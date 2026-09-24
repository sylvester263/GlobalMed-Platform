import "server-only";

import { createAdminClient } from "@/lib/db/admin";
import {
  acceptedPosition,
  enrollmentActive,
  evaluateUnlock,
  isVideoComplete,
} from "@/lib/lms/rules";

export type ProgressResult =
  | { ok: true; completed: boolean; justCompleted: boolean; positionSec: number }
  | { ok: false; status: 403 | 404; message: string };

/**
 * The only writer of lesson_progress (0003 removed student write access). Checks the
 * enrollment is active and the lesson unlocked, clamps the reported position, and decides
 * completion server-side: videos at ≥ 90% of their real duration, other lessons when the
 * learner marks them complete. Completion is never undone.
 */
export async function recordProgress(input: {
  userId: string;
  lessonId: string;
  positionSec?: number;
  markComplete?: boolean;
}): Promise<ProgressResult> {
  const db = createAdminClient();
  const { data: lesson } = await db
    .from("lessons")
    .select("id, type, duration_sec, unlock_rule, module_id")
    .eq("id", input.lessonId)
    .maybeSingle();
  if (!lesson) return { ok: false, status: 404, message: "Lesson not found." };

  const { data: moduleRow } = await db
    .from("modules")
    .select("course_id")
    .eq("id", lesson.module_id)
    .single();
  if (!moduleRow) return { ok: false, status: 404, message: "Lesson not found." };

  const { data: enrollment } = await db
    .from("enrollments")
    .select("id, status, expires_at, starts_at")
    .eq("course_id", moduleRow.course_id)
    .eq("user_id", input.userId)
    .maybeSingle();
  if (!enrollment || !enrollmentActive(enrollment)) {
    return { ok: false, status: 403, message: "You're not enrolled in this course." };
  }

  const { data: all } = await db
    .from("lesson_progress")
    .select("lesson_id, position_sec, completed_at, updated_at")
    .eq("enrollment_id", enrollment.id);
  const completedIds = new Set((all ?? []).filter((p) => p.completed_at).map((p) => p.lesson_id));
  const unlock = evaluateUnlock(lesson.unlock_rule, {
    enrolledAt: new Date(enrollment.starts_at),
    completedLessonIds: completedIds,
  });
  if (!unlock.unlocked)
    return { ok: false, status: 403, message: "This lesson isn't unlocked yet." };

  const previous = (all ?? []).find((p) => p.lesson_id === lesson.id);
  const secondsSinceLastSave = previous
    ? Math.max(0, (Date.now() - new Date(previous.updated_at).getTime()) / 1000)
    : null;
  const positionSec =
    input.positionSec === undefined
      ? (previous?.position_sec ?? 0)
      : acceptedPosition({
          reported: input.positionSec,
          durationSec: lesson.duration_sec,
          previousSec: previous?.position_sec ?? 0,
          secondsSinceLastSave,
        });

  const alreadyComplete = Boolean(previous?.completed_at);
  const nowComplete =
    alreadyComplete ||
    (lesson.type === "video"
      ? isVideoComplete(positionSec, lesson.duration_sec)
      : Boolean(input.markComplete) && lesson.type !== "quiz"); // quizzes complete via grading (Phase 6)

  const { error } = await db.from("lesson_progress").upsert(
    {
      enrollment_id: enrollment.id,
      lesson_id: lesson.id,
      position_sec: positionSec,
      completed_at: nowComplete ? (previous?.completed_at ?? new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "enrollment_id,lesson_id" },
  );
  if (error) return { ok: false, status: 404, message: "Couldn't save progress." };
  return {
    ok: true,
    completed: nowComplete,
    justCompleted: nowComplete && !alreadyComplete,
    positionSec,
  };
}

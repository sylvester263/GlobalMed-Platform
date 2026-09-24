import "server-only";

import { cache } from "react";

import { createAdminClient } from "@/lib/db/admin";
import type { Tables } from "@/lib/db/types";
import {
  continueLessonId,
  courseProgress,
  enrollmentActive,
  evaluateUnlock,
  type UnlockState,
} from "@/lib/lms/rules";

export type LearnerLesson = {
  id: string;
  moduleId: string;
  title: string;
  type: Tables<"lessons">["type"];
  durationSec: number | null;
  isPreview: boolean;
  required: boolean;
  videoStatus: string;
  unlock: UnlockState;
  completed: boolean;
  positionSec: number;
  /** Whether this learner may open the lesson content. */
  canView: boolean;
};

export type LearnerCourse = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  instructorId: string | null;
  isStaff: boolean;
  enrollment: Tables<"enrollments"> | null;
  enrollmentActive: boolean;
  modules: { id: string; title: string; lessons: LearnerLesson[] }[];
  lessons: LearnerLesson[];
  progress: ReturnType<typeof courseProgress>;
  continueLessonId: string | undefined;
};

/**
 * The course outline for one learner, with unlock state and progress per lesson. Loaded
 * with the service role (the outline is public on the course page anyway); lesson
 * CONTENT is only released where `canView` is true — staff, free previews, or an active
 * enrollment with the lesson unlocked. RLS remains as a second layer for direct API use.
 */
export const getLearnerCourse = cache(
  async (
    slug: string,
    userId: string,
    role: Tables<"profiles">["role"],
  ): Promise<LearnerCourse | null> => {
    const db = createAdminClient();
    const { data: course } = await db.from("courses").select("*").eq("slug", slug).maybeSingle();
    if (!course) return null;

    const isStaff = role === "admin" || course.instructor_id === userId;
    if (course.status !== "published" && !isStaff) return null;

    const [{ data: modules }, { data: enrollment }] = await Promise.all([
      db.from("modules").select("id, title, position").eq("course_id", course.id).order("position"),
      db
        .from("enrollments")
        .select("*")
        .eq("course_id", course.id)
        .eq("user_id", userId)
        .maybeSingle(),
    ]);
    const moduleIds = (modules ?? []).map((m) => m.id);
    const { data: lessonRows } = moduleIds.length
      ? await db
          .from("lessons")
          .select(
            "id, module_id, title, type, position, duration_sec, is_preview, required, unlock_rule, video_status",
          )
          .in("module_id", moduleIds)
          .order("position")
      : { data: [] };

    const { data: progressRows } = enrollment
      ? await db
          .from("lesson_progress")
          .select("lesson_id, position_sec, completed_at, updated_at")
          .eq("enrollment_id", enrollment.id)
      : { data: [] };
    const progressById = new Map((progressRows ?? []).map((p) => [p.lesson_id, p]));
    const completed = new Set(
      (progressRows ?? []).filter((p) => p.completed_at).map((p) => p.lesson_id),
    );
    const active = enrollment ? enrollmentActive(enrollment) : false;
    const enrolledAt = enrollment ? new Date(enrollment.starts_at) : new Date();

    const moduleOrder = new Map((modules ?? []).map((m, i) => [m.id, i]));
    const ordered = [...(lessonRows ?? [])].sort(
      (a, b) =>
        (moduleOrder.get(a.module_id) ?? 0) - (moduleOrder.get(b.module_id) ?? 0) ||
        a.position - b.position,
    );

    const lessons: LearnerLesson[] = ordered.map((l) => {
      const unlock = evaluateUnlock(l.unlock_rule, { enrolledAt, completedLessonIds: completed });
      const p = progressById.get(l.id);
      return {
        id: l.id,
        moduleId: l.module_id,
        title: l.title,
        type: l.type,
        durationSec: l.duration_sec,
        isPreview: l.is_preview,
        required: l.required,
        videoStatus: l.video_status,
        unlock,
        completed: completed.has(l.id),
        positionSec: p?.position_sec ?? 0,
        canView: isStaff || l.is_preview || (active && unlock.unlocked),
      };
    });

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      summary: course.summary,
      instructorId: course.instructor_id,
      isStaff,
      enrollment: enrollment ?? null,
      enrollmentActive: active,
      modules: (modules ?? []).map((m) => ({
        id: m.id,
        title: m.title,
        lessons: lessons.filter((l) => l.moduleId === m.id),
      })),
      lessons,
      progress: courseProgress(lessons, completed),
      continueLessonId: continueLessonId(
        lessons,
        (progressRows ?? []).map((p) => ({
          lessonId: p.lesson_id,
          completed: Boolean(p.completed_at),
          updatedAt: p.updated_at,
        })),
      ),
    };
  },
);

/** Full lesson row — call only after checking `canView`. */
export async function getLessonContent(lessonId: string) {
  const db = createAdminClient();
  const [{ data: lesson }, { data: resources }] = await Promise.all([
    db
      .from("lessons")
      .select(
        "id, title, type, content_md, live_url, pdf_path, bunny_video_id, video_status, video_meta, duration_sec",
      )
      .eq("id", lessonId)
      .maybeSingle(),
    db
      .from("lesson_resources")
      .select("id, label, storage_path")
      .eq("lesson_id", lessonId)
      .order("label"),
  ]);
  return lesson ? { ...lesson, resources: resources ?? [] } : null;
}

/** Courses the user is enrolled in, with progress, for "My courses" and the overview. */
export async function getMyCourses(userId: string) {
  const db = createAdminClient();
  const { data: enrollments } = await db
    .from("enrollments")
    .select("id, course_id, status, starts_at, expires_at, completed_at")
    .eq("user_id", userId)
    .order("starts_at", { ascending: false });
  if (!enrollments?.length) return [];

  const courseIds = enrollments.map((e) => e.course_id);
  const [{ data: courses }, { data: modules }, { data: progress }] = await Promise.all([
    db.from("courses").select("id, slug, title").in("id", courseIds),
    db.from("modules").select("id, course_id").in("course_id", courseIds),
    db
      .from("lesson_progress")
      .select("enrollment_id, lesson_id, completed_at, updated_at")
      .in(
        "enrollment_id",
        enrollments.map((e) => e.id),
      ),
  ]);
  const { data: lessons } = modules?.length
    ? await db
        .from("lessons")
        .select("id, module_id, required")
        .in(
          "module_id",
          modules.map((m) => m.id),
        )
    : { data: [] };

  return enrollments.flatMap((enrollment) => {
    const course = courses?.find((c) => c.id === enrollment.course_id);
    if (!course) return [];
    const moduleIds = new Set(
      (modules ?? []).filter((m) => m.course_id === course.id).map((m) => m.id),
    );
    const courseLessons = (lessons ?? []).filter((l) => moduleIds.has(l.module_id));
    const mine = (progress ?? []).filter((p) => p.enrollment_id === enrollment.id);
    const done = new Set(mine.filter((p) => p.completed_at).map((p) => p.lesson_id));
    const lastTouched = [...mine].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
    return [
      {
        course,
        enrollment,
        active: enrollmentActive(enrollment),
        progress: courseProgress(courseLessons, done),
        lastTouchedAt: lastTouched?.updated_at ?? null,
      },
    ];
  });
}

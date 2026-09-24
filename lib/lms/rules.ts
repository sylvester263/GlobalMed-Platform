import { z } from "zod";

/**
 * LMS rules (docs/08 §3–4), pure so they can be unit-tested and shared by the player,
 * the progress API and (Phase 6) certificate issuing. Never trust the browser for these.
 */

// ---------- Drip / unlock rules (L-6) ----------

export const unlockRuleSchema = z
  .union([
    z.object({ after_lesson: z.uuid() }).strict(),
    z.object({ days_after_enroll: z.number().int().min(1).max(365) }).strict(),
    z.object({ date: z.iso.datetime({ offset: true }).or(z.iso.date()) }).strict(),
    z.object({}).strict(),
  ])
  .catch({});
export type UnlockRule = z.infer<typeof unlockRuleSchema>;

export type UnlockState =
  | { unlocked: true }
  | { unlocked: false; reason: "after_lesson"; lessonId: string }
  | { unlocked: false; reason: "date"; unlocksAt: Date };

const DAY_MS = 24 * 60 * 60 * 1000;

export function evaluateUnlock(
  rawRule: unknown,
  ctx: { enrolledAt: Date; completedLessonIds: ReadonlySet<string>; now?: Date },
): UnlockState {
  const rule = unlockRuleSchema.parse(rawRule ?? {});
  const now = ctx.now ?? new Date();
  if ("after_lesson" in rule) {
    return ctx.completedLessonIds.has(rule.after_lesson)
      ? { unlocked: true }
      : { unlocked: false, reason: "after_lesson", lessonId: rule.after_lesson };
  }
  if ("days_after_enroll" in rule) {
    const unlocksAt = new Date(ctx.enrolledAt.getTime() + rule.days_after_enroll * DAY_MS);
    return now >= unlocksAt ? { unlocked: true } : { unlocked: false, reason: "date", unlocksAt };
  }
  if ("date" in rule) {
    const unlocksAt = new Date(rule.date);
    return now >= unlocksAt ? { unlocked: true } : { unlocked: false, reason: "date", unlocksAt };
  }
  return { unlocked: true };
}

// ---------- Progress (L-5) ----------

/** A video counts as complete once 90% has been watched (docs/08 §3). */
export const VIDEO_COMPLETE_RATIO = 0.9;

export function isVideoComplete(positionSec: number, durationSec: number | null): boolean {
  if (!durationSec || durationSec <= 0) return false;
  return positionSec / durationSec >= VIDEO_COMPLETE_RATIO;
}

/**
 * Clamps a reported playback position. The browser reports it, so it's only trusted to be
 * within the video's length and never to jump more than the elapsed wall-clock time plus a
 * margin since the last save (stops "skip to the end" completion by forged requests).
 */
export function acceptedPosition(input: {
  reported: number;
  durationSec: number | null;
  previousSec: number;
  secondsSinceLastSave: number | null;
}): number {
  const max =
    input.durationSec && input.durationSec > 0 ? input.durationSec : Number.POSITIVE_INFINITY;
  const reported = Math.max(0, Math.min(Math.floor(input.reported), max));
  if (input.secondsSinceLastSave === null) {
    // First save for this lesson: allow resuming from anywhere but not beyond 60s in.
    return Math.min(reported, 60);
  }
  // Playback up to 2x speed plus 30s of slack; seeking backwards is always fine.
  const ceiling = input.previousSec + input.secondsSinceLastSave * 2 + 30;
  return Math.min(reported, ceiling);
}

export type LessonRef = { id: string; required: boolean };

export function courseProgress(
  lessons: readonly LessonRef[],
  completedLessonIds: ReadonlySet<string>,
): { completed: number; total: number; percent: number; requiredComplete: boolean } {
  const total = lessons.length;
  const completed = lessons.filter((l) => completedLessonIds.has(l.id)).length;
  const requiredComplete = lessons
    .filter((l) => l.required)
    .every((l) => completedLessonIds.has(l.id));
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    requiredComplete,
  };
}

/** Next lesson in course order after `currentId`, or undefined at the end. */
export function nextLesson<T extends { id: string }>(
  ordered: readonly T[],
  currentId: string,
): T | undefined {
  const i = ordered.findIndex((l) => l.id === currentId);
  return i >= 0 ? ordered[i + 1] : undefined;
}

/** Where "Continue learning" goes: last touched incomplete lesson, else first incomplete. */
export function continueLessonId(
  ordered: readonly { id: string }[],
  progress: readonly { lessonId: string; completed: boolean; updatedAt: string }[],
): string | undefined {
  const byRecency = [...progress].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const lastIncomplete = byRecency.find((p) => !p.completed);
  if (lastIncomplete) return lastIncomplete.lessonId;
  const done = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
  return ordered.find((l) => !done.has(l.id))?.id ?? ordered[0]?.id;
}

/** Access period (L-11): null months = lifetime. */
export function enrollmentActive(
  enrollment: { status: string; expires_at: string | null },
  now = new Date(),
): boolean {
  if (enrollment.status !== "active") return false;
  return !enrollment.expires_at || new Date(enrollment.expires_at) > now;
}

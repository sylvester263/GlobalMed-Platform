import { describe, expect, it } from "vitest";

import {
  acceptedPosition,
  continueLessonId,
  courseProgress,
  enrollmentActive,
  evaluateUnlock,
  isVideoComplete,
  nextLesson,
} from "@/lib/lms/rules";

const A = "11111111-1111-4111-8111-111111111111";
const enrolledAt = new Date("2026-10-01T00:00:00Z");

describe("evaluateUnlock (drip rules)", () => {
  it("unlocks lessons with no rule, an empty rule, or malformed input", () => {
    const ctx = { enrolledAt, completedLessonIds: new Set<string>() };
    expect(evaluateUnlock(null, ctx).unlocked).toBe(true);
    expect(evaluateUnlock({}, ctx).unlocked).toBe(true);
    expect(evaluateUnlock({ nonsense: 1 }, ctx).unlocked).toBe(true);
  });

  it("waits for a prerequisite lesson", () => {
    const rule = { after_lesson: A };
    expect(evaluateUnlock(rule, { enrolledAt, completedLessonIds: new Set() })).toEqual({
      unlocked: false,
      reason: "after_lesson",
      lessonId: A,
    });
    expect(evaluateUnlock(rule, { enrolledAt, completedLessonIds: new Set([A]) }).unlocked).toBe(
      true,
    );
  });

  it("unlocks N days after enrollment", () => {
    const rule = { days_after_enroll: 7 };
    const before = evaluateUnlock(rule, {
      enrolledAt,
      completedLessonIds: new Set(),
      now: new Date("2026-10-07T23:59:00Z"),
    });
    expect(before.unlocked).toBe(false);
    if (!before.unlocked && before.reason === "date") {
      expect(before.unlocksAt.toISOString()).toBe("2026-10-08T00:00:00.000Z");
    }
    const after = evaluateUnlock(rule, {
      enrolledAt,
      completedLessonIds: new Set(),
      now: new Date("2026-10-08T00:00:00Z"),
    });
    expect(after.unlocked).toBe(true);
  });

  it("unlocks on a fixed date", () => {
    const rule = { date: "2026-11-01T09:00:00+05:00" };
    expect(
      evaluateUnlock(rule, {
        enrolledAt,
        completedLessonIds: new Set(),
        now: new Date("2026-11-01T03:59:00Z"),
      }).unlocked,
    ).toBe(false);
    expect(
      evaluateUnlock(rule, {
        enrolledAt,
        completedLessonIds: new Set(),
        now: new Date("2026-11-01T04:00:00Z"),
      }).unlocked,
    ).toBe(true);
  });
});

describe("video completion and position trust", () => {
  it("completes at 90% watched, never without a duration", () => {
    expect(isVideoComplete(89, 100)).toBe(false);
    expect(isVideoComplete(90, 100)).toBe(true);
    expect(isVideoComplete(500, null)).toBe(false);
  });

  it("caps the first save so a forged request can't start at the end", () => {
    expect(
      acceptedPosition({
        reported: 590,
        durationSec: 600,
        previousSec: 0,
        secondsSinceLastSave: null,
      }),
    ).toBe(60);
  });

  it("allows up to 2x playback plus slack between saves", () => {
    expect(
      acceptedPosition({
        reported: 100,
        durationSec: 600,
        previousSec: 60,
        secondsSinceLastSave: 15,
      }),
    ).toBe(100);
    expect(
      acceptedPosition({
        reported: 500,
        durationSec: 600,
        previousSec: 60,
        secondsSinceLastSave: 15,
      }),
    ).toBe(120);
  });

  it("allows seeking backwards and clamps to the duration", () => {
    expect(
      acceptedPosition({
        reported: 10,
        durationSec: 600,
        previousSec: 300,
        secondsSinceLastSave: 15,
      }),
    ).toBe(10);
    expect(
      acceptedPosition({
        reported: 9999,
        durationSec: 600,
        previousSec: 590,
        secondsSinceLastSave: 600,
      }),
    ).toBe(600);
    expect(
      acceptedPosition({ reported: -5, durationSec: 600, previousSec: 0, secondsSinceLastSave: 5 }),
    ).toBe(0);
  });
});

describe("course progress", () => {
  const lessons = [
    { id: "a", required: true },
    { id: "b", required: true },
    { id: "c", required: false },
  ];

  it("counts completed lessons and required completion", () => {
    expect(courseProgress(lessons, new Set(["a"]))).toEqual({
      completed: 1,
      total: 3,
      percent: 33,
      requiredComplete: false,
    });
    expect(courseProgress(lessons, new Set(["a", "b"])).requiredComplete).toBe(true);
    expect(courseProgress([], new Set()).percent).toBe(0);
  });

  it("finds the next lesson in order", () => {
    expect(nextLesson(lessons, "a")?.id).toBe("b");
    expect(nextLesson(lessons, "c")).toBeUndefined();
  });

  it("continues from the last touched unfinished lesson", () => {
    expect(
      continueLessonId(lessons, [
        { lessonId: "a", completed: true, updatedAt: "2026-10-02T10:00:00Z" },
        { lessonId: "b", completed: false, updatedAt: "2026-10-01T10:00:00Z" },
      ]),
    ).toBe("b");
    expect(
      continueLessonId(lessons, [
        { lessonId: "a", completed: true, updatedAt: "2026-10-02T10:00:00Z" },
      ]),
    ).toBe("b");
    expect(continueLessonId(lessons, [])).toBe("a");
  });

  it("treats expired or revoked enrollments as inactive", () => {
    const now = new Date("2026-10-10T00:00:00Z");
    expect(enrollmentActive({ status: "active", expires_at: null }, now)).toBe(true);
    expect(enrollmentActive({ status: "active", expires_at: "2026-10-09T00:00:00Z" }, now)).toBe(
      false,
    );
    expect(enrollmentActive({ status: "revoked", expires_at: null }, now)).toBe(false);
  });
});

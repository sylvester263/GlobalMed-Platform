import { describe, expect, it } from "vitest";

import { batchSessionSchema } from "@/lib/validation/batch";
import {
  lessonUpdateSchema,
  reorderSchema,
  slugify,
  slugSchema,
  unlockRuleFrom,
} from "@/lib/validation/course";

const LESSON = "7f1c2a4e-9b3d-4c5e-8f6a-1b2c3d4e5f60";
const OTHER = "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d";

function lessonInput(overrides: Record<string, unknown> = {}) {
  return lessonUpdateSchema.parse({
    lessonId: LESSON,
    title: "Intro to ICD-10-CM",
    type: "video",
    isPreview: false,
    required: true,
    unlock: "none",
    ...overrides,
  });
}

describe("slugify", () => {
  it("makes a clean, lowercase, hyphenated slug", () => {
    expect(slugify("CPC® Exam Prep — Evening Batch!")).toBe("cpc-exam-prep-evening-batch");
  });

  it("strips accents and trims hyphens", () => {
    expect(slugify("  Codificación Médica  ")).toBe("codificacion-medica");
  });

  it("produces slugs the slug schema accepts", () => {
    expect(slugSchema.safeParse(slugify("Medical Billing 101")).success).toBe(true);
  });

  it("rejects double hyphens and uppercase in hand-typed slugs after lowercasing", () => {
    expect(slugSchema.safeParse("bad--slug").success).toBe(false);
    expect(slugSchema.parse("Good-Slug")).toBe("good-slug");
  });
});

describe("unlockRuleFrom", () => {
  it("returns an empty rule for 'straight away'", () => {
    expect(unlockRuleFrom(lessonInput())).toEqual({});
  });

  it("builds an after-lesson rule", () => {
    expect(unlockRuleFrom(lessonInput({ unlock: "after_lesson", unlockLessonId: OTHER }))).toEqual({
      after_lesson: OTHER,
    });
  });

  it("builds a days-after-enroll rule from a form string", () => {
    expect(unlockRuleFrom(lessonInput({ unlock: "days_after_enroll", unlockDays: "7" }))).toEqual({
      days_after_enroll: 7,
    });
  });

  it("builds a date rule", () => {
    expect(unlockRuleFrom(lessonInput({ unlock: "date", unlockDate: "2026-11-01" }))).toEqual({
      date: "2026-11-01",
    });
  });

  it("falls back to no rule when the chosen rule is missing its value", () => {
    expect(unlockRuleFrom(lessonInput({ unlock: "after_lesson", unlockLessonId: "" }))).toEqual({});
  });
});

describe("lesson and reorder schemas", () => {
  it("only accepts https live links", () => {
    expect(
      lessonUpdateSchema.safeParse({ ...lessonInput(), liveUrl: "http://zoom.us/j/1" }).success,
    ).toBe(false);
    expect(
      lessonUpdateSchema.safeParse({ ...lessonInput(), liveUrl: "https://zoom.us/j/1" }).success,
    ).toBe(true);
  });

  it("rejects non-uuid ids in a reorder", () => {
    expect(reorderSchema.safeParse({ parentId: LESSON, orderedIds: ["1; drop"] }).success).toBe(
      false,
    );
  });
});

describe("batch sessions", () => {
  const base = {
    batchId: LESSON,
    title: "E/M workshop",
    startsAt: "2026-10-05T15:00:00.000Z",
    durationMin: "90",
  };

  it("accepts an ISO start time and coerces the length", () => {
    expect(batchSessionSchema.parse(base).durationMin).toBe(90);
  });

  it("rejects sessions shorter than 15 minutes and non-https join links", () => {
    expect(batchSessionSchema.safeParse({ ...base, durationMin: "5" }).success).toBe(false);
    expect(
      batchSessionSchema.safeParse({ ...base, joinUrl: "http://meet.google.com/x" }).success,
    ).toBe(false);
  });
});

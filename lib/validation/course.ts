import { z } from "zod";

import { unlockRuleSchema } from "@/lib/lms/rules";

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Use at least 3 characters.")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens.");

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const courseTitleSchema = z.string().trim().min(3, "Give the course a title.").max(160);

export const courseDetailsSchema = z.object({
  courseId: z.uuid(),
  title: courseTitleSchema,
  slug: slugSchema,
  summary: z
    .string()
    .trim()
    .max(300, "Keep the summary under 300 characters.")
    .optional()
    .or(z.literal("")),
  description: z.string().trim().max(10000).optional().or(z.literal("")),
  outcomes: z.string().max(4000).optional().or(z.literal("")),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  passPct: z.coerce.number().int().min(1, "Between 1 and 100.").max(100, "Between 1 and 100."),
});

export const courseAdminSchema = z.object({
  courseId: z.uuid(),
  status: z.enum(["draft", "published", "archived"]),
  priceUsd: z.coerce.number().min(0).max(100000),
  pricePkr: z.coerce.number().min(0).max(100000000).optional().or(z.literal("")),
  accessMonths: z.coerce.number().int().min(1).max(120).optional().or(z.literal("")),
  instructorId: z.uuid().optional().or(z.literal("")),
});

export const lessonTypes = ["video", "text", "pdf", "quiz", "assignment", "live"] as const;

export const lessonUpdateSchema = z.object({
  lessonId: z.uuid(),
  title: z.string().trim().min(2, "Give the lesson a title.").max(160),
  type: z.enum(lessonTypes),
  isPreview: z.boolean(),
  required: z.boolean(),
  contentMd: z.string().max(50000).optional().or(z.literal("")),
  liveUrl: z
    .string()
    .trim()
    .url("Enter a full link starting with https://")
    .startsWith("https://", "Links must start with https://")
    .optional()
    .or(z.literal("")),
  durationMin: z.coerce.number().int().min(0).max(600).optional(),
  unlock: z.enum(["none", "after_lesson", "days_after_enroll", "date"]),
  unlockLessonId: z.uuid().optional().or(z.literal("")),
  unlockDays: z.coerce.number().int().min(1).max(365).optional(),
  unlockDate: z.iso.date().optional().or(z.literal("")),
});

/** Turns the lesson form's unlock fields into the stored rule (docs/08 §4). */
export function unlockRuleFrom(input: z.infer<typeof lessonUpdateSchema>) {
  const rule =
    input.unlock === "after_lesson" && input.unlockLessonId
      ? { after_lesson: input.unlockLessonId }
      : input.unlock === "days_after_enroll" && input.unlockDays
        ? { days_after_enroll: input.unlockDays }
        : input.unlock === "date" && input.unlockDate
          ? { date: input.unlockDate }
          : {};
  return unlockRuleSchema.parse(rule);
}

export const reorderSchema = z.object({
  parentId: z.uuid(),
  orderedIds: z.array(z.uuid()).min(1).max(500),
});

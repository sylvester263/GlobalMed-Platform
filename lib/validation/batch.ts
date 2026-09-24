import { z } from "zod";

export const batchSchema = z.object({
  courseId: z.uuid("Choose a course."),
  name: z.string().trim().min(3, "Name the batch, e.g. “CPC — March evening”.").max(120),
  startsAt: z.iso.date("Choose a start date."),
  schedule: z.string().trim().max(200).optional().or(z.literal("")),
  seats: z.coerce.number().int().min(1).max(1000).optional().or(z.literal("")),
});

export const batchSessionSchema = z.object({
  batchId: z.uuid(),
  title: z.string().trim().min(3, "Give the session a title.").max(160),
  /** ISO timestamp; the browser converts the local date-time before sending. */
  startsAt: z.iso.datetime({ offset: true, message: "Choose a date and time." }),
  durationMin: z.coerce.number().int().min(15, "At least 15 minutes.").max(480),
  joinUrl: z
    .string()
    .trim()
    .url("Enter a full link starting with https://")
    .startsWith("https://", "Links must start with https://")
    .optional()
    .or(z.literal("")),
});

export const batchMemberSchema = z.object({ batchId: z.uuid(), userId: z.uuid() });

export const announcementSchema = z.object({
  batchId: z.uuid(),
  title: z.string().trim().min(3, "Add a title.").max(160),
  body: z.string().trim().min(3, "Write the announcement.").max(4000),
});

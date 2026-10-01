import { z } from "zod";

import { defaultGreeting, defaultQuickReplies } from "@/lib/ai/defaults";

/**
 * Chatbot settings (admin → Chatbot → Settings), stored in `settings` under the key
 * "chatbot". Pure helpers here; lib/ai/store.ts loads and saves them.
 */

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM (24-hour).");

export const chatSettingsSchema = z.object({
  greeting: z.string().trim().min(1).max(400),
  quickReplies: z.array(z.string().trim().min(1).max(60)).min(1).max(4),
  handoffEnabled: z.boolean(),
  hours: z.discriminatedUnion("mode", [
    z.object({ mode: z.literal("always") }),
    z.object({
      mode: z.literal("schedule"),
      timezone: z.string().min(1),
      /** 0 = Sunday … 6 = Saturday. */
      days: z.array(z.number().int().min(0).max(6)).min(1),
      open: time,
      close: time,
    }),
  ]),
});

export type ChatSettings = z.infer<typeof chatSettingsSchema>;

export const defaultChatSettings: ChatSettings = {
  greeting: defaultGreeting,
  quickReplies: defaultQuickReplies,
  handoffEnabled: true,
  // The site says "Open 24/7" (lib/site.ts).
  hours: { mode: "always" },
};

/** Merges stored settings over the defaults; invalid stored values fall back to defaults. */
export function parseChatSettings(value: unknown): ChatSettings {
  const parsed = chatSettingsSchema.safeParse({ ...defaultChatSettings, ...(value as object) });
  return parsed.success ? parsed.data : defaultChatSettings;
}

function minutes(hhmm: string): number {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Day of week and minutes since midnight in a time zone. */
function localTime(now: Date, timezone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function isWithinHours(settings: ChatSettings, now = new Date()): boolean {
  const { hours } = settings;
  if (hours.mode === "always") return true;
  const { day, minutes: m } = localTime(now, hours.timezone);
  return hours.days.includes(day) && m >= minutes(hours.open) && m < minutes(hours.close);
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Our team is available Monday–Friday, 09:00–18:00 (Asia/Karachi)…" for outside hours. */
export function outsideHoursText(settings: ChatSettings): string {
  const { hours } = settings;
  if (hours.mode === "always") return "";
  const days = hours.days.map((d) => dayNames[d]).join(", ");
  return `Our team replies ${days}, ${hours.open}–${hours.close} (${hours.timezone} time). We'll get back to you then — you can also message us on WhatsApp.`;
}

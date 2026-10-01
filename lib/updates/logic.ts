/**
 * Updates (news / announcements, 2026-10-02): the publishing rules in one pure module, used by
 * the home section, /updates, the dashboard and the chatbot — and by the unit tests.
 */

export const updateCategories = [
  { id: "course", label: "Course Updates" },
  { id: "batch", label: "Batch & Enrollment" },
  { id: "company", label: "Company News" },
  { id: "events", label: "Events" },
  { id: "announcements", label: "Announcements" },
] as const;

export type UpdateCategory = (typeof updateCategories)[number]["id"];
export type UpdateStatus = "draft" | "published";

export const categoryLabel = (id: string): string =>
  updateCategories.find((c) => c.id === id)?.label ?? id;

export const isUpdateCategory = (id: string): id is UpdateCategory =>
  updateCategories.some((c) => c.id === id);

export type Update = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bodyMd: string | null;
  category: UpdateCategory;
  imagePath: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  publishAt: string;
  expiresAt: string | null;
  pinned: boolean;
  status: UpdateStatus;
};

export type UpdateState = "draft" | "scheduled" | "live" | "expired";

/** Where an update stands right now (dashboard badges). */
export function updateState(update: Update, now = new Date()): UpdateState {
  if (update.status !== "published") return "draft";
  if (new Date(update.publishAt) > now) return "scheduled";
  if (update.expiresAt && new Date(update.expiresAt) <= now) return "expired";
  return "live";
}

/** Published, its publish date reached and not expired (same rule as the RLS policy). */
export const isLive = (update: Update, now = new Date()) => updateState(update, now) === "live";

/** Pinned first, then newest publish date first. */
export function orderUpdates<T extends Pick<Update, "pinned" | "publishAt">>(list: T[]): T[] {
  return [...list].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime(),
  );
}

/** The live updates in display order (pinned first). */
export function liveUpdates(list: Update[], now = new Date()): Update[] {
  return orderUpdates(list.filter((u) => isLive(u, now)));
}

/** The home page shows the 3 latest live updates, pinned first. */
export const HOME_UPDATES = 3;
export const UPDATES_PER_PAGE = 12;

export function paginate<T>(list: T[], page: number, perPage = UPDATES_PER_PAGE) {
  const pages = Math.max(1, Math.ceil(list.length / perPage));
  const current = Math.min(Math.max(1, Math.trunc(page) || 1), pages);
  return { items: list.slice((current - 1) * perPage, current * perPage), page: current, pages };
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2 Oct 2026" (Pakistan time; three-letter months, so September is "Sep"). */
export function formatUpdateDate(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "Asia/Karachi",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${Number(get("day"))} ${months[Number(get("month")) - 1]} ${get("year")}`;
}

/** URL-safe slug from a title; `taken` adds -2, -3… until it is unique. */
export function slugify(title: string, taken: Iterable<string> = []): string {
  const base =
    title
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "update";
  const used = new Set(taken);
  let slug = base;
  for (let i = 2; used.has(slug); i++) slug = `${base}-${i}`;
  return slug;
}

/** Plain-text summary of live updates for the chatbot's knowledge (newest first). */
export function updatesKnowledge(list: Update[], now = new Date()): string {
  const live = liveUpdates(list, now);
  if (!live.length) return "";
  return live
    .map(
      (u) =>
        `- ${formatUpdateDate(u.publishAt)} · ${categoryLabel(u.category)}: ${u.title}. ${u.summary}${u.linkUrl ? ` (${u.linkLabel}: ${u.linkUrl})` : ""}`,
    )
    .join("\n");
}

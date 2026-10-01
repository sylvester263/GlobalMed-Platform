import "server-only";

import { createAnonClient } from "@/lib/db/anon";
import type { Tables } from "@/lib/db/types";
import { isSupabaseConfigured } from "@/lib/env";
import { isUpdateCategory, liveUpdates, type Update } from "@/lib/updates/logic";

export const UPDATE_IMAGES_BUCKET = "update-images";

export function toUpdate(row: Tables<"updates">): Update {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    bodyMd: row.body_md,
    category: isUpdateCategory(row.category) ? row.category : "announcements",
    imagePath: row.image_path,
    linkUrl: row.link_url,
    linkLabel: row.link_label,
    publishAt: row.publish_at,
    expiresAt: row.expires_at,
    pinned: row.pinned,
    status: row.status === "published" ? "published" : "draft",
  };
}

/** Public URL of an update image (public bucket). */
export function updateImageUrl(path: string | null): string | null {
  if (!path || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${UPDATE_IMAGES_BUCKET}/${path}`;
}

/**
 * Live updates in display order (pinned first, newest first). RLS returns only what is live
 * (published, date reached, not expired); the same rule is applied again here so a slightly
 * stale cache never shows an expired update. Empty when Supabase isn't configured.
 */
export async function getLiveUpdates(): Promise<Update[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await createAnonClient()
    .from("updates")
    .select("*")
    .order("pinned", { ascending: false })
    .order("publish_at", { ascending: false })
    .limit(500);
  if (error || !data) return [];
  return liveUpdates(data.map(toUpdate));
}

export async function getLiveUpdate(slug: string): Promise<Update | null> {
  return (await getLiveUpdates()).find((u) => u.slug === slug) ?? null;
}

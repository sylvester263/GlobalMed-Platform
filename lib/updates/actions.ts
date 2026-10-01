"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { syncUpdatesDocument } from "@/lib/ai/kb";
import { authorize } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { storeUpdateImage } from "@/lib/updates/images";
import { slugify } from "@/lib/updates/logic";
import { updateFormSchema } from "@/lib/validation/updates";

/**
 * Admin → Content → Updates (also Sales → Updates). Admins and sales staff only (re-checked
 * here; RLS "staff manage updates" as well). Nothing is hard-deleted: unpublish instead.
 * Every change revalidates the home page and /updates, so it shows within a minute.
 */

export type UpdateResult = {
  ok: boolean;
  message: string;
  id?: string;
  imagePath?: string;
  fieldErrors?: Record<string, string>;
};

const denied: UpdateResult = { ok: false, message: "You don't have access to do that." };

function staff() {
  return authorize(["admin", "sales"]);
}

/** Refreshes every page that shows updates, and the chatbot's copy of them. */
async function refreshPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/updates");
  if (slug) revalidatePath(`/updates/${slug}`);
  revalidatePath("/sitemap.xml");
  // Re-embed the live updates for the chatbot; a failure (e.g. no embedding key yet) must
  // not undo the save.
  await syncUpdatesDocument().catch(() => 0);
}

export async function saveUpdate(input: unknown, imagePath?: string | null): Promise<UpdateResult> {
  const session = await staff();
  if (!session) return denied;
  const parsed = updateFormSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Check the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;
  if (imagePath != null && !/^\d{4}\/[0-9a-f-]{36}\.webp$/.test(imagePath)) {
    return { ok: false, message: "Upload the image again." };
  }

  const supabase = await createClient();
  const values = {
    title: data.title,
    summary: data.summary,
    body_md: data.bodyMd || null,
    category: data.category,
    link_url: data.linkUrl || null,
    link_label: data.linkLabel || null,
    publish_at: data.publishAt,
    expires_at: data.expiresAt || null,
    pinned: data.pinned,
    status: data.status,
    updated_at: new Date().toISOString(),
    ...(imagePath !== undefined && { image_path: imagePath }),
  };

  if (data.id) {
    const { data: row, error } = await supabase
      .from("updates")
      .update(values)
      .eq("id", data.id)
      .select("id, slug")
      .single();
    if (error || !row) return { ok: false, message: "Could not save the update." };
    await refreshPages(row.slug);
    return { ok: true, id: row.id, message: savedMessage(data.status, data.publishAt) };
  }

  const { data: existing } = await supabase.from("updates").select("slug");
  const slug = slugify(
    data.title,
    (existing ?? []).map((r) => r.slug),
  );
  const { data: row, error } = await supabase
    .from("updates")
    .insert({ ...values, slug, created_by: session.user.id })
    .select("id, slug")
    .single();
  if (error || !row) return { ok: false, message: "Could not save the update." };
  await refreshPages(row.slug);
  return { ok: true, id: row.id, message: savedMessage(data.status, data.publishAt) };
}

function savedMessage(status: string, publishAt: string): string {
  if (status === "draft") return "Saved as a draft. It isn't on the site.";
  if (new Date(publishAt) > new Date())
    return "Scheduled. It appears on the site at the publish date.";
  return "Published. It appears on the site within a minute.";
}

const idSchema = z.uuid();

/** Publish or unpublish (unpublishing is how an update is removed; nothing is deleted). */
export async function setUpdateStatus(
  id: string,
  status: "draft" | "published",
): Promise<UpdateResult> {
  if (!(await staff())) return denied;
  if (!idSchema.safeParse(id).success || !["draft", "published"].includes(status)) {
    return { ok: false, message: "Unknown update." };
  }
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("updates")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug")
    .single();
  if (error || !row) return { ok: false, message: "Could not update it." };
  await refreshPages(row.slug);
  return {
    ok: true,
    message: status === "published" ? "Published." : "Unpublished: removed from the site.",
  };
}

export async function setUpdatePinned(id: string, pinned: boolean): Promise<UpdateResult> {
  if (!(await staff())) return denied;
  if (!idSchema.safeParse(id).success) return { ok: false, message: "Unknown update." };
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("updates")
    .update({ pinned, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug")
    .single();
  if (error || !row) return { ok: false, message: "Could not update it." };
  await refreshPages(row.slug);
  return { ok: true, message: pinned ? "Pinned: shown first." : "Unpinned." };
}

/** Uploads and converts an image (1600 × 900 WebP); the form then saves its path. */
export async function uploadUpdateImage(form: FormData): Promise<UpdateResult> {
  if (!(await staff())) return denied;
  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose an image." };
  try {
    const imagePath = await storeUpdateImage(file);
    return { ok: true, imagePath, message: "Image ready (resized to 1600 × 900 WebP)." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Upload failed." };
  }
}

"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";

/** Marks all of the caller's notifications read. RLS limits the update to their own rows. */
export async function markAllNotificationsRead(): Promise<void> {
  const session = await getSessionUser();
  if (!session) return;
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", session.user.id)
    .is("read_at", null);
  revalidatePath("/dashboard", "layout");
}

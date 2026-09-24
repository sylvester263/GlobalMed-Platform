import "server-only";

import { createClient } from "@/lib/db/server";

export type NotificationItem = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string | null;
};

/** Latest notifications for the signed-in user. RLS ("own notifications") scopes the query. */
export async function getRecentNotifications(
  userId: string,
): Promise<{ items: NotificationItem[]; unread: number }> {
  const supabase = await createClient();
  const [{ data }, { count }] = await Promise.all([
    supabase
      .from("notifications")
      .select("id, title, body, link, read_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("read_at", null),
  ]);
  return {
    items: (data ?? []).map((n) => ({
      id: n.id,
      title: n.title ?? "Notification",
      body: n.body,
      link: n.link,
      read: n.read_at !== null,
      createdAt: n.created_at,
    })),
    unread: count ?? 0,
  };
}

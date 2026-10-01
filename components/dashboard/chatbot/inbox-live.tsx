"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/lib/db/client";

/**
 * Refreshes the Sales inbox list when conversations or messages change (Supabase realtime;
 * RLS means only staff receive these events).
 */
export function InboxLive() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    let timer: number | undefined;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => router.refresh(), 300);
    };
    const channel = supabase
      .channel("sales-inbox")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_conversations" },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        refresh,
      )
      .subscribe();
    return () => {
      window.clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [router]);
  return (
    <p className="sr-only" aria-live="polite">
      This list updates automatically.
    </p>
  );
}

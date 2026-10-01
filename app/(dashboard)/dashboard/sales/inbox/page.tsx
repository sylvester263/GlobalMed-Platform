import { Inbox } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { InboxLive } from "@/components/dashboard/chatbot/inbox-live";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { handoffReasonLabels } from "@/lib/ai/labels";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";

export const metadata: Metadata = { title: "Inbox" };

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/**
 * Sales inbox (docs/09 §6): website chats handed to a person — asked for a person, the bot
 * wasn't sure twice, a complaint or a payment issue. Updates live.
 */
export default async function SalesInboxPage() {
  await requireArea("sales", "/dashboard/sales/inbox");
  const supabase = await createClient();
  const { data: conversations } = await supabase
    .from("chat_conversations")
    .select("id, status, handoff_reason, handoff_at, summary, last_message_at")
    .eq("status", "handoff")
    .order("last_message_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Inbox"
        description="Website chats waiting for a person. Open one to reply; your reply appears in the visitor's chat."
      />
      <InboxLive />
      {!conversations?.length ? (
        <EmptyState
          icon={Inbox}
          title="No chats waiting"
          description="When a visitor asks for a person, or the bot can't help, the chat appears here."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/dashboard/sales/inbox/${c.id}`}
                className="flex flex-col gap-2 rounded-lg border bg-card p-4 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-semibold text-primary">{c.summary ?? "Website chat"}</span>
                <span className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {c.handoff_reason && (
                    <Badge variant="warning">
                      {handoffReasonLabels[c.handoff_reason] ?? c.handoff_reason}
                    </Badge>
                  )}
                  {dateFormat.format(new Date(c.last_message_at ?? c.handoff_at ?? Date.now()))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm text-muted-foreground">
        Chats stay here until you hand them back to the bot or close them. Every chat, including
        those the bot handled, is in Admin → Chatbot → Conversations.
      </p>
    </div>
  );
}

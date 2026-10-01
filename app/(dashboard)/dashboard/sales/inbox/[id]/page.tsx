import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { LiveThread } from "@/components/dashboard/chatbot/live-thread";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { conversationStatusLabels, handoffReasonLabels } from "@/lib/ai/labels";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";

export const metadata: Metadata = { title: "Chat" };

type Props = { params: Promise<{ id: string }> };

/** One handed-off chat: live transcript, reply box, linked lead. */
export default async function InboxThreadPage({ params }: Props) {
  const { id } = await params;
  await requireArea("sales", `/dashboard/sales/inbox/${id}`);
  if (!z.uuid().safeParse(id).success) notFound();

  const supabase = await createClient();
  const [{ data: conversation }, { data: messages }, { data: leads }] = await Promise.all([
    supabase
      .from("chat_conversations")
      .select("id, status, handoff_reason, summary")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", id)
      .order("created_at"),
    supabase
      .from("leads")
      .select("id, name, email, phone")
      .eq("details->>conversationId", id)
      .limit(3),
  ]);
  if (!conversation) notFound();
  const status = conversationStatusLabels[conversation.status] ?? conversationStatusLabels.bot!;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/sales/inbox"
        className="inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Inbox
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <DashboardPageHeader className="mb-0" title={conversation.summary ?? "Website chat"} />
        <Badge variant={status.variant}>{status.label}</Badge>
        {conversation.handoff_reason && (
          <Badge variant="outline">
            {handoffReasonLabels[conversation.handoff_reason] ?? conversation.handoff_reason}
          </Badge>
        )}
      </div>
      {leads?.map((lead) => (
        <p key={lead.id} className="text-sm">
          Contact details given:{" "}
          <Link
            href={`/dashboard/sales/leads/${lead.id}`}
            className="font-semibold text-primary hover:underline"
          >
            {lead.name ?? "Lead"}
          </Link>
          {lead.email && ` · ${lead.email}`}
          {lead.phone && ` · ${lead.phone}`}
        </p>
      ))}
      <LiveThread
        conversationId={conversation.id}
        initialMessages={messages ?? []}
        status={conversation.status}
      />
    </div>
  );
}

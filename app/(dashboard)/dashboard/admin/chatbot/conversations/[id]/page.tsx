import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { DeleteConversation } from "@/components/dashboard/chatbot/delete-conversation";
import { Transcript } from "@/components/dashboard/chatbot/transcript";
import { Badge } from "@/components/ui/badge";
import { conversationStatusLabels, handoffReasonLabels } from "@/lib/ai/labels";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";

export const metadata: Metadata = { title: "Conversation" };

type Props = { params: Promise<{ id: string }> };

/** One conversation (admin log): transcript, linked lead, delete on request. */
export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
  await requireArea("admin", `/dashboard/admin/chatbot/conversations/${id}`);
  if (!z.uuid().safeParse(id).success) notFound();

  const supabase = await createClient();
  const [{ data: conversation }, { data: messages }, { data: leads }] = await Promise.all([
    supabase
      .from("chat_conversations")
      .select("id, status, handoff_reason, summary, created_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", id)
      .order("created_at"),
    supabase.from("leads").select("id, name").eq("details->>conversationId", id).limit(5),
  ]);
  if (!conversation) notFound();
  const status = conversationStatusLabels[conversation.status] ?? conversationStatusLabels.bot!;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/admin/chatbot/conversations"
        className="inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> All conversations
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl">{conversation.summary ?? "Conversation"}</h2>
        <Badge variant={status.variant}>{status.label}</Badge>
        {conversation.handoff_reason && (
          <Badge variant="outline">
            {handoffReasonLabels[conversation.handoff_reason] ?? conversation.handoff_reason}
          </Badge>
        )}
      </div>
      {leads?.length ? (
        <p className="text-sm">
          Lead:{" "}
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/dashboard/sales/leads/${lead.id}`}
              className="mr-3 text-primary hover:underline"
            >
              {lead.name ?? "View lead"}
            </Link>
          ))}
        </p>
      ) : null}
      <div className="max-w-3xl rounded-lg border bg-card p-4">
        <Transcript messages={messages ?? []} />
      </div>
      <DeleteConversation id={conversation.id} />
    </div>
  );
}

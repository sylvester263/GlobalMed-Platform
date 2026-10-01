import { MessagesSquare, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { conversationStatusLabels as statusLabels } from "@/lib/ai/labels";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Chatbot conversations" };

type Props = { searchParams: Promise<{ q?: string }> };

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/** Conversation logs with search over every message (admin). */
export default async function ChatbotConversationsPage({ searchParams }: Props) {
  await requireArea("admin", "/dashboard/admin/chatbot/conversations");
  const q = (await searchParams).q?.trim().slice(0, 100) ?? "";

  let conversations: {
    id: string;
    status: string;
    summary: string | null;
    created_at: string;
    last_message_at: string | null;
  }[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let ids: string[] | null = null;
    if (q) {
      const pattern = `%${q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
      const { data: hits } = await supabase
        .from("chat_messages")
        .select("conversation_id")
        .ilike("content", pattern)
        .limit(500);
      ids = [...new Set((hits ?? []).map((h) => h.conversation_id))];
    }
    let query = supabase
      .from("chat_conversations")
      .select("id, status, summary, created_at, last_message_at")
      .eq("channel", "web")
      .order("last_message_at", { ascending: false })
      .limit(100);
    if (ids) query = query.in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
    conversations = (await query).data ?? [];
  }

  return (
    <div className="flex flex-col gap-6">
      <form role="search" className="flex max-w-xl gap-2">
        <label htmlFor="conversation-search" className="sr-only">
          Search conversations
        </label>
        <Input id="conversation-search" name="q" defaultValue={q} placeholder="Search messages" />
        <Button type="submit" variant="secondary">
          <Search aria-hidden="true" /> Search
        </Button>
      </form>

      {!conversations.length ? (
        <EmptyState
          icon={MessagesSquare}
          title={q ? "No matching conversations" : "No conversations yet"}
          description={
            q ? "Try another word from the visitor's messages." : "Website chats will appear here."
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First question</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversations.map((c) => {
              const status = statusLabels[c.status] ?? statusLabels.bot!;
              return (
                <TableRow key={c.id}>
                  <TableCell className="max-w-md">
                    <Link
                      href={`/dashboard/admin/chatbot/conversations/${c.id}`}
                      className="line-clamp-2 font-semibold text-primary hover:underline"
                    >
                      {c.summary ?? "(no text)"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    {dateFormat.format(new Date(c.last_message_at ?? c.created_at))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

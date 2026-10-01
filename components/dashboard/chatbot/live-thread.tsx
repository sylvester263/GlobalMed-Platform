"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { Transcript, type TranscriptMessage } from "@/components/dashboard/chatbot/transcript";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendAgentReply, setConversationStatus } from "@/lib/ai/inbox-actions";
import { createClient } from "@/lib/db/client";

/**
 * One chat in the Sales inbox: messages arrive live (Supabase realtime), the agent replies
 * here and the reply appears in the visitor's widget. Hand back to the bot or close the chat.
 */
export function LiveThread({
  conversationId,
  initialMessages,
  status,
}: {
  conversationId: string;
  initialMessages: TranscriptMessage[];
  status: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`thread-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as TranscriptMessage;
          setMessages((current) =>
            current.some((m) => m.id === row.id) ? current : [...current, row],
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_conversations",
          filter: `id=eq.${conversationId}`,
        },
        (payload) => setCurrentStatus(String((payload.new as { status: string }).status)),
      )
      .subscribe();
    return () => void supabase.removeChannel(channel);
  }, [conversationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const changeStatus = (next: "bot" | "closed") =>
    startTransition(async () => {
      const result = await setConversationStatus({ conversationId, status: next });
      if (result.ok) setCurrentStatus(next);
      else setError(result.message ?? "Could not update the conversation.");
    });

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <div
        className="max-h-[60vh] overflow-y-auto rounded-lg border bg-card p-4"
        aria-live="polite"
      >
        <Transcript messages={messages} />
        <div ref={endRef} />
      </div>

      {currentStatus === "closed" ? (
        <p className="text-sm text-muted-foreground">This chat is closed.</p>
      ) : (
        <form
          ref={formRef}
          className="flex flex-col gap-2"
          action={(form) =>
            startTransition(async () => {
              setError(null);
              const result = await sendAgentReply({ conversationId, body: form.get("body") });
              if (result.ok) formRef.current?.reset();
              else setError(result.message ?? "Could not send the reply.");
            })
          }
        >
          <Label htmlFor="agent-reply">Reply</Label>
          <Textarea
            id="agent-reply"
            name="body"
            rows={3}
            maxLength={2000}
            required
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <p className="text-xs text-muted-foreground">
            The visitor sees your reply in the chat widget. Never ask for patient information.
          </p>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" loading={pending}>
              Send reply
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => changeStatus("bot")}
            >
              Hand back to the bot
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={() => changeStatus("closed")}
            >
              Close chat
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

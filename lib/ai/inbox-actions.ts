"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { authorize } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";

/**
 * Sales inbox actions (docs/09 §6). Staff write under their own session (RLS "staff
 * messages" / "staff conversations"); the role is re-checked here, never taken from the browser.
 */

export type InboxResult = { ok: boolean; message?: string };

const replySchema = z.object({
  conversationId: z.uuid(),
  body: z.string().trim().min(1, "Write a reply.").max(2000),
});

export async function sendAgentReply(input: unknown): Promise<InboxResult> {
  const session = await authorize(["sales", "admin"]);
  if (!session) return { ok: false, message: "You don't have access to do that." };
  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("chat_messages").insert({
    conversation_id: parsed.data.conversationId,
    role: "agent",
    content: parsed.data.body,
    author_id: session.user.id,
  });
  if (error) return { ok: false, message: "Could not send the reply." };
  // A person is answering: the bot stops collecting details and stays paused.
  await supabase
    .from("chat_conversations")
    .update({
      status: "handoff",
      handoff: true,
      lead_flow: null,
      assigned_to: session.user.id,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.conversationId);
  return { ok: true };
}

const statusSchema = z.object({ conversationId: z.uuid(), status: z.enum(["bot", "closed"]) });

/** Hand the chat back to the bot, or close it. */
export async function setConversationStatus(input: unknown): Promise<InboxResult> {
  if (!(await authorize(["sales", "admin"]))) {
    return { ok: false, message: "You don't have access to do that." };
  }
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Unknown conversation." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("chat_conversations")
    .update({ status: parsed.data.status, handoff: false, low_confidence_streak: 0 })
    .eq("id", parsed.data.conversationId);
  if (error) return { ok: false, message: "Could not update the conversation." };
  revalidatePath("/dashboard/sales/inbox");
  return { ok: true };
}

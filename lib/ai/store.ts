import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import type { LeadFlow } from "@/lib/ai/lead-flow";
import { parseChatSettings, type ChatSettings } from "@/lib/ai/settings";
import { createAdminClient } from "@/lib/db/admin";
import type { Json } from "@/lib/db/types";
import { isSupabaseConfigured } from "@/lib/env";
import { formsDryRun, serverEnv } from "@/lib/server-env";

/**
 * Chat persistence for the widget (service role, after the visitor token is checked).
 * Staff pages read the same tables with their own session under RLS.
 *
 * Local dry run (FORMS_DRY_RUN=true, never in production) without Supabase keeps
 * conversations in this process's memory, so the widget can be built and tested before
 * the database is linked.
 */

export type ConversationStatus = "bot" | "handoff" | "closed";
export type MessageRole = "user" | "assistant" | "agent" | "system";

export type Conversation = {
  id: string;
  status: ConversationStatus;
  handoffReason: string | null;
  lowConfidenceStreak: number;
  leadFlow: LeadFlow | null;
  leadId: string | null;
  tokenHash: string | null;
  summary: string | null;
  createdAt: string;
};

export type StoredMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  meta: Record<string, unknown>;
};

type ConversationPatch = Partial<
  Pick<Conversation, "status" | "handoffReason" | "lowConfidenceStreak" | "leadFlow" | "leadId">
> & { handoffAt?: string };

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function newVisitorToken(): string {
  return randomBytes(24).toString("base64url");
}

export function tokenMatches(token: string, hash: string | null): boolean {
  if (!hash) return false;
  const a = Buffer.from(hashToken(token), "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function hasDatabase(): boolean {
  return isSupabaseConfigured() && Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY);
}

/** True when chats can be stored (database, or the local dry-run memory). */
export function isStoreAvailable(): boolean {
  return hasDatabase() || formsDryRun();
}

// ---------- Local dry-run memory ----------

type Memory = {
  conversations: Map<string, Conversation>;
  messages: Map<string, StoredMessage[]>;
  settings: ChatSettings | null;
};

const globalMemory = globalThis as typeof globalThis & { __gmChatMemory?: Memory };
function memory(): Memory {
  globalMemory.__gmChatMemory ??= { conversations: new Map(), messages: new Map(), settings: null };
  return globalMemory.__gmChatMemory;
}

// ---------- Mapping ----------

type ConversationRow = {
  id: string;
  status: string;
  handoff_reason: string | null;
  low_confidence_streak: number;
  lead_flow: Json | null;
  lead_id: string | null;
  visitor_token_hash: string | null;
  summary: string | null;
  created_at: string;
};

function toConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    status: row.status as ConversationStatus,
    handoffReason: row.handoff_reason,
    lowConfidenceStreak: row.low_confidence_streak,
    leadFlow: (row.lead_flow as LeadFlow | null) ?? null,
    leadId: row.lead_id,
    tokenHash: row.visitor_token_hash,
    summary: row.summary,
    createdAt: row.created_at,
  };
}

const conversationColumns =
  "id, status, handoff_reason, low_confidence_streak, lead_flow, lead_id, visitor_token_hash, summary, created_at";

// ---------- Conversations ----------

export async function createConversation(input: {
  visitorId: string;
  tokenHash: string;
  summary: string;
}): Promise<Conversation> {
  if (!hasDatabase()) {
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      status: "bot",
      handoffReason: null,
      lowConfidenceStreak: 0,
      leadFlow: null,
      leadId: null,
      tokenHash: input.tokenHash,
      summary: input.summary,
      createdAt: new Date().toISOString(),
    };
    memory().conversations.set(conversation.id, conversation);
    memory().messages.set(conversation.id, []);
    return conversation;
  }
  const { data, error } = await createAdminClient()
    .from("chat_conversations")
    .insert({
      channel: "web",
      visitor_id: input.visitorId,
      visitor_token_hash: input.tokenHash,
      summary: input.summary.slice(0, 200),
    })
    .select(conversationColumns)
    .single();
  if (error || !data) throw new Error("Could not start the conversation.");
  return toConversation(data);
}

export async function getConversation(id: string): Promise<Conversation | null> {
  if (!hasDatabase()) return memory().conversations.get(id) ?? null;
  const { data } = await createAdminClient()
    .from("chat_conversations")
    .select(conversationColumns)
    .eq("id", id)
    .maybeSingle();
  return data ? toConversation(data) : null;
}

export async function updateConversation(id: string, patch: ConversationPatch): Promise<void> {
  if (!hasDatabase()) {
    const current = memory().conversations.get(id);
    if (current) {
      const { handoffAt: _handoffAt, ...rest } = patch;
      memory().conversations.set(id, { ...current, ...rest });
    }
    return;
  }
  await createAdminClient()
    .from("chat_conversations")
    .update({
      ...(patch.status !== undefined && {
        status: patch.status,
        handoff: patch.status === "handoff",
      }),
      ...(patch.handoffReason !== undefined && { handoff_reason: patch.handoffReason }),
      ...(patch.handoffAt !== undefined && { handoff_at: patch.handoffAt }),
      ...(patch.lowConfidenceStreak !== undefined && {
        low_confidence_streak: patch.lowConfidenceStreak,
      }),
      ...(patch.leadFlow !== undefined && { lead_flow: patch.leadFlow as Json }),
      ...(patch.leadId !== undefined && { lead_id: patch.leadId }),
    })
    .eq("id", id);
}

// ---------- Messages ----------

export async function addMessage(
  conversationId: string,
  message: {
    role: MessageRole;
    content: string;
    meta?: Record<string, unknown>;
    authorId?: string;
  },
): Promise<StoredMessage> {
  const now = new Date().toISOString();
  if (!hasDatabase()) {
    const stored: StoredMessage = {
      id: crypto.randomUUID(),
      role: message.role,
      content: message.content,
      createdAt: now,
      meta: message.meta ?? {},
    };
    memory().messages.get(conversationId)?.push(stored);
    return stored;
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("chat_messages")
    .insert({
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      meta: (message.meta ?? {}) as Json,
      author_id: message.authorId ?? null,
    })
    .select("id, role, content, created_at, meta")
    .single();
  if (error || !data) throw new Error("Could not save the message.");
  await admin.from("chat_conversations").update({ last_message_at: now }).eq("id", conversationId);
  return {
    id: data.id,
    role: data.role as MessageRole,
    content: data.content,
    createdAt: data.created_at,
    meta: (data.meta as Record<string, unknown>) ?? {},
  };
}

/** Messages in order; `after` (ISO time) returns only newer ones (widget polling). */
export async function listMessages(
  conversationId: string,
  { after, limit = 200 }: { after?: string; limit?: number } = {},
): Promise<StoredMessage[]> {
  if (!hasDatabase()) {
    const all = memory().messages.get(conversationId) ?? [];
    return (after ? all.filter((m) => m.createdAt > after) : all).slice(-limit);
  }
  let query = createAdminClient()
    .from("chat_messages")
    .select("id, role, content, created_at, meta")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (after) query = query.gt("created_at", after);
  const { data } = await query;
  return (data ?? []).map((m) => ({
    id: m.id,
    role: m.role as MessageRole,
    content: m.content,
    createdAt: m.created_at,
    meta: (m.meta as Record<string, unknown>) ?? {},
  }));
}

/** Agent reply (dry-run test hook only; staff reply through lib/ai/inbox-actions.ts). */
export async function addAgentMessageForTest(conversationId: string, content: string) {
  if (!formsDryRun()) throw new Error("Test hook is only available in local dry run.");
  return addMessage(conversationId, { role: "agent", content });
}

// ---------- Settings ----------

export async function getChatSettings(): Promise<ChatSettings> {
  if (!hasDatabase()) return memory().settings ?? parseChatSettings({});
  const { data } = await createAdminClient()
    .from("settings")
    .select("value")
    .eq("key", "chatbot")
    .maybeSingle();
  return parseChatSettings(data?.value ?? {});
}

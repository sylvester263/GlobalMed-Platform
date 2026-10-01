import "server-only";

import { isChatConfigured, isEmbeddingConfigured, modelInUse } from "@/lib/ai/provider";
import { emailConfigured } from "@/lib/email/send";
import { isSupabaseConfigured } from "@/lib/env";
import { serverEnv } from "@/lib/server-env";

export type SetupItem = { label: string; ok: boolean; detail: string; envVars: string };

/** What the chatbot needs on the hosting, for admin → Chatbot (never shows key values). */
export function chatbotSetup(): SetupItem[] {
  const model = modelInUse();
  return [
    {
      label: "Language model",
      ok: isChatConfigured(),
      detail: model.chat ?? "Not set: scripted answers (prices, contact) still work.",
      envVars: "LLM_PROVIDER, LLM_API_KEY, LLM_MODEL",
    },
    {
      label: "Embeddings (knowledge base)",
      ok: isEmbeddingConfigured(),
      detail: model.embedding ?? "Not set: answers use the pinned site data only.",
      envVars: "EMBEDDING_MODEL (+ EMBEDDING_PROVIDER, EMBEDDING_API_KEY with Anthropic)",
    },
    {
      label: "Database",
      ok: isSupabaseConfigured() && Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY),
      detail: "Conversations, knowledge base, leads, inbox.",
      envVars: "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY",
    },
    {
      label: "Rate limiting",
      ok: Boolean(serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN),
      detail: "20 messages / 10 min per visitor across all server instances.",
      envVars: "UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN",
    },
    {
      label: "Bot check",
      ok: Boolean(serverEnv.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
      detail: "Turnstile on the first message. Without it, chats are refused in production.",
      envVars: "NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY",
    },
    {
      label: "Email",
      ok: emailConfigured(),
      detail: "Lead and handoff emails to the sales inbox.",
      envVars: "RESEND_API_KEY, EMAIL_FROM, ADMIN_NOTIFY_EMAIL",
    },
  ];
}

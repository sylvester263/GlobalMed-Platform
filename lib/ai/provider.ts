import "server-only";

import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { embed as sdkEmbed, embedMany as sdkEmbedMany, streamText, type ModelMessage } from "ai";

type ProviderOptions = NonNullable<Parameters<typeof sdkEmbed>[0]["providerOptions"]>;

import { serverEnv } from "@/lib/server-env";

/**
 * LLM adapter (docs/09 §2): one interface over the client's provider, chosen by LLM_PROVIDER
 * (openai | anthropic | gemini). Keys come only from the environment.
 */

/** kb_chunks.embedding is vector(1536) (supabase/migrations/0006_chatbot.sql). */
export const EMBEDDING_DIMENSIONS = 1536;

const defaultModels = {
  openai: { chat: "gpt-4o-mini", embedding: "text-embedding-3-small" },
  anthropic: { chat: "claude-haiku-4-5", embedding: null },
  gemini: { chat: "gemini-2.5-flash", embedding: "gemini-embedding-001" },
} as const;

type ChatProvider = keyof typeof defaultModels;
type EmbeddingProvider = "openai" | "gemini";

function chatSettings(): { provider: ChatProvider; apiKey: string; model: string } | null {
  const provider = serverEnv.LLM_PROVIDER;
  if (!provider || !serverEnv.LLM_API_KEY) return null;
  return {
    provider,
    apiKey: serverEnv.LLM_API_KEY,
    model: serverEnv.LLM_MODEL ?? defaultModels[provider].chat,
  };
}

function embeddingSettings(): {
  provider: EmbeddingProvider;
  apiKey: string;
  model: string;
} | null {
  const chat = serverEnv.LLM_PROVIDER;
  const provider: EmbeddingProvider | undefined =
    serverEnv.EMBEDDING_PROVIDER ?? (chat === "openai" || chat === "gemini" ? chat : undefined);
  if (!provider) return null;
  const sameProvider = provider === chat;
  const apiKey = serverEnv.EMBEDDING_API_KEY ?? (sameProvider ? serverEnv.LLM_API_KEY : undefined);
  if (!apiKey) return null;
  return {
    provider,
    apiKey,
    model: serverEnv.EMBEDDING_MODEL ?? defaultModels[provider].embedding,
  };
}

/** True when the chat model can answer (provider + key set). */
export function isChatConfigured(): boolean {
  return chatSettings() !== null;
}

/** True when embeddings (retrieval and knowledge-base sync) are available. */
export function isEmbeddingConfigured(): boolean {
  return embeddingSettings() !== null;
}

/** Shown in admin settings: what is in use, never the key. */
export function modelInUse(): { chat: string | null; embedding: string | null } {
  const chat = chatSettings();
  const embedding = embeddingSettings();
  return {
    chat: chat ? `${chat.provider} · ${chat.model}` : null,
    embedding: embedding ? `${embedding.provider} · ${embedding.model}` : null,
  };
}

function chatModel() {
  const settings = chatSettings();
  if (!settings) throw new Error("LLM is not configured: set LLM_PROVIDER and LLM_API_KEY.");
  const { provider, apiKey, model } = settings;
  if (provider === "openai") return createOpenAI({ apiKey })(model);
  if (provider === "anthropic") return createAnthropic({ apiKey })(model);
  return createGoogleGenerativeAI({ apiKey })(model);
}

function embeddingModel() {
  const settings = embeddingSettings();
  if (!settings) {
    throw new Error("Embeddings are not configured: set EMBEDDING_MODEL and an embedding key.");
  }
  const { provider, apiKey, model } = settings;
  return {
    model:
      provider === "openai"
        ? createOpenAI({ apiKey }).embedding(model)
        : createGoogleGenerativeAI({ apiKey }).embedding(model),
    providerOptions: (provider === "openai"
      ? { openai: { dimensions: EMBEDDING_DIMENSIONS } }
      : { google: { outputDimensionality: EMBEDDING_DIMENSIONS } }) as ProviderOptions,
    name: model,
  };
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** Streams the reply as text parts. `maxOutputTokens` caps every reply (docs/09 §9). */
export function generate(
  messages: ChatTurn[],
  options: { system: string; maxOutputTokens: number; abortSignal?: AbortSignal },
): AsyncIterable<string> {
  const result = streamText({
    model: chatModel(),
    system: options.system,
    messages: messages as ModelMessage[],
    maxOutputTokens: options.maxOutputTokens,
    temperature: 0.2,
    abortSignal: options.abortSignal,
  });
  return result.textStream;
}

/** One embedding (a visitor's question). */
export async function embed(text: string): Promise<number[]> {
  const { model, providerOptions } = embeddingModel();
  const { embedding } = await sdkEmbed({ model, value: text, providerOptions });
  return embedding;
}

/** Several embeddings (knowledge-base chunks); returns the model name stored with them. */
export async function embedMany(texts: string[]): Promise<{ vectors: number[][]; model: string }> {
  const { model, providerOptions, name } = embeddingModel();
  const { embeddings } = await sdkEmbedMany({
    model,
    values: texts,
    providerOptions,
    maxParallelCalls: 2,
  });
  return { vectors: embeddings, model: name };
}

/** pgvector's text format for an embedding: "[0.1,0.2,…]". */
export function toPgVector(vector: number[]): string {
  return `[${vector.join(",")}]`;
}

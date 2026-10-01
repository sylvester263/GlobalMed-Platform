import "server-only";

import { createAdminClient } from "@/lib/db/admin";
import { embed, isEmbeddingConfigured, toPgVector } from "@/lib/ai/provider";
import { isSupabaseConfigured } from "@/lib/env";
import { serverEnv } from "@/lib/server-env";

export type Retrieved = {
  context: string;
  /** Best cosine similarity (0 when nothing was retrieved). */
  topSimilarity: number;
  sources: { title: string; similarity: number }[];
};

const empty: Retrieved = { context: "", topSimilarity: 0, sources: [] };

/** Below this similarity a chunk is not used as context. */
export const MIN_SIMILARITY = 0.25;

/** Builds the context block from match_kb rows (top first). */
export function buildContext(
  rows: { title: string; content: string; similarity: number }[],
  min = MIN_SIMILARITY,
): Retrieved {
  const used = rows.filter((r) => r.similarity >= min);
  if (!used.length) return { ...empty, topSimilarity: rows[0]?.similarity ?? 0 };
  return {
    context: used.map((r) => `[${r.title}]\n${r.content}`).join("\n\n---\n\n"),
    topSimilarity: used[0]?.similarity ?? 0,
    sources: used.map((r) => ({ title: r.title, similarity: Number(r.similarity.toFixed(3)) })),
  };
}

/**
 * docs/09 §2: embed the question → match_kb top 5 → context. Returns an empty context when
 * Supabase or embeddings aren't configured (the pinned knowledge still answers).
 */
export async function retrieve(question: string, count = 5): Promise<Retrieved> {
  if (!isEmbeddingConfigured() || !isSupabaseConfigured() || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return empty;
  }
  try {
    const vector = await embed(question);
    const { data, error } = await createAdminClient().rpc("match_kb", {
      query_embedding: toPgVector(vector),
      match_count: count,
    });
    if (error || !data) return empty;
    return buildContext(data);
  } catch {
    return empty;
  }
}

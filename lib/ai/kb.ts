import "server-only";

import { chunkText } from "@/lib/ai/chunk";
import { extractMainText } from "@/lib/ai/extract";
import { pinnedKnowledge } from "@/lib/ai/knowledge";
import { embedMany, isEmbeddingConfigured, toPgVector } from "@/lib/ai/provider";
import { createAdminClient } from "@/lib/db/admin";
import { isSupabaseConfigured, publicEnv } from "@/lib/env";
import { serverEnv } from "@/lib/server-env";
import { getLiveUpdates } from "@/lib/updates/data";
import { updatesKnowledge } from "@/lib/updates/logic";
import { aapcCertificationPath } from "@/lib/site";

/**
 * Knowledge base (docs/09 §3): documents synced from the live site, the pinned site-data
 * document, and documents admins add. Every save re-embeds (chunk ≈800 tokens, 100 overlap).
 * Deleting is a soft delete: retrieval skips the document, the record stays.
 */

/** Pages the bot learns from (live site). Hidden courses aren't rendered, so never indexed. */
export const sitePages: { path: string; title: string }[] = [
  { path: "/", title: "Home — services and Why register through GlobalMed" },
  { path: "/about", title: "About — Our Story" },
  { path: aapcCertificationPath, title: "AAPC Certification in Pakistan (courses, FAQ)" },
  { path: "/education/cpc", title: "CPC® course" },
  { path: "/education/cpb", title: "CPB® course" },
  { path: "/education/cpc-cpb", title: "CPC® + CPB® dual certifications" },
  { path: "/services", title: "Services" },
  { path: "/faq", title: "FAQ" },
  { path: "/contact", title: "Contact" },
  { path: "/legal/privacy", title: "Privacy policy" },
];

export const PINNED_SLUG = "pinned:site-data";

export type SyncReport = { slug: string; title: string; chunks: number; error?: string }[];

function db() {
  if (!isSupabaseConfigured() || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured.");
  }
  return createAdminClient();
}

/** Chunks and embeds one document, replacing its previous chunks. Returns the chunk count. */
export async function embedDocument(documentId: string): Promise<number> {
  const admin = db();
  const { data: doc } = await admin
    .from("kb_documents")
    .select("id, title, body")
    .eq("id", documentId)
    .single();
  if (!doc) throw new Error("Document not found.");
  if (!isEmbeddingConfigured()) return 0; // stored now; embedded once a key is set (re-sync)

  const chunks = chunkText(doc.body);
  const { vectors, model } = chunks.length ? await embedMany(chunks) : { vectors: [], model: "" };
  await admin.from("kb_chunks").delete().eq("document_id", documentId);
  if (chunks.length) {
    const { error } = await admin.from("kb_chunks").insert(
      chunks.map((content, i) => ({
        document_id: documentId,
        chunk_index: i,
        content,
        embedding: toPgVector(vectors[i] ?? []),
      })),
    );
    if (error) throw new Error(`Could not store chunks: ${error.message}`);
  }
  await admin
    .from("kb_documents")
    .update({ embedded_at: new Date().toISOString(), embedding_model: model || null })
    .eq("id", documentId);
  return chunks.length;
}

/** Creates or updates a document by slug (site and pinned documents) and re-embeds it. */
async function upsertBySlug(input: {
  slug: string;
  title: string;
  body: string;
  kind: "site" | "pinned" | "update";
  source: string;
}): Promise<number> {
  const admin = db();
  const { data, error } = await admin
    .from("kb_documents")
    .upsert(
      {
        slug: input.slug,
        title: input.title,
        body: input.body,
        kind: input.kind,
        source: input.source,
        deleted_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not save the document.");
  return embedDocument(data.id);
}

export const UPDATES_SLUG = "updates:live";

/**
 * The live updates as one knowledge document (re-embedded whenever an update is saved,
 * published, pinned or unpublished, and on re-sync). Hidden from the chatbot when none are live.
 */
export async function syncUpdatesDocument(): Promise<number> {
  const text = updatesKnowledge(await getLiveUpdates());
  if (!text) {
    await db()
      .from("kb_documents")
      .update({ deleted_at: new Date().toISOString() })
      .eq("slug", UPDATES_SLUG);
    return 0;
  }
  return upsertBySlug({
    slug: UPDATES_SLUG,
    title: "Latest updates (news, batches, events)",
    body: text,
    kind: "update",
    source: "/updates",
  });
}

/** "Re-sync from website": fetches each live page, stores its text and re-embeds it. */
export async function syncFromSite(baseUrl = publicEnv.NEXT_PUBLIC_SITE_URL): Promise<SyncReport> {
  const report: SyncReport = [];
  try {
    const chunks = await upsertBySlug({
      slug: PINNED_SLUG,
      title: "Site data: contact, courses, prices, packages, services",
      body: pinnedKnowledge(),
      kind: "pinned",
      source: "lib/ai/knowledge.ts",
    });
    report.push({ slug: PINNED_SLUG, title: "Site data", chunks });
  } catch (error) {
    report.push({ slug: PINNED_SLUG, title: "Site data", chunks: 0, error: String(error) });
  }

  try {
    const chunks = await syncUpdatesDocument();
    report.push({ slug: UPDATES_SLUG, title: "Latest updates", chunks });
  } catch (error) {
    report.push({ slug: UPDATES_SLUG, title: "Latest updates", chunks: 0, error: String(error) });
  }

  for (const page of sitePages) {
    const slug = `site:${page.path}`;
    try {
      const res = await fetch(new URL(page.path, baseUrl), {
        cache: "no-store",
        headers: { "User-Agent": "GlobalMed-KB-Sync/1.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = extractMainText(await res.text());
      if (body.length < 80) throw new Error("No page text found");
      const chunks = await upsertBySlug({
        slug,
        title: page.title,
        body,
        kind: "site",
        source: new URL(page.path, baseUrl).toString(),
      });
      report.push({ slug, title: page.title, chunks });
    } catch (error) {
      report.push({ slug, title: page.title, chunks: 0, error: String(error) });
    }
  }
  return report;
}

/** Admin document: create or edit, then re-embed. */
export async function saveAdminDocument(input: {
  id?: string;
  title: string;
  body: string;
  source?: string | null;
  createdBy: string;
}): Promise<{ id: string; chunks: number }> {
  const admin = db();
  const values = {
    title: input.title,
    body: input.body,
    source: input.source ?? null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = input.id
    ? await admin.from("kb_documents").update(values).eq("id", input.id).select("id").single()
    : await admin
        .from("kb_documents")
        .insert({ ...values, kind: "admin", created_by: input.createdBy })
        .select("id")
        .single();
  if (error || !data) throw new Error(error?.message ?? "Could not save the document.");
  return { id: data.id, chunks: await embedDocument(data.id) };
}

/** Soft delete (or restore): retrieval skips deleted documents; nothing is removed. */
export async function setDocumentDeleted(id: string, deleted: boolean): Promise<void> {
  await db()
    .from("kb_documents")
    .update({ deleted_at: deleted ? new Date().toISOString() : null })
    .eq("id", id);
}

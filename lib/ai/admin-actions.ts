"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { saveAdminDocument, setDocumentDeleted, syncFromSite, type SyncReport } from "@/lib/ai/kb";
import { chatSettingsSchema } from "@/lib/ai/settings";
import { authorize } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import type { Json } from "@/lib/db/types";

/**
 * Admin → Chatbot actions. Every action re-checks the admin role (and MFA) on the server.
 */

export type ActionResult = { ok: boolean; message: string; id?: string; report?: SyncReport };

const denied: ActionResult = { ok: false, message: "You don't have access to do that." };
const chatbotPath = "/dashboard/admin/chatbot";

const documentSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(2, "Add a title.").max(200),
  body: z.string().trim().min(20, "Add at least a sentence of content.").max(100_000),
  source: z.string().trim().max(500).optional(),
});

export async function saveKbDocument(input: unknown): Promise<ActionResult> {
  const session = await authorize(["admin"]);
  if (!session) return denied;
  const parsed = documentSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };
  try {
    const { id, chunks } = await saveAdminDocument({ ...parsed.data, createdBy: session.user.id });
    revalidatePath(chatbotPath);
    return {
      ok: true,
      id,
      message: chunks
        ? `Saved and embedded (${chunks} chunk${chunks === 1 ? "" : "s"}).`
        : "Saved. It will be embedded once the embedding key is set (then use Re-sync).",
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not save." };
  }
}

export async function setKbDocumentDeleted(id: string, deleted: boolean): Promise<ActionResult> {
  if (!(await authorize(["admin"]))) return denied;
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Unknown document." };
  await setDocumentDeleted(id, deleted);
  revalidatePath(chatbotPath);
  return {
    ok: true,
    message: deleted ? "Document hidden from the chatbot." : "Document restored.",
  };
}

export async function resyncKnowledgeBase(): Promise<ActionResult> {
  if (!(await authorize(["admin"]))) return denied;
  try {
    const report = await syncFromSite();
    revalidatePath(chatbotPath);
    const failed = report.filter((r) => r.error).length;
    return {
      ok: failed === 0,
      report,
      message: failed
        ? `Synced ${report.length - failed} of ${report.length} documents; see the errors below.`
        : `Synced ${report.length} documents from the website.`,
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Sync failed." };
  }
}

export async function saveChatSettings(input: unknown): Promise<ActionResult> {
  if (!(await authorize(["admin"]))) return denied;
  const parsed = chatSettingsSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key: "chatbot", value: parsed.data as unknown as Json }, { onConflict: "key" });
  if (error) return { ok: false, message: "Could not save the settings." };
  revalidatePath(`${chatbotPath}/settings`);
  return { ok: true, message: "Settings saved." };
}

/** Deletes a conversation and its messages on the visitor's request (privacy). */
export async function deleteConversation(id: string): Promise<ActionResult> {
  if (!(await authorize(["admin"]))) return denied;
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Unknown conversation." };
  const supabase = await createClient();
  const { error } = await supabase.from("chat_conversations").delete().eq("id", id);
  if (error) return { ok: false, message: "Could not delete the conversation." };
  revalidatePath(`${chatbotPath}/conversations`);
  return { ok: true, message: "Conversation deleted." };
}

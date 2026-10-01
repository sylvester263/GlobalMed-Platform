import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { KbDocumentForm } from "@/components/dashboard/chatbot/kb-document-form";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";

export const metadata: Metadata = { title: "Knowledge document" };

type Props = { params: Promise<{ id: string }> };

export default async function KnowledgeDocumentPage({ params }: Props) {
  const { id } = await params;
  await requireArea("admin", `/dashboard/admin/chatbot/knowledge/${id}`);
  if (!z.uuid().safeParse(id).success) notFound();
  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("kb_documents")
    .select("id, title, source, body, kind")
    .eq("id", id)
    .maybeSingle();
  if (!doc) notFound();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl">Edit document</h2>
      <KbDocumentForm doc={doc} synced={doc.kind !== "admin"} />
    </div>
  );
}

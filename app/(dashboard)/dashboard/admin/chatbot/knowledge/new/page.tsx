import type { Metadata } from "next";

import { KbDocumentForm } from "@/components/dashboard/chatbot/kb-document-form";
import { requireArea } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Add knowledge document" };

export default async function NewKnowledgeDocumentPage() {
  await requireArea("admin", "/dashboard/admin/chatbot/knowledge/new");
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl">Add document</h2>
      <KbDocumentForm />
    </div>
  );
}

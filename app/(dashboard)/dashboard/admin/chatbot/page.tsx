import { BookOpen, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DeleteToggle, ResyncButton } from "@/components/dashboard/chatbot/kb-actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Chatbot knowledge base" };

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });
const kindLabels: Record<string, string> = { site: "Website", pinned: "Site data", admin: "Added" };

/**
 * Knowledge base: documents synced from the website, the pinned site-data document, and
 * documents admins add. Saving re-embeds; deleting hides a document from the chatbot (soft).
 */
export default async function ChatbotKnowledgePage() {
  await requireArea("admin", "/dashboard/admin/chatbot");
  let documents = null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    ({ data: documents } = await supabase
      .from("kb_documents")
      .select("id, title, kind, source, updated_at, embedded_at, deleted_at, kb_chunks(count)")
      .order("deleted_at", { ascending: true, nullsFirst: true })
      .order("kind")
      .order("title"));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <ResyncButton />
        <Link href="/dashboard/admin/chatbot/knowledge/new" className={buttonVariants()}>
          <Plus aria-hidden="true" /> Add document
        </Link>
      </div>

      {!documents?.length ? (
        <EmptyState
          icon={BookOpen}
          title="No documents yet"
          description="Use Re-sync from website to build the knowledge base from the live pages, or add a document."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Chunks</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const chunks = (doc.kb_chunks as unknown as { count: number }[])[0]?.count ?? 0;
              return (
                <TableRow key={doc.id} className={doc.deleted_at ? "opacity-60" : undefined}>
                  <TableCell>
                    <Link
                      href={`/dashboard/admin/chatbot/knowledge/${doc.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {doc.title}
                    </Link>
                    {doc.deleted_at && (
                      <Badge variant="neutral" className="ml-2">
                        Hidden
                      </Badge>
                    )}
                    {!doc.embedded_at && !doc.deleted_at && (
                      <Badge variant="warning" className="ml-2">
                        Not embedded
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{kindLabels[doc.kind] ?? doc.kind}</TableCell>
                  <TableCell>{chunks}</TableCell>
                  <TableCell>
                    {doc.updated_at ? dateFormat.format(new Date(doc.updated_at)) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteToggle id={doc.id} deleted={Boolean(doc.deleted_at)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

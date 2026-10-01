"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveKbDocument, type ActionResult } from "@/lib/ai/admin-actions";

type Doc = { id?: string; title: string; source: string | null; body: string };

/**
 * Add or edit a knowledge-base document. Saving re-embeds it. Website and site-data documents
 * are rebuilt by Re-sync, so edits to them last until the next sync.
 */
export function KbDocumentForm({ doc, synced }: { doc?: Doc; synced?: boolean }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex max-w-3xl flex-col gap-5"
      action={(form) =>
        startTransition(async () => {
          const saved = await saveKbDocument({
            id: doc?.id,
            title: form.get("title"),
            source: form.get("source") || undefined,
            body: form.get("body"),
          });
          setResult(saved);
          if (saved.ok && !doc?.id && saved.id) {
            router.replace(`/dashboard/admin/chatbot/knowledge/${saved.id}`);
          }
        })
      }
    >
      {synced && (
        <Alert>
          <AlertDescription>
            This document comes from the website. Re-sync replaces it with the live page text, so
            change the page itself for lasting edits.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="kb-title">Title</Label>
        <Input id="kb-title" name="title" defaultValue={doc?.title} required maxLength={200} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="kb-source">Source (optional)</Label>
        <Input id="kb-source" name="source" defaultValue={doc?.source ?? ""} maxLength={500} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="kb-body">Content</Label>
        <p id="kb-body-hint" className="text-sm text-muted-foreground">
          Plain text. Business information only: never patient information.
        </p>
        <Textarea
          id="kb-body"
          name="body"
          aria-describedby="kb-body-hint"
          defaultValue={doc?.body}
          rows={18}
          required
          className="font-mono text-sm"
        />
      </div>
      {result && (
        <Alert variant={result.ok ? "default" : "destructive"} aria-live="polite">
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" loading={pending} className="self-start">
        Save and re-embed
      </Button>
    </form>
  );
}

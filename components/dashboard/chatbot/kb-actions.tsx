"use client";

import { RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  resyncKnowledgeBase,
  setKbDocumentDeleted,
  type ActionResult,
} from "@/lib/ai/admin-actions";

/** "Re-sync from website" with the per-document report. */
export function ResyncButton() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        variant="secondary"
        loading={pending}
        onClick={() => startTransition(async () => setResult(await resyncKnowledgeBase()))}
      >
        <RefreshCw aria-hidden="true" /> Re-sync from website
      </Button>
      {result && (
        <Alert variant={result.ok ? "default" : "destructive"} aria-live="polite">
          <AlertDescription>
            <p>{result.message}</p>
            {result.report && (
              <ul className="mt-2 list-disc pl-5 text-xs">
                {result.report.map((row) => (
                  <li key={row.slug}>
                    {row.title}: {row.error ? row.error : `${row.chunks} chunks`}
                  </li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/** Hide from the chatbot (soft delete) or restore. */
export function DeleteToggle({ id, deleted }: { id: string; deleted: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const run = () =>
    startTransition(async () => {
      await setKbDocumentDeleted(id, !deleted);
      setConfirming(false);
    });

  if (deleted) {
    return (
      <Button size="sm" variant="ghost" loading={pending} onClick={run}>
        Restore
      </Button>
    );
  }
  return confirming ? (
    <span className="inline-flex gap-1">
      <Button size="sm" variant="destructive" loading={pending} onClick={run}>
        Confirm
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </span>
  ) : (
    <Button size="sm" variant="ghost" onClick={() => setConfirming(true)}>
      Delete
    </Button>
  );
}

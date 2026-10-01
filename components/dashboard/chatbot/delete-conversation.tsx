"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { deleteConversation } from "@/lib/ai/admin-actions";

/** Deletes a conversation and its messages when a visitor asks (two-step, no browser dialog). */
export function DeleteConversation({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = () =>
    startTransition(async () => {
      const result = await deleteConversation(id);
      if (result.ok) router.replace("/dashboard/admin/chatbot/conversations");
      else setError(result.message);
    });

  return (
    <div className="flex flex-col items-start gap-2">
      {confirming ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm">Delete this conversation permanently?</span>
          <Button variant="destructive" size="sm" loading={pending} onClick={run}>
            Delete
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setConfirming(true)}>
          Delete conversation
        </Button>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

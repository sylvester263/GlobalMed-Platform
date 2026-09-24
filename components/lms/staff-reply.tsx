"use client";

import { useRef, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { answerQuestion } from "@/lib/lms/learner-actions";

/** Inline reply box for the instructor Q&A inbox. */
export function StaffReply({ questionId, path }: { questionId: string; path: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(form) =>
        startTransition(async () => {
          setError(null);
          const result = await answerQuestion({ questionId, body: form.get("body"), path });
          if (result.ok) formRef.current?.reset();
          else setError(result.message);
        })
      }
      className="flex flex-col gap-2"
    >
      <label htmlFor={`reply-${questionId}`} className="text-sm font-semibold">
        Your answer
      </label>
      <Textarea id={`reply-${questionId}`} name="body" rows={3} maxLength={4000} required />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" size="sm" loading={pending} className="self-start">
        Post answer
      </Button>
    </form>
  );
}

"use client";

import { useRef, useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { answerQuestion, askQuestion } from "@/lib/lms/learner-actions";

export type QaThread = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  answers: { id: string; author: string; body: string; createdAt: string; byStaff: boolean }[];
};

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

/** L-9 lesson Q&A. No patient information: this is a study forum. */
export function QaPanel({
  lessonId,
  path,
  threads,
  canPost,
}: {
  lessonId: string;
  path: string;
  threads: QaThread[];
  canPost: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function ask(form: FormData) {
    startTransition(async () => {
      setError(null);
      const result = await askQuestion({ lessonId, body: form.get("body"), path });
      if (result.ok) formRef.current?.reset();
      else setError(result.message);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {canPost && (
        <form ref={formRef} action={ask} className="flex flex-col gap-2">
          <label htmlFor={`qa-${lessonId}`} className="text-sm font-semibold">
            Ask a question about this lesson
          </label>
          <Textarea id={`qa-${lessonId}`} name="body" rows={3} maxLength={2000} required />
          <p className="text-xs text-muted-foreground">
            Your instructor and classmates can see questions. Never include patient information.
          </p>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" loading={pending} className="self-start">
            Post question
          </Button>
        </form>
      )}

      {threads.length === 0 ? (
        <p className="text-sm text-muted-foreground">No questions yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {threads.map((t) => (
            <li key={t.id} className="flex flex-col gap-3 rounded-lg border bg-ledger p-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t.author} · {dateFormat.format(new Date(t.createdAt))}
                </p>
                <p className="whitespace-pre-line">{t.body}</p>
              </div>
              {t.answers.map((a) => (
                <div key={a.id} className="ml-4 rounded-md border bg-card p-3">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    {a.author} {a.byStaff && <Badge variant="secondary">Instructor</Badge>} ·{" "}
                    {dateFormat.format(new Date(a.createdAt))}
                  </p>
                  <p className="text-sm whitespace-pre-line">{a.body}</p>
                </div>
              ))}
              {canPost && <AnswerForm questionId={t.id} path={path} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AnswerForm({ questionId, path }: { questionId: string; path: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  if (!open) {
    return (
      <Button variant="link" size="sm" className="self-start" onClick={() => setOpen(true)}>
        Reply
      </Button>
    );
  }
  return (
    <form
      action={(form) =>
        startTransition(async () => {
          const result = await answerQuestion({ questionId, body: form.get("body"), path });
          if (result.ok) setOpen(false);
          else setError(result.message);
        })
      }
      className="ml-4 flex flex-col gap-2"
    >
      <label htmlFor={`answer-${questionId}`} className="sr-only">
        Your reply
      </label>
      <Textarea
        id={`answer-${questionId}`}
        name="body"
        rows={2}
        maxLength={4000}
        required
        autoFocus
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={pending}>
          Post reply
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

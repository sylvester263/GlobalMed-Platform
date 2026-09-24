"use client";

import { useEffect, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { saveNote } from "@/lib/lms/learner-actions";

type Status = "idle" | "saving" | "saved" | "error";

/** L-4 private notes per lesson, saved automatically a second after typing stops. */
export function NotesPanel({ lessonId, initial }: { lessonId: string; initial: string }) {
  const [body, setBody] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | undefined>(undefined);
  const lastSaved = useRef(initial);

  useEffect(() => {
    if (body === lastSaved.current) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setStatus("saving");
      const result = await saveNote({ lessonId, body });
      if (result.ok) {
        lastSaved.current = body;
        setStatus("saved");
      } else {
        setStatus("error");
      }
    }, 1000);
    return () => window.clearTimeout(timer.current);
  }, [body, lessonId]);

  const statusText = {
    idle: "",
    saving: "Saving…",
    saved: "Saved",
    error: "Couldn't save. Check your connection.",
  }[status];

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`notes-${lessonId}`} className="text-sm font-semibold">
        Your notes
      </label>
      <Textarea
        id={`notes-${lessonId}`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={10000}
        rows={6}
        aria-describedby={`notes-${lessonId}-status`}
        placeholder="Only you can see these notes."
      />
      <p
        id={`notes-${lessonId}-status`}
        aria-live="polite"
        className="min-h-5 text-xs text-muted-foreground"
      >
        {statusText}
      </p>
    </div>
  );
}

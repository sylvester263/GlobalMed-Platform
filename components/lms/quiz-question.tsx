"use client";

import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { Button } from "@/components/ui/button";
import { dur, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type QuizOption = { id: string; label: string };

export type QuizQuestionData = {
  id: string;
  type: "single" | "multi" | "truefalse";
  prompt: string;
  options: QuizOption[];
};

/** Returned by the server after grading. Correct answers are never sent before submit (P6-2). */
export type QuizFeedback = {
  correct: boolean;
  correctOptionIds: string[];
  explanation?: string;
};

type QuizQuestionProps = {
  question: QuizQuestionData;
  number: number;
  total: number;
  feedback?: QuizFeedback;
  submitting?: boolean;
  onSubmit: (selectedIds: string[]) => void;
  className?: string;
};

/**
 * One quiz question (docs/02 L-7) with DM-4 feedback: correct answer gets a spring
 * tick; a wrong answer gets a subtle 4px shake (none for reduced motion).
 * Result is always stated in text too.
 */
export function QuizQuestion({
  question,
  number,
  total,
  feedback,
  submitting = false,
  onSubmit,
  className,
}: QuizQuestionProps) {
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState<string[]>([]);
  const multi = question.type === "multi";
  const locked = Boolean(feedback);
  const legendId = `q-${question.id}-legend`;

  function toggle(id: string) {
    if (locked) return;
    setSelected((prev) =>
      multi ? (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]) : [id],
    );
  }

  return (
    <motion.form
      className={cn("flex flex-col gap-5 rounded-lg border bg-card p-6", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (selected.length) onSubmit(selected);
      }}
      animate={feedback && !feedback.correct && !reduced ? { x: [0, -4, 4, -4, 0] } : { x: 0 }}
      transition={{ duration: dur.base }}
    >
      <fieldset className="flex flex-col gap-4" aria-describedby={legendId}>
        <legend className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-muted-foreground">
            Question {number} of {total}
            {multi && " · Select all that apply"}
          </span>
          <span id={legendId} className="font-serif text-xl font-semibold">
            {question.prompt}
          </span>
        </legend>
        <div className="flex flex-col gap-2">
          {question.options.map((option) => {
            const isSelected = selected.includes(option.id);
            const isCorrect = feedback?.correctOptionIds.includes(option.id) ?? false;
            const showCorrect = locked && isCorrect;
            const showWrong = locked && isSelected && !isCorrect;
            return (
              <label
                key={option.id}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors duration-(--duration-fast)",
                  !locked && "hover:bg-mint/60",
                  isSelected && !locked && "border-teal bg-mint",
                  showCorrect && "border-success bg-success-soft",
                  showWrong && "border-destructive bg-destructive-soft",
                  locked && "cursor-default",
                )}
              >
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={`q-${question.id}`}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => toggle(option.id)}
                  disabled={locked}
                  className="size-5 shrink-0 accent-teal"
                />
                <span className="flex-1">{option.label}</span>
                {showCorrect && (
                  <motion.span
                    initial={reduced ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={spring.snappy}
                    className="flex items-center gap-1 text-sm font-semibold text-success"
                  >
                    <Check aria-hidden="true" className="size-5" strokeWidth={2.5} />
                    Correct answer
                  </motion.span>
                )}
                {showWrong && (
                  <span className="flex items-center gap-1 text-sm font-semibold text-destructive">
                    <X aria-hidden="true" className="size-5" strokeWidth={2.5} />
                    Your answer
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite">
        {feedback && (
          <div
            className={cn(
              "rounded-md px-4 py-3",
              feedback.correct
                ? "bg-success-soft text-success"
                : "bg-destructive-soft text-destructive",
            )}
          >
            <p className="font-semibold">{feedback.correct ? "Correct." : "Not quite."}</p>
            {feedback.explanation && (
              <p className="mt-1 text-sm text-foreground">{feedback.explanation}</p>
            )}
          </div>
        )}
      </div>

      {!locked && (
        <Button
          type="submit"
          className="self-start"
          disabled={!selected.length}
          loading={submitting}
        >
          Check answer
        </Button>
      )}
    </motion.form>
  );
}

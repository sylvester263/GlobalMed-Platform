"use client";

import { CheckCircle2, ExternalLink } from "lucide-react";
import { useState, useTransition } from "react";

import { LessonComplete } from "@/components/lms/lesson-complete";
import { VideoPlayer } from "@/components/lms/video-player";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { markLessonComplete } from "@/lib/lms/learner-actions";

type LessonBodyProps = {
  lesson: {
    id: string;
    title: string;
    type: "video" | "text" | "pdf" | "quiz" | "assignment" | "live";
    liveUrl: string | null;
    pdfUrl: string | null;
  };
  /** Rendered markdown for text lessons (server component passed in). */
  textContent?: React.ReactNode;
  completed: boolean;
  canTrackProgress: boolean;
  watermark: string;
  coursePath: string;
  next?: { href: string; title: string };
};

/** The main lesson area: content by type, completion controls and DM-3 feedback. */
export function LessonBody({
  lesson,
  textContent,
  completed: initiallyCompleted,
  canTrackProgress,
  watermark,
  coursePath,
  next,
}: LessonBodyProps) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [justCompleted, setJustCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function complete() {
    startTransition(async () => {
      setError(null);
      const result = await markLessonComplete(lesson.id, coursePath);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setCompleted(true);
      setJustCompleted(true);
    });
  }

  const selfCompletable = lesson.type !== "video" && lesson.type !== "quiz";

  return (
    <div className="flex flex-col gap-6">
      {lesson.type === "video" && (
        <VideoPlayer
          lessonId={lesson.id}
          title={lesson.title}
          watermark={watermark}
          onComplete={() => {
            setCompleted(true);
            setJustCompleted(true);
          }}
        />
      )}

      {lesson.type === "text" && (
        <article className="rounded-lg border bg-card p-6 md:p-8">{textContent}</article>
      )}

      {lesson.type === "pdf" && lesson.pdfUrl && (
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
          <iframe
            src={lesson.pdfUrl}
            title={lesson.title}
            className="h-[70vh] w-full rounded-md border"
          />
          <a
            href={lesson.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary", className: "self-start" })}
          >
            <ExternalLink aria-hidden="true" /> Open the PDF in a new tab
          </a>
        </div>
      )}

      {lesson.type === "live" && (
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-6">
          <p>This is a live session. Join from the link below at the scheduled time.</p>
          {lesson.liveUrl ? (
            <a
              href={lesson.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg", className: "self-start" })}
            >
              Join the live session <ExternalLink aria-hidden="true" />
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">
              The link will appear here before the session starts.
            </p>
          )}
        </div>
      )}

      {(lesson.type === "quiz" || lesson.type === "assignment") && (
        <Alert variant="info">
          <AlertDescription>
            {lesson.type === "quiz"
              ? "Quizzes open when the quiz engine launches."
              : "Assignment submissions open soon. Your instructor will share the brief in the lesson notes."}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {justCompleted ? (
        <LessonComplete next={next} courseHref="/dashboard/student/courses" />
      ) : completed ? (
        <p className="flex items-center gap-2 font-semibold text-success">
          <CheckCircle2 aria-hidden="true" className="size-5" /> Completed. You can revisit this
          lesson any time.
        </p>
      ) : (
        canTrackProgress &&
        selfCompletable && (
          <Button onClick={complete} loading={pending} size="lg" className="self-start">
            Mark as complete
          </Button>
        )
      )}
    </div>
  );
}

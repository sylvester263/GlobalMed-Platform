import {
  CheckCircle2,
  Circle,
  FileText,
  Lock,
  PlayCircle,
  Radio,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";

import { ClaimProgress } from "@/components/ui/claim-progress";
import type { LearnerCourse, LearnerLesson } from "@/lib/lms/course-data";
import { cn } from "@/lib/utils";

const typeIcon = {
  video: PlayCircle,
  text: FileText,
  pdf: FileText,
  quiz: ClipboardCheck,
  assignment: FileText,
  live: Radio,
} as const;

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function lockReason(lesson: LearnerLesson, all: LearnerLesson[], enrolled: boolean): string {
  if (!enrolled) return "Enroll to unlock";
  if (lesson.unlock.unlocked) return "";
  if (lesson.unlock.reason === "date")
    return `Unlocks ${dateFormat.format(lesson.unlock.unlocksAt)}`;
  const reason = lesson.unlock;
  const prereq = all.find((l) => l.id === reason.lessonId);
  return prereq ? `Finish “${prereq.title}” first` : "Finish the previous lesson first";
}

function formatMinutes(sec: number | null): string | null {
  if (!sec) return null;
  return `${Math.max(1, Math.round(sec / 60))} min`;
}

/** Curriculum sidebar for the player: progress, completion, locks with reasons in text. */
export function CourseOutline({
  course,
  currentLessonId,
}: {
  course: LearnerCourse;
  currentLessonId: string;
}) {
  return (
    <nav aria-label="Course curriculum" className="flex flex-col gap-5">
      {(course.enrollmentActive || course.isStaff) && (
        <ClaimProgress
          label={`${course.title} progress`}
          value={course.progress.completed}
          max={Math.max(1, course.progress.total)}
        />
      )}
      <ol className="flex flex-col gap-5">
        {course.modules.map((module, mi) => (
          <li key={module.id} className="flex flex-col gap-2">
            <h2 className="font-sans text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Module {mi + 1} · {module.title}
            </h2>
            <ol className="flex flex-col gap-0.5">
              {module.lessons.map((lesson) => {
                const Icon = typeIcon[lesson.type];
                const current = lesson.id === currentLessonId;
                const reason = lesson.canView
                  ? ""
                  : lockReason(lesson, course.lessons, course.enrollmentActive);
                const content = (
                  <>
                    <span className="mt-0.5 shrink-0">
                      {lesson.completed ? (
                        <CheckCircle2 aria-hidden="true" className="size-4 text-success" />
                      ) : lesson.canView ? (
                        current ? (
                          <Icon aria-hidden="true" className="size-4 text-teal" />
                        ) : (
                          <Circle aria-hidden="true" className="size-4 text-tick" />
                        )
                      ) : (
                        <Lock aria-hidden="true" className="size-4 text-muted-foreground" />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className={cn("text-sm", current && "font-semibold")}>
                        {lesson.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {[
                          lesson.completed ? "Completed" : null,
                          formatMinutes(lesson.durationSec),
                          lesson.isPreview && !course.enrollmentActive ? "Free preview" : null,
                          reason || null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={lesson.id}>
                    {lesson.canView ? (
                      <Link
                        href={`/learn/${course.slug}/${lesson.id}`}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "flex items-start gap-3 rounded-md px-2 py-2 hover:bg-mint",
                          current && "bg-mint",
                        )}
                      >
                        {content}
                      </Link>
                    ) : (
                      <span className="flex items-start gap-3 rounded-md px-2 py-2">{content}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}

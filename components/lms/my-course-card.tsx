import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ClaimProgress } from "@/components/ui/claim-progress";
import type { getMyCourses } from "@/lib/lms/course-data";

type MyCourse = Awaited<ReturnType<typeof getMyCourses>>[number];

const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

/** One enrolled course with DM-2 progress and the right next action. */
export function MyCourseCard({ item, headingLevel = 3 }: { item: MyCourse; headingLevel?: 2 | 3 }) {
  const { course, enrollment, active, progress } = item;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const finished = progress.total > 0 && progress.completed === progress.total;
  const expired = !active && enrollment.status === "active";

  return (
    <article className="flex flex-col gap-4 rounded-lg border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Heading className="font-serif text-lg font-semibold">{course.title}</Heading>
        {finished ? (
          <Badge variant="gold">Completed</Badge>
        ) : expired ? (
          <Badge variant="warning">Access ended</Badge>
        ) : enrollment.status !== "active" ? (
          <Badge variant="neutral">{enrollment.status}</Badge>
        ) : null}
      </div>
      <ClaimProgress
        value={progress.completed}
        max={progress.total}
        label={`${course.title} progress`}
      />
      <p className="text-sm text-muted-foreground">
        {enrollment.expires_at
          ? `${active ? "Access until" : "Access ended"} ${date.format(new Date(enrollment.expires_at))}`
          : "Lifetime access"}
      </p>
      {active && (
        <Link
          href={`/learn/${course.slug}`}
          className={buttonVariants({
            variant: progress.completed === 0 ? "default" : "secondary",
            className: "self-start",
          })}
        >
          {progress.completed === 0 ? "Start course" : finished ? "Review course" : "Continue"}
          <span className="sr-only"> {course.title}</span>
        </Link>
      )}
    </article>
  );
}

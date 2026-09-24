import { CalendarClock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CreateBatchForm } from "@/components/lms/batches/batch-forms";
import { EmptyState } from "@/components/ui/empty-state";
import { requireArea } from "@/lib/auth/session";
import { getStaffBatches } from "@/lib/lms/batch-data";

export const metadata: Metadata = { title: "Live batches" };

const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

/** P4-8: cohorts with a start date, live sessions and announcements. */
export default async function BatchesPage() {
  const session = await requireArea("instructor", "/dashboard/instructor/batches");
  const { courses, batches } = await getStaffBatches(session);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Live batches"
        description="Group students into cohorts, schedule live sessions and post announcements."
      />
      {courses.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Create a course first"
          description="Batches belong to a course. Build one, then come back to schedule a cohort."
        />
      ) : (
        <>
          <section aria-labelledby="new-batch" className="flex flex-col gap-3">
            <h2 id="new-batch" className="text-xl">
              New batch
            </h2>
            <CreateBatchForm courses={courses} />
          </section>
          <section aria-labelledby="all-batches" className="flex flex-col gap-3">
            <h2 id="all-batches" className="text-xl">
              Batches
            </h2>
            {batches.length === 0 ? (
              <p className="text-muted-foreground">No batches yet.</p>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {batches.map((b) => (
                  <li key={b.id} className="flex flex-col gap-2 rounded-lg border bg-card p-5">
                    <Link
                      href={`/dashboard/instructor/batches/${b.id}`}
                      className="font-serif text-lg font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {b.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{b.courseTitle}</p>
                    <p className="text-sm">
                      Starts {date.format(new Date(b.starts_at))}
                      {b.schedule && ` · ${b.schedule}`}
                    </p>
                    <p className="text-sm">
                      {b.memberCount}
                      {b.seats ? ` of ${b.seats}` : ""} students · {b.upcomingSessions} upcoming{" "}
                      {b.upcomingSessions === 1 ? "session" : "sessions"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

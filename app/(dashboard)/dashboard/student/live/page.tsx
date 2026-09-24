import { CalendarClock, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { LocalTime } from "@/components/lms/local-time";
import { EmptyState } from "@/components/ui/empty-state";
import { requireArea } from "@/lib/auth/session";
import { getMyBatches } from "@/lib/lms/batch-data";

export const metadata: Metadata = { title: "Live classes" };

/** P4-8 student view: upcoming live sessions and batch announcements. */
export default async function LiveClassesPage() {
  const session = await requireArea("student", "/dashboard/student/live");
  const { batches, sessions, announcements } = await getMyBatches(session.user.id);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Live classes" description="Times show in your own time zone." />
      {batches.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="You're not in a live batch"
          description="If your course runs live classes, your instructor adds you to a batch and the sessions appear here."
        />
      ) : (
        <>
          <section aria-labelledby="upcoming" className="flex flex-col gap-3">
            <h2 id="upcoming" className="text-xl">
              Upcoming sessions
            </h2>
            {sessions.length === 0 ? (
              <p className="text-muted-foreground">No sessions scheduled yet.</p>
            ) : (
              <ul className="flex flex-col divide-y rounded-lg border bg-card">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <span className="flex flex-col">
                      <span className="font-semibold">{s.title}</span>
                      <span className="text-sm text-muted-foreground">
                        <LocalTime iso={s.starts_at} /> · {s.duration_min} min · {s.batchLabel}
                      </span>
                    </span>
                    {s.join_url ? (
                      <a
                        href={s.join_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                      >
                        Join <span className="sr-only">{s.title} (opens in a new tab)</span>
                        <ExternalLink aria-hidden="true" className="size-4" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">Link coming soon</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section aria-labelledby="announcements" className="flex flex-col gap-3">
            <h2 id="announcements" className="text-xl">
              Announcements
            </h2>
            {announcements.length === 0 ? (
              <p className="text-muted-foreground">Nothing yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {announcements.map((a) => (
                  <li key={a.id} className="rounded-lg border bg-card p-4">
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="whitespace-pre-line">{a.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {a.batchLabel} · <LocalTime iso={a.created_at} />
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

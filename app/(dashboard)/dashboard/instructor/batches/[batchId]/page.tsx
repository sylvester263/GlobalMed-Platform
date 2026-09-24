import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import {
  AnnouncementForm,
  DeleteBatchButton,
  MemberManager,
  RemoveSessionButton,
  SessionForm,
} from "@/components/lms/batches/batch-forms";
import { LocalTime } from "@/components/lms/local-time";
import { requireArea } from "@/lib/auth/session";
import { getStaffBatch } from "@/lib/lms/batch-data";

export const metadata: Metadata = { title: "Batch" };

type Props = { params: Promise<{ batchId: string }> };

const day = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

export default async function BatchPage({ params }: Props) {
  const { batchId } = await params;
  const session = await requireArea("instructor", `/dashboard/instructor/batches/${batchId}`);
  const { batch, course, sessions, members, candidates, announcements } = await getStaffBatch(
    batchId,
    session,
  );

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link
          href="/dashboard/instructor/batches"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> All batches
        </Link>
        <DashboardPageHeader
          title={batch.name}
          description={`${course.title} · starts ${day.format(new Date(batch.starts_at))}${
            batch.schedule ? ` · ${batch.schedule}` : ""
          }`}
        />
      </div>

      <section aria-labelledby="sessions-heading" className="flex flex-col gap-4">
        <h2 id="sessions-heading" className="text-xl">
          Live sessions
        </h2>
        {sessions.length === 0 ? (
          <p className="text-sm">No sessions scheduled.</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-lg border bg-card">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="flex flex-col">
                  <span className="font-semibold">{s.title}</span>
                  <span className="text-sm text-muted-foreground">
                    <LocalTime iso={s.starts_at} /> · {s.duration_min} min
                    {!s.join_url && " · no join link yet"}
                  </span>
                </span>
                <RemoveSessionButton sessionId={s.id} title={s.title} />
              </li>
            ))}
          </ul>
        )}
        <div className="rounded-lg border bg-ledger p-5">
          <SessionForm batchId={batch.id} />
        </div>
      </section>

      <section aria-labelledby="members-heading" className="flex flex-col gap-4">
        <h2 id="members-heading" className="text-xl">
          Students ({members.length}
          {batch.seats ? ` of ${batch.seats}` : ""})
        </h2>
        <MemberManager batchId={batch.id} members={members} candidates={candidates} />
      </section>

      <section aria-labelledby="announcements-heading" className="flex flex-col gap-4">
        <h2 id="announcements-heading" className="text-xl">
          Announcements
        </h2>
        <div className="rounded-lg border bg-card p-5">
          <AnnouncementForm batchId={batch.id} />
        </div>
        {announcements.length > 0 && (
          <ul className="flex flex-col gap-3">
            {announcements.map((a) => (
              <li key={a.id} className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="whitespace-pre-line">{a.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <LocalTime iso={a.created_at} />
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="delete-batch"
        className="flex flex-col gap-3 rounded-lg border border-destructive/40 p-4"
      >
        <h2 id="delete-batch" className="font-semibold">
          Delete batch
        </h2>
        <p className="text-sm text-muted-foreground">
          Removes its sessions, members and announcements. Students keep their course access.
        </p>
        <DeleteBatchButton batchId={batch.id} />
      </section>
    </div>
  );
}

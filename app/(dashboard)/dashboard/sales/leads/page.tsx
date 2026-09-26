import { Inbox } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { requireArea } from "@/lib/auth/session";
import type { Enums, Json } from "@/lib/db/types";
import { createClient } from "@/lib/db/server";
import { leadSourceLabels, leadStatuses } from "@/lib/leads/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads pipeline" };

type Props = { searchParams: Promise<{ source?: string; status?: string }> };

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/** Registration answers stored in `leads.details` (city, background, contact time). */
function detail(details: Json, key: string): string | null {
  if (!details || typeof details !== "object" || Array.isArray(details)) return null;
  const value = (details as Record<string, Json>)[key];
  return typeof value === "string" && value ? value : null;
}

function filterHref(params: { source?: string; status?: string }) {
  const query = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();
  return `/dashboard/sales/leads${query ? `?${query}` : ""}`;
}

/**
 * Leads pipeline (sales and admin): every website lead with its status, filterable by source
 * and status. AAPC registrations (source "aapc_registration") show the course, city, background
 * and preferred contact time. Readable under the "staff leads" RLS policy. Kanban and
 * drag-to-move arrive with P8-1.
 */
export default async function LeadsPipelinePage({ searchParams }: Props) {
  await requireArea("sales", "/dashboard/sales/leads");
  const { source, status } = await searchParams;
  const activeStatus = leadStatuses.find((s) => s === status);
  const activeSource = source && leadSourceLabels[source] ? source : undefined;

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("id, source, name, email, phone, interest, details, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (activeSource) query = query.eq("source", activeSource);
  if (activeStatus) query = query.eq("status", activeStatus);

  const [{ data: leads }, counts] = await Promise.all([
    query,
    Promise.all(
      leadStatuses.map(async (s) => {
        let countQuery = supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("status", s);
        if (activeSource) countQuery = countQuery.eq("source", activeSource);
        const { count } = await countQuery;
        return [s, count ?? 0] as [Enums<"lead_status">, number];
      }),
    ),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Leads pipeline"
        description="Website leads and AAPC registrations, newest first."
      />

      <nav aria-label="Filter by source" className="flex flex-wrap gap-2">
        {[undefined, ...Object.keys(leadSourceLabels)].map((key) => (
          <Link
            key={key ?? "all"}
            href={filterHref({ source: key, status: activeStatus })}
            aria-current={key === activeSource ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold",
              key === activeSource
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:border-primary",
            )}
          >
            {key ? leadSourceLabels[key] : "All sources"}
          </Link>
        ))}
      </nav>

      <section aria-label="Leads by status">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {counts.map(([s, count]) => (
            <li key={s}>
              <Link
                href={filterHref({
                  source: activeSource,
                  status: s === activeStatus ? undefined : s,
                })}
                aria-current={s === activeStatus ? "page" : undefined}
                className={cn(
                  "flex flex-col gap-1 rounded-lg border bg-card p-4 hover:border-primary",
                  s === activeStatus && "border-2 border-primary",
                )}
              >
                <span className="text-sm font-semibold text-muted-foreground capitalize">{s}</span>
                <span className="font-serif text-2xl font-semibold">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {leads && leads.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Leads, newest first</caption>
            <thead className="bg-ledger">
              <tr>
                {["Received", "Name", "Course / interest", "Details", "Source", "Status"].map(
                  (h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const extras = [
                  detail(lead.details, "city"),
                  detail(lead.details, "background"),
                  detail(lead.details, "contactTime"),
                ].filter(Boolean);
                return (
                  <tr key={lead.id} className="border-t align-top">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.created_at ? dateFormat.format(new Date(lead.created_at)) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{lead.name ?? "—"}</span>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="block text-muted-foreground hover:underline"
                        >
                          {lead.email}
                        </a>
                      )}
                      {lead.phone && (
                        <span className="block text-muted-foreground">{lead.phone}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{lead.interest ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {extras.length ? extras.join(" · ") : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {leadSourceLabels[lead.source] ?? lead.source}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={lead.status === "new" ? "secondary" : "neutral"}
                        className="capitalize"
                      >
                        {lead.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No leads match"
          description="AAPC registrations and website enquiries appear here as they arrive."
        />
      )}
    </div>
  );
}

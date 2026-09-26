import { Inbox } from "lucide-react";
import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { StatBlock } from "@/components/ui/stat-block";
import { requireArea } from "@/lib/auth/session";
import { createClient } from "@/lib/db/server";
import { leadSourceLabels } from "@/lib/leads/labels";

export const metadata: Metadata = { title: "Overview" };

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

/**
 * Sales overview (docs/07 §4): the newest leads from the website forms, readable by
 * sales and admin under the "staff leads" RLS policy. The full pipeline arrives in P8-1.
 */
export default async function SalesOverviewPage() {
  await requireArea("sales", "/dashboard/sales");
  const supabase = await createClient();
  const [{ data: leads }, { count: newCount }] = await Promise.all([
    supabase
      .from("leads")
      .select("id, source, name, email, practice_name, interest, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Overview"
        description="New enquiries from the website, newest first."
      />
      <section
        aria-label="Key figures"
        className="grid gap-8 rounded-lg border bg-card p-6 sm:grid-cols-2"
      >
        <StatBlock label="New leads" value={newCount ?? 0} animate={false} />
        <StatBlock label="Conversations waiting" value={0} animate={false} />
      </section>

      {leads && leads.length > 0 ? (
        <section aria-labelledby="recent-leads" className="flex flex-col gap-4">
          <h2 id="recent-leads" className="text-xl">
            Recent leads
          </h2>
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Ten most recent leads</caption>
              <thead className="bg-ledger">
                <tr>
                  {["Received", "Name", "Practice", "Interest", "Source", "Status"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.created_at ? dateFormat.format(new Date(lead.created_at)) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{lead.name ?? "—"}</span>
                      {lead.email && (
                        <span className="block text-muted-foreground">{lead.email}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{lead.practice_name ?? "—"}</td>
                    <td className="px-4 py-3">{lead.interest ?? "—"}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No leads yet"
          description="AAPC registrations and requests from the free billing audit and contact forms will appear here."
        />
      )}
    </div>
  );
}

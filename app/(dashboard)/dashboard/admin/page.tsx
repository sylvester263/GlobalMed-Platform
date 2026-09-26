import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatBlock } from "@/components/ui/stat-block";
import { requireArea } from "@/lib/auth/session";
import { features } from "@/config/features";
import { createClient } from "@/lib/db/server";

export const metadata: Metadata = { title: "Overview" };

/**
 * Admin overview (docs/07 §3). Live counts via RLS (admins can read all rows); revenue
 * charts and the nightly daily_stats summary arrive in Phase 8 (P8-3).
 */
export default async function AdminOverviewPage() {
  await requireArea("admin", "/dashboard/admin");
  const supabase = await createClient();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [enrollments, pendingPayments, newLeads, handoffs, registrations, recent] =
    await Promise.all([
      supabase
        .from("enrollments")
        .select("id", { count: "exact", head: true })
        .gte("starts_at", since),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "awaiting_verification"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase
        .from("chat_conversations")
        .select("id", { count: "exact", head: true })
        .eq("handoff", true),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("source", "aapc_registration")
        .gte("created_at", since),
      supabase
        .from("leads")
        .select("id, name, email, phone, interest, status, created_at")
        .eq("source", "aapc_registration")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Overview" description="What needs your attention today." />
      <section
        aria-label="Key figures"
        className="grid grid-cols-2 gap-8 rounded-lg border bg-card p-6 lg:grid-cols-4"
      >
        <StatBlock
          label="AAPC registrations (30 days)"
          value={registrations.count ?? 0}
          animate={false}
        />
        {/* Hidden at client request — GlobalMed education plans are future scope. */}
        {features.learningPlatform && (
          <StatBlock label="Enrollments (30 days)" value={enrollments.count ?? 0} animate={false} />
        )}
        {features.onlineCheckout && (
          <StatBlock
            label="Payments to approve"
            value={pendingPayments.count ?? 0}
            animate={false}
          />
        )}
        <StatBlock label="New leads" value={newLeads.count ?? 0} animate={false} />
        <StatBlock label="Chats waiting for a person" value={handoffs.count ?? 0} animate={false} />
      </section>
      <section aria-labelledby="recent-registrations" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="recent-registrations" className="text-xl">
            Latest AAPC registrations
          </h2>
          <Link
            href="/dashboard/sales/leads?source=aapc_registration"
            className="text-sm font-semibold text-primary underline underline-offset-4"
          >
            All AAPC registrations
          </Link>
        </div>
        {recent.data && recent.data.length > 0 ? (
          <ul className="divide-y rounded-lg border bg-card">
            {recent.data.map((lead) => (
              <li
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-semibold">{lead.name ?? "—"}</span>
                  <span className="block text-muted-foreground">
                    {[lead.email, lead.phone].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <span className="font-semibold">{lead.interest ?? "—"}</span>
                <span className="text-muted-foreground capitalize">{lead.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            No AAPC registrations yet. They appear here as soon as someone sends the Register Now
            form.
          </p>
        )}
      </section>
      <Alert variant="info">
        <Info aria-hidden="true" />
        <AlertTitle>More of the admin dashboard is on the way</AlertTitle>
        <AlertDescription>
          Users, content management and reports are added as each part of the platform is built.
          Every lead and AAPC registration is in the{" "}
          <Link href="/dashboard/sales/leads">leads pipeline</Link>.
        </AlertDescription>
      </Alert>
    </div>
  );
}

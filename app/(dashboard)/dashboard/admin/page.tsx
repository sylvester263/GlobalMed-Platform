import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatBlock } from "@/components/ui/stat-block";
import { requireArea } from "@/lib/auth/session";
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

  const [enrollments, pendingPayments, newLeads, handoffs] = await Promise.all([
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
  ]);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Overview" description="What needs your attention today." />
      <section
        aria-label="Key figures"
        className="grid grid-cols-2 gap-8 rounded-lg border bg-card p-6 lg:grid-cols-4"
      >
        <StatBlock label="Enrollments (30 days)" value={enrollments.count ?? 0} animate={false} />
        <StatBlock label="Payments to approve" value={pendingPayments.count ?? 0} animate={false} />
        <StatBlock label="New leads" value={newLeads.count ?? 0} animate={false} />
        <StatBlock label="Chats waiting for a person" value={handoffs.count ?? 0} animate={false} />
      </section>
      <Alert variant="info">
        <Info aria-hidden="true" />
        <AlertTitle>More of the admin dashboard is on the way</AlertTitle>
        <AlertDescription>
          Revenue charts, orders, users and content management are added as each part of the
          platform is built. New leads are already visible in the{" "}
          <Link href="/dashboard/sales">sales dashboard</Link>.
        </AlertDescription>
      </Alert>
    </div>
  );
}

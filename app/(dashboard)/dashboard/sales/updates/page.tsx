import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { UpdatesManager } from "@/components/dashboard/updates/updates-manager";
import { requireArea } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Updates" };

/** Sales staff post updates too (same list and form as Admin → Content → Updates). */
export default async function SalesUpdatesPage() {
  await requireArea("sales", "/dashboard/sales/updates");
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Updates"
        description="Publish, schedule, pin and expire news. Live updates show on the home page and /updates within a minute."
      />
      <UpdatesManager basePath="/dashboard/sales/updates" />
    </div>
  );
}

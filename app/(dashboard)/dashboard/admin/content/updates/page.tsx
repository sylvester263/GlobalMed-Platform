import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { UpdatesManager } from "@/components/dashboard/updates/updates-manager";
import { requireArea } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Updates" };

export default async function AdminUpdatesPage() {
  await requireArea("admin", "/dashboard/admin/content/updates");
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Updates"
        description="Publish, schedule, pin and expire news. Live updates show on the home page and /updates within a minute."
      />
      <UpdatesManager basePath="/dashboard/admin/content/updates" />
    </div>
  );
}

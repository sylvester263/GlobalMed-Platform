import { Construction } from "lucide-react";
import { notFound } from "next/navigation";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { dashboardSections, type DashboardArea } from "@/lib/auth/roles";

/**
 * Sections whose real page arrives in a later phase (docs/07). Keeps every sidebar link
 * working; a real page at the same path takes precedence over this dynamic route.
 */
export function SectionPlaceholder({ area, slug }: { area: DashboardArea; slug: string }) {
  const section = dashboardSections[area].find((s) => s.slug === slug && s.slug !== "");
  if (!section) notFound();
  return (
    <>
      <DashboardPageHeader title={section.label} description={section.description} />
      <EmptyState
        icon={Construction}
        title="Coming soon"
        description={`This area is being built and will be ready soon (project phase ${section.phase}).`}
      />
    </>
  );
}

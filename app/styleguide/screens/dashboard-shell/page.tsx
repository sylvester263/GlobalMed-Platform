import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyState } from "@/components/ui/empty-state";
import { dashboardSections, sectionHref } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Screen: Dashboard shell", robots: { index: false } };

/**
 * The production DashboardShell with sample props, so the shell can be reviewed and
 * audited (Playwright + axe) without a signed-in Supabase session.
 */
export default function DashboardShellScreen() {
  const nav = dashboardSections.student.map((s) => ({
    href: sectionHref("student", s.slug),
    label: s.label,
    icon: s.icon,
    exact: s.slug === "",
  }));
  return (
    <DashboardShell
      areaLabel="Student dashboard"
      nav={nav}
      areas={[{ href: "/dashboard/student", label: "Student dashboard" }]}
      user={{
        name: "Sample Student",
        email: "student@example.com",
        initials: "SS",
        roleLabel: "Student",
      }}
      notifications={{
        unread: 1,
        items: [
          {
            id: "1",
            title: "Welcome to GlobalMed",
            body: "Browse the courses to get started.",
            link: "/education/courses",
            read: false,
          },
        ],
      }}
    >
      <DashboardPageHeader
        title="Welcome, Sample"
        description="Design review of the real dashboard shell."
      />
      <EmptyState
        icon={BookOpen}
        title="You haven't enrolled in a course yet"
        description="Watch free preview lessons, then enroll when you're ready."
      />
    </DashboardShell>
  );
}

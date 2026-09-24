import { DashboardShell, type ShellNavItem } from "@/components/dashboard/shell";
import {
  areasFor,
  dashboardSections,
  roleLabels,
  sectionHref,
  type DashboardArea,
} from "@/lib/auth/roles";
import { requireArea, type SessionUser } from "@/lib/auth/session";
import { getRecentNotifications } from "@/lib/notifications";

const areaLabels: Record<DashboardArea, string> = {
  student: "Student dashboard",
  instructor: "Instructor dashboard",
  admin: "Admin dashboard",
  sales: "Sales dashboard",
};

export function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export function shellUser(session: SessionUser) {
  const name = session.profile.full_name?.trim() || session.user.email?.split("@")[0] || "Account";
  return {
    name,
    email: session.user.email ?? "",
    initials: initialsOf(name),
    roleLabel: roleLabels[session.profile.role],
  };
}

export function areaSwitcher(session: SessionUser) {
  return areasFor(session.profile.role).map((a) => ({
    href: `/dashboard/${a}`,
    label: areaLabels[a],
  }));
}

/** Guards an area (role + admin MFA) and renders it inside the dashboard shell (P3-3/P3-5). */
export async function AreaShell({
  area,
  children,
}: {
  area: DashboardArea;
  children: React.ReactNode;
}) {
  const session = await requireArea(area, `/dashboard/${area}`);
  const notifications = await getRecentNotifications(session.user.id);
  const nav: ShellNavItem[] = dashboardSections[area].map((s) => ({
    href: sectionHref(area, s.slug),
    label: s.label,
    icon: s.icon,
    exact: s.slug === "",
  }));

  return (
    <DashboardShell
      areaLabel={areaLabels[area]}
      nav={nav}
      areas={areaSwitcher(session)}
      user={shellUser(session)}
      notifications={notifications}
    >
      {children}
    </DashboardShell>
  );
}

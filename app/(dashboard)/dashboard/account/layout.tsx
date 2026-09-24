import { areaSwitcher, shellUser } from "@/components/dashboard/area-shell";
import { DashboardShell, type ShellNavItem } from "@/components/dashboard/shell";
import { requireUser } from "@/lib/auth/session";
import { getRecentNotifications } from "@/lib/notifications";

/**
 * Account settings for every role. Only needs a signed-in user (not MFA), so admins can
 * reach it to turn on two-step verification before entering the admin area.
 */
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser("/dashboard/account");
  const notifications = await getRecentNotifications(session.user.id);
  const nav: ShellNavItem[] = [
    ...areaSwitcher(session).map((a) => ({
      href: a.href,
      label: a.label,
      icon: "overview" as const,
    })),
    { href: "/dashboard/account", label: "Account settings", icon: "settings", exact: true },
  ];
  return (
    <DashboardShell
      areaLabel="Account"
      nav={nav}
      areas={areaSwitcher(session)}
      user={shellUser(session)}
      notifications={notifications}
    >
      <div className="route-fade">{children}</div>
    </DashboardShell>
  );
}

"use client";

import {
  Award,
  Bell,
  BookOpen,
  CalendarClock,
  ChartColumn,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Hammer,
  History,
  Inbox,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Menu,
  MessageSquare,
  MessagesSquare,
  Receipt,
  Settings,
  Ticket,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Wordmark } from "@/components/marketing/wordmark";
import { MotionFeatures } from "@/components/motion/motion-features";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { signOut } from "@/lib/auth/actions";
import type { NavIcon } from "@/lib/auth/roles";
import { dur, ease, spring } from "@/lib/motion";
import { markAllNotificationsRead } from "@/lib/notifications-actions";
import { cn } from "@/lib/utils";

const icons: Record<NavIcon, LucideIcon> = {
  overview: LayoutDashboard,
  courses: BookOpen,
  quiz: ClipboardCheck,
  certificate: Award,
  orders: Receipt,
  settings: Settings,
  builder: Hammer,
  students: GraduationCap,
  qa: MessagesSquare,
  users: Users,
  enrollments: UserCheck,
  coupons: Ticket,
  content: FileText,
  chatbot: MessageSquare,
  audit: History,
  leads: ChartColumn,
  inbox: Inbox,
  reports: TrendingUp,
  live: CalendarClock,
};

export type ShellNavItem = { href: string; label: string; icon: NavIcon; exact?: boolean };
export type ShellUser = { name: string; email: string; initials: string; roleLabel: string };
export type ShellNotification = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
};

type ShellProps = {
  areaLabel: string;
  nav: ShellNavItem[];
  /** Other dashboard areas this user may switch to (staff roles, admin). */
  areas: { href: string; label: string }[];
  user: ShellUser;
  notifications: { items: ShellNotification[]; unread: number };
  children: React.ReactNode;
};

const STORAGE_KEY = "gm_sidebar_collapsed";

function isActive(pathname: string, item: ShellNavItem): boolean {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavList({
  nav,
  pathname,
  collapsed = false,
  onNavigate,
}: {
  nav: ShellNavItem[];
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {nav.map((item) => {
        const Icon = icons[item.icon];
        const active = isActive(pathname, item);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors duration-(--duration-fast)",
                active
                  ? "bg-mint text-teal-deep"
                  : "text-muted-foreground hover:bg-ledger hover:text-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {collapsed ? (
                <span className="sr-only">{item.label}</span>
              ) : (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Dashboard shell (docs/07): sidebar, top bar with notifications and profile, sheet on
 * mobile. DM-1: sidebar collapses with a layout animation; route content fades
 * (dashboard template). Collapse state is a per-viewer convenience in localStorage.
 */
export function DashboardShell({
  areaLabel,
  nav,
  areas,
  user,
  notifications,
  children,
}: ShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Storage can be blocked (private mode); the sidebar just starts expanded.
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, c ? "0" : "1");
      } catch {
        // Ignore: purely a convenience.
      }
      return !c;
    });
  }

  return (
    <MotionFeatures features="max">
      <div className="flex min-h-dvh bg-ledger">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>

        {/* Desktop sidebar (DM-1) */}
        <m.aside
          layout
          transition={spring.soft}
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 flex-col gap-6 border-r bg-card p-3 lg:flex",
            collapsed ? "w-[72px]" : "w-64",
          )}
        >
          <m.div
            layout="position"
            className={cn("flex h-10 items-center", collapsed ? "justify-center" : "px-2")}
          >
            <Link href="/" aria-label="GlobalMed home" className="rounded-md">
              {collapsed ? <Wordmark iconOnly /> : <Wordmark size="compact" />}
            </Link>
          </m.div>
          <nav aria-label={`${areaLabel} navigation`} className="flex-1 overflow-y-auto">
            <NavList nav={nav} pathname={pathname} collapsed={collapsed} />
          </nav>
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-10 items-center justify-center gap-2 rounded-md text-sm font-semibold text-muted-foreground hover:bg-ledger hover:text-foreground"
          >
            {collapsed ? (
              <ChevronsRight aria-hidden="true" className="size-4" />
            ) : (
              <ChevronsLeft aria-hidden="true" className="size-4" />
            )}
            <AnimatePresence initial={false}>
              {!collapsed && (
                <m.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: dur.fast, ease: ease.standard }}
                >
                  Collapse
                </m.span>
              )}
            </AnimatePresence>
          </button>
        </m.aside>

        {/* Mobile sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Wordmark size="compact" />
              </SheetTitle>
              <SheetDescription>{areaLabel}</SheetDescription>
            </SheetHeader>
            <nav aria-label={`${areaLabel} navigation`} className="px-3">
              <NavList nav={nav} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card px-4 md:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="-ml-2 flex size-11 items-center justify-center rounded-md hover:bg-mint lg:hidden"
            >
              <Menu aria-hidden="true" className="size-5" />
            </button>
            <p className="truncate text-sm font-semibold text-muted-foreground">{areaLabel}</p>

            <div className="ml-auto flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label={
                        notifications.unread > 0
                          ? `Notifications, ${notifications.unread} unread`
                          : "Notifications"
                      }
                    />
                  }
                  className="relative flex size-11 items-center justify-center rounded-md hover:bg-mint"
                >
                  <Bell aria-hidden="true" className="size-5" />
                  {notifications.unread > 0 && (
                    <span className="absolute top-2 right-2 flex min-w-4 items-center justify-center rounded-full bg-alert px-1 text-[10px] leading-4 font-bold text-white">
                      {notifications.unread > 9 ? "9+" : notifications.unread}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    {notifications.items.length === 0 && (
                      <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                        You&apos;re all caught up.
                      </p>
                    )}
                    {notifications.items.map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        render={n.link ? <Link href={n.link} /> : undefined}
                        className="flex-col items-start gap-0.5 py-2"
                      >
                        <span className={cn("text-sm", !n.read && "font-semibold")}>
                          {!n.read && <span className="sr-only">Unread: </span>}
                          {n.title}
                        </span>
                        {n.body && <span className="text-xs text-muted-foreground">{n.body}</span>}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  {notifications.unread > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => startTransition(() => markAllNotificationsRead())}
                      >
                        Mark all as read
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<button type="button" aria-label={`Account menu for ${user.name}`} />}
                  className="flex h-11 items-center gap-2 rounded-md px-2 hover:bg-mint"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-mint text-xs font-semibold text-teal-deep">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-left text-sm sm:block">
                    <span className="block font-semibold">{user.name}</span>
                    <span className="block text-xs text-muted-foreground">{user.roleLabel}</span>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="truncate font-normal">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuItem render={<Link href="/dashboard/account" />}>
                      <Settings aria-hidden="true" /> Account settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {areas.length > 1 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Switch dashboard</DropdownMenuLabel>
                        {areas.map((a) => (
                          <DropdownMenuItem key={a.href} render={<Link href={a.href} />}>
                            {a.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => startTransition(() => signOut())}>
                    <LogOut aria-hidden="true" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main
            id="main"
            tabIndex={-1}
            className="mx-auto w-full max-w-360 flex-1 p-4 focus:outline-none md:p-6"
          >
            {children}
          </main>
        </div>
      </div>
    </MotionFeatures>
  );
}

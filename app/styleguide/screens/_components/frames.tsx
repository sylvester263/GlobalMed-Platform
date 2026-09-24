import {
  Award,
  Bell,
  BookOpen,
  ChartColumn,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Search,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
 * Design-review frames for the P1-6 key screens. The production header/mega menu and
 * footer are built in P2-1 and the dashboard shell in P3-4; these frames only give the
 * screens their context for client sign-off.
 */

export function ReviewBanner({ screen }: { screen: string }) {
  return (
    <div className="bg-ink text-white">
      <p className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm md:px-6">
        <span>
          Design review · <strong>{screen}</strong> · sample content, not live data
        </span>
        <Link href="/styleguide#screens" className="text-teal-bright underline underline-offset-4">
          Back to styleguide
        </Link>
      </p>
    </div>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-serif text-xl font-semibold", className)}>
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-md bg-teal font-sans text-sm text-white"
      >
        GM
      </span>
      GlobalMed
    </span>
  );
}

export function MarketingFrame({
  screen,
  children,
}: {
  screen: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <ReviewBanner screen={screen} />
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-300 items-center justify-between gap-6 px-4 md:px-6">
          <Wordmark />
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6 text-sm font-semibold">
              {["Services", "School", "Specialties", "Resources", "About", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <span className="cursor-default hover:text-teal">{item}</span>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden sm:inline-flex",
              )}
            >
              Log in
            </span>
            <span className={buttonVariants({ size: "sm" })}>Free billing audit</span>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-ink text-white/80">
        <div className="mx-auto grid max-w-300 gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
          <div className="flex flex-col gap-3">
            <Wordmark className="text-white" />
            <p className="text-sm">Medical billing, coding and transcription for US practices.</p>
          </div>
          {[
            [
              "Services",
              ["Medical billing", "Medical coding", "Transcription", "AI documentation"],
            ],
            [
              "School",
              ["All courses", "Certification pathways", "Exam preparation", "Verify a certificate"],
            ],
            ["Company", ["About", "Careers", "Contact", "Privacy policy"]],
          ].map(([title, links]) => (
            <div key={title as string}>
              <p className="mb-3 font-semibold text-white">{title as string}</p>
              <ul className="flex flex-col gap-2 text-sm">
                {(links as string[]).map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="border-t border-white/10 px-4 py-4 text-center text-sm">
          Designed &amp; developed by SylJo Tech
        </p>
      </footer>
    </div>
  );
}

const dashboardNav = {
  student: [
    { label: "Overview", icon: LayoutDashboard, active: true },
    { label: "My courses", icon: BookOpen },
    { label: "Quizzes & exams", icon: ClipboardList },
    { label: "Certificates", icon: Award },
    { label: "Orders & invoices", icon: Receipt },
    { label: "Settings", icon: Settings },
  ],
  admin: [
    { label: "Overview", icon: LayoutDashboard, active: true },
    { label: "Users", icon: Users },
    { label: "Courses", icon: GraduationCap },
    { label: "Orders", icon: Receipt },
    { label: "Certificates", icon: Award },
    { label: "Leads", icon: ChartColumn },
    { label: "Chatbot", icon: MessageSquare },
    { label: "Content", icon: FileText },
    { label: "Settings", icon: Settings },
  ],
};

export function DashboardFrame({
  screen,
  role,
  user,
  children,
}: {
  screen: string;
  role: keyof typeof dashboardNav;
  user: { name: string; initials: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <ReviewBanner screen={screen} />
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r bg-card p-4 lg:flex">
          <Wordmark />
          <nav aria-label="Dashboard">
            <ul className="flex flex-col gap-1">
              {dashboardNav[role].map(({ label, icon: Icon, ...rest }) => {
                const active = "active" in rest;
                return (
                  <li key={label}>
                    <span
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold",
                        active ? "bg-mint text-teal-deep" : "text-muted-foreground hover:bg-ledger",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6">
            <div className="flex h-10 w-full max-w-sm items-center gap-2 rounded-md border border-input bg-card px-3 text-sm text-muted-foreground">
              <Search aria-hidden="true" className="size-4" />
              Search
            </div>
            <div className="flex items-center gap-3">
              <span
                role="img"
                aria-label="3 unread notifications"
                className="relative flex size-10 items-center justify-center"
              >
                <Bell aria-hidden="true" className="size-5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-alert" />
              </span>
              <Avatar>
                <AvatarFallback className="bg-mint font-semibold text-teal-deep">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-sm sm:block">
                <p className="font-semibold">{user.name}</p>
                <p className="text-muted-foreground">{user.label}</p>
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-360 flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

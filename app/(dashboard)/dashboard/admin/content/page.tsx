import { FileText, Megaphone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { requireArea } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Content" };

/** Admin → Content. Updates are live (2026-10-02); pages, blog, testimonials and FAQs follow in Phase 8. */
export default async function AdminContentPage() {
  await requireArea("admin", "/dashboard/admin/content");
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader title="Content" description="What appears on the public website." />
      <ul className="grid gap-4 md:grid-cols-2">
        <li>
          <Link
            href="/dashboard/admin/content/updates"
            className="flex h-full flex-col gap-2 rounded-lg border bg-card p-5 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Megaphone aria-hidden="true" className="size-6 text-primary" />
            <span className="font-semibold">Updates</span>
            <span className="text-sm text-muted-foreground">
              News, batch dates, events and announcements on the home page and /updates.
            </span>
          </Link>
        </li>
        <li className="flex flex-col gap-2 rounded-lg border border-dashed bg-card p-5 text-muted-foreground">
          <FileText aria-hidden="true" className="size-6" />
          <span className="font-semibold">Pages, blog, testimonials and FAQs</span>
          <span className="text-sm">
            Edited in the code for now; dashboard editing arrives in Phase 8.
          </span>
        </li>
      </ul>
    </div>
  );
}

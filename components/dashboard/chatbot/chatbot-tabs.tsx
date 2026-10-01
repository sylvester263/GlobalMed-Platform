"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard/admin/chatbot", label: "Knowledge base" },
  { href: "/dashboard/admin/chatbot/conversations", label: "Conversations" },
  { href: "/dashboard/admin/chatbot/settings", label: "Settings" },
];

/** Admin → Chatbot sub-navigation. */
export function ChatbotTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Chatbot" className="border-b">
      <ul className="-mb-px flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const active =
            tab.href === "/dashboard/admin/chatbot"
              ? pathname === tab.href || pathname.startsWith(`${tab.href}/knowledge`)
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-semibold",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

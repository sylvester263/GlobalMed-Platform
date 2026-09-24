"use client";

import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MegaMenu } from "@/components/marketing/mega-menu";
import { Wordmark } from "@/components/marketing/wordmark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The mobile sheet loads on first hover/focus/tap of the menu button, not with every page.
const MobileNav = dynamic(() => import("./mobile-nav").then((m) => m.MobileNav), { ssr: false });

/** Primary navigation (docs/05): Services ▾ · School ▾ · Resources ▾ · Specialties · About · Contact. */
export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileLoaded, setMobileLoaded] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="mx-auto flex h-16 max-w-300 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" aria-label="GlobalMed home" className="rounded-md">
          <Wordmark />
        </Link>

        <MegaMenu pathname={pathname} />

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Log in
          </Link>
          <Link
            href="/free-billing-audit"
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
          >
            Free billing audit
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-haspopup="dialog"
            onPointerEnter={() => setMobileLoaded(true)}
            onFocus={() => setMobileLoaded(true)}
            onClick={() => {
              setMobileLoaded(true);
              setMobileOpen(true);
            }}
            className="flex size-11 items-center justify-center rounded-md hover:bg-mint lg:hidden"
          >
            <Menu aria-hidden="true" className="size-6" />
          </button>
          {mobileLoaded && (
            <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} pathname={pathname} />
          )}
        </div>
      </div>
    </header>
  );
}

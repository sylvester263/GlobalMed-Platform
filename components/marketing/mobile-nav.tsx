"use client";

import Link from "next/link";

import { features } from "@/config/features";

import { Wordmark } from "@/components/marketing/wordmark";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { isActivePath, isNavGroup, primaryNav, type NavGroup, type NavLink } from "@/lib/site";

type NavRun = { kind: "groups"; items: NavGroup[] } | { kind: "links"; items: NavLink[] };

/** primaryNav in order, with neighbouring dropdown groups sharing one accordion. */
const navRuns = primaryNav.reduce<NavRun[]>((runs, item) => {
  const last = runs.at(-1);
  if (isNavGroup(item)) {
    if (last?.kind === "groups") last.items.push(item);
    else runs.push({ kind: "groups", items: [item] });
  } else if (last?.kind === "links") {
    last.items.push(item);
  } else {
    runs.push({ kind: "links", items: [item] });
  }
  return runs;
}, []);

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
};

/**
 * Mobile navigation sheet. Loaded on demand by SiteHeader (first hover/tap of the menu
 * button), so its dialog code isn't part of every page's initial JavaScript.
 */
export function MobileNav({ open, onOpenChange, pathname }: MobileNavProps) {
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>
            <Wordmark size="compact" />
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-4 px-4 pb-8">
          {navRuns.map((run) =>
            run.kind === "groups" ? (
              <Accordion key={run.items[0]?.label}>
                {run.items.map((group) => (
                  <AccordionItem key={group.label} value={group.label}>
                    <AccordionTrigger>{group.label}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col">
                        {group.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={close}
                              aria-current={pathname === link.href ? "page" : undefined}
                              className="flex min-h-11 items-center rounded-md px-2 no-underline! hover:bg-mint aria-[current=page]:text-teal-deep"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <ul key={run.items[0]?.href} className="flex flex-col">
                {run.items.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={isActivePath(pathname, link.href) ? "page" : undefined}
                      className="flex min-h-12 items-center rounded-md text-base font-semibold hover:bg-mint"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ),
          )}
          <div className="flex flex-col gap-2">
            <Link
              href="/free-billing-audit"
              onClick={close}
              className={buttonVariants({ size: "lg" })}
            >
              Book your free billing audit
            </Link>
            {/* Hidden at client request — GlobalMed education plans are future scope. Staff still reach /login directly. */}
            {features.publicLogin && (
              <Link
                href="/login"
                onClick={close}
                className={buttonVariants({ size: "lg", variant: "secondary" })}
              >
                Log in
              </Link>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

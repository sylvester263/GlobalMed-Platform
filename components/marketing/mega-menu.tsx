"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { isActivePath, mainNav, simpleNav } from "@/lib/site";
import { cn } from "@/lib/utils";

const triggerClass =
  "inline-flex h-10 cursor-pointer items-center gap-1 rounded-md px-3 text-sm font-semibold text-primary transition-colors hover:bg-mint aria-expanded:bg-mint";

/**
 * Desktop primary navigation using the WAI-ARIA disclosure pattern (buttons with
 * aria-expanded that reveal link panels) — the recommended pattern for site navigation,
 * and far lighter to hydrate than a menu widget with a positioning engine (P2-21).
 * Escape closes and returns focus; clicking outside or navigating closes; panels reveal
 * their links in sequence (MG-17, `.menu-stagger`).
 */
export function MegaMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();

  // Close when the route changes.
  useEffect(() => setOpen(null), [pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpen(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const trigger = open ? triggerRefs.current[open] : null;
      setOpen(null);
      trigger?.focus();
    }
    function onFocusOut(event: FocusEvent) {
      if (!navRef.current?.contains(event.relatedTarget as Node | null)) setOpen(null);
    }
    const nav = navRef.current;
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    nav?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      nav?.removeEventListener("focusout", onFocusOut);
    };
  }, [open]);

  return (
    <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {mainNav.map((group) => {
          const panelId = `${baseId}-${group.label}`;
          const expanded = open === group.label;
          return (
            <li key={group.label} className="relative">
              <button
                ref={(el) => {
                  triggerRefs.current[group.label] = el;
                }}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : group.label)}
                className={cn(triggerClass, isActivePath(pathname, group.href) && "text-teal-deep")}
              >
                {group.label}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-3.5 transition-transform duration-(--duration-fast)",
                    expanded && "rotate-180",
                  )}
                />
              </button>
              <div
                id={panelId}
                hidden={!expanded}
                className="absolute top-full left-0 z-50 mt-2 w-[min(720px,90vw)] rounded-lg border bg-popover p-2 shadow-lg"
              >
                <div className="menu-stagger grid grid-cols-[1.4fr_1fr] gap-2">
                  <ul className="grid grid-cols-2 gap-1">
                    {group.links.map((link, i) => (
                      <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
                        <Link
                          href={link.href}
                          aria-current={pathname === link.href ? "page" : undefined}
                          className="flex flex-col gap-0.5 rounded-md p-3 text-sm hover:bg-mint focus:bg-mint aria-[current=page]:bg-mint"
                        >
                          <span className="font-semibold">{link.label}</span>
                          {link.description && (
                            <span className="text-muted-foreground">{link.description}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {group.feature && (
                    <Link
                      href={group.feature.href}
                      style={{ "--i": group.links.length } as React.CSSProperties}
                      className="flex flex-col justify-end gap-2 rounded-md bg-ink p-5 text-white"
                    >
                      <span className="font-serif text-lg font-semibold">
                        {group.feature.label}
                      </span>
                      <span className="text-sm text-white/80">{group.feature.description}</span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-teal-bright">
                        Learn more <ArrowRight aria-hidden="true" className="size-4" />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        {simpleNav.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActivePath(pathname, link.href) ? "page" : undefined}
              className={cn(triggerClass, "aria-[current=page]:text-teal-deep")}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

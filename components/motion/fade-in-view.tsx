"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

/**
 * One-time fade on scroll. Visible by default (server HTML, no JS, reduced motion): only a
 * block that starts below the fold is hidden after mount, then fades in (480ms, ease-enter,
 * the same tokens Motion used) the first time it enters the viewport and never hides again.
 * CSS transition + IntersectionObserver instead of Motion, so the About page loads no
 * animation library (2026-10-01 performance work).
 */
export function FadeInView({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<"idle" | "waiting" | "shown">("idle");

  useEffect(() => {
    // The hook reads false during hydration, so ask the media query directly as well.
    const reduce = reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (reduce || !el || el.getBoundingClientRect().top < window.innerHeight) return;
    setState("waiting");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={cn(
        className,
        state !== "idle" && "transition-opacity duration-(--duration-slow) ease-(--ease-enter)",
        state === "waiting" && "opacity-0",
      )}
    >
      {children}
    </div>
  );
}

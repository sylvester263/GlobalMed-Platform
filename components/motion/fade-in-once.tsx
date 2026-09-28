"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Visible by default (server HTML, no JS). Only content that starts below the fold is hidden
 * on mount, then fades in the first time it enters the viewport and stays visible.
 */
export function FadeInOnce({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "waiting" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
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
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        className,
        "transition-opacity duration-(--duration-slow) ease-(--ease-enter)",
        state === "waiting" && "opacity-0",
      )}
    >
      {children}
    </div>
  );
}

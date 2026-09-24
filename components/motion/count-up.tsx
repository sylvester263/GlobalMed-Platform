"use client";

import { useEffect, useMemo, useRef } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { dur } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CountUpProps = {
  value: number;
  /** Maximum fraction digits shown. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

// Close to ease.standard's deceleration without pulling in an animation engine.
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Counts from 0 to `value` once when it comes into view (MG-4, DM-7). A small rAF loop
 * (ADR-015) — no Motion runtime. The server render and screen readers always get the
 * final value; an invisible copy reserves the width so the layout never shifts.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  const format = useMemo(() => {
    const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals });
    return (n: number) => `${prefix}${nf.format(n)}${suffix}`;
  }, [decimals, prefix, suffix]);
  const finalText = format(value);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const node = liveRef.current;
    if (!wrapper || !node || reduced) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const duration = dur.story * 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          node.textContent = format(value * easeOutCubic(t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      // Start just before it's visible so the reset to zero is never seen.
      { rootMargin: "0px 0px 60px 0px" },
    );
    node.textContent = format(0);
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = format(value);
    };
  }, [reduced, value, format]);

  return (
    <span ref={wrapperRef} className={cn("inline-grid tabular-nums", className)}>
      <span className="sr-only">{finalText}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {finalText}
      </span>
      <span ref={liveRef} aria-hidden="true" className="col-start-1 row-start-1">
        {finalText}
      </span>
    </span>
  );
}

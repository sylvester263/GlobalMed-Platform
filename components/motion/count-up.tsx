"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CountUpProps = {
  value: number;
  /** Maximum fraction digits shown. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/**
 * Counts from 0 to `value` once when scrolled into view (MG-4, DM-7).
 * Screen readers and the server render always get the final value, and an invisible
 * copy of the final value reserves the width so the layout never shifts.
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
  const inView = useInView(wrapperRef, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();

  const format = useMemo(() => {
    const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals });
    return (n: number) => `${prefix}${nf.format(n)}${suffix}`;
  }, [decimals, prefix, suffix]);
  const finalText = format(value);

  useEffect(() => {
    const node = liveRef.current;
    if (!node) return;
    if (reduced) {
      node.textContent = format(value);
      return;
    }
    if (!inView) {
      node.textContent = format(0);
      return;
    }
    const controls = animate(0, value, {
      duration: dur.story * 1.2,
      ease: ease.standard,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, format]);

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

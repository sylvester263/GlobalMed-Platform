"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ClaimLineProps = {
  /** Number of tick marks (at least 2). */
  ticks?: number;
  /** How many ticks are reached, counted from the left. Defaults to all. */
  filled?: number;
  /** Mark the last tick gold when it is reached (achievement). */
  goldEnd?: boolean;
  /** When the draw starts. `static` renders the final state with no animation. */
  trigger?: "mount" | "inView" | "static";
  /** Extra delay before drawing, in seconds. */
  delay?: number;
  className?: string;
};

/**
 * The brand signature (MASTER.md §4): a ledger rule with tick marks that draws
 * left-to-right while ticks light up in sequence. Decorative: pair it with text,
 * or use ClaimProgress when it conveys progress.
 */
export function ClaimLine({
  ticks = 8,
  filled,
  goldEnd = false,
  trigger = "inView",
  delay = 0,
  className,
}: ClaimLineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();

  const count = Math.max(2, ticks);
  const reached = Math.min(count, Math.max(0, filled ?? count));
  const positions = Array.from({ length: count }, (_, i) => (i / (count - 1)) * 100);
  const fraction = reached <= 1 ? 0 : (positions[reached - 1] ?? 0) / 100;

  const settled = trigger === "static" || reduced;
  const play = settled || trigger === "mount" || inView;

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      className={cn("block h-3 w-full overflow-visible", className)}
    >
      <line
        x1="0"
        y1="6"
        x2="100"
        y2="6"
        className="stroke-tick"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {positions.map((x) => (
        <line
          key={`base-${x}`}
          x1={x}
          y1="2"
          x2={x}
          y2="10"
          className="stroke-tick"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {fraction > 0 && (
        <motion.line
          x1="0"
          y1="6"
          x2={fraction * 100}
          y2="6"
          className="stroke-teal"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          // scaleX, not pathLength: dash-based drawing breaks on a stretched SVG.
          style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
          initial={settled ? false : { scaleX: 0 }}
          animate={{ scaleX: play ? 1 : 0 }}
          transition={{ duration: dur.story * fraction, ease: ease.standard, delay }}
        />
      )}
      {positions.slice(0, reached).map((x, i) => {
        const isGold = goldEnd && i === count - 1;
        return (
          <motion.line
            key={`on-${x}`}
            x1={x}
            y1="1"
            x2={x}
            y2="11"
            className={isGold ? "stroke-gold" : "stroke-teal"}
            strokeWidth={isGold ? 3 : 2}
            vectorEffect="non-scaling-stroke"
            initial={settled ? false : { opacity: 0 }}
            animate={{ opacity: play ? 1 : 0 }}
            transition={{
              duration: dur.fast,
              ease: ease.enter,
              delay: delay + (x / 100) * dur.story,
            }}
          />
        );
      })}
    </svg>
  );
}

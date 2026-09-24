"use client";

import { m } from "motion/react";

import { MotionFeatures } from "@/components/motion/motion-features";
import { dur, ease } from "@/lib/motion";

import { usePlayOnApproach } from "./use-play-on-approach";

// Illustrative values, labelled as such (docs/15 §4 MG-8).
const metrics = [
  { label: "Denial rate", before: 12, after: 4, suffix: "%" },
  { label: "Net collection rate", before: 88, after: 97, suffix: "%" },
];

/** MG-8: before/after bars morph from the "before" value to the "after" value. */
export function DenialBars() {
  const { ref, play } = usePlayOnApproach<HTMLDivElement>();

  return (
    <MotionFeatures>
      <figure ref={ref} className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
        <p className="font-serif text-lg font-semibold">Six months with denial management</p>
        <div className="grid grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-3">
              <div
                aria-hidden="true"
                className="relative flex h-40 items-end justify-center gap-3 rounded-md bg-ledger px-4 pt-4"
              >
                <span
                  className="w-8 rounded-t-sm bg-tick"
                  style={{ height: `${metric.before}%` }}
                />
                <m.span
                  className="w-8 origin-bottom rounded-t-sm bg-teal"
                  style={{ height: `${metric.after}%` }}
                  initial={false}
                  animate={play ? { scaleY: [metric.before / metric.after, 1] } : { scaleY: 1 }}
                  transition={{ duration: dur.story, ease: ease.standard, delay: 0.2 }}
                />
              </div>
              <p className="text-sm font-semibold">{metric.label}</p>
              <p className="text-sm text-muted-foreground">
                Before{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {metric.before}
                  {metric.suffix}
                </span>{" "}
                · After{" "}
                <span className="font-semibold text-teal-deep tabular-nums">
                  {metric.after}
                  {metric.suffix}
                </span>
              </p>
            </div>
          ))}
        </div>
        <figcaption className="text-xs text-muted-foreground">
          Illustrative figures. Grey bars show before, teal bars after.
        </figcaption>
      </figure>
    </MotionFeatures>
  );
}

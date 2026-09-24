"use client";

import { m } from "motion/react";

import { MotionFeatures } from "@/components/motion/motion-features";
import { spring, staggerStep } from "@/lib/motion";

import { usePlayOnApproach } from "./use-play-on-approach";

const lines = [
  { label: "Diagnosis", code: "E11.9", meaning: "Type 2 diabetes without complications" },
  { label: "Diagnosis", code: "I10", meaning: "Essential hypertension" },
  { label: "Service", code: "99214", meaning: "Office visit, moderate complexity" },
  { label: "Service", code: "83036", meaning: "Hemoglobin A1c test" },
];

/** MG-7: ICD-10 / CPT code chips snapping into a claim form (illustration, fictional visit). */
export function CodeChips() {
  const { ref, play } = usePlayOnApproach<HTMLDivElement>();

  return (
    <MotionFeatures>
      <figure ref={ref} className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-serif text-lg font-semibold">Claim lines</p>
          <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">
            Ready to submit
          </span>
        </div>
        <ul className="flex flex-col gap-2">
          {lines.map((line, i) => (
            <li
              key={line.code}
              className="flex items-center gap-3 rounded-md border border-dashed px-3 py-2"
            >
              <m.span
                className="min-w-16 rounded-md bg-mint px-2 py-1 text-center font-mono text-sm font-semibold text-teal-deep"
                initial={false}
                animate={
                  play
                    ? { x: [48, 0], opacity: [0, 1], scale: [0.9, 1] }
                    : { x: 0, opacity: 1, scale: 1 }
                }
                transition={{ ...spring.snappy, delay: 0.2 + i * staggerStep * 3 }}
              >
                {line.code}
              </m.span>
              <span className="flex flex-col">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {line.label}
                </span>
                <span className="text-sm">{line.meaning}</span>
              </span>
            </li>
          ))}
        </ul>
        <figcaption className="text-xs text-muted-foreground">
          Illustration with a fictional visit.
        </figcaption>
      </figure>
    </MotionFeatures>
  );
}

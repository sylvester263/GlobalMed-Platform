"use client";

import { m } from "motion/react";

import { MotionFeatures } from "@/components/motion/motion-features";
import { dur, ease, staggerStep } from "@/lib/motion";

import { usePlayOnApproach } from "./use-play-on-approach";

// Fictional demo content only: no patient names, dates or identifiers (docs/15 §6).
const noteLines = [
  { label: "Chief complaint", text: "Follow-up for blood pressure" },
  { label: "History", text: "Home readings improved on current dose" },
  { label: "Assessment", text: "Hypertension, controlled" },
  { label: "Plan", text: "Continue medication, recheck in 3 months" },
];

const bars = [0.35, 0.8, 0.5, 1, 0.65, 0.9, 0.4, 0.75, 0.55, 0.95, 0.45, 0.7, 0.3, 0.85, 0.6, 0.5];

/** MG-6: voice waveform → lines typing into a structured clinical note (demo, fake data). */
export function VoiceToNote() {
  const { ref, play } = usePlayOnApproach<HTMLDivElement>();

  return (
    <MotionFeatures>
      <figure ref={ref} className="flex flex-col gap-5 rounded-lg border bg-card p-6 shadow-sm">
        <div
          aria-hidden="true"
          className="flex h-16 items-center justify-center gap-1 rounded-md bg-ledger px-4"
        >
          {bars.map((h, i) => (
            <m.span
              key={i}
              className="w-1.5 origin-center rounded-full bg-teal"
              style={{ height: `${h * 100}%` }}
              initial={false}
              animate={play ? { scaleY: [0.2, 1, 0.4, 1] } : { scaleY: 1 }}
              transition={{ duration: dur.story, ease: ease.standard, delay: i * 0.03 }}
            />
          ))}
        </div>
        <dl className="flex flex-col gap-3">
          {noteLines.map((line, i) => (
            <m.div
              key={line.label}
              className="grid grid-cols-[120px_1fr] gap-3 text-sm"
              initial={false}
              animate={play ? { opacity: [0, 1], x: [-8, 0] } : { opacity: 1, x: 0 }}
              transition={{
                duration: dur.base,
                ease: ease.enter,
                delay: dur.story + i * staggerStep * 4,
              }}
            >
              <dt className="font-semibold text-muted-foreground">{line.label}</dt>
              <dd>{line.text}</dd>
            </m.div>
          ))}
        </dl>
        <figcaption className="border-t pt-3 text-xs text-muted-foreground">
          Illustration with fictional content. A specialist reviews every AI draft.
        </figcaption>
      </figure>
    </MotionFeatures>
  );
}

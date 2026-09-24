"use client";

import { Check } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type PathwayStage = { label: string; description?: string };

type PathwayLineProps = {
  stages: PathwayStage[];
  /** Index of the stage the learner is on. `stages.length` means everything is complete. */
  current?: number;
  className?: string;
};

/**
 * Certification pathway (MG-9, docs/15 §3): the claim line connects stages, completed
 * stages fill teal, the current stage glows, and the final stage turns gold when reached.
 * Horizontal from `md`, vertical on mobile. Meaning is carried by text and aria-current.
 */
export function PathwayLine({ stages, current = 0, className }: PathwayLineProps) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = usePrefersReducedMotion();
  const last = stages.length - 1;
  const progress = last <= 0 ? 0 : Math.min(current, last) / last;
  const play = reduced || inView;
  const lineTransition = { duration: reduced ? 0 : dur.story, ease: ease.standard };

  return (
    <ol ref={ref} className={cn("relative grid gap-8 md:grid-flow-col md:gap-4", className)}>
      {/* Connector: vertical below md, horizontal from md. Only transform is animated. */}
      <span aria-hidden="true" className="absolute top-4 bottom-4 left-4 w-px bg-tick md:hidden">
        <motion.span
          className="absolute inset-0 origin-top bg-teal"
          initial={reduced ? false : { scaleY: 0 }}
          animate={{ scaleY: play ? progress : 0 }}
          transition={lineTransition}
        />
      </span>
      <span
        aria-hidden="true"
        className="absolute top-4 hidden h-px bg-tick md:block"
        style={{
          left: `calc(100% / ${stages.length * 2})`,
          right: `calc(100% / ${stages.length * 2})`,
        }}
      >
        <motion.span
          className="absolute inset-0 origin-left bg-teal"
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: play ? progress : 0 }}
          transition={lineTransition}
        />
      </span>

      {stages.map((stage, i) => {
        const done = i < current;
        const isCurrent = i === current;
        const isFinal = i === last;
        const nodeDelay = reduced ? 0 : (last <= 0 ? 0 : i / last) * dur.story;
        return (
          <li
            key={stage.label}
            aria-current={isCurrent ? "step" : undefined}
            className="relative flex gap-4 md:flex-col md:items-center md:text-center"
          >
            <motion.span
              aria-hidden="true"
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                done && !isFinal && "border-teal bg-teal text-primary-foreground",
                done && isFinal && "border-gold bg-gold text-ink",
                isCurrent && "border-teal bg-card ring-4 ring-teal/25",
                !done && !isCurrent && "border-tick bg-card",
              )}
              initial={reduced ? false : { scale: 0.6, opacity: 0 }}
              animate={play ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
              transition={{ duration: dur.base, ease: ease.enter, delay: nodeDelay }}
            >
              {done ? (
                <Check className="size-4" strokeWidth={2.5} />
              ) : (
                <span className={cn("size-2 rounded-full", isCurrent ? "bg-teal" : "bg-tick")} />
              )}
            </motion.span>
            <div className="pt-1 md:pt-0">
              <p className="font-serif text-lg font-semibold">{stage.label}</p>
              {stage.description && (
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              )}
              <p className="sr-only">
                {done ? "Completed" : isCurrent ? "Current stage" : "Not started"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

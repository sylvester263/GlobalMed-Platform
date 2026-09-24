"use client";

import { m } from "motion/react";

import { MotionFeatures } from "@/components/motion/motion-features";
import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { dur, ease, spring } from "@/lib/motion";

/**
 * MG-14 success state: a teal "stamp" presses in and the checkmark draws. Confetti-free.
 * (pathLength is safe here: the SVG isn't stretched and uses a normal stroke.)
 */
export function CheckStamp({ size = 88 }: { size?: number }) {
  const reduced = usePrefersReducedMotion();
  return (
    <MotionFeatures>
      <m.svg
        viewBox="0 0 88 88"
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
        initial={reduced ? false : { scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduced ? { duration: 0 } : spring.snappy}
      >
        <circle cx="44" cy="44" r="42" className="fill-mint stroke-teal" strokeWidth="2" />
        <circle
          cx="44"
          cy="44"
          r="34"
          className="fill-none stroke-teal/40"
          strokeWidth="1.5"
          strokeDasharray="2 4"
        />
        <m.path
          d="M28 45 L39 56 L61 33"
          className="fill-none stroke-teal"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: dur.slow, ease: ease.enter, delay: reduced ? 0 : dur.base }}
        />
      </m.svg>
    </MotionFeatures>
  );
}

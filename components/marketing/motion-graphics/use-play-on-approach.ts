"use client";

import { useInView } from "motion/react";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";

/**
 * For in-page motion graphics: the server renders the final state; `play` turns true just
 * before the graphic scrolls into view (100px early, so the reset to the first frame is
 * never seen). Always false for reduced motion.
 */
export function usePlayOnApproach<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px 100px 0px" });
  const reduced = usePrefersReducedMotion();
  return { ref, play: inView && !reduced };
}

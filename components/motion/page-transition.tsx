"use client";

import { motion } from "motion/react";
import { useEffect } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { distance, dur, ease } from "@/lib/motion";

// The first page a visitor lands on must not animate: its content is the LCP.
let hasNavigated = false;

/**
 * Page enter transition (MG-16): cross-fade + 8px rise. Use it in a `template.tsx`,
 * which remounts on every navigation. Only client-side navigations animate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const animateIn = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: reduced ? 0 : distance.sm } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? dur.fast : dur.slow, ease: ease.enter }}
    >
      {children}
    </motion.div>
  );
}

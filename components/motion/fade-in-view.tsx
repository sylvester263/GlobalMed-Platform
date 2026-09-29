"use client";

import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { MotionFeatures } from "@/components/motion/motion-features";
import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { dur, ease } from "@/lib/motion";

const variants = {
  waiting: { opacity: 0, transition: { duration: 0 } },
  shown: { opacity: 1, transition: { duration: dur.slow, ease: ease.enter } },
};

/**
 * Motion `whileInView` fade, played once. Visible by default (server HTML, no JS, reduced
 * motion): only a block that starts below the fold is hidden after mount, and it never hides
 * again once shown, so scrolling back up leaves it in place.
 */
export function FadeInView({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // The hook reads false during hydration, so ask the media query directly as well.
    const reduce = reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    setArmed(!reduce && !!el && el.getBoundingClientRect().top >= window.innerHeight);
  }, [reduced]);

  return (
    <MotionFeatures>
      <m.div
        ref={ref}
        className={className}
        variants={variants}
        initial={false}
        animate={armed ? "waiting" : undefined}
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      >
        {children}
      </m.div>
    </MotionFeatures>
  );
}

"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { useContext } from "react";

import { ReducedMotionContext } from "@/components/motion/motion-provider";

/**
 * Opt-in scope for components that use Motion's `m.*` elements (ADR-015). Only pages that
 * render one of these download the Motion runtime. `strict` makes a stray full `motion.*`
 * component throw in development instead of silently re-bloating the bundle.
 */
export function MotionFeatures({ children }: { children: React.ReactNode }) {
  const setting = useContext(ReducedMotionContext);
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={setting}>{children}</MotionConfig>
    </LazyMotion>
  );
}

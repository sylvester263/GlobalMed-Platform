"use client";

import { domAnimation, domMax, LazyMotion, MotionConfig } from "motion/react";
import { useContext } from "react";

import { ReducedMotionContext } from "@/components/motion/motion-provider";

/**
 * Opt-in scope for components that use Motion's `m.*` elements (ADR-015). Only pages that
 * render one of these download the Motion runtime. `strict` makes a stray full `motion.*`
 * component throw in development instead of silently re-bloating the bundle.
 * `features="max"` adds layout animations (dashboard sidebar, DM-1; kanban, DM-8).
 */
export function MotionFeatures({
  children,
  features = "animation",
}: {
  children: React.ReactNode;
  features?: "animation" | "max";
}) {
  const setting = useContext(ReducedMotionContext);
  return (
    <LazyMotion features={features === "max" ? domMax : domAnimation} strict>
      <MotionConfig reducedMotion={setting}>{children}</MotionConfig>
    </LazyMotion>
  );
}

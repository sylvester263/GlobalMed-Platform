"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

export type ReducedMotionSetting = "user" | "always";

export const ReducedMotionContext = createContext<ReducedMotionSetting>("user");

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Root reduced-motion setting (docs/15 §8). Deliberately imports nothing from `motion`:
 * most pages animate with CSS only (ADR-015), so the Motion runtime loads only where a
 * component opts in via <MotionFeatures>. `reducedMotion="always"` lets a subtree (the
 * /styleguide toggle) preview the reduced version regardless of the OS setting; the data
 * attribute also switches off CSS animations underneath it (globals.css).
 */
export function MotionProvider({
  children,
  reducedMotion = "user",
}: {
  children: React.ReactNode;
  reducedMotion?: ReducedMotionSetting;
}) {
  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      <div data-reduced-motion={reducedMotion === "always" || undefined} className="contents">
        {children}
      </div>
    </ReducedMotionContext.Provider>
  );
}

/** True when the OS asks for reduced motion or a parent MotionProvider forces it. */
export function usePrefersReducedMotion(): boolean {
  const setting = useContext(ReducedMotionContext);
  const os = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  return setting === "always" || os;
}

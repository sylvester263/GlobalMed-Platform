"use client";

import { MotionConfig, useReducedMotion as useOsReducedMotion } from "motion/react";
import { createContext, useContext } from "react";

type ReducedMotionSetting = "user" | "always";

const ReducedMotionContext = createContext<ReducedMotionSetting>("user");

/**
 * Root motion settings (docs/15 §8). `reducedMotion="always"` lets a subtree (e.g. the
 * /styleguide toggle) preview the reduced-motion version regardless of the OS setting.
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
      <MotionConfig reducedMotion={reducedMotion}>
        <div data-reduced-motion={reducedMotion === "always" || undefined} className="contents">
          {children}
        </div>
      </MotionConfig>
    </ReducedMotionContext.Provider>
  );
}

/** True when the OS asks for reduced motion or a parent MotionProvider forces it. */
export function usePrefersReducedMotion(): boolean {
  const setting = useContext(ReducedMotionContext);
  const os = useOsReducedMotion();
  return setting === "always" || Boolean(os);
}

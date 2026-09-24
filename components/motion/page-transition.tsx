"use client";

import { useEffect } from "react";

// The first page a visitor lands on must not animate: its content is the LCP.
let hasNavigated = false;

/**
 * Page enter transition (MG-16): cross-fade + 8px rise via the `.page-enter` CSS class
 * (ADR-015, no Motion runtime). Use it in a `template.tsx`, which remounts on every
 * navigation, so only client-side navigations animate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const animateIn = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return <div className={animateIn ? "page-enter" : undefined}>{children}</div>;
}

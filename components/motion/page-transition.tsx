"use client";

import { useEffect, useState } from "react";

// The first page a visitor lands on must not animate: its content is the LCP.
let hasNavigated = false;

/**
 * Page enter transition (MG-16): cross-fade + 8px rise via the `.page-enter` CSS class
 * (ADR-015, no Motion runtime). Use it in a `template.tsx`, which remounts on every
 * navigation, so only client-side navigations animate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  // Once the enter animation ends the class is removed, so this wrapper never keeps a
  // transform: a transformed ancestor breaks `position: sticky` below it (home services
  // stack, "How it works").
  const [animateIn, setAnimateIn] = useState(hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <div
      className={animateIn ? "page-enter" : undefined}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setAnimateIn(false);
      }}
    >
      {children}
    </div>
  );
}

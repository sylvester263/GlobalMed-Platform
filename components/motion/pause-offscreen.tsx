"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pauses CSS loops inside it while it's off-screen (docs/15 §7). Sets
 * `data-paused` on the wrapper; CSS switches `animation-play-state`.
 */
export function PauseOffscreen({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setPaused(!entry?.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-paused={paused || undefined}>
      {children}
    </div>
  );
}

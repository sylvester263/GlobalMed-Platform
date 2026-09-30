"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import type { SiteImage } from "@/content/images";

/**
 * Full-bleed photo behind a band, drifting slightly slower than the page as it scrolls past
 * (±6% of the band's height), under a navy overlay that keeps white text above 4.5:1. The
 * image is 12% taller than the band, so the drift never shows an edge. Reduced motion: static.
 * One passive, rAF-throttled scroll listener while the band is on screen; no animation
 * library (2026-10-01 performance work).
 */
export function ScrollBackground({ image }: { image: SiteImage }) {
  const ref = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // The hook reads false during hydration, so ask the media query directly as well.
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = ref.current;
    const layer = layerRef.current;
    if (!box || !layer) return;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the band's top enters the bottom of the screen, 1 when its bottom leaves the top.
      const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      layer.style.transform = `translateY(${(-6 + 12 * progress).toFixed(2)}%)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        paint();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    observer.observe(box);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div ref={layerRef} className="absolute inset-x-0 -top-[6%] h-[112%]">
        <Image
          src={image.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
      </div>
      <div className="absolute inset-0 bg-navy/65 lg:bg-transparent lg:bg-linear-to-r lg:from-navy/90 lg:from-40% lg:via-navy/70 lg:to-navy/35" />
    </div>
  );
}

"use client";

import { m, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MotionFeatures } from "@/components/motion/motion-features";
import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import type { SiteImage } from "@/content/images";

/**
 * Full-bleed photo behind a band, drifting slightly slower than the page as it scrolls past
 * (±6% of the band's height), under a navy overlay that keeps white text above 4.5:1. The
 * image is 12% taller than the band, so the drift never shows an edge. Reduced motion: static.
 */
export function ScrollBackground({ image }: { image: SiteImage }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [still, setStill] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    // The hook reads false during hydration, so ask the media query directly as well.
    setStill(reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [reduced]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <MotionFeatures>
        <m.div className="absolute inset-x-0 -top-[6%] h-[112%]" style={still ? undefined : { y }}>
          <Image
            src={image.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
        </m.div>
      </MotionFeatures>
      <div className="absolute inset-0 bg-navy/75 lg:bg-transparent lg:bg-linear-to-r lg:from-navy/85 lg:from-30% lg:via-navy/60 lg:to-navy/25" />
    </div>
  );
}

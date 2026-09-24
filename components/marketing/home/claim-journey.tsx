"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

type Stage = { stage: string; caption: string; stat: string };

/**
 * MG-3 (docs/15 §3, storyboard mg-03): the claim line becomes a scroll-scrubbed path.
 * All content renders as a normal ordered list first. On desktop with motion allowed,
 * GSAP + ScrollTrigger load when the section nears the viewport, pin it, and scrub the
 * line and stage highlights. Nothing is hidden before GSAP runs.
 */
export function ClaimJourney({ stages }: { stages: Stage[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    // Phones and tablets get the static list, so never download GSAP there (P2-21).
    // A later resize to desktop keeps the static list, which is an acceptable fallback.
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!section || reduced || !desktop) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
          const line = section.querySelector("[data-journey-line]");
          const steps = section.querySelectorAll("[data-journey-step]");
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 15%",
              end: "+=150%",
              scrub: 0.5,
              pin: true,
            },
          });
          timeline.fromTo(
            line,
            { scaleX: 0 },
            { scaleX: 1, ease: "none", duration: steps.length },
            0,
          );
          steps.forEach((step, i) => {
            timeline.fromTo(
              step,
              { opacity: 0.3, y: 12 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power1.out" },
              i,
            );
          });
        });
        cleanup = () => mm.revert();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(section);

    return () => {
      cancelled = true;
      observer.disconnect();
      cleanup?.();
    };
  }, [reduced]);

  return (
    <div ref={sectionRef} className="relative">
      {/* Desktop connector; mobile uses the vertical rule on the list. */}
      <div
        aria-hidden="true"
        className="absolute top-4 right-[10%] left-[10%] hidden h-0.5 bg-tick lg:block"
      >
        <div data-journey-line className="absolute inset-0 origin-left bg-teal" />
      </div>
      <ol className="relative grid gap-8 border-l-2 border-teal pl-6 lg:grid-cols-5 lg:gap-6 lg:border-0 lg:pl-0">
        {stages.map((s, i) => (
          <li
            key={s.stage}
            data-journey-step
            className="relative flex flex-col gap-3 lg:items-center lg:text-center"
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1 -left-[33px] z-10 flex size-4 rounded-full border-2 bg-card lg:static lg:size-8 lg:items-center lg:justify-center",
                i === stages.length - 1 ? "border-gold" : "border-teal",
              )}
            >
              <span
                className={cn(
                  "hidden size-2.5 rounded-full lg:block",
                  i === stages.length - 1 ? "bg-gold" : "bg-teal",
                )}
              />
            </span>
            <span className="text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase">
              Step {i + 1}
            </span>
            <h3 className="text-xl">{s.stage}</h3>
            <p className="text-foreground">{s.caption}</p>
            <p className="text-sm font-semibold text-muted-foreground">{s.stat}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

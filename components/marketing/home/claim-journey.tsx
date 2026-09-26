"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

type Stage = { stage: string; caption: string; stat: string };

/** Sticky offset: the site header (h-16 + 1px border) plus breathing room. */
const STICKY_TOP = 80;
/** Scroll distance per step while the section is sticky. */
const VH_PER_STEP = 60;

/**
 * The steps along the claim line. Every step, title and caption is always visible: scroll
 * only draws the line (`--journey-progress`) and highlights the active step. With no JS,
 * on smaller screens and with reduced motion, the line is fully drawn and nothing is
 * highlighted.
 */
function JourneyList({ stages, active }: { stages: Stage[]; active: number }) {
  return (
    <div className="relative">
      {/* Desktop connector; below lg the list's left rule is the (fully drawn) line. */}
      <div
        aria-hidden="true"
        className="absolute top-4 hidden h-0.5 bg-tick lg:block"
        style={{
          left: `calc(100% / ${stages.length * 2})`,
          right: `calc(100% / ${stages.length * 2})`,
        }}
      >
        <div
          data-journey-line
          className="absolute inset-0 origin-left bg-teal"
          style={{ transform: "scaleX(var(--journey-progress, 1))" }}
        />
      </div>
      <ol
        style={
          {
            "--journey-cols": `repeat(${stages.length}, minmax(0, 1fr))`,
          } as React.CSSProperties
        }
        className="relative grid gap-8 border-l-2 border-teal pl-6 lg:grid-cols-(--journey-cols) lg:gap-6 lg:border-0 lg:pl-0"
      >
        {stages.map((s, i) => {
          const isActive = i === active;
          const isLast = i === stages.length - 1;
          return (
            <li
              key={s.stage}
              data-journey-step
              aria-current={isActive ? "step" : undefined}
              className="relative flex flex-col gap-3 lg:items-center lg:text-center"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1 -left-[33px] z-10 flex size-4 rounded-full border-2 bg-card transition-shadow duration-(--duration-fast) lg:static lg:size-8 lg:items-center lg:justify-center",
                  isLast ? "border-gold" : "border-teal",
                  isActive && "ring-4 ring-teal/25",
                )}
              >
                <span
                  className={cn(
                    "hidden size-2.5 rounded-full lg:block",
                    isLast ? "bg-gold" : "bg-teal",
                  )}
                />
              </span>
              <span className="text-xs font-semibold tracking-[0.12em] text-teal-deep uppercase">
                Step {i + 1}
              </span>
              <h3
                className={cn(
                  "text-xl transition-colors duration-(--duration-fast)",
                  isActive && "text-teal-deep",
                )}
              >
                {s.stage}
              </h3>
              <p className="text-foreground">{s.caption}</p>
              <p className="text-sm font-semibold text-muted-foreground">{s.stat}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** The claim-line steps on their own, fully drawn (no scroll behaviour). */
export function ClaimJourney({ stages }: { stages: Stage[] }) {
  return <JourneyList stages={stages} active={-1} />;
}

/**
 * MG-3 "How it works" section (docs/15 §3). Content always renders visible. On desktop
 * (≥ 1024px) with motion allowed, the section sits in a tall wrapper (steps × 60vh) and its
 * content is CSS `position: sticky`, so it stays in view while you scroll through; scroll
 * position only draws the claim line and highlights the current step. Scrolling back up
 * un-highlights steps but never hides them. No GSAP pinning (it broke under the page-enter
 * transform) and nothing is measured before layout settles: progress is read on every
 * scroll frame from the wrapper's live position.
 */
export function ClaimJourneySection({
  id,
  title,
  intro,
  stages,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  stages: Stage[];
  /** Content under the steps (e.g. the Register Now button). */
  children?: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(-1);

  // Desktop + motion allowed → sticky and scroll-linked; otherwise the plain section.
  useEffect(() => {
    if (reduced) {
      setEnhanced(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnhanced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    if (!enhanced || !wrapper || !sticky) {
      wrapper?.style.removeProperty("--journey-progress");
      setActive(-1);
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const distance = wrapper.offsetHeight - sticky.offsetHeight;
      const top = wrapper.getBoundingClientRect().top;
      const progress = distance > 0 ? Math.min(1, Math.max(0, (STICKY_TOP - top) / distance)) : 1;
      wrapper.style.setProperty("--journey-progress", String(progress));
      // Highlight a step only while the section is actually in its sticky range.
      const inRange = top <= STICKY_TOP && top + wrapper.offsetHeight > STICKY_TOP;
      setActive(inRange ? Math.min(stages.length - 1, Math.floor(progress * stages.length)) : -1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enhanced, stages.length]);

  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="bg-mint">
      <div
        ref={wrapperRef}
        className="relative"
        style={enhanced ? { height: `${stages.length * VH_PER_STEP}vh` } : undefined}
      >
        <div
          ref={stickyRef}
          className={cn(enhanced && "sticky")}
          style={enhanced ? { top: STICKY_TOP } : undefined}
        >
          <div
            className={cn(
              "mx-auto flex max-w-300 flex-col gap-10 px-4 py-16 md:px-6 lg:py-20",
              enhanced && "lg:py-12",
            )}
          >
            <div className="flex max-w-3xl flex-col gap-3">
              <h2 id={headingId} className="text-2xl lg:text-3xl">
                {title}
              </h2>
              {intro && <p className="max-w-prose text-muted-foreground">{intro}</p>}
            </div>
            <JourneyList stages={stages} active={active} />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

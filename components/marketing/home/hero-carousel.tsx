"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { heroHeight } from "@/components/marketing/home/hero-size";
import { sliderLockupHeight } from "@/components/marketing/home/slider-lockup-size";
import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { buttonVariants } from "@/components/ui/button";
import { features } from "@/config/features";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  headline: string;
  body: string;
  image: string;
  imageAlt: string;
  /** False until the client's photo is in public/; a labelled placeholder shows instead. */
  hasImage: boolean;
  placeholder: string;
  actions: { label: string; href: string }[];
};

/**
 * Where the copy starts: the same top on every slide, so the lockup, headline, text and
 * buttons sit at the same height on all of them (no jump when slides change).
 */
const copyTop = "pt-8 md:pt-12 lg:pt-[clamp(40px,9vh,88px)]";

const SWIPE_THRESHOLD = 50;
const TICKS = 8;

/**
 * Home hero slider (WAI-ARIA APG carousel). Autoplays every 6s: the claim line under the
 * slides fills over those 6s (`.slide-progress` in globals.css) and its animationend
 * advances the slide, so the indicator and the timer can never drift apart. With the claim
 * line retired (ADR-028) an invisible `.slide-timer` runs the same 6s clock and only the
 * dots show. Hover, focus
 * inside, and the pause button all pause it (CSS animation-play-state). Reduced motion: no
 * autoplay (the fill animation is never applied, so it never ends) and a plain crossfade.
 * Slides are stacked at a fixed height, so changing slides causes no layout shift.
 * The GlobalMed + AAPC lockup (server-rendered, passed in) is drawn once above the slides,
 * so it does not move or fade with them; each slide keeps an empty space of its height.
 */
export function HeroCarousel({
  slides,
  lockup,
}: {
  slides: HeroSlide[];
  lockup?: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const count = slides.length;

  const autoplay = !reduced;
  const running = autoplay && !userPaused && !hovered && !focusWithin;

  const goTo = (index: number) => setActive(((index % count) + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className={cn("relative isolate touch-pan-y overflow-hidden bg-navy text-white", heroHeight)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") pointerStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        const start = pointerStart.current;
        pointerStart.current = null;
        if (start === null) return;
        const dx = e.clientX - start;
        if (Math.abs(dx) >= SWIPE_THRESHOLD) goTo(active + (dx < 0 ? 1 : -1));
      }}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
      }}
    >
      <div aria-live={running ? "off" : "polite"} className="absolute inset-0">
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${count}`}
              aria-hidden={!isActive}
              inert={!isActive}
              data-active={isActive || undefined}
              className={cn(
                "hero-slide absolute inset-0",
                isActive ? "z-10 opacity-100" : "z-0 opacity-0",
              )}
            >
              {slide.hasImage ? (
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : undefined}
                  loading={i === 0 ? undefined : "lazy"}
                  className="object-cover object-center lg:object-right"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-linear-to-br from-navy via-mid-blue to-sky"
                  aria-hidden="true"
                >
                  <span className="absolute top-3 right-4 max-w-[calc(100%-2rem)] truncate rounded-md border-2 border-dashed border-white/70 px-2 py-1 text-[11px] font-semibold text-white md:top-6 md:right-6 md:px-3 md:py-1.5 md:text-xs">
                    {slide.placeholder} · 1920 × 640 · /images/slider/{slide.image.split("/").pop()}
                  </span>
                </div>
              )}
              {/* Navy 75% (phones and tablets), then navy 75% → transparent from 1024px, where the
                  text column is narrow enough to stay on the solid part: white text ≥ 4.5:1
                  (measured, tests/audit/contrast-over-images.mjs). */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-navy/75 lg:bg-transparent lg:bg-linear-to-r lg:from-navy/75 lg:from-55% lg:to-transparent"
              />
              <div className={cn("relative container-fluid flex h-full flex-col", copyTop)}>
                <div className="hero-slide-copy flex max-w-2xl flex-col gap-5">
                  {lockup && <div aria-hidden="true" className={sliderLockupHeight} />}
                  {/* Headline → 20px → text → 32px → buttons, the same on every slide;
                      leftover space goes below the buttons (client, 2026-10-01). */}
                  <h2 className="text-3xl text-white lg:text-4xl">{slide.headline}</h2>
                  <p className="max-w-prose text-lg text-white/90">{slide.body}</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {slide.actions.map((action, j) => {
                      const external = action.href.startsWith("http");
                      return (
                        <Link
                          key={action.href}
                          href={action.href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className={cn(
                            buttonVariants({ size: "lg", variant: j === 0 ? "default" : "ghost" }),
                            j === 0
                              ? "bg-sky text-ink hover:bg-white"
                              : "border border-white/70 text-white hover:bg-white/10",
                          )}
                        >
                          {action.label}
                          {j === 0 && <ArrowRight aria-hidden="true" />}
                          {external && <span className="sr-only">(opens in a new tab)</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lockup && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[15]">
          <div className={cn("container-fluid", copyTop)}>{lockup}</div>
        </div>
      )}

      {/* Controls: claim-line progress (retired 2026-09-28, ADR-028), dots, previous/next
          and pause. */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        {/* Bottom offset = the stats card's overlap + 24px (32 + 24 on phones, 64 + 24 on
            tablets, 72 + 24 from 1024px), so the card never covers the controls (2026-10-01). */}
        <div className="container-fluid flex flex-wrap items-center gap-x-4 gap-y-2 pb-14 md:pb-[88px] lg:pb-24">
          {features.claimLine ? (
            <div className="order-last w-full sm:order-none sm:w-56" aria-hidden="true">
              <svg
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                className="block h-3 w-full overflow-visible"
              >
                <line
                  x1="0"
                  y1="6"
                  x2="100"
                  y2="6"
                  className="stroke-white/40"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                {Array.from({ length: TICKS }, (_, t) => (t / (TICKS - 1)) * 100).map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="2"
                    x2={x}
                    y2="10"
                    className="stroke-white/40"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <line
                  key={`${active}-${autoplay}`}
                  x1="0"
                  y1="6"
                  x2="100"
                  y2="6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  data-autoplay={autoplay || undefined}
                  style={
                    {
                      "--slide-fraction": (active + 1) / count,
                      animationPlayState: running ? "running" : "paused",
                    } as React.CSSProperties
                  }
                  onAnimationEnd={() => goTo(active + 1)}
                  className="slide-progress stroke-sky"
                />
              </svg>
            </div>
          ) : (
            // Claim line retired: an invisible, zero-size 6s timer keeps autoplay (and its
            // pause/resume) exactly as before; its animationend advances the slide.
            <span
              key={`${active}-${autoplay}`}
              aria-hidden="true"
              data-autoplay={autoplay || undefined}
              style={{ animationPlayState: running ? "running" : "paused" }}
              onAnimationEnd={() => goTo(active + 1)}
              className="slide-timer absolute size-0"
            />
          )}

          <div className="flex items-center gap-1">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${i + 1} of ${count}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goTo(i)}
                className="group flex size-11 items-center justify-center rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-2.5 rounded-full border border-white transition-[width,background-color] duration-(--duration-fast)",
                    features.claimLine
                      ? i === active
                        ? "w-7 bg-white"
                        : "w-2.5 bg-transparent group-hover:bg-white/60"
                      : // Client, 2026-09-28: active navy #283F93, others #C9D6EE.
                        i === active
                        ? "w-7 bg-navy"
                        : "w-2.5 bg-dot-muted group-hover:bg-white",
                  )}
                />
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {autoplay && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                className="flex size-11 items-center justify-center rounded-full border border-white/60 hover:bg-white/10"
              >
                {userPaused ? (
                  <Play aria-hidden="true" className="size-5" />
                ) : (
                  <Pause aria-hidden="true" className="size-5" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous slide"
              className="flex size-11 items-center justify-center rounded-full border border-white/60 hover:bg-white/10"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next slide"
              className="flex size-11 items-center justify-center rounded-full border border-white/60 hover:bg-white/10"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

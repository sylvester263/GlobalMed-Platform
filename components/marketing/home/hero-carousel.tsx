"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { buttonVariants } from "@/components/ui/button";
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
  /** Extra content above the headline (slide 3's logo lockup), rendered on the server. */
  lockup?: React.ReactNode;
};

const SWIPE_THRESHOLD = 50;
const TICKS = 8;

/**
 * Home hero slider (WAI-ARIA APG carousel). Autoplays every 6s: the claim line under the
 * slides fills over those 6s (`.slide-progress` in globals.css) and its animationend
 * advances the slide, so the indicator and the timer can never drift apart. Hover, focus
 * inside, and the pause button all pause it (CSS animation-play-state). Reduced motion: no
 * autoplay (the fill animation is never applied, so it never ends) and a plain crossfade.
 * Slides are stacked at a fixed height, so changing slides causes no layout shift.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
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
      className="relative isolate h-[560px] touch-pan-y overflow-hidden bg-navy text-white md:h-[520px] lg:h-[640px]"
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
              {/* Navy 75% → transparent keeps white text above 4.5:1 on any photo. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-navy/75 md:bg-transparent md:bg-linear-to-r md:from-navy/75 md:from-55% md:to-transparent"
              />
              <div className="relative mx-auto flex h-full max-w-300 flex-col justify-center gap-5 px-4 pt-10 pb-24 md:px-6 lg:pb-20">
                <div className="hero-slide-copy flex max-w-2xl flex-col gap-5">
                  {slide.lockup}
                  <h2 className="text-3xl text-white lg:text-4xl">{slide.headline}</h2>
                  <p className="max-w-prose text-lg text-white/90">{slide.body}</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

      {/* Controls: claim-line progress, dots, previous/next and pause. */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex max-w-300 flex-wrap items-center gap-x-4 gap-y-2 px-4 pb-5 md:px-6 lg:pb-8">
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
                    i === active ? "w-7 bg-white" : "w-2.5 bg-transparent group-hover:bg-white/60",
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

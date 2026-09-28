"use client";

import { m, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { MotionFeatures } from "@/components/motion/motion-features";
import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

/** Site header height (h-16 + 1px border rounds to 64) plus 24px breathing room. */
const STACK_TOP = 88;
/** Each card sits this much lower than the one before, so earlier edges peek above. */
const PEEK = 28;
const SCALE_STEP = 0.04;
const MIN_SCALE = 0.88;
const MAX_OVERLAY = 0.1;
const MIN_HEIGHT = 520;

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktop(onChange: () => void): () => void {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// useLayoutEffect warns during SSR; the measurement only matters in the browser.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type StackCard = {
  id: string;
  tone: "white" | "soft" | "navy";
  content: React.ReactNode;
};

const toneClass: Record<StackCard["tone"], string> = {
  white: "bg-white text-foreground",
  soft: "bg-surface-soft text-foreground",
  navy: "bg-navy text-white",
};

type Geometry = { start: number; end: number };

/**
 * Sticky stacking service cards (client, 2026-09-28). From 768px each card is CSS sticky,
 * `PEEK` px lower than the one before; as the next card slides up, the cards underneath
 * scale down 4% per card stacked above them (min 0.88) and a navy overlay fades 0 → 10%.
 * Only transform and opacity animate.
 *
 * Scroll bug guard (docs/15, Session 007b): no ancestor may clip or transform, the cards are
 * visible in the server HTML, and nothing fades out on scroll. A card taller than the
 * viewport sticks with a negative top so its bottom is reachable before the next one covers it.
 *
 * Phones and reduced motion: plain stacked cards with a one-time fade-in.
 */
export function ServicesStack({ cards }: { cards: StackCard[] }) {
  const reduced = usePrefersReducedMotion();
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );
  const stacking = desktop && !reduced;

  return (
    <MotionFeatures>
      {stacking ? <StickyStack cards={cards} /> : <PlainStack cards={cards} />}
    </MotionFeatures>
  );
}

function StickyStack({ cards }: { cards: StackCard[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const geometry = useRef<Geometry[]>([]);
  const [tops, setTops] = useState<number[]>(() => cards.map((_, i) => STACK_TOP + i * PEEK));
  // Every card gets the tallest card's height, so a taller card underneath never shows
  // below the one covering it.
  const [cardHeight, setCardHeight] = useState<number>();

  // Page scroll drives everything: arrival[j] is 0 when card j's natural position enters the
  // bottom of the viewport and 1 once it is stuck in place.
  const { scrollY } = useScroll();
  const tick = useMotionValue(0);
  const arrivals = useTransform([scrollY, tick], ([y]) =>
    geometry.current.map(({ start, end }) =>
      end > start ? Math.min(1, Math.max(0, ((y as number) - start) / (end - start))) : 0,
    ),
  );

  useIsoLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const measure = () => {
      const vh = window.innerHeight;
      // Natural height = the content grid plus the article's padding and border (the content
      // is not stretched by the min-height set below, so this stays stable).
      const natural = cardRefs.current.map((el) => {
        const article = el?.firstElementChild as HTMLElement | null;
        const content = article?.firstElementChild as HTMLElement | null;
        if (!article || !content) return 0;
        const st = getComputedStyle(article);
        const chrome =
          parseFloat(st.paddingTop) +
          parseFloat(st.paddingBottom) +
          parseFloat(st.borderTopWidth) +
          parseFloat(st.borderBottomWidth);
        return Math.ceil(content.offsetHeight + chrome);
      });
      const height = Math.max(MIN_HEIGHT, ...natural);
      // A card taller than the screen allows sticks higher so the whole card can be read.
      const nextTops = cards.map((_, i) => Math.min(STACK_TOP + i * PEEK, vh - height - 24));
      geometry.current = cards.map((_, i) => {
        const marker = markerRefs.current[i];
        const natural = marker ? marker.getBoundingClientRect().top + window.scrollY : 0;
        return { start: natural - vh, end: natural - (nextTops[i] ?? STACK_TOP) };
      });
      setTops((prev) => (prev.every((t, i) => t === nextTops[i]) ? prev : nextTops));
      setCardHeight(height);
      tick.set(tick.get() + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [cards, tick]);

  // Flat children: every sticky card shares this one containing block, so earlier cards stay
  // stuck underneath until the last card scrolls away. Spacers (not margins) give each card
  // about 70vh of scroll; a sticky element's margin would unstick it early. `md:motion-safe:`
  // keeps the server HTML right for phones and reduced motion before hydration (no layout
  // shift when PlainStack takes over).
  return (
    <div ref={wrapperRef} className="flex flex-col">
      {cards.map((card, i) => (
        <Fragment key={card.id}>
          {/* Natural (unstuck) position of the card, for measuring its arrival. */}
          <div
            ref={(el) => {
              markerRefs.current[i] = el;
            }}
            aria-hidden="true"
          />
          <StickyCard
            card={card}
            index={i}
            top={tops[i] ?? STACK_TOP}
            height={cardHeight}
            arrivals={arrivals}
            cardRef={(el) => {
              cardRefs.current[i] = el;
            }}
          />
          {i < cards.length - 1 && (
            <div aria-hidden="true" className="h-6 shrink-0 md:motion-safe:h-[70vh]" />
          )}
        </Fragment>
      ))}
    </div>
  );
}

function StickyCard({
  card,
  index,
  top,
  height,
  arrivals,
  cardRef,
}: {
  card: StackCard;
  index: number;
  top: number;
  height: number | undefined;
  arrivals: MotionValue<number[]>;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const scale = useTransform(arrivals, (a) => {
    const above = a.slice(index + 1).reduce((sum, v) => sum + v, 0);
    return Math.max(MIN_SCALE, 1 - SCALE_STEP * above);
  });
  const overlay = useTransform(arrivals, (a) => MAX_OVERLAY * (a[index + 1] ?? 0));

  return (
    <div ref={cardRef} className="md:motion-safe:sticky" style={{ top, zIndex: index + 1 }}>
      <m.article
        aria-labelledby={`${card.id}-title`}
        style={{ scale, transformOrigin: "50% 0%", minHeight: height }}
        className={cardShell(card.tone)}
      >
        {card.content}
        <m.div
          aria-hidden="true"
          style={{ opacity: overlay }}
          className="pointer-events-none absolute inset-0 rounded-[24px] bg-navy-deep"
        />
      </m.article>
    </div>
  );
}

/** Phones and reduced motion: normal flow, each card fades in once when first seen. */
function PlainStack({ cards }: { cards: StackCard[] }) {
  return (
    <div className="flex flex-col gap-6">
      {cards.map((card) => (
        <FadeInOnce key={card.id}>
          <article aria-labelledby={`${card.id}-title`} className={cardShell(card.tone)}>
            {card.content}
          </article>
        </FadeInOnce>
      ))}
    </div>
  );
}

/**
 * Visible by default (server HTML, no JS). Only a card that starts below the fold is hidden
 * on mount, then fades in the first time it enters the viewport and stays visible.
 */
function FadeInOnce({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "waiting" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
    setState("waiting");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-opacity duration-(--duration-slow) ease-(--ease-enter)",
        state === "waiting" && "opacity-0",
      )}
    >
      {children}
    </div>
  );
}

function cardShell(tone: StackCard["tone"]) {
  return cn(
    "relative mx-auto w-full max-w-[1200px] rounded-[24px] border border-border p-6 shadow-[0_20px_50px_rgba(23,38,92,0.12)] md:min-h-[520px] md:p-8 xl:p-10",
    toneClass[tone],
    tone === "navy" && "border-navy",
  );
}

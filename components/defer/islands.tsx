"use client";

import { deferHydration } from "@/components/defer/defer-hydration";

/**
 * Interactive sections whose hydration is deferred (2026-10-01 performance work). Each one's
 * code is a separate chunk that loads only when needed; the server HTML is identical.
 */

/** Home slider: slide 1 is complete in the server HTML; controls and autoplay start after load. */
export const DeferredHeroCarousel = deferHydration(
  "hero-carousel",
  () => import("@/components/marketing/home/hero-carousel").then((m) => m.HeroCarousel),
  "load",
);

/** Home "Our Services" stacking cards. */
export const DeferredServicesStack = deferHydration(
  "services-stack",
  () => import("@/components/marketing/home/services-stack").then((m) => m.ServicesStack),
  "visible",
);

/** "How it works" (home, AAPC page). */
export const DeferredClaimJourneySection = deferHydration(
  "claim-journey",
  () => import("@/components/marketing/home/claim-journey").then((m) => m.ClaimJourneySection),
  "visible",
);

/** FAQ accordions (home, AAPC page, course pages, FAQ page, service pages). */
export const DeferredFaqAccordion = deferHydration(
  "faq-accordion",
  () => import("@/components/marketing/faq-accordion").then((m) => m.FaqAccordion),
  "visible",
);

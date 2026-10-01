/**
 * Home hero minimum height per breakpoint. The slides share one grid cell, so the hero grows
 * if a slide needs more room; these minimums are the tallest slide measured in each range
 * (2026-10-01) plus 8px, so in practice the height is fixed. The same classes reserve the
 * hero's space in the server HTML (hero-slider.tsx): the slider streams in after the page
 * shell (deferred island), and the reserved box keeps the stats card and everything below
 * from moving when it arrives (CLS 0).
 */
export const heroHeight =
  "min-h-[720px] min-[390px]:min-h-[676px] sm:min-h-[556px] md:min-h-[548px] lg:min-h-[672px]";

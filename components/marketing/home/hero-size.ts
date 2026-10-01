/**
 * Home hero height per breakpoint. Used by the slider itself and by the box that reserves its
 * space in the server HTML (hero-slider.tsx): the slider streams in after the page shell
 * (deferred island), and the reserved box keeps the stats card and everything below from
 * moving when it arrives (CLS 0, 2026-10-01). Phones are taller so slide 1's buttons clear
 * the controls, which sit above the stats card's overlap.
 */
export const heroHeight =
  "h-[704px] min-[390px]:h-[660px] sm:h-[560px] md:h-[520px] lg:h-[clamp(560px,80vh,640px)]";

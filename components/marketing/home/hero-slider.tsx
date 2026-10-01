import { DeferredHeroCarousel } from "@/components/defer/islands";
import { heroHeight } from "@/components/marketing/home/hero-size";
import { SliderLockup } from "@/components/marketing/home/slider-lockup";
import { heroSlides } from "@/content/home";
import { publicAssetExists } from "@/lib/public-asset";

/**
 * Server half of the home slider: checks which photos exist and renders the GlobalMed + AAPC
 * lockup, shown once above all three slides (2026-10-01; it was on slide 3 only).
 */
export function HeroSlider() {
  const slides = heroSlides.map((slide) => ({
    ...slide,
    hasImage: publicAssetExists(slide.image),
  }));
  // The box reserves the slider's height before it streams in, so nothing below moves.
  return (
    <div className={heroHeight}>
      <DeferredHeroCarousel slides={slides} lockup={<SliderLockup />} />
    </div>
  );
}

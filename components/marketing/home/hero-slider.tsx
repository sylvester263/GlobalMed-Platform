import { HeroCarousel } from "@/components/marketing/home/hero-carousel";
import { PartnerLockup } from "@/components/marketing/partner-lockup";
import { heroSlides } from "@/content/home";
import { publicAssetExists } from "@/lib/public-asset";

/** Server half of the home slider: checks which photos exist and renders the lockup. */
export function HeroSlider() {
  const slides = heroSlides.map((slide) => ({
    ...slide,
    hasImage: publicAssetExists(slide.image),
    lockup: slide.id === "aapc" ? <PartnerLockup /> : undefined,
  }));
  return <HeroCarousel slides={slides} />;
}

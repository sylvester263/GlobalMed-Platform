import Image from "next/image";

import { HeroCarousel } from "@/components/marketing/home/hero-carousel";
import { Wordmark } from "@/components/marketing/wordmark";
import { heroSlides } from "@/content/home";
import { publicAssetExists } from "@/lib/public-asset";

/** The AAPC mark is the client-supplied file, used as-is and never redrawn (CLAUDE.md §5). */
const aapcLogoOptions = [
  { src: "/aapc-logo.png", width: 160, height: 48 },
  { src: "/aapc-logo.svg", width: 146, height: 51 },
];

/** GlobalMed logo + AAPC partner logo, on a white plate so both marks stay true to colour. */
function PartnerLockup() {
  const aapcLogo = aapcLogoOptions.find((logo) => publicAssetExists(logo.src));
  return (
    <div className="flex items-center gap-4 self-start rounded-lg bg-white px-4 py-3">
      <Wordmark size="compact" />
      <span aria-hidden="true" className="h-9 w-px bg-border" />
      {aapcLogo ? (
        <Image
          src={aapcLogo.src}
          alt="AAPC logo"
          width={aapcLogo.width}
          height={aapcLogo.height}
          unoptimized={aapcLogo.src.endsWith(".svg")}
          className="h-9 w-auto object-contain"
        />
      ) : (
        <span className="flex h-9 items-center rounded-md border-2 border-dashed border-input px-3 text-xs font-semibold text-muted-foreground">
          AAPC partner logo
        </span>
      )}
    </div>
  );
}

/** Server half of the home slider: checks which photos exist and renders the lockup. */
export function HeroSlider() {
  const slides = heroSlides.map((slide) => ({
    ...slide,
    hasImage: publicAssetExists(slide.image),
    lockup: slide.id === "aapc" ? <PartnerLockup /> : undefined,
  }));
  return <HeroCarousel slides={slides} />;
}

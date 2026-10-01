import Image from "next/image";

import { sliderLockupHeight } from "@/components/marketing/home/slider-lockup-size";
import { publicAssetExists } from "@/lib/public-asset";

const aapcLogoOptions = [
  { src: "/aapc-logo.png", width: 160, height: 48 },
  { src: "/aapc-logo.svg", width: 146, height: 51 },
];

const logoHeight = "h-7 w-auto md:h-[34px] lg:h-10";

/**
 * Home slider lockup (2026-10-01): the official horizontal GlobalMed logo | AAPC logo on a
 * white plate. Rendered once above all three slides, so it stays put while slides change.
 * (About keeps the stacked-mark PartnerLockup.)
 */
export function SliderLockup() {
  const aapcLogo = aapcLogoOptions.find((logo) => publicAssetExists(logo.src));
  return (
    <div
      role="group"
      aria-label="GlobalMed Transcriptions, Strategic Partner of AAPC"
      className={`flex w-fit items-center rounded-[12px] bg-white px-5 py-3.5 ${sliderLockupHeight}`}
    >
      <Image
        src="/images/brand/globalmed-logo-horizontal.png"
        alt="GlobalMed Transcriptions logo"
        width={800}
        height={174}
        sizes="(min-width: 1024px) 184px, (min-width: 768px) 157px, 129px"
        className={logoHeight}
      />
      {aapcLogo && (
        <>
          <span aria-hidden="true" className="mx-5 w-px self-stretch bg-[#D9E3F0]" />
          <Image
            src={aapcLogo.src}
            alt="AAPC logo"
            width={aapcLogo.width}
            height={aapcLogo.height}
            unoptimized={aapcLogo.src.endsWith(".svg")}
            className={logoHeight}
          />
        </>
      )}
    </div>
  );
}

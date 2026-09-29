import Image from "next/image";

import { Wordmark } from "@/components/marketing/wordmark";
import { publicAssetExists } from "@/lib/public-asset";
import { cn } from "@/lib/utils";

/** The AAPC mark is the client-supplied file, used as-is and never redrawn (CLAUDE.md §5). */
const aapcLogoOptions = [
  { src: "/aapc-logo.png", width: 160, height: 48 },
  { src: "/aapc-logo.svg", width: 146, height: 51 },
];

/**
 * GlobalMed logo + AAPC partner logo, on a white plate so both marks stay true to colour.
 * Without the client's AAPC file, `missingLogo` either shows a labelled slot or hides the
 * AAPC half entirely.
 */
export function PartnerLockup({
  missingLogo = "placeholder",
  className,
}: {
  missingLogo?: "placeholder" | "hide";
  className?: string;
}) {
  const aapcLogo = aapcLogoOptions.find((logo) => publicAssetExists(logo.src));
  const showSlot = !aapcLogo && missingLogo === "placeholder";
  return (
    <div
      className={cn("flex items-center gap-4 self-start rounded-lg bg-white px-4 py-3", className)}
    >
      <Wordmark size="compact" />
      {(aapcLogo || showSlot) && <span aria-hidden="true" className="h-9 w-px bg-border" />}
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
        showSlot && (
          <span className="flex h-9 items-center rounded-md border-2 border-dashed border-input px-3 text-xs font-semibold text-muted-foreground">
            AAPC partner logo
          </span>
        )
      )}
    </div>
  );
}

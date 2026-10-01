import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The client's official logo: the horizontal artwork (icon + "GLOBALMED TRANSCRIPTIONS" side
 * by side), used everywhere at the client's request (2026-10-01). The icon is the supplied icon
 * file (collapsed sidebar; favicons and app icons). Never recolour or redraw either; size by
 * height only. (The stacked artwork, globalmed-logo-stacked.png, used 2026-09-27 to 2026-10-01,
 * and the older public/logo.png are kept but no longer used.)
 */
const logo = {
  src: "/images/brand/globalmed-logo-horizontal.png",
  width: 800,
  height: 174,
} as const;
const icon = { src: "/images/brand/globalmed-icon.png", width: 628, height: 628 } as const;

const heights = {
  /** Site header and auth pages: 40px on phones, 44px from 768px (the header bar is 64px). */
  header: "h-10 md:h-11",
  /** Extended footer: 44px. */
  footer: "h-11",
  /** Dashboard sidebar, sheets, the course player bar and the About partner lockup: 36px. */
  compact: "h-9",
} as const;

export function Wordmark({
  size = "header",
  iconOnly = false,
  onDark = false,
  priority = false,
  className,
}: {
  size?: keyof typeof heights;
  /** Show only the circular icon (collapsed dashboard sidebar). */
  iconOnly?: boolean;
  /** The logo is navy on transparent, so on dark bands it sits on a white plate. */
  onDark?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const source = iconOnly ? icon : logo;
  const image = (
    <Image
      src={source.src}
      width={source.width}
      height={source.height}
      alt="GlobalMed Transcriptions logo"
      priority={priority}
      className={cn(
        iconOnly ? "size-10 object-contain" : cn("w-auto", heights[size]),
        !onDark && className,
      )}
    />
  );

  if (!onDark) return image;
  return (
    <span className={cn("inline-flex self-start rounded-md bg-white px-3 py-2", className)}>
      {image}
    </span>
  );
}

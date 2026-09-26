import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The client's official logo: the supplied stacked artwork, used everywhere at the client's
 * request (2026-09-27). The icon is the supplied icon file. Never recolour or redraw either.
 * (The horizontal lockup, public/images/brand/globalmed-logo-horizontal.png, and the older
 * public/logo.png are kept but no longer used.)
 */
const logo = {
  src: "/images/brand/globalmed-logo-stacked.png",
  width: 653,
  height: 786,
} as const;
const icon = { src: "/images/brand/globalmed-icon.png", width: 628, height: 628 } as const;

const heights = {
  /** Site header and auth pages: 56px (the header bar is 64px). */
  header: "h-14",
  /** Extended footer: 96px. */
  footer: "h-24",
  /** Dashboard sidebar, sheets, the course player bar and the hero lockup: 48px. */
  compact: "h-12",
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

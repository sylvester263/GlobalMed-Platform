import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The client's official logo (brand set, 2026-09-26). The horizontal lockup is the supplied
 * stacked artwork's icon and wordmark placed side by side, pixels unchanged; the icon is the
 * supplied icon file. Never recolour or redraw either. (public/logo.png is the older logo.)
 */
const logo = {
  src: "/images/brand/globalmed-logo-horizontal.png",
  width: 800,
  height: 174,
} as const;
const icon = { src: "/images/brand/globalmed-icon.png", width: 628, height: 628 } as const;

const heights = {
  /** Site header and auth pages: 36px on mobile, 44px from md. */
  header: "h-9 md:h-11",
  /** Footer: 48px. */
  footer: "h-12",
  /** Dashboard sidebar, sheets and the course player bar: 36px. */
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

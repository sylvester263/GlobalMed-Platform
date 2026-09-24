import Image from "next/image";

import { cn } from "@/lib/utils";

/** The client's official logo (public/logo.png, 561 × 143). Use as supplied: never recolour or redraw it. */
const logo = { src: "/logo.png", width: 561, height: 143 } as const;

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
  /** Crop to the circular icon with object-position (collapsed dashboard sidebar). */
  iconOnly?: boolean;
  /** The logo is navy on transparent, so on dark bands it sits on a white plate. */
  onDark?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const image = (
    <Image
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt="GlobalMed Transcriptions logo"
      priority={priority}
      className={cn(
        iconOnly ? "size-10 object-cover object-left" : cn("w-auto", heights[size]),
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

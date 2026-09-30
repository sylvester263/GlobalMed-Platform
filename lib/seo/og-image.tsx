import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import sharp from "sharp";

// Colours mirror MASTER.md tokens; ImageResponse can't read CSS variables.
const NAVY = "40, 63, 147";

export const ogSize = { width: 1200, height: 630 };

/** Photo backgrounds (pm/IMAGE_PLAN.md B02–B04, B22–B23), 1200×630 JPGs. */
const backgrounds = {
  default: "og/og-default-1200.jpg",
  education: "og/og-education-1200.jpg",
  services: "og/og-services-1200.jpg",
  blog: "og/og-blog-1200.jpg",
  careers: "og/og-careers-1200.jpg",
} as const;

export type OgBackground = keyof typeof backgrounds;

async function dataUri(path: string, type: string): Promise<string> {
  const file = await readFile(join(process.cwd(), path));
  return `data:${type};base64,${file.toString("base64")}`;
}

/**
 * Social share card: the section's photo, a navy gradient from the left, and the official
 * logo and page title on the left. Returned as a JPEG (Open Graph can't be WebP, and a PNG
 * photo is several times larger).
 */
export async function ogImage({
  background,
  title,
}: {
  background: OgBackground;
  title: string;
}): Promise<Response> {
  const [photo, logo, serif] = await Promise.all([
    dataUri(`public/images/${backgrounds[background]}`, "image/jpeg"),
    dataUri("public/images/brand/globalmed-logo-stacked.png", "image/png"),
    readFile(join(process.cwd(), "assets/fonts/source-serif-4-latin-600.ttf")),
  ]);
  const fontSize = title.length > 60 ? 44 : title.length > 36 ? 52 : 60;

  const png = new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
      <img
        src={photo}
        width={ogSize.width}
        height={ogSize.height}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: ogSize.width,
          height: ogSize.height,
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: ogSize.width,
          height: ogSize.height,
          display: "flex",
          backgroundImage: `linear-gradient(90deg, rgba(${NAVY},0.96) 0%, rgba(${NAVY},0.9) 40%, rgba(${NAVY},0.35) 72%, rgba(${NAVY},0) 100%)`,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 660,
          height: "100%",
          padding: "64px 0 72px 72px",
        }}
      >
        {/* The official logo, unaltered, on a white plate (it is navy on transparent). */}
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "white",
            borderRadius: 12,
            padding: "12px 18px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
          <img src={logo} width={100} height={120} alt="GlobalMed Transcriptions logo" />
        </div>
        <div
          style={{
            display: "flex",
            color: "white",
            fontFamily: "Source Serif 4",
            fontSize,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [{ name: "Source Serif 4", data: serif, weight: 600, style: "normal" }],
    },
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
}

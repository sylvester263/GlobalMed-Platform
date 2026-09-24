import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "GlobalMed — medical billing, coding and training";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours mirror MASTER.md tokens; ImageResponse can't read CSS variables.
const NAVY = "#283F93";
const SKY = "#51ACE3";

/** Default social card for every page without its own image. */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const ticks = Array.from({ length: 9 }, (_, i) => i);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: NAVY,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        fontFamily: "Georgia, serif",
      }}
    >
      {/* The official logo, unaltered, on a white plate (it is navy on transparent). */}
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          background: "white",
          borderRadius: 12,
          padding: "14px 20px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
        <img src={logoSrc} width={330} height={84} alt="GlobalMed Transcriptions logo" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.15, maxWidth: 950 }}>
          Clean claims for your practice. Career-ready skills for your future.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: 640,
            height: 24,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 11,
              height: 2,
              background: SKY,
            }}
          />
          {ticks.map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(i / 8) * 100}%`,
                top: 0,
                width: i === 8 ? 4 : 2,
                height: 24,
                background: SKY,
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{ fontSize: 26, color: "rgba(255,255,255,0.8)", fontFamily: "Arial, sans-serif" }}
      >
        Medical billing · Coding · Transcription · School of Billing and Coding
      </div>
    </div>,
    size,
  );
}

import { ImageResponse } from "next/og";

export const alt = "GlobalMed — medical billing, coding and training";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours mirror MASTER.md tokens; ImageResponse can't read CSS variables.
const INK = "#0F2A3D";
const TEAL = "#0E7C7B";
const TEAL_BRIGHT = "#5FC7C0";
const GOLD = "#C8962E";

/** Default social card for every page without its own image. */
export default function OpengraphImage() {
  const ticks = Array.from({ length: 9 }, (_, i) => i);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: INK,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            background: TEAL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "Arial, sans-serif",
          }}
        >
          GM
        </div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>GlobalMed</div>
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
              background: TEAL_BRIGHT,
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
                background: i === 8 ? GOLD : TEAL_BRIGHT,
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

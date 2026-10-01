import type { Metadata } from "next";
import { JetBrains_Mono, Public_Sans, Source_Serif_4 } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { publicEnv } from "@/lib/env";

import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

// Headings: "optional" instead of "swap" (ADR-035). The font is preloaded and is almost
// always ready before first paint; if it isn't, that page keeps the size-matched fallback
// instead of swapping, because the swap re-wrapped hero headlines and moved the page (CLS).
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "optional",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  // Used only for codes and IDs; don't let it compete with the LCP text for bandwidth.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "GlobalMed Transcriptions and Billing Solutions",
    template: "%s | GlobalMed",
  },
  description:
    "Medical billing, coding and transcription services for US practices, and GlobalMed Education.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        {/* Tooltip and toast providers live in the dashboard and styleguide layouts only: the
            public pages use neither, and they cost ~20 kB on every page (2026-10-01). */}
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

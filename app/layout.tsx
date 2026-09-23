import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { publicEnv } from "@/lib/env";

import "./globals.css";

// Placeholder fonts; replaced by the locked pairing in design-system/MASTER.md (Phase 1).
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "GlobalMed Transcriptions and Billing Solutions",
    template: "%s | GlobalMed",
  },
  description:
    "Medical billing, coding and transcription services for US practices, and the GlobalMed School of Billing and Coding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}

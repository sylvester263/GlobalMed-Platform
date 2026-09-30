/**
 * Builds the web versions of the client's photos (pm/IMAGE_PLAN.md). The originals stay
 * untouched next to their outputs. Each photo becomes one WebP "master", cropped to the slot's
 * aspect ratio; next/image then serves AVIF/WebP at the deviceSizes in next.config.ts
 * (640 / 960 / 1280 / 1920 / 2560). Social share backgrounds become 1200×630 JPGs, because
 * Open Graph images can't be WebP.
 *
 * Run: node scripts/optimize-images.mjs   (add --check to only print the size report)
 */
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

const root = join(import.meta.dirname, "..", "public", "images");
const checkOnly = process.argv.includes("--check");

/** Crop presets: master size, and the width the size budget is checked at. */
const presets = {
  banner: { width: 2560, height: null, budgetAt: 1920, budgetKb: 350 },
  hero: { width: 1600, height: 1200, budgetAt: 1280, budgetKb: 180 },
  card: { width: 1600, height: 1200, budgetAt: 1280, budgetKb: 180 },
  cover: { width: 1920, height: 1080, budgetAt: 1280, budgetKb: 180 },
  og: { width: 1200, height: 630, budgetAt: 1200, budgetKb: 250 },
};

/**
 * [source, preset, crop position]. Positions were chosen by looking at each photo so faces and
 * the subject stay in frame ("attention" lets sharp find the busiest region).
 */
const images = [
  ["slider/slide-1.jpg", "banner"],
  ["slider/slide-2.jpg", "banner"],
  ["slider/slide-3.jpg", "banner"],
  ["backgrounds/home-aapc-band.jpg", "banner"],
  ["heroes/aapc-certification.jpg", "hero", "centre"],
  ["heroes/free-billing-audit.jpg", "hero", "attention"],
  ["heroes/course-cpc.jpg", "hero", "right"],
  ["heroes/course-cpb.jpg", "hero", "attention"],
  ["heroes/course-cpc-cpb.jpg", "hero", "right"],
  ["heroes/services.jpg", "hero", "right"],
  ["heroes/medical-billing.jpg", "hero", "attention"],
  ["heroes/medical-coding.jpg", "hero", "right"],
  ["heroes/denial-management.jpg", "hero", "right"],
  ["heroes/careers.jpg", "hero", "centre"],
  ["services/medical-transcription.jpg", "card", "centre"],
  ["services/ai-clinical-documentation.jpg", "card", "centre"],
  ["services/revenue-cycle-management.jpg", "card", "centre"],
  ["services/aapc-certification.jpg", "card", "centre"],
  ["blog/why-claims-get-denied.jpg", "cover", "centre"],
  ["blog/modifier-25-explained.jpg", "cover", "centre"],
  ["blog/start-medical-coding-career-pakistan.jpg", "cover", "centre"],
  ["blog/clean-claim-rate.jpg", "cover", "centre"],
  ["guides/clean-claim-checklist.jpg", "card", "centre"],
  ["guides/denial-reason-codes.jpg", "card", "right"],
  ["guides/coding-career-90-day-plan.jpg", "card", "centre"],
  ["og/og-default.jpg", "og", "centre"],
  ["og/og-education.jpg", "og", "centre"],
  ["og/og-services.jpg", "og", "right"],
  ["og/og-blog.jpg", "og", "right"],
  ["og/og-careers.jpg", "og", "right"],
];

function outputPath(src, preset) {
  const base = src.replace(/\.[a-z]+$/i, "");
  return preset === "og" ? `${base}-1200.jpg` : `${base}.webp`;
}

function resize(pipeline, { width, height }, position) {
  if (!height) return pipeline.resize({ width, withoutEnlargement: true });
  const pos =
    position === "attention"
      ? sharp.strategy.attention
      : position === "centre"
        ? "centre"
        : position;
  return pipeline.resize({ width, height, fit: "cover", position: pos });
}

const kb = (bytes) => Math.round(bytes / 1024);
const rows = [];

for (const [src, presetName, position = "centre"] of images) {
  const preset = presets[presetName];
  const input = join(root, src);
  if (!existsSync(input)) {
    rows.push([src, "MISSING", "", ""]);
    continue;
  }
  const out = join(root, outputPath(src, presetName));
  if (!checkOnly) {
    const pipeline = resize(sharp(input).rotate(), preset, position);
    if (presetName === "og") await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(out);
    else await pipeline.webp({ quality: 80 }).toFile(out);
  }
  // Size budget: what the browser downloads at the checked width (next/image quality 75).
  const probe = sharp(out).resize({ width: preset.budgetAt, withoutEnlargement: true });
  const buf =
    presetName === "og"
      ? await probe.jpeg({ quality: 80, mozjpeg: true }).toBuffer()
      : await probe.webp({ quality: 75 }).toBuffer();
  const meta = await sharp(out).metadata();
  const ok = kb(buf.length) <= preset.budgetKb;
  rows.push([
    outputPath(src, presetName),
    `${meta.width}×${meta.height}`,
    `${kb(statSync(out).size)} KB master`,
    `${kb(buf.length)} KB @${preset.budgetAt} (≤${preset.budgetKb}) ${ok ? "ok" : "OVER"}`,
  ]);
}

const report = rows.map((row) => row.map((c, i) => String(c).padEnd([48, 12, 16, 0][i])).join(" "));
process.stdout.write(report.join("\n") + "\n");

/**
 * Home slider lockup check (2026-10-01): on every slide and width the lockup sits at the same
 * place, the headline/text/buttons start at the same height, and nothing overlaps (lockup vs
 * headline, copy vs the slider controls). Screenshots: node tests/audit/slider-lockup.mjs <dir>
 */
import { mkdirSync } from "node:fs";

import { chromium } from "@playwright/test";

const [shotDir] = process.argv.slice(2);
const base = process.env.AUDIT_BASE ?? "http://localhost:3100";
const widths = [360, 390, 768, 1024, 1280, 1440, 1920];
const shotWidths = [390, 1920];
if (shotDir) mkdirSync(shotDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
let problems = 0;
for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: width >= 1024 ? 900 : 800 },
    reducedMotion: "reduce",
  });
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForSelector('[aria-label="Show slide 3 of 3"]');
  // Wait for the carousel to hydrate (controls respond).
  await page.waitForTimeout(800);
  const rows = [];
  for (let i = 0; i < 3; i++) {
    await page.click(`[aria-label="Show slide ${i + 1} of 3"]`);
    await page.waitForTimeout(500);
    const m = await page.evaluate(() => {
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
      };
      const plate = document.querySelector(
        '[aria-label="GlobalMed Transcriptions, Strategic Partner of AAPC"]',
      );
      const slide = document.querySelector(".hero-slide[data-active]");
      const h2 = slide.querySelector("h2");
      const p = slide.querySelector("p");
      const buttons = slide.querySelector(".hero-slide-copy").lastElementChild;
      const controls = document.querySelector('[aria-label="Show slide 1 of 3"]').parentElement
        .parentElement;
      const imgs = [...plate.querySelectorAll("img")].map((img) => ({
        h: img.getBoundingClientRect().height,
        loaded: img.complete && img.naturalWidth > 0,
      }));
      return {
        plate: box(plate),
        h2: box(h2),
        p: box(p),
        buttons: box(buttons),
        controlsTop: controls.getBoundingClientRect().top,
        imgs,
      };
    });
    rows.push(m);
    if (shotDir && shotWidths.includes(width)) {
      await page.screenshot({ path: `${shotDir}/slide-${i + 1}-${width}.png` });
    }
  }
  const [a] = rows;
  const issues = [];
  rows.forEach((m, i) => {
    const n = i + 1;
    for (const k of ["top", "left", "right"]) {
      if (Math.abs(m.plate[k] - a.plate[k]) > 0.5) issues.push(`slide ${n} lockup ${k} differs`);
    }
    for (const k of ["h2", "p", "buttons"]) {
      if (Math.abs(m[k].top - a[k].top) > 0.5) issues.push(`slide ${n} ${k} top differs`);
    }
    if (Math.abs(m.plate.left - m.h2.left) > 0.5) issues.push(`slide ${n} lockup not left-aligned`);
    if (m.plate.bottom > m.h2.top) issues.push(`slide ${n} lockup overlaps headline`);
    if (m.buttons.bottom > m.controlsTop) issues.push(`slide ${n} buttons overlap controls`);
    if (m.imgs.some((img) => !img.loaded)) issues.push(`slide ${n} logo not loaded`);
    if (new Set(m.imgs.map((img) => Math.round(img.h))).size !== 1)
      issues.push(`slide ${n} logos differ in height`);
  });
  problems += issues.length;
  process.stdout.write(
    `${width}\tplate ${Math.round(a.plate.left)},${Math.round(a.plate.top)} ${Math.round(a.plate.right - a.plate.left)}x${Math.round(a.plate.bottom - a.plate.top)}\tlogo ${Math.round(a.imgs[0].h)}px\tgap to h2 ${Math.round(a.h2.top - a.plate.bottom)}\th2 ${Math.round(a.h2.top)}\tbuttons end ${Math.round(Math.max(...rows.map((r) => r.buttons.bottom)))} / controls ${Math.round(a.controlsTop)}\t${issues.join("; ") || "ok"}\n`,
  );
  await page.close();
}
await browser.close();
process.stdout.write(`${problems} problems\n`);

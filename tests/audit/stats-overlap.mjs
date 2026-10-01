/**
 * Home stats card over the hero (2026-10-01). At each width: the card overlaps the bottom of
 * the hero (half its height, 72px, from 1024px; 64px on tablets; 32px on phones), the slider controls stay 16px above the
 * card and clickable, "Our Services" follows with normal section spacing (no empty band),
 * and loading the page causes no layout shift. Screenshots: node tests/audit/stats-overlap.mjs <dir>
 */
import { mkdirSync } from "node:fs";

import { chromium } from "@playwright/test";

const [shotDir] = process.argv.slice(2);
const base = process.env.AUDIT_BASE ?? "http://localhost:3100";
if (shotDir) mkdirSync(shotDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
let problems = 0;
for (const width of [360, 390, 768, 1024, 1280, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: width >= 1024 ? 900 : 800 } });
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForSelector('[aria-label="Show slide 3 of 3"]');
  await page.waitForTimeout(1500);

  const m = await page.evaluate(() => {
    const box = (el) => el.getBoundingClientRect();
    const hero = document.querySelector('[aria-roledescription="carousel"]');
    const card = document.querySelector('section[aria-label="GlobalMed in numbers"] ul');
    const dots = document.querySelector('[aria-label="Show slide 1 of 3"]');
    // The controls' own boxes (dots and buttons), not their padded container.
    const controlBoxes = [...dots.closest(".container-fluid").querySelectorAll("button")].map(box);
    const next = document.querySelector('[aria-label="Next slide"]');
    const services = document.querySelector("#services");
    const firstText = services.querySelector("p");
    const h = box(hero);
    const c = box(card);
    const ctlBottom = Math.max(...controlBoxes.map((r) => r.bottom));
    // Which element is on top at the centre of the "next" button and of a dot?
    const at = (el) => {
      if (el.offsetParent === null) return true; // hidden (prev/next on phones)
      const r = box(el);
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return el.contains(hit);
    };
    const items = [...card.querySelectorAll("li")].map((li) => box(li));
    return {
      heroBottom: h.bottom,
      cardTop: c.top,
      cardBottom: c.bottom,
      cardHeight: c.height,
      overlap: h.bottom - c.top,
      controlsBottom: ctlBottom,
      nextOnTop: next ? at(next) : true,
      dotOnTop: at(dots),
      gapToServices: box(firstText).top - c.bottom,
      rows: new Set(items.map((r) => Math.round(r.top))).size,
      cardRadius: getComputedStyle(card).borderRadius,
      cardZ: getComputedStyle(card.closest("section")).zIndex,
      sectionTop: box(card.closest("section")).top,
      cls: window.__cls,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  const issues = [];
  const wantOverlap = width >= 1024 ? 72 : width >= 768 ? 64 : 32;
  if (Math.abs(m.overlap - wantOverlap) > 1) {
    issues.push(`overlap ${Math.round(m.overlap)}px (card ${Math.round(m.cardHeight)}px)`);
  }
  // The section's white background must start at the hero's bottom (only the card overlaps).
  if (Math.abs(m.sectionTop - m.heroBottom) > 1)
    issues.push(`section starts ${Math.round(m.heroBottom - m.sectionTop)}px over the hero`);
  if (m.controlsBottom > m.cardTop - 15)
    issues.push(`controls ${Math.round(m.cardTop - m.controlsBottom)}px above the card`);
  if (!m.nextOnTop || !m.dotOnTop) issues.push("controls covered");
  const join = width >= 1024 ? 96 : width >= 768 ? 64 : 48;
  if (m.gapToServices > join + 30)
    issues.push(`gap to Our Services ${Math.round(m.gapToServices)}px`);
  const wantRows = width >= 1024 ? 1 : width >= 768 ? 2 : 3;
  if (m.rows !== wantRows) issues.push(`${m.rows} rows (want ${wantRows})`);
  if (m.cls > 0.001) issues.push(`CLS ${m.cls.toFixed(3)}`);
  if (m.overflow) issues.push("horizontal overflow");

  // The controls still work: next moves to slide 2.
  await page.click('[aria-label="Show slide 2 of 3"]');
  const active = await page.getAttribute('[aria-label="Show slide 2 of 3"]', "aria-current");
  if (active !== "true") issues.push("dot click failed");

  problems += issues.length;
  process.stdout.write(
    `${width}\toverlap ${Math.round(m.overlap)}/${Math.round(m.cardHeight)}px (want ~${Math.round(wantOverlap)})\tcontrols→card ${Math.round(m.cardTop - m.controlsBottom)}px\tcard→services ${Math.round(m.gapToServices)}px\trows ${m.rows}\tCLS ${m.cls.toFixed(3)}\t${issues.join("; ") || "ok"}\n`,
  );
  if (shotDir) {
    await page.click('[aria-label="Show slide 1 of 3"]');
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${shotDir}/home-${width}.png` });
  }
  await page.close();
}
await browser.close();
process.stdout.write(`${problems} problems\n`);

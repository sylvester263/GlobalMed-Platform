/**
 * Course card alignment (2026-10-01): from 1024px the three AAPC course cards are equal height
 * and their sections (title, summary, facts, "Who it's for", price, "Package Includes",
 * buttons, "Course details") start at the same height. Also checks price → "Package Includes"
 * is 24px and that every card shows the delivery note (restored 2026-10-01).
 * Screenshots: node tests/audit/course-cards.mjs <dir>
 */
import { mkdirSync } from "node:fs";

import { chromium } from "@playwright/test";

const [shotDir] = process.argv.slice(2);
const base = process.env.AUDIT_BASE ?? "http://localhost:3100";
const routes = [
  ["/", "#certification-programs"],
  ["/education/aapc-certification-pakistan", "#courses"],
];
if (shotDir) mkdirSync(shotDir, { recursive: true });

async function shootFooter(page, path) {
  await page.goto(base + "/about", { waitUntil: "load" });
  await page.addStyleTag({ content: ".cv-auto{content-visibility:visible!important}" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.locator("footer").screenshot({ path });
}

const browser = await chromium.launch({ channel: "chrome" });
let problems = 0;
for (const width of [360, 768, 1024, 1280, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  for (const [route, section] of routes) {
    await page.goto(base + route, { waitUntil: "load" });
    await page.addStyleTag({ content: ".cv-auto{content-visibility:visible!important}" });
    const m = await page.evaluate((sel) => {
      const cards = [...document.querySelectorAll(`${sel} article`)];
      return cards.map((card) => {
        const kids = [...card.children].filter((c) => getComputedStyle(c).position !== "absolute");
        const r = card.getBoundingClientRect();
        const price = card.querySelector(".font-serif.text-3xl:not(.text-primary)");
        const pkg = card.querySelector("[data-package-includes]");
        const priceWrap = price.parentElement;
        return {
          top: r.top,
          height: r.height,
          rows: kids.map((k) => k.getBoundingClientRect().top - r.top),
          pkgGap: pkg.getBoundingClientRect().top - priceWrap.getBoundingClientRect().bottom,
          note: card.textContent.includes("Training is delivered online by AAPC"),
        };
      });
    }, section);
    const issues = [];
    if (m.length !== 3) issues.push(`${m.length} cards`);
    m.forEach((c, i) => {
      if (!c.note) issues.push(`card ${i + 1} is missing the price note`);
      if (Math.abs(c.pkgGap - 24) > 0.5 && !(i === 2 && width < 1024))
        issues.push(`card ${i + 1} price → package ${Math.round(c.pkgGap)}px`);
    });
    if (width >= 1024) {
      m.forEach((c, i) => {
        if (Math.abs(c.top - m[0].top) > 0.5) issues.push(`card ${i + 1} top offset`);
        if (Math.abs(c.height - m[0].height) > 0.5) issues.push(`card ${i + 1} height differs`);
        c.rows.forEach((y, k) => {
          if (Math.abs(y - m[0].rows[k]) > 0.5) issues.push(`card ${i + 1} row ${k + 1} off`);
        });
      });
    }
    problems += issues.length;
    process.stdout.write(`${width}\t${route}\t${issues.join("; ") || "ok"}\n`);
    if (shotDir && width === 1440) {
      const el = page.locator(`${section} ul`).first();
      await el.scrollIntoViewIfNeeded();
      const box = await el.boundingBox();
      await page.screenshot({
        fullPage: true,
        clip: {
          x: box.x - 16,
          y: box.y + (await page.evaluate(() => scrollY)) - 24,
          width: box.width + 32,
          height: box.height + 40,
        },
        path: `${shotDir}/course-cards-${route === "/" ? "home" : "aapc"}-1440.png`,
      });
    }
  }
  if (shotDir && width === 1920) {
    await shootFooter(page, `${shotDir}/footer-${width}.png`);
  }
  await page.close();
}
// The brief asks for the footer at 390 too.
if (shotDir) {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await shootFooter(page, `${shotDir}/footer-390.png`);
  await page.close();
}
await browser.close();
process.stdout.write(`${problems} problems\n`);

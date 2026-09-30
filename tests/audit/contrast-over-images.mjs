/**
 * Contrast of white text over photos (hero slider slides, home AAPC band). For each text
 * line, hides the text, reads the pixels behind it and reports the contrast of white against
 * the 95th-percentile brightest pixel (worst realistic case). Run against a local server:
 *   node tests/audit/contrast-over-images.mjs [widths]
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";

const base = process.env.AUDIT_BASE ?? "http://localhost:3100";
const widths = (process.argv[2] ?? "360,768,1280,1920").split(",").map(Number);
const lum = (r, g, b) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

async function measure(page, selector, label) {
  const boxes = await page.$$eval(selector, (els) =>
    els
      .filter((el) => el.getBoundingClientRect().width > 0 && !el.closest("[aria-hidden=true]"))
      .map((el) => {
        // Box around the element's own text only (not icons or chips beside it).
        const range = document.createRange();
        const rects = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim()) continue;
          range.selectNodeContents(n);
          rects.push(...range.getClientRects());
        }
        const x = Math.min(...rects.map((r) => r.left));
        const y = Math.min(...rects.map((r) => r.top));
        const w = Math.max(...rects.map((r) => r.right)) - x;
        const h = Math.max(...rects.map((r) => r.bottom)) - y;
        return { x, y: y + window.scrollY, w, h, text: el.textContent.trim().slice(0, 30) };
      }),
  );
  await page.addStyleTag({
    content: `${selector}, ${selector} * { color: transparent !important; } a, button { background: transparent !important; border-color: transparent !important; box-shadow: none !important; }`,
  });
  await page.waitForTimeout(150);
  const shot = await page.screenshot({ fullPage: true });
  const img = sharp(shot);
  const results = [];
  for (const b of boxes) {
    const { data, info } = await img
      .clone()
      .extract({
        left: Math.max(0, Math.round(b.x)),
        top: Math.max(0, Math.round(b.y)),
        width: Math.max(1, Math.round(b.w)),
        height: Math.max(1, Math.round(b.h)),
      })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const ls = [];
    for (let i = 0; i < data.length; i += info.channels)
      ls.push(lum(data[i], data[i + 1], data[i + 2]));
    ls.sort((a, c) => a - c);
    const p95 = ls[Math.floor(ls.length * 0.95)];
    results.push({ label, text: b.text, ratio: +(1.05 / (p95 + 0.05)).toFixed(2) });
  }
  return results;
}

const browser = await chromium.launch({ channel: "chrome" });
const out = [];
for (const width of widths) {
  for (let slide = 0; slide < 3; slide++) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    if (slide > 0)
      await page
        .getByRole("button", { name: new RegExp(`slide ${slide + 1}`, "i") })
        .first()
        .click();
    await page.waitForTimeout(900);
    const r = await measure(
      page,
      "[data-active] .hero-slide-copy h2, [data-active] .hero-slide-copy p",
      `slide ${slide + 1}`,
    );
    out.push(...r.map((x) => ({ width, ...x })));
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.locator("#aapc-instructors").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const r = await measure(
    page,
    "#aapc-instructors h2, #aapc-instructors p, #aapc-instructors li",
    "AAPC band",
  );
  out.push(...r.map((x) => ({ width, ...x })));
  await page.close();
}
await browser.close();
for (const row of out)
  process.stdout.write(
    `${row.width}\t${row.label}\t${row.ratio}\t${row.ratio >= 4.5 ? "ok" : "LOW"}\t${row.text}\n`,
  );

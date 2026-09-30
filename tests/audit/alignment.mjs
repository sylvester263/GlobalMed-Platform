/**
 * Alignment audit (pm/UI_UX_REPORT_2026-09-30.md, step 4). For every route and width:
 *  - left edges: section headings (h1/h2 outside centred blocks) must share one left edge;
 *  - column balance: in two-column grids (the split grid, hero, text + form/FAQ sections) no
 *    column may be more than 20% taller than its neighbour unless it is vertically centred.
 * Run against a local server: node tests/audit/alignment.mjs <routes.txt> [widths]
 */
import { readFileSync } from "node:fs";

import { chromium } from "@playwright/test";

const [routesFile, widthArg = "1024,1280,1440,1920"] = process.argv.slice(2);
const routes = readFileSync(routesFile, "utf8").split(/\r?\n/).filter(Boolean);
const base = process.env.AUDIT_BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
let problems = 0;

for (const width of widthArg.split(",").map(Number)) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load" });
    const found = await page.evaluate(() => {
      const out = [];
      const main = document.querySelector("main");
      if (!main) return out;
      const lefts = new Map();
      for (const h of main.querySelectorAll("h1, h2")) {
        const r = h.getBoundingClientRect();
        if (
          !r.width ||
          h.closest(
            ".text-center, [data-centered], li, article, .hero-slide, form, [role=dialog], [class*='rounded-'][class*='p-']",
          )
        )
          continue;
        const cs = getComputedStyle(h);
        if (cs.textAlign === "center") continue;
        // Only headings that start a column at the container's content edge count.
        const container = h.closest(".container-fluid");
        if (!container) continue;
        const pad = parseFloat(getComputedStyle(container).paddingLeft);
        const edge = container.getBoundingClientRect().left + pad;
        if (Math.abs(r.left - edge) > 1 && r.left < window.innerWidth / 2) {
          lefts.set(h.textContent.trim().slice(0, 40), Math.round(r.left - edge));
        }
      }
      for (const [text, delta] of lefts)
        out.push(`heading off the container edge by ${delta}px: "${text}"`);
      // Column balance in two-column grids.
      for (const grid of main.querySelectorAll("div, section")) {
        const cs = getComputedStyle(grid);
        if (cs.display !== "grid" || grid.closest("form")) continue;
        const cols = cs.gridTemplateColumns.split(" ").filter(Boolean);
        if (cols.length !== 2) continue;
        const kids = [...grid.children].filter((k) => k.getBoundingClientRect().height > 0);
        const byCol = new Map();
        for (const k of kids) {
          const r = k.getBoundingClientRect();
          const key = Math.round(r.left);
          const b = byCol.get(key) ?? { top: Infinity, bottom: -Infinity, centred: false };
          b.top = Math.min(b.top, r.top);
          b.bottom = Math.max(b.bottom, r.bottom);
          // Vertically centred columns and sticky intro columns (beside long forms and FAQ
          // lists) are deliberate, not empty space.
          const ks = getComputedStyle(k);
          b.centred ||=
            ks.alignSelf === "center" ||
            (ks.alignSelf === "auto" && cs.alignItems === "center") ||
            ks.position === "sticky";
          byCol.set(key, b);
        }
        if (byCol.size !== 2) continue;
        const [a, c] = [...byCol.values()];
        const [ha, hc] = [a.bottom - a.top, c.bottom - c.top];
        if (Math.min(ha, hc) < 120 || a.centred || c.centred) continue;
        const ratio = Math.max(ha, hc) / Math.min(ha, hc);
        if (ratio > 1.2) {
          const label = grid
            .closest("section")
            ?.querySelector("h1,h2")
            ?.textContent.trim()
            .slice(0, 40);
          out.push(
            `columns ${Math.round(ha)} vs ${Math.round(hc)}px (${ratio.toFixed(2)}×) in "${label}"`,
          );
        }
      }
      return out;
    });
    for (const f of found) {
      problems++;
      process.stdout.write(`${width}\t${route}\t${f}\n`);
    }
  }
  await page.close();
}
await browser.close();
process.stdout.write(`${problems} alignment problems\n`);

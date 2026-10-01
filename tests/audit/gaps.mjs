/**
 * Gap audit (pm/UI_UX_REPORT_2026-09-30.md, part 4). For every route and width it finds
 *  - empty bands: vertical stretches of the page with no content (text, image, control) at
 *    any x, larger than two section paddings (200px desktop, 150px tablet, 120px phone);
 *  - same-background neighbours: adjacent sections with the same background whose content is
 *    more than 96 / 64 / 48px apart (desktop / tablet / phone).
 * Run against a local server: node tests/audit/gaps.mjs <routes.txt> [widths]
 */
import { readFileSync } from "node:fs";

import { chromium } from "@playwright/test";

const [routesFile, widthArg = "390,768,1440"] = process.argv.slice(2);
const routes = readFileSync(routesFile, "utf8").split(/\r?\n/).filter(Boolean);
const base = process.env.AUDIT_BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
let total = 0;

for (const width of widthArg.split(",").map(Number)) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load" });
    // Render everything (lazy sections, deferred islands) before measuring.
    await page.addStyleTag({ content: ".cv-auto{content-visibility:visible!important}" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 25));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const found = await page.evaluate((vw) => {
      const out = [];
      const band = vw >= 1024 ? 200 : vw >= 768 ? 150 : 120;
      const join = vw >= 1024 ? 96 : vw >= 768 ? 64 : 48;
      const main = document.querySelector("main");
      if (!main) return out;
      const top = (el) => el.getBoundingClientRect().top + window.scrollY;
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.opacity !== "0";
      };
      // Content boxes: elements with their own text, images, controls.
      const boxes = [];
      for (const el of main.querySelectorAll("*")) {
        // Decorative graphics (aria-hidden) are still visible content, so they count.
        if (!visible(el)) continue;
        const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        // Cards and panels (a border or background, narrower than the page) count as content.
        const cs = getComputedStyle(el);
        const panel =
          el.getBoundingClientRect().width < vw * 0.95 &&
          (parseFloat(cs.borderTopWidth) > 0 ||
            !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor));
        if (
          ownText ||
          panel ||
          ["IMG", "SVG", "INPUT", "SELECT", "TEXTAREA", "BUTTON", "VIDEO", "IFRAME"].includes(
            el.tagName.toUpperCase(),
          )
        ) {
          const r = el.getBoundingClientRect();
          boxes.push([r.top + window.scrollY, r.bottom + window.scrollY]);
        }
      }
      boxes.sort((a, b) => a[0] - b[0]);
      let reach = boxes[0]?.[1] ?? 0;
      for (const [t, b] of boxes.slice(1)) {
        if (t - reach > band) {
          // Which section(s) the gap sits in.
          const mid = (reach + t) / 2;
          const sec = [...main.querySelectorAll("section")].find(
            (s) => top(s) <= mid && top(s) + s.offsetHeight >= mid,
          );
          const label =
            sec?.querySelector("h1,h2")?.textContent.trim().slice(0, 40) ?? "(between sections)";
          out.push(`empty band ${Math.round(t - reach)}px at y=${Math.round(reach)} in "${label}"`);
        }
        reach = Math.max(reach, b);
      }
      // Adjacent sections with the same background.
      const sections = [...main.querySelectorAll("section")].filter(
        (s) => visible(s) && !s.parentElement.closest("section"),
      );
      const bg = (el) => {
        for (let e = el; e && e !== document.body; e = e.parentElement) {
          const c = getComputedStyle(e).backgroundColor;
          if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      const contentEdge = (s, which) => {
        const rs = boxes.filter(([t, b]) => t >= top(s) - 1 && b <= top(s) + s.offsetHeight + 1);
        if (!rs.length) return null;
        return which === "first"
          ? Math.min(...rs.map((r) => r[0]))
          : Math.max(...rs.map((r) => r[1]));
      };
      for (let i = 1; i < sections.length; i++) {
        const [a, b] = [sections[i - 1], sections[i]];
        if (Math.abs(top(a) + a.offsetHeight - top(b)) > 2 || bg(a) !== bg(b)) continue;
        const [end, start] = [contentEdge(a, "last"), contentEdge(b, "first")];
        // 30px allowance for line-height above and below text.
        if (end != null && start != null && start - end > join + 30) {
          out.push(
            `same background, ${Math.round(start - end)}px between "${a.querySelector("h1,h2")?.textContent.trim().slice(0, 30)}" and "${b.querySelector("h1,h2")?.textContent.trim().slice(0, 30)}"`,
          );
        }
      }
      return out;
    }, width);
    for (const f of found) {
      total++;
      process.stdout.write(`${width}\t${route}\t${f}\n`);
    }
  }
  await page.close();
}
await browser.close();
process.stdout.write(`${total} gap findings\n`);

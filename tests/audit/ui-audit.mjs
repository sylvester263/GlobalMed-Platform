/**
 * UI/UX audit (pm/UI_UX_REPORT_2026-09-30.md): loads every route at the test widths and
 * reports layout problems as JSON lines. Not part of CI; run against a local `next start`:
 *   node tests/audit/ui-audit.mjs <routes.txt> <out.jsonl> [browser] [widths]
 */
import { readFileSync, writeFileSync } from "node:fs";

import { chromium, firefox, webkit } from "@playwright/test";

const [routesFile, outFile, browserName = "chrome", widthArg] = process.argv.slice(2);
const base = process.env.AUDIT_BASE ?? "http://localhost:3100";
const routes = readFileSync(routesFile, "utf8").split(/\r?\n/).filter(Boolean);
// "360" or "844x390" (landscape); height defaults to 800 on phones, 900 elsewhere.
const sizes = (widthArg ?? "360,390,414,768,834,1024,1280,1440,1920,2560").split(",").map((v) => {
  const [w, h] = v.split("x").map(Number);
  return { width: w, height: h || (w < 768 ? 800 : 900) };
});

const launchers = {
  chrome: () => chromium.launch({ channel: "chrome" }),
  firefox: () => firefox.launch(),
  webkit: () => webkit.launch(),
};
const browser = await launchers[browserName]();
const lines = [];

for (const { width, height } of sizes) {
  // Phones and tablets (incl. landscape) are touch devices (pointer: coarse); desktops use a mouse.
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: "reduce",
    hasTouch: width < 1024 || height < 600,
  });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load" });
    await page.evaluate(async () => {
      // Scroll through once so lazy content mounts, then back to the top.
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    const issues = await page.evaluate(() => {
      const out = [];
      const vw = document.documentElement.clientWidth;
      const visible = (el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return (
          s.visibility !== "hidden" &&
          s.display !== "none" &&
          r.width > 0 &&
          r.height > 0 &&
          !el.closest("[aria-hidden=true],[inert],.sr-only,dialog:not([open])")
        );
      };
      const name = (el) => {
        const cls =
          typeof el.className === "string" ? el.className.split(/\s+/).slice(0, 3).join(".") : "";
        const txt = (el.getAttribute("aria-label") || el.textContent || "")
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 40);
        return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""} "${txt}"`;
      };
      // 1. Horizontal overflow.
      if (document.documentElement.scrollWidth > vw + 1) {
        const wide = [...document.querySelectorAll("body *")].filter((el) => {
          const r = el.getBoundingClientRect();
          return visible(el) && r.right > vw + 1 && !el.closest("[data-scroll-x]");
        });
        out.push({
          check: "overflow",
          detail: `scrollWidth ${document.documentElement.scrollWidth}`,
          els: wide.slice(-3).map(name),
        });
      }
      const main = document.querySelector("main") ?? document.body;
      const textEls = [...main.querySelectorAll("p, li, dd, td, th, label, blockquote")].filter(
        visible,
      );
      // 2a. Body text under 16px on phones (small meta text reported separately so it can be reviewed).
      if (vw < 768) {
        const small = textEls.filter(
          (el) =>
            el.tagName === "P" &&
            parseFloat(getComputedStyle(el).fontSize) < 16 &&
            el.textContent.trim().length > 60,
        );
        if (small.length)
          out.push({
            check: "small-body-text",
            count: small.length,
            els: small.slice(0, 4).map(name),
          });
      }
      // 2b. Line length over 75ch.
      const long = textEls.filter((el) => {
        if (!["P", "LI", "BLOCKQUOTE"].includes(el.tagName) || el.closest("nav,table"))
          return false;
        // List items that hold blocks (cards, rows with images) are layout, not a line of text.
        if (el.tagName === "LI" && el.querySelector("p, h2, h3, h4, img, div")) return false;
        const probe = document.createElement("span");
        probe.style.cssText = "position:absolute;visibility:hidden;width:75ch";
        el.appendChild(probe);
        const cap = probe.getBoundingClientRect().width;
        probe.remove();
        return el.getBoundingClientRect().width > cap + 2 && el.textContent.trim().length > 75;
      });
      if (long.length)
        out.push({ check: "line-length", count: long.length, els: long.slice(0, 4).map(name) });
      // 2c. Text touching the viewport edge (under 16px from either side).
      const edge = [
        ...document.querySelectorAll("h1,h2,h3,p,li,a,button,label,input,select,textarea"),
      ].filter((el) => {
        if (!visible(el) || el.closest("[data-scroll-x],[role=dialog]")) return false;
        const r = el.getBoundingClientRect();
        return r.left < 15.5 || r.right > vw - 15.5;
      });
      if (edge.length)
        out.push({ check: "edge", count: edge.length, els: edge.slice(0, 4).map(name) });
      // 3. Touch targets under 44×44 (inline links inside running text are exempt, WCAG 2.5.8).
      const targets = [
        ...document.querySelectorAll(
          "a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=checkbox]",
        ),
      ].filter(
        // Stretched links (after:inset-0) make the whole card the target.
        (el) =>
          visible(el) &&
          !el.closest("p, .prose, [data-inline-links]") &&
          !/after:inset-0/.test(el.className),
      );
      // 44px on touch screens; 24px (WCAG 2.5.8) where a mouse is the pointer.
      const min = matchMedia("(pointer: coarse)").matches ? 43.5 : 23.5;
      const small = targets.filter((el) => {
        const r = el.getBoundingClientRect();
        if (el.type === "checkbox" || el.getAttribute("role") === "checkbox") {
          const label = el.closest("label") ?? document.querySelector(`label[for="${el.id}"]`);
          const lr = label?.getBoundingClientRect();
          return !lr || lr.height < min;
        }
        return r.width < min || r.height < min;
      });
      if (small.length)
        out.push({
          check: "touch-target",
          count: small.length,
          els: small.slice(0, 6).map((el) => {
            const r = el.getBoundingClientRect();
            return `${name(el)} ${Math.round(r.width)}×${Math.round(r.height)}`;
          }),
        });
      // 5. Images stretched (rendered ratio ≠ natural ratio without object-fit).
      const stretched = [...document.querySelectorAll("img")].filter((img) => {
        if (!visible(img) || !img.naturalWidth) return false;
        const fit = getComputedStyle(img).objectFit;
        if (fit === "cover" || fit === "contain") return false;
        const r = img.getBoundingClientRect();
        return Math.abs(r.width / r.height - img.naturalWidth / img.naturalHeight) > 0.03;
      });
      if (stretched.length)
        out.push({ check: "stretched-image", els: stretched.map((i) => i.currentSrc.slice(-60)) });
      // 13. Empty placeholder boxes.
      const dashed = [...main.querySelectorAll(".border-dashed")].filter(visible);
      if (dashed.length) out.push({ check: "placeholder", els: dashed.map(name) });
      // 11. Floating help button covering an interactive element at the current scroll.
      const help = document.querySelector("[data-help-button], button[aria-label*='help' i]");
      if (help && visible(help)) {
        const h = help.getBoundingClientRect();
        const covered = targets.filter((el) => {
          if (el === help || help.contains(el)) return false;
          const r = el.getBoundingClientRect();
          return r.left < h.right && r.right > h.left && r.top < h.bottom && r.bottom > h.top;
        });
        if (covered.length)
          out.push({ check: "help-overlap-top", els: covered.slice(0, 3).map(name) });
      }
      // 4. Sticky header vs anchor targets.
      const header = document.querySelector("header");
      const hh = header ? header.getBoundingClientRect().height : 0;
      const sp = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const anchored = [...main.querySelectorAll("[id]")].filter(
        (el) => visible(el) && document.querySelector(`a[href="#${el.id}"]`),
      );
      const unsafe = anchored.filter(
        (el) => Math.max(sp, parseFloat(getComputedStyle(el).scrollMarginTop) || 0) < hh,
      );
      if (unsafe.length)
        out.push({
          check: "anchor-under-header",
          detail: `header ${Math.round(hh)}px, scroll-padding ${sp}px`,
          els: unsafe.slice(0, 4).map((el) => "#" + el.id),
        });
      return out;
    });
    // 11b. Help button over interactive elements anywhere down the page (scroll in steps).
    const helpHits = await page.evaluate(async () => {
      const help = document.querySelector("[data-help-button], button[aria-label*='help' i]");
      if (!help) return [];
      const hits = new Set();
      for (let y = 0; y < document.body.scrollHeight; y += Math.round(window.innerHeight / 2)) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
        const h = help.getBoundingClientRect();
        for (const el of document.querySelectorAll(
          "main a[href], main button, main input, main select, main textarea, footer a[href], footer button, footer input",
        )) {
          const r = el.getBoundingClientRect();
          if (
            r.width &&
            r.left < h.right &&
            r.right > h.left &&
            r.top < h.bottom &&
            r.bottom > h.top
          )
            hits.add(
              `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || el.getAttribute("name") || "").trim().slice(0, 30)}"`,
            );
        }
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 50));
      // At the very bottom nothing may be under it (footer bottom padding).
      const h = help.getBoundingClientRect();
      const bottom = [...document.querySelectorAll("footer a[href], footer button")].filter(
        (el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width && r.left < h.right && r.right > h.left && r.top < h.bottom && r.bottom > h.top
          );
        },
      );
      return [...hits, ...bottom.map((el) => `AT-BOTTOM ${el.textContent.trim().slice(0, 30)}`)];
    });
    if (helpHits.length)
      issues.push({
        check: "help-overlap-scroll",
        count: helpHits.length,
        els: helpHits.slice(0, 5),
      });
    for (const issue of issues)
      lines.push(JSON.stringify({ browser: browserName, width, height, route, ...issue }));
  }
  await page.close();
}
await browser.close();
writeFileSync(outFile, lines.join("\n") + "\n");
process.stdout.write(`${lines.length} issues → ${outFile}\n`);

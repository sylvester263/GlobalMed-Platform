import { expect, test } from "@playwright/test";

// Every visible "®" is a small raised mark (<sup class="reg">, components/ui/reg.tsx), 2026-10-03.
const pages = [
  "/",
  "/about",
  "/faq",
  "/education/aapc-certification-pakistan",
  "/education/cpc",
  "/education/cpb",
  "/education/cpc-cpb",
  "/blog/start-medical-coding-career-pakistan",
  "/legal/terms",
];

for (const path of pages) {
  test(`${path}: no full-size ® in visible text`, async ({ page }) => {
    await page.goto(path);
    const stray = await page.evaluate(() => {
      const found: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const parent = node.parentElement;
        if (!node.textContent?.includes("®") || !parent) continue;
        if (parent.matches("sup.reg, script, style, option, textarea, .sr-only, .sr-only *"))
          continue;
        if (parent.closest(".sr-only, caption")) continue;
        found.push(node.textContent.trim().slice(0, 80));
      }
      return found;
    });
    expect(stray).toEqual([]);
  });
}

test("the mark is half size, raised, and keeps the line height", async ({ page }) => {
  await page.goto("/education/cpc");
  const sup = page.locator("h1 sup.reg").first();
  await expect(sup).toHaveCSS("vertical-align", "super");
  await expect(sup).toHaveCSS("line-height", "0px");
  const [h1Size, supSize] = await Promise.all([
    page.locator("h1").evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    sup.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ]);
  expect(supSize).toBeCloseTo(h1Size / 2, 1);
});

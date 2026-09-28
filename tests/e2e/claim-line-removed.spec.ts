import { expect, test } from "@playwright/test";

// Claim line retired site-wide at client request (2026-09-28, ADR-028).

const pages = [
  "/",
  "/about",
  "/education",
  "/education/aapc-certification-pakistan",
  "/education/cpc",
  "/education/cpb",
  "/education/cpc-cpb",
  "/free-billing-audit",
  "/contact",
  "/services",
  "/services/medical-billing",
  "/faq",
  "/login",
];

// Everything the claim line was drawn with: the component, pathway, slider progress,
// "How it works" connector and the old hero claim form.
const lineSelector =
  ".claim-line, .claim-tick, .claim-fill, .pathway, .slide-progress, [data-journey-line], .hc-tick";

for (const width of [360, 768, 1280]) {
  test.describe(`no claim line at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const path of pages) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(page.locator(lineSelector)).toHaveCount(0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      });
    }
  });
}

test.describe("replacements", () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: "no-preference" });

  test("hero slider keeps only dots (navy active, #C9D6EE others) and pause", async ({ page }) => {
    await page.goto("/");
    const slider = page.getByRole("region", { name: "Highlights" });
    await expect(slider.locator("svg line")).toHaveCount(0);
    const dots = slider.getByRole("button", { name: /Show slide/ });
    await expect(dots).toHaveCount(3);
    await expect(dots.nth(0).locator("span")).toHaveCSS("background-color", "rgb(40, 63, 147)");
    await expect(dots.nth(1).locator("span")).toHaveCSS("background-color", "rgb(201, 214, 238)");
    await expect(slider.getByRole("button", { name: "Pause slideshow" })).toBeVisible();
  });

  test("audit form shows step text and a plain 4px bar", async ({ page }) => {
    await page.goto("/free-billing-audit");
    const form = page.locator("#audit-form form");
    await expect(form.getByText("Step 1 of 2")).toBeVisible();
    const bar = form.locator("div.rounded-full.bg-border").first();
    await expect(bar).toHaveCSS("height", "4px");
    await expect(bar.locator("div")).toHaveCSS("background-color", "rgb(40, 63, 147)");
  });
});

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });

  test("home has no claim line and the steps are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(lineSelector)).toHaveCount(0);
    const steps = page.locator("#certification-path [data-journey-step]");
    await steps.first().scrollIntoViewIfNeeded();
    for (const step of await steps.all()) await expect(step).toBeVisible();
  });
});

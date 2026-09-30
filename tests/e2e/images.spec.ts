import { expect, test } from "@playwright/test";

// Photos placed on 2026-09-30 (pm/IMAGE_PLAN.md) and the social share images.

const heroPages = [
  "/education/aapc-certification-pakistan",
  "/education/cpc",
  "/education/cpb",
  "/education/cpc-cpb",
  "/free-billing-audit",
  "/services",
  "/services/medical-billing",
  "/services/medical-coding",
  "/services/denial-management",
  "/careers",
];

test.describe("page hero photos", () => {
  for (const path of heroPages) {
    test(`${path}: photo right from 1024px, above the text on phones`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(path);
      const img = page.locator("[data-hero-image]");
      const h1 = page.locator("h1");
      await expect(img).toHaveCount(1);
      expect((await img.getAttribute("alt"))?.length).toBeGreaterThan(20);
      expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(
        true,
      );
      const [i, t] = [await img.boundingBox(), await h1.boundingBox()];
      expect(i!.x).toBeGreaterThan(t!.x + t!.width - 1);
      expect(Math.abs(i!.width / i!.height - 4 / 3)).toBeLessThan(0.02);

      await page.setViewportSize({ width: 360, height: 800 });
      const [i2, t2] = [await img.boundingBox(), await h1.boundingBox()];
      expect(i2!.y + i2!.height).toBeLessThanOrEqual(t2!.y);
    });
  }
});

test("home: only slide 1 loads with priority, the band has its photo", async ({ page }) => {
  await page.goto("/");
  const slides = page.locator(".hero-slide > img");
  await expect(slides).toHaveCount(3);
  await expect(slides.nth(0)).toHaveAttribute("fetchpriority", "high");
  await expect(slides.nth(1)).toHaveAttribute("loading", "lazy");
  await expect(slides.nth(2)).toHaveAttribute("src", /slide-3\.webp/);
  await expect(page.locator("#aapc-instructors[data-dark-band] img")).toHaveAttribute(
    "src",
    /home-aapc-band\.webp/,
  );
});

test("blog cards and guide cards show their photos", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator("ul.divide-y img")).toHaveCount(4);
  await page.goto("/resources/guides");
  await expect(page.locator("main li img")).toHaveCount(3);
});

const shareCases: [string, RegExp][] = [
  ["/", /\/opengraph-image$/],
  ["/about", /\/opengraph-image$/],
  ["/education/cpc", /\/school\/cpc\/opengraph-image/],
  ["/services/medical-billing", /\/services\/medical-billing\/opengraph-image/],
  ["/specialties/cardiology", /\/specialties\/cardiology\/opengraph-image/],
  ["/blog/clean-claim-rate", /\/blog\/clean-claim-rate\/opengraph-image/],
  ["/careers", /\/careers\/opengraph-image/],
];

test.describe("social share images", () => {
  for (const [path, expected] of shareCases) {
    test(`${path}: one absolute og:image, a 1200×630 JPEG`, async ({ page, request }) => {
      await page.goto(path);
      const og = page.locator('meta[property="og:image"]');
      await expect(og).toHaveCount(1);
      const url = (await og.getAttribute("content"))!;
      expect(url).toMatch(/^https?:\/\//);
      expect(new URL(url).pathname).toMatch(expected);
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
        "content",
        "1200",
      );
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
        "content",
        "630",
      );
      const res = await request.get(new URL(url).pathname + new URL(url).search);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toBe("image/jpeg");
      expect((await res.body()).length).toBeLessThan(250 * 1024);
    });
  }
});

import { expect, test } from "@playwright/test";

// Footer App Store + Google Play badges (client, 2026-09-28). Google Play is linked
// (2026-10-01); the App Store link is still empty, so that badge is a disabled "Coming soon".

for (const width of [360, 768, 1280]) {
  test.describe(`footer badges at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test("both official badges show side by side; Google Play links, App Store is coming soon", async ({
      page,
    }) => {
      await page.goto("/");
      const footer = page.locator("footer");
      const appStore = footer.getByRole("link", { name: "Download on the App Store" });
      const googlePlay = footer.getByRole("link", {
        name: "Download the GlobalMed app on Google Play",
      });
      await appStore.scrollIntoViewIfNeeded();

      await expect(appStore).toHaveAttribute("aria-disabled", "true");
      await expect(appStore).not.toHaveAttribute("href");
      await expect(googlePlay).toHaveAttribute(
        "href",
        "https://play.google.com/store/apps/details?id=com.globalmed_transcriptions.org",
      );
      await expect(googlePlay).toHaveAttribute("target", "_blank");
      await expect(googlePlay).toHaveAttribute("rel", "noopener noreferrer");

      for (const badge of [appStore, googlePlay]) {
        await expect(badge).toBeVisible();
        const box = (await badge.boundingBox())!;
        expect(box.height).toBe(50);
        expect(box.width).toBeLessThanOrEqual(160);
        // Full size from 768px; on phones both may shrink a little to stay side by side.
        if (width >= 768) expect(box.width).toBeGreaterThanOrEqual(149);
      }
      await expect(footer.locator('a[href="#"]')).toHaveCount(0);

      // Same row, App Store first, 20px apart.
      const a = (await appStore.boundingBox())!;
      const g = (await googlePlay.boundingBox())!;
      expect(a.y).toBe(g.y);
      expect(Math.round(g.x - (a.x + a.width))).toBe(20);
      if (width < 768) {
        // Centred on phones.
        const centre = (a.x + g.x + g.width) / 2;
        expect(Math.abs(centre - width / 2)).toBeLessThanOrEqual(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    });

    test("keyboard focus shows the Coming soon tooltip", async ({ page }) => {
      await page.goto("/");
      const badge = page.locator("footer").getByRole("link", { name: "Download on the App Store" });
      await badge.focus();
      await expect(badge).toHaveAccessibleDescription("Coming soon");
      await expect(badge.getByRole("tooltip")).toHaveCSS("opacity", "1");
    });
  });
}

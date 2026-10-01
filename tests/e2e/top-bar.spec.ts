import { expect, test } from "@playwright/test";

// Top contact bar (client, 2026-10-02): sky bar above the nav on every public page, navy
// text, email + mobile from data/site.ts, socials only when linked; scrolls away while the
// nav stays sticky; phones show icons only.

const bar = (page: import("@playwright/test").Page) =>
  page.getByRole("list", { name: "Contact GlobalMed" });

for (const path of ["/", "/about", "/contact", "/education/cpc", "/does-not-exist"]) {
  test(`top bar on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(path);
    const email = bar(page).getByRole("link", { name: "info@globalmedtranscriptions.com" });
    await expect(email).toHaveAttribute("href", "mailto:info@globalmedtranscriptions.com");
    await expect(bar(page).getByRole("link", { name: "+92 300 419 8760" })).toHaveAttribute(
      "href",
      "tel:+923004198760",
    );
  });
}

test("44px tall, sky background, navy 15px text, aligned with the nav", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const container = bar(page).locator("xpath=ancestor::div[contains(@class,'container-fluid')][1]");
  const wrapper = container.locator("xpath=..");
  expect((await wrapper.boundingBox())!.height).toBe(44);
  expect(await wrapper.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
    "rgb(81, 172, 227)",
  );
  const email = bar(page).getByRole("link").first();
  expect(await email.evaluate((el) => getComputedStyle(el).color)).toBe("rgb(23, 38, 92)");
  expect(await email.evaluate((el) => getComputedStyle(el).fontSize)).toBe("15px");
  // Same left edge as the logo in the nav.
  const logo = page.getByRole("link", { name: "GlobalMed home" }).first();
  const iconX = (await email.locator("svg").boundingBox())!.x;
  expect(Math.abs(iconX - (await logo.boundingBox())!.x)).toBeLessThanOrEqual(1);
});

test("scrolls away while the nav stays sticky", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/about");
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(200);
  expect((await bar(page).boundingBox())!.y).toBeLessThan(0);
  expect((await page.locator("header").first().boundingBox())!.y).toBe(0);
});

test("phones: icons only, centred, 44px targets", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/");
  const links = bar(page).getByRole("link");
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    const box = (await link.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    await expect(link.locator("span")).toHaveClass(/sr-only/);
  }
  const first = (await links.first().boundingBox())!;
  const last = (await links.last().boundingBox())!;
  expect(Math.abs((first.x + last.x + last.width) / 2 - 180)).toBeLessThanOrEqual(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
});

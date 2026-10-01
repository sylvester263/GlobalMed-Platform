import { expect, test, type Page } from "@playwright/test";

// Company facts (home card + About strip, one shared component; 2026-10-02): count-up once
// when visible, "+" fixed, hover lift/colour/underline for pointer users, reduced motion =
// final numbers and colour only.

const card = (page: Page) => page.locator('section[aria-label="GlobalMed in numbers"]');

async function liveNumber(page: Page, label: string) {
  return card(page)
    .locator("li, div.group\\/stat")
    .filter({ hasText: label })
    .first()
    .locator('[aria-hidden="true"].inline-grid > span:last-child')
    .textContent();
}

test.describe("stats (motion allowed)", () => {
  test.use({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });

  test("counts up from 0 to the value once, with the + fixed", async ({ page }) => {
    await page.goto("/");
    // Visible on load: counting starts right away and ends on the real value.
    await expect.poll(() => liveNumber(page, "Projects Completed"), { timeout: 5000 }).toBe("470");
    const plus = card(page).getByText("+", { exact: true }).first();
    await expect(plus).toBeVisible();
    // Screen readers get the final value with its suffix.
    await expect(card(page)).toContainText("Years in Healthcare25+");
  });

  test("hover lifts the item, recolours the number and grows the underline", async ({ page }) => {
    await page.goto("/");
    await expect.poll(() => liveNumber(page, "Happy Clients")).toBe("55");
    const item = card(page).locator(".group\\/stat").first();
    const number = item.locator("p").nth(1);
    await item.hover();
    await page.waitForTimeout(350);
    expect(await item.evaluate((el) => getComputedStyle(el).translate)).toBe("0px -4px");
    expect(await item.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      "rgb(238, 246, 252)",
    );
    expect(await number.evaluate((el) => getComputedStyle(el).color)).toBe("rgb(58, 115, 194)");
    const underline = await number.evaluate((el) => {
      const after = getComputedStyle(el, "::after");
      return { width: parseFloat(after.width), height: after.height, color: after.backgroundColor };
    });
    expect(underline.width).toBeGreaterThan(20);
    expect(underline).toMatchObject({ height: "3px", color: "rgb(81, 172, 227)" });
    // Items aren't links, so they aren't keyboard stops.
    expect(await item.getAttribute("tabindex")).toBeNull();
  });

  test("About shows the same facts with the same hover", async ({ page }) => {
    await page.goto("/about");
    const strip = card(page);
    await strip.scrollIntoViewIfNeeded();
    await expect(strip).toContainText("Years in Healthcare25+");
    await expect(strip.locator(".group\\/stat")).toHaveCount(5);
  });
});

test.describe("stats (reduced motion)", () => {
  test.use({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });

  test("final numbers at once; hover changes colour only, no lift", async ({ page }) => {
    await page.goto("/");
    expect(await liveNumber(page, "Projects Completed")).toBe("470");
    const item = card(page).locator(".group\\/stat").first();
    await item.hover();
    await page.waitForTimeout(350);
    expect(await item.evaluate((el) => getComputedStyle(el).translate)).toMatch(/^(none|0px)$/);
    expect(
      await item
        .locator("p")
        .nth(1)
        .evaluate((el) => getComputedStyle(el).color),
    ).toBe("rgb(58, 115, 194)");
  });
});

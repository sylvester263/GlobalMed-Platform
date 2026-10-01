import { expect, test } from "@playwright/test";

// Updates (2026-10-02). Without Supabase there are no live updates, so these check the
// empty states, navigation, sitemap and the card layout (styleguide samples). The dashboard
// flow (create → publish → pin → expire → unpublish) needs Supabase: E2E_SUPABASE=1.

test("home hides Latest Updates when nothing is live", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#latest-updates")).toHaveCount(0);
});

test("/updates lists categories and an empty state", async ({ page }) => {
  await page.goto("/updates");
  await expect(page.getByRole("heading", { level: 1, name: "Updates" })).toBeVisible();
  const filters = page.getByRole("navigation", { name: "Filter updates by category" });
  await expect(filters.getByRole("link")).toHaveText([
    "All",
    "Course Updates",
    "Batch & Enrollment",
    "Company News",
    "Events",
    "Announcements",
  ]);
  await expect(filters.getByRole("link", { name: "All" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("No updates yet")).toBeVisible();
  await filters.getByRole("link", { name: "Events" }).click();
  await expect(page).toHaveURL(/category=events/);
  await expect(page.getByText("No Events right now")).toBeVisible();
});

test("an unknown update is a 404", async ({ page }) => {
  const res = await page.goto("/updates/not-a-real-update");
  expect(res?.status()).toBe(404);
});

test("Updates is in the Resources menu, the footer and the sitemap", async ({ page, request }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Resources" }).click();
  await expect(page.getByRole("link", { name: /^Updates/ }).first()).toHaveAttribute(
    "href",
    "/updates",
  );
  await expect(page.locator("footer").getByRole("link", { name: "Updates" })).toHaveAttribute(
    "href",
    "/updates",
  );
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/updates</loc>");
});

for (const width of [360, 768, 1280, 1920]) {
  test(`update cards: equal heights and button at the bottom at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/styleguide#updates");
    const cards = page.locator("#updates article");
    await expect(cards).toHaveCount(3);
    const boxes = await cards.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        const button = el.querySelector("a.mt-auto")?.getBoundingClientRect();
        return {
          top: Math.round(r.top),
          height: Math.round(r.height),
          buttonBottom: button ? Math.round(r.bottom - button.bottom) : null,
        };
      }),
    );
    // Cards in the same row share one height; buttons sit 24px above the card's bottom edge.
    const rows = new Map<number, number[]>();
    for (const b of boxes) rows.set(b.top, [...(rows.get(b.top) ?? []), b.height]);
    for (const heights of rows.values()) expect(new Set(heights).size).toBe(1);
    for (const b of boxes) if (b.buttonBottom !== null) expect(b.buttonBottom).toBe(25);
    await expect(cards.first().getByText("Batch & Enrollment")).toBeVisible();
    await expect(cards.first().locator("time")).toHaveText("2 Oct 2026");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

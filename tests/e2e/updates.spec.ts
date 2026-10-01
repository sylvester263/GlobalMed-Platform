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

test.describe("dashboard round trip (needs Supabase)", () => {
  test.skip(!process.env.E2E_SUPABASE, "needs a linked Supabase project and a sales user");

  test("create → publish → pin → expire → unpublish shows on the home page and /updates", async ({
    page,
  }) => {
    test.setTimeout(240_000); // waits out a one-minute expiry
    const title = `E2E update ${Date.now()}`;
    await page.goto("/login?next=/dashboard/sales/updates/new");
    await page.getByLabel("Email").fill(process.env.E2E_SALES_EMAIL ?? "");
    await page.getByLabel("Password").fill(process.env.E2E_SALES_PASSWORD ?? "");
    await page.getByRole("button", { name: /log in|sign in/i }).click();

    // Create and publish.
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Short text").fill("Short text from the E2E test.");
    await page.getByLabel("Category").selectOption("events");
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText(/Published/)).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/sales\/updates\/[0-9a-f-]{36}$/);
    const editUrl = page.url();

    await page.goto("/");
    await expect(page.locator("#latest-updates")).toContainText(title);
    await page.goto("/updates?category=events");
    await expect(page.getByRole("heading", { name: title })).toBeVisible();

    // Pin: first on the home page.
    await page.goto("/dashboard/sales/updates");
    const row = page.getByRole("listitem").filter({ hasText: title });
    await row.getByRole("button", { name: "Pin" }).click();
    await expect(row.getByText("Pinned")).toBeVisible();
    await page.goto("/");
    await expect(page.locator("#latest-updates article").first()).toContainText(title);

    // Expire (expiry in the past is refused; set it a minute ahead and wait it out).
    await page.goto(editUrl);
    const soon = new Date(Date.now() + 65_000);
    const pad = (n: number) => String(n).padStart(2, "0");
    await page
      .getByLabel("Expiry (optional)")
      .fill(
        `${soon.getFullYear()}-${pad(soon.getMonth() + 1)}-${pad(soon.getDate())}T${pad(soon.getHours())}:${pad(soon.getMinutes())}`,
      );
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText(/Published|Scheduled/)).toBeVisible();
    await page.waitForTimeout(75_000);
    await page.goto(`/updates?category=events&t=${Date.now()}`);
    await expect(page.getByRole("heading", { name: title })).toHaveCount(0);

    // Unpublish (no delete): gone from the site, still in the dashboard as a draft.
    await page.goto("/dashboard/sales/updates");
    await page
      .getByRole("listitem")
      .filter({ hasText: title })
      .getByRole("button", { name: "Unpublish" })
      .click();
    await expect(
      page.getByRole("listitem").filter({ hasText: title }).getByText("Draft"),
    ).toBeVisible();
  });
});

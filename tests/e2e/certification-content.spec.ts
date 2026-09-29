import { expect, test, type Page } from "@playwright/test";

// Certification content update (client, 2026-09-29): order CPC®, CPB®, dual; dual USD 1,800
// over 16 weeks; one sessions line for every course.

const order = ["CPC®", "CPB®", "CPC® + CPB®"];
const sessions = "Online sessions conducted by AAPC certified trainers";
const forbidden = /1,600|1600|USD 500|32[ -]weeks?/i;
const pages = [
  "/",
  "/education/aapc-certification-pakistan",
  "/education/cpc",
  "/education/cpb",
  "/education/cpc-cpb",
  "/faq",
];

async function visibleText(page: Page) {
  return page.locator("body").innerText();
}

test.describe("certification content", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const path of pages) {
    test(`no old price or duration on ${path}`, async ({ page }) => {
      await page.goto(path);
      expect(await visibleText(page)).not.toMatch(forbidden);
      const ld = (
        await page.locator('script[type="application/ld+json"]').allTextContents()
      ).join();
      expect(ld).not.toMatch(forbidden);
    });
  }

  test("cards, table and prices on the AAPC page", async ({ page }) => {
    await page.goto("/education/aapc-certification-pakistan");
    const cards = page.locator("article").filter({ hasText: "AAPC Official Course" });
    await expect(cards).toHaveCount(3);
    for (const [i, credential] of order.entries()) {
      await expect(cards.nth(i).locator("p.font-serif").first()).toHaveText(credential);
    }
    await expect(cards.nth(2)).toContainText("Best value");
    await expect(cards.nth(2)).toContainText("USD 1,800");
    await expect(cards.nth(2)).toContainText(
      "Save USD 300 compared to taking CPC® and CPB® separately (USD 2,100).",
    );
    for (const i of [0, 1]) await expect(cards.nth(i)).toContainText("USD 1,050");
    for (const i of [0, 1, 2]) await expect(cards.nth(i)).toContainText(sessions);

    const table = page.locator("#compare table");
    const headers = await table.locator("thead th").allInnerTexts();
    expect(headers.slice(1).map((h) => h.trim())).toEqual(
      order.map((o) => expect.stringContaining(o)),
    );
    const row = (label: string) =>
      table.locator("tbody tr").filter({ has: page.getByRole("rowheader", { name: label }) });
    expect((await row("Duration").locator("td").allInnerTexts()).map((t) => t.trim())).toEqual([
      "16 weeks",
      "16 weeks",
      "16 weeks",
    ]);
    expect((await row("Format").locator("td").allInnerTexts()).map((t) => t.trim())).toEqual([
      sessions,
      sessions,
      sessions,
    ]);
    await expect(row("Price").locator("td").nth(2)).toHaveText("USD 1,800 (save USD 300)");

    // Registration form: course options in order, dual shows its price.
    const options = await page
      .locator("#register select")
      .first()
      .locator("option")
      .allInnerTexts();
    expect(options.slice(1)).toEqual([
      "CPC® — USD 1,050",
      "CPB® — USD 1,050",
      "CPC® + CPB® — USD 1,800",
    ]);

    // FAQ price answer (answers render when their question is opened).
    await page.getByRole("button", { name: "How much does it cost?" }).click();
    await expect(page.locator("body")).toContainText(
      "CPC® and CPB® are USD 1,050 each. The CPC® + CPB® dual certifications course is USD 1,800, saving USD 300.",
    );
  });

  test("home cards in order with the dual course third", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#certification-programs article");
    for (const [i, credential] of order.entries()) {
      await expect(cards.nth(i).locator("p.font-serif").first()).toHaveText(credential);
    }
    await expect(cards.nth(2)).toContainText("Best value");
  });

  test("dual course page: hero, package, intro and Offer", async ({ page }) => {
    await page.goto("/education/cpc-cpb");
    const hero = page.locator("main section").first();
    await expect(hero).toContainText(sessions);
    await expect(hero).toContainText("16 weeks");
    await expect(page.locator("body")).toContainText(
      "Instructor-led 16-week online courses led by world-class AAPC faculty",
    );
    await expect(page.locator("body")).toContainText("in a program that runs over 16 weeks");
    await expect(page.locator("body")).not.toContainText("16 weeks for CPC®");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join();
    expect(ld).toContain('"price":1800');
  });

  test("CPC and CPB course heroes show the sessions line", async ({ page }) => {
    for (const slug of ["cpc", "cpb"]) {
      await page.goto(`/education/${slug}`);
      await expect(page.locator("main section").first()).toContainText(sessions);
    }
  });

  test("Education menu and sitemap order", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page
      .locator("header a[href^='/education/cp']")
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    const firstThree = [...new Set(hrefs)].slice(0, 3);
    expect(firstThree).toEqual(["/education/cpc", "/education/cpb", "/education/cpc-cpb"]);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    const positions = ["/education/cpc<", "/education/cpb<", "/education/cpc-cpb<"].map((p) =>
      sitemap.indexOf(p),
    );
    expect(positions.every((p) => p > 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);

    const llms = await (await request.get("/llms.txt")).text();
    expect(llms).not.toMatch(forbidden);
    expect(llms).toContain("USD 1,800");
  });
});

test.describe("instructors band without photos", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const path of ["/", "/education/aapc-certification-pakistan"]) {
    test(`no instructor photo slots on ${path}`, async ({ page }) => {
      await page.goto(path);
      const band = page.locator("#aapc-instructors");
      await expect(band.getByRole("heading", { level: 2 })).toBeVisible();
      await expect(band.getByRole("link")).toBeVisible();
      await expect(band.getByRole("list", { name: "AAPC instructors" })).toHaveCount(0);
      await expect(page.locator("body")).not.toContainText("Instructor photo");
    });
  }
});

test.describe("certification content at 360px", () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test("AAPC page: cards stack in order, no horizontal scroll", async ({ page }) => {
    await page.goto("/education/aapc-certification-pakistan");
    const cards = page.locator("article").filter({ hasText: "AAPC Official Course" });
    for (const [i, credential] of order.entries()) {
      await expect(cards.nth(i).locator("p.font-serif").first()).toHaveText(credential);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      360,
    );
    await page.screenshot({ path: "pm/screenshots/certification-order-360.png", fullPage: true });
  });
});

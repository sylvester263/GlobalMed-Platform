import { expect, test } from "@playwright/test";

test.describe("free billing audit form", () => {
  test("validates step 1 before continuing and moves focus to the first error", async ({
    page,
  }) => {
    await page.goto("/free-billing-audit");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter your practice name.")).toBeVisible();
    await expect(page.getByLabel(/Practice name/)).toBeFocused();
    await expect(page.getByText("Step 1 of 2")).toBeVisible();
  });

  test("walks both steps and fails closed without Turnstile in production", async ({ page }) => {
    await page.goto("/free-billing-audit");
    await page.getByLabel(/Practice name/).fill("Riverside Family Medicine");
    await page.getByLabel(/Main specialty/).fill("Family medicine");
    await page.getByLabel(/Monthly claim volume/).selectOption("500–1,500 claims a month");
    await page.getByLabel(/How do you bill today/).selectOption("In-house billing team");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("heading", { name: "How we reach you" })).toBeFocused();
    await page.getByLabel(/Your name/).fill("Sam Taylor");
    await page.getByLabel(/Your role/).fill("Office manager");
    await page.getByLabel(/Work email/).fill("office@riverside.example");
    await page.getByLabel(/Best time to call/).selectOption("Morning (ET)");
    await page.getByRole("button", { name: "Book my free audit" }).click();

    // `next start` is production: FORMS_DRY_RUN is ignored and Turnstile isn't configured,
    // so the server must refuse rather than silently accept (docs/11 §4).
    await expect(page.locator("[data-slot=alert]")).toContainText(/robot/i);
    await expect(page).toHaveURL(/\/free-billing-audit$/);
  });

  test("shows the patient-information notice", async ({ page }) => {
    await page.goto("/free-billing-audit");
    await expect(page.getByText("Do not include patient information.")).toBeVisible();
  });
});

test.describe("course catalog", () => {
  test("filters with URL params and reports the count", async ({ page }) => {
    await page.goto("/school/courses");
    await page.getByLabel("Level").selectOption("advanced");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page).toHaveURL(/level=advanced/);
    await expect(page.getByText(/^1 course/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "CPC Exam Preparation" })).toBeVisible();
  });

  test("shows an empty state with a way out", async ({ page }) => {
    await page.goto("/school/courses?q=zzzz-no-match");
    await expect(
      page.getByRole("heading", { name: "No courses match those filters" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Clear filters" }).first().click();
    await expect(page).toHaveURL(/\/school\/courses$/);
  });
});

test.describe("certificate verification", () => {
  test("rejects a malformed ID with a helpful message", async ({ page }) => {
    await page.goto("/verify");
    await page.getByLabel("Certificate ID").fill("abc");
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page.getByRole("alert")).toContainText("12 letters and numbers");
  });

  test("normalises a valid ID into the result URL", async ({ page }) => {
    await page.goto("/verify");
    await page.getByLabel("Certificate ID").fill("7f3a-9c21-b04d");
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page).toHaveURL(/\/verify\/7F3A9C21B04D$/);
  });
});

test.describe("navigation and SEO", () => {
  test("mega menu opens with keyboard and links to a service", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Services" }).focus();
    await page.keyboard.press("Enter");
    const link = page.getByRole("link", { name: /Medical coding/ }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/services\/medical-coding$/);
  });

  test("mobile menu opens as a sheet", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  });

  test("skip link moves to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("every page has one h1, a canonical and a description", async ({ page }) => {
    for (const path of [
      "/",
      "/services/medical-billing",
      "/school/courses/cpc-exam-preparation",
      "/blog/modifier-25-explained",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(50);
      expect(description?.length ?? 0).toBeLessThanOrEqual(160);
    }
  });

  test("sitemap, robots and llms.txt are served", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).toContain("/services/medical-billing");
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("Disallow: /dashboard/");
    const llms = await request.get("/llms.txt");
    expect(await llms.text()).toContain("does not collect patient information");
  });

  test("the AAPC page stays hidden without permission", async ({ request }) => {
    const res = await request.get("/school/aapc-partnership");
    expect(res.status()).toBe(404);
  });
});

test.describe("home motion (desktop, motion allowed)", () => {
  test.use({ viewport: { width: 1280, height: 720 }, reducedMotion: "no-preference" });

  test("How we work pins with scroll space, so the next section never covers it", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator("#how-we-work");
    await section.scrollIntoViewIfNeeded();
    const spacer = page.locator(".pin-spacer").filter({ has: section });
    await expect(spacer).toHaveCount(1);
    const padding = await spacer.evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));
    expect(padding).toBeGreaterThan(0);

    // Scroll into the middle of the pin: the heading and CTA stay on screen.
    const top = await spacer.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo(0, y), top + padding / 2);
    await expect(
      page.getByRole("heading", { name: "How we work with your practice" }),
    ).toBeInViewport();
    await expect(section.getByRole("link", { name: /free billing audit/i })).toBeInViewport();

    // The section after it starts below the spacer, not on top of the pinned section.
    const overlap = await spacer.evaluate((el) => {
      const next = el.nextElementSibling;
      return next
        ? next.getBoundingClientRect().top < el.getBoundingClientRect().bottom - 1
        : false;
    });
    expect(overlap).toBe(false);
  });

  test("the hero claim form loops and pauses off-screen", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator(".hero-claim");
    await expect(hero).not.toHaveAttribute("data-paused");
    const running = await hero.evaluate(
      (el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length,
    );
    expect(running).toBeGreaterThan(10);
    await page.locator("#how-we-work").scrollIntoViewIfNeeded();
    await expect(hero).toHaveAttribute("data-paused", "true");
  });
});

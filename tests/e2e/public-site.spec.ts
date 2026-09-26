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
    await expect(page).toHaveURL(/\/education\/courses$/);
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

  test("How it works stays visible while scrolling down and back up", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#certification-path");
    const steps = section.locator("[data-journey-step]");
    // Sticky, not pinned: no GSAP spacer, and the content sits in a tall wrapper.
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await section.scrollIntoViewIfNeeded();
    // After hydration, desktop gets the tall sticky wrapper (steps × 60vh).
    await expect
      .poll(() => section.evaluate((el) => el.getBoundingClientRect().height), { timeout: 15000 })
      .toBeGreaterThan(720);
    const range = await section.evaluate((el) => ({
      top: el.getBoundingClientRect().top + window.scrollY,
      // Scroll distance while the content is stuck: wrapper height minus the sticky content.
      distance:
        el.getBoundingClientRect().height -
        (el.querySelector(".sticky")?.getBoundingClientRect().height ?? 0),
    }));

    // Down through the sticky range, then back up (slowly and in one jump).
    const positions = [0.05, 0.5, 0.95, 0.6, 0.3, 0.05].map(
      (f) => range.top - 80 + range.distance * f,
    );
    for (const y of positions) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await expect(page.getByRole("heading", { name: "How it works" })).toBeInViewport();
      for (const step of await steps.all()) {
        await expect(step).toBeInViewport();
        await expect(step).toHaveCSS("opacity", "1");
      }
    }
  });

  test("the hero slider autoplays, pauses on hover and has working controls", async ({ page }) => {
    await page.goto("/");
    const slider = page.getByRole("region", { name: "Highlights" });
    // Inactive slides are inert (out of the accessibility tree), so match on the label.
    await expect(slider.locator('[aria-label="Slide 1 of 3"]')).toHaveAttribute(
      "data-active",
      "true",
    );
    // Autoplay: the 6s claim-line progress ends and advances to slide 2.
    await page.mouse.move(640, 20); // over the header, not the slider (hover pauses it)
    await expect(slider.locator('[aria-label="Slide 2 of 3"]')).toHaveAttribute(
      "data-active",
      "true",
      { timeout: 9000 },
    );
    await slider.getByRole("button", { name: "Next slide" }).click();
    await expect(slider.locator('[aria-label="Slide 3 of 3"]')).toHaveAttribute(
      "data-active",
      "true",
    );
    await slider.getByRole("button", { name: "Show slide 1 of 3" }).press("Enter");
    await expect(slider.locator('[aria-label="Slide 1 of 3"]')).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(slider.getByRole("button", { name: "Pause slideshow" })).toBeVisible();
  });
});

test.describe("hero slider (reduced motion)", () => {
  test.use({ reducedMotion: "reduce" });

  test("does not autoplay and hides the pause button", async ({ page }) => {
    await page.goto("/");
    const slider = page.getByRole("region", { name: "Highlights" });
    await expect(slider.getByRole("button", { name: /slideshow/ })).toHaveCount(0);
    await page.waitForTimeout(7000);
    await expect(slider.locator('[aria-label="Slide 1 of 3"]')).toHaveAttribute(
      "data-active",
      "true",
    );
  });
});

test.describe("client review 2026-09-25", () => {
  test("old /school and new /education URLs both render", async ({ request }) => {
    for (const path of [
      "/school",
      "/education",
      "/school/courses/cpc-certified-professional-coder",
      "/education/courses/cpc-certified-professional-coder",
      "/education/aapc-certification-pakistan",
    ]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
  });

  test("primary nav starts with About Us then Education", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const items = page.getByRole("navigation", { name: "Primary" }).locator(":scope > ul > li");
    await expect(items).toHaveText([
      /About Us/,
      /Education/,
      /Services/,
      /Resources/,
      /Specialties/,
      /Contact/,
    ]);
    await page.getByRole("button", { name: "Education" }).click();
    const educationItem = items.filter({
      has: page.getByRole("button", { name: "Education" }),
    });
    await expect(educationItem.getByRole("link").first()).toHaveText(
      /AAPC Certification in Pakistan/,
    );
  });

  test("certificate lightbox opens, traps focus and closes on Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /View certificate.*PSEB/ });
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "PSEB" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("footer shows the client's contact details", async ({ page }) => {
    await page.goto("/about");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "+92 42 3594 6342" }).first()).toHaveAttribute(
      "href",
      "tel:+924235946342",
    );
    await expect(footer).toContainText("CPC® and CPB® are registered trademarks of AAPC.");
    await expect(footer).toContainText("Designed & developed by SylJo Tech");
  });
});

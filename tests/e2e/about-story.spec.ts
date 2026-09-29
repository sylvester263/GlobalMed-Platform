import { expect, test, type Page } from "@playwright/test";

import { aboutStory } from "../../content/about-story";

// About page "Our Story" (client, 2026-09-29).

const widths = [360, 768, 1280, 1920];
const headings = [
  aboutStory.story.title,
  aboutStory.documentation.title,
  aboutStory.revenueCycle.title,
  aboutStory.workforce.title,
];
const paragraphs = [
  ...aboutStory.story.paragraphs,
  ...aboutStory.documentation.paragraphs,
  ...aboutStory.revenueCycle.paragraphs,
  ...aboutStory.workforce.paragraphs,
];

async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(600);
}

async function storyOpacities(page: Page) {
  return page
    .locator("[data-about-story] section > div")
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
}

test.describe("about: Our Story", () => {
  test.use({ reducedMotion: "no-preference" });

  test("client text exactly, right after the hero, old blocks hidden", async ({ page }) => {
    await page.goto("/about");
    const story = page.locator("[data-about-story]");
    for (const name of headings) {
      await expect(story.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
    }
    const texts = await story.locator("p").allInnerTexts();
    for (const p of [...paragraphs, aboutStory.closing]) expect(texts).toContain(p);
    await expect(page.locator("body")).not.toContainText("®️");

    // First section after the hero.
    const firstAfterHero = await page
      .locator("main h1")
      .evaluate((h1) => h1.closest("section")?.nextElementSibling?.matches("[data-about-story]"));
    expect(firstAfterHero).toBe(true);

    // Old "Our Story"/"What We Do" and "Strategic Partnership" are hidden; the kept blocks stay.
    await expect(page.getByRole("heading", { name: "What We Do" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Our Story" })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Strategic Partnership" })).toHaveCount(0);
    for (const kept of ["Quality First", "Our Mission"]) {
      await expect(page.getByRole("heading", { name: kept }).first()).toBeVisible();
    }
    // The standalone Leadership card is hidden (aboutLeaderCard); the founder shows only in
    // Our Story.
    await expect(page.getByRole("heading", { name: "Riaz Naveed" })).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("diploma in Medical Laboratory");
    await expect(page.getByText("Photo: Riaz Naveed")).toHaveCount(1);

    await expect(story.getByRole("link", { name: "View CPC® & CPB® Courses" })).toHaveAttribute(
      "href",
      "/education/aapc-certification-pakistan",
    );
    await expect(story).toContainText("Riaz Naveed, Founder & CEO");
    await expect(story).toContainText("Est. 2007 · Lahore, Pakistan");
  });

  test("meta description and Organization JSON-LD", async ({ page }) => {
    await page.goto("/about");
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description!.length).toBeLessThanOrEqual(160);
    expect(description).toContain("2007");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join();
    expect(ld).toContain('"foundingDate":"2007"');
    expect(ld).toContain("Riaz Naveed");
  });

  for (const width of widths) {
    test(`layout at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/about");
      await scrollThrough(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
      // Paragraphs stay within 75ch (the closing statement within 60ch).
      const tooWide = await page.locator("[data-about-story] p").evaluateAll(
        (ps) =>
          ps.filter((p) => {
            const probe = document.createElement("span");
            probe.style.cssText = `position:absolute;visibility:hidden;width:${p.closest("blockquote") ? 60 : 75}ch`;
            p.appendChild(probe);
            const cap = probe.getBoundingClientRect().width;
            probe.remove();
            return p.getBoundingClientRect().width > cap + 1;
          }).length,
      );
      expect(tooWide).toBe(0);
      // Everything faded in and stays visible after scrolling back up.
      expect(new Set(await storyOpacities(page))).toEqual(new Set(["1"]));
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      expect(new Set(await storyOpacities(page))).toEqual(new Set(["1"]));

      const twoColumn = width >= 1024;
      const story = page.locator("[data-about-story] section").first();
      const [text, figure] = await Promise.all([
        story.locator("h2").boundingBox(),
        story.locator("figure").boundingBox(),
      ]);
      expect(figure!.x > text!.x + text!.width).toBe(twoColumn);

      if (width === 360 || width === 1920) {
        await page.screenshot({ path: `pm/screenshots/about-story-${width}.png`, fullPage: true });
      }
    });
  }
});

test.describe("about: Our Story, reduced motion", () => {
  test.use({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });

  test("no fade: every part is visible before and after scrolling", async ({ page }) => {
    await page.goto("/about");
    await page.waitForTimeout(300);
    expect(new Set(await storyOpacities(page))).toEqual(new Set(["1"]));
    await page.locator("[data-about-story] blockquote").scrollIntoViewIfNeeded();
    expect(new Set(await storyOpacities(page))).toEqual(new Set(["1"]));
  });
});

import { expect, test } from "@playwright/test";

import { aapcCourses } from "@/data/courses";
import { whyRegister } from "@/content/home";

// Course packages and "Why register" (client text, 2026-09-30).

const coursePaths = {
  cpc: "/education/cpc",
  cpb: "/education/cpb",
  "cpc-cpb": "/education/cpc-cpb",
};

test.describe("Package Includes", () => {
  for (const course of aapcCourses) {
    test(`${course.credential}: listed in the hero, no old "What's included"`, async ({ page }) => {
      await page.goto(coursePaths[course.slug]);
      const hero = page.locator("section:has(h1)");
      const pkg = hero.locator("[data-package-includes]");
      await expect(pkg.getByText("Package Includes", { exact: true })).toBeVisible();
      await expect(pkg.locator("li")).toHaveText(course.packageIncludes);
      await expect(page.getByRole("heading", { name: "What's included" })).toHaveCount(0);
    });
  }

  test("AAPC page: each card lists its package under the price note", async ({ page }) => {
    await page.goto("/education/aapc-certification-pakistan");
    for (const course of aapcCourses) {
      const card = page.locator("article", { has: page.getByText(course.title, { exact: true }) });
      await expect(card.locator("[data-package-includes] li")).toHaveText(course.packageIncludes);
    }
  });

  test("comparison table: one row per package item, old rows gone", async ({ page }) => {
    await page.goto("/education/aapc-certification-pakistan");
    const table = page.locator("#compare table");
    for (const label of [
      "Training",
      "Blackboard access",
      "Certification exam(s)",
      "AAPC membership",
      "Books",
    ]) {
      await expect(table.getByRole("rowheader", { name: label, exact: true })).toHaveCount(1);
    }
    await expect(table.getByRole("row", { name: /CPC exam with two attempts/ })).toHaveCount(1);
  });

  test("no page mentions the old package items", async ({ page }) => {
    for (const path of [
      "/",
      "/education/aapc-certification-pakistan",
      ...Object.values(coursePaths),
      "/faq",
    ]) {
      await page.goto(path);
      const text = await page.locator("main").innerText();
      for (const old of [
        /Practicode/i,
        /Codify/i,
        /practice tests/i,
        /Denials Management/i,
        /1\/2 off/i,
        /two-year/i,
      ]) {
        expect(text, `${path} mentions ${old}`).not.toMatch(old);
      }
    }
  });
});

test("home: Why register through GlobalMed Transcriptions?", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const section = page.locator("#why-register");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(whyRegister.title);
  await expect(section.getByText(whyRegister.intro)).toBeVisible();
  const cards = section.locator("li");
  await expect(cards).toHaveCount(5);
  for (const [i, point] of whyRegister.points.entries()) {
    await expect(cards.nth(i)).toHaveText(`${point.lead} — ${point.rest}`);
  }
  await expect(section.getByText(whyRegister.tagline)).toBeVisible();
  await expect(section.getByText(whyRegister.closing)).toBeVisible();
  await expect(section.getByRole("link", { name: /Register Now/ })).toHaveAttribute(
    "href",
    /#register$/,
  );
  await expect(section.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute(
    "href",
    "https://wa.me/923004198760",
  );
  // 3 + 2: the second row is centred under the first, and all cards are the same height.
  const boxes = await Promise.all([0, 1, 2, 3, 4].map((i) => cards.nth(i).boundingBox()));
  expect(Math.abs(boxes[3]!.y - boxes[4]!.y)).toBeLessThan(1);
  expect(boxes[3]!.y).toBeGreaterThan(boxes[0]!.y);
  const left = boxes[3]!.x - boxes[0]!.x;
  const right = boxes[2]!.x + boxes[2]!.width - (boxes[4]!.x + boxes[4]!.width);
  expect(Math.abs(left - right)).toBeLessThan(2);
  expect(new Set(boxes.map((b) => Math.round(b!.height))).size).toBe(1);
});

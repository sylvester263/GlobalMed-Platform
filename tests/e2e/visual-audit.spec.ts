import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Every public page type at the CLAUDE.md breakpoints (no horizontal scroll) plus an axe
 * scan (docs/13 §1). Key templates are also screenshotted into design-system/screens/.
 * Run: `npm run test:e2e -- visual-audit`.
 */
const pages = [
  { path: "/", name: "home" },
  { path: "/services", name: "services" },
  { path: "/services/medical-coding", name: "service-coding" },
  { path: "/services/denial-management", name: "service-denials" },
  { path: "/specialties", name: "specialties" },
  { path: "/specialties/cardiology", name: "specialty-cardiology" },
  { path: "/free-billing-audit", name: "audit" },
  { path: "/free-billing-audit/thank-you", name: "audit-thanks" },
  { path: "/school", name: "school" },
  { path: "/school/courses", name: "catalog" },
  { path: "/school/courses?level=intermediate&category=coding", name: "catalog-filtered" },
  { path: "/school/courses/medical-coding-foundations", name: "course" },
  { path: "/school/pathways", name: "pathways" },
  { path: "/school/pathways/billing-and-coding-career", name: "pathway" },
  { path: "/school/exam-prep", name: "exam-prep" },
  { path: "/school/batches", name: "batches" },
  { path: "/school/corporate-training", name: "corporate" },
  { path: "/blog", name: "blog" },
  { path: "/blog/category/coding", name: "blog-category" },
  { path: "/blog/why-claims-get-denied", name: "post" },
  { path: "/about", name: "about" },
  { path: "/about/team", name: "team" },
  { path: "/careers", name: "careers" },
  { path: "/contact", name: "contact" },
  { path: "/faq", name: "faq" },
  { path: "/resources/guides", name: "guides" },
  { path: "/legal/privacy", name: "legal" },
  { path: "/verify", name: "verify" },
  { path: "/verify/7F3A9C21B04D", name: "verify-result" },
  { path: "/newsletter/confirm", name: "newsletter-confirm" },
  { path: "/login", name: "login" },
  { path: "/does-not-exist", name: "not-found" },
  { path: "/styleguide", name: "styleguide" },
];

// Full-page screenshots are slow, so only the key templates get them.
const screenshotted = new Set([
  "home",
  "service-coding",
  "audit",
  "school",
  "catalog",
  "course",
  "post",
  "contact",
  "verify-result",
]);
const widths = [360, 768, 1280];

for (const { path, name } of pages) {
  test.describe(name, () => {
    for (const width of widths) {
      test(`renders at ${width}px without horizontal scroll`, async ({ page }) => {
        // Reduced motion renders every animation in its final state, so screens are deterministic.
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
        if (screenshotted.has(name)) {
          await page.screenshot({
            path: `design-system/screens/${name}-${width}.png`,
            fullPage: true,
            animations: "disabled",
          });
        }
      });
    }

    test("has no serious or critical axe violations", async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(
        blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
      ).toEqual([]);
    });
  });
}

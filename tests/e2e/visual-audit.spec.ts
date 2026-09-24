import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Screenshots at the CLAUDE.md breakpoints plus an axe scan (docs/13 §1).
 * Run: `npm run test:e2e -- visual-audit`. Screens land in design-system/screens/.
 */
const pages = [
  { path: "/", name: "home" },
  { path: "/styleguide", name: "styleguide" },
  { path: "/styleguide/screens/home", name: "screen-home" },
  { path: "/styleguide/screens/course", name: "screen-course" },
  { path: "/styleguide/screens/student", name: "screen-student" },
  { path: "/styleguide/screens/admin", name: "screen-admin" },
];
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
        await page.screenshot({
          path: `design-system/screens/${name}-${width}.png`,
          fullPage: true,
          animations: "disabled",
        });
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

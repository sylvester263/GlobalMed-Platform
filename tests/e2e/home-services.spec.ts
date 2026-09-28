import { expect, test, type Page } from "@playwright/test";

// "Our Services" sticky stacking cards on the home page (client, 2026-09-28).

const titles = [
  "Medical Transcription",
  "AI-Powered Clinical Documentation",
  "Revenue Cycle Management (RCM)",
  "AAPC Certifications: CPC® and CPB®",
];

async function servicesRange(page: Page) {
  return page.locator("#services").evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
  });
}

/** Every card's heading must be the topmost element at some point while scrolling. */
async function headingsSeenOnTop(page: Page, ys: number[]) {
  const seen = new Set<number>();
  for (const y of ys) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
    const onTop = await page.locator("#services article").evaluateAll((articles) =>
      articles.map((a) => {
        const h = a.querySelector("h3")!.getBoundingClientRect();
        const y = h.top + h.height / 2;
        if (y < 70 || y > window.innerHeight) return false;
        return document.elementFromPoint(h.left + 10, y)?.closest("article") === a;
      }),
    );
    onTop.forEach((v, i) => v && seen.add(i));
    // Nothing is ever faded out.
    for (const op of await page
      .locator("#services article")
      .evaluateAll((as) => as.map((a) => getComputedStyle(a).opacity)))
      expect(op).toBe("1");
  }
  return [...seen].sort();
}

test.describe("home services (desktop, motion allowed)", () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: "no-preference" });

  test("sits right after the hero with the client's text, and the old list is hidden", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator("#services");
    await expect(section.getByRole("heading", { level: 2, name: "Our Services" })).toBeVisible();
    await expect(section).toContainText("focus more on what matters most – PATIENT CARE.");
    await expect(
      section.getByRole("link", { name: /Through its strategic partnership with AAPC/ }),
    ).toHaveAttribute("href", "/education/aapc-certification-pakistan");
    for (const title of titles) {
      await expect(section.getByRole("heading", { level: 3, name: title })).toBeAttached();
    }
    // The closing line of card 2 is bold.
    await expect(
      section.locator("p.font-semibold", { hasText: "Partner with GlobalMed for medical" }),
    ).toHaveCount(1);
    // Directly after the hero slider.
    const afterHero = await section.evaluate(
      (el) => el.previousElementSibling?.querySelector('[aria-label="Slide 1 of 3"]') !== null,
    );
    expect(afterHero).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Medical billing services for US practices" }),
    ).toHaveCount(0);
  });

  test("cards stack, scale and stay readable scrolling down and up", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#services article");
    await expect(cards).toHaveCount(4);
    await expect
      .poll(() => cards.first().evaluate((a) => getComputedStyle(a.parentElement!).position))
      .toBe("sticky");

    const { top, bottom } = await servicesRange(page);
    const down: number[] = [];
    for (let y = top - 800; y <= bottom; y += 120) down.push(y);
    expect(await headingsSeenOnTop(page, down)).toEqual([0, 1, 2, 3]);
    expect(await headingsSeenOnTop(page, [...down].reverse())).toEqual([0, 1, 2, 3]);

    // Fully stacked: earlier cards are scaled down, never below 0.88.
    await page.evaluate((y) => window.scrollTo(0, y), bottom - 900);
    const scales = await cards.evaluateAll((as) =>
      as.map((a) => new DOMMatrix(getComputedStyle(a).transform).a),
    );
    expect(scales[0]).toBeLessThan(1);
    for (const s of scales) expect(s).toBeGreaterThanOrEqual(0.88);

    // No clipping or transformed ancestor above the sticky cards.
    const offenders = await cards.first().evaluate((a) => {
      const bad: string[] = [];
      for (let el = a.parentElement?.parentElement; el; el = el.parentElement) {
        const s = getComputedStyle(el);
        if (s.transform !== "none" || /hidden|auto|clip|scroll/.test(s.overflowX + s.overflowY))
          bad.push(el.tagName);
      }
      return bad;
    });
    expect(offenders).toEqual([]);
  });
});

test.describe("home services (phone and reduced motion)", () => {
  for (const [name, options] of [
    ["360px", { viewport: { width: 360, height: 740 }, reducedMotion: "no-preference" }],
    ["reduced motion", { viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" }],
  ] as const) {
    test.describe(name, () => {
      test.use(options);

      test("plain stacked cards, no sticky and no scaling", async ({ page }) => {
        await page.goto("/");
        const cards = page.locator("#services article");
        await expect(cards).toHaveCount(4);
        const { top, bottom } = await servicesRange(page);
        for (let y = top; y <= bottom; y += 400) {
          await page.evaluate((y) => window.scrollTo(0, y), y);
          const state = await cards.evaluateAll((as) =>
            as.map((a) => ({
              pos: getComputedStyle(a.parentElement!).position,
              transform: getComputedStyle(a).transform,
            })),
          );
          for (const s of state) {
            expect(s.pos).not.toBe("sticky");
            expect(s.transform).toBe("none");
          }
        }
        for (const card of await cards.all()) {
          await card.scrollIntoViewIfNeeded();
          await expect(card).toBeVisible();
        }
      });
    });
  }
});

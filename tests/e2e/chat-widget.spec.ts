import { expect, test, type Page } from "@playwright/test";

/**
 * Website chat (Phase 7A, docs/09).
 * - "widget" tests run against the production build (`next start`): the panel, its links,
 *   keyboard behaviour, and failing closed while the database / bot-check keys are missing.
 * - "conversation" tests need the local dry run (FORMS_DRY_RUN=true on `next dev`):
 *     FORMS_DRY_RUN=true npx next dev -p 3200
 *     E2E_CHAT_DRY_RUN=1 E2E_BASE_URL=http://localhost:3200 npx playwright test chat-widget
 * - "inbox" needs a linked Supabase project with a sales user (E2E_SUPABASE=1, E2E_SALES_EMAIL,
 *   E2E_SALES_PASSWORD): the handed-off chat appears in the Sales inbox and the agent's reply
 *   shows in the widget.
 */

async function openChat(page: Page) {
  await page.getByRole("button", { name: "Help and support" }).click();
  const dialog = page.getByRole("dialog", { name: "GlobalMed assistant" });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function ask(page: Page, text: string) {
  const dialog = page.getByRole("dialog", { name: "GlobalMed assistant" });
  await dialog.getByRole("textbox", { name: "Your message" }).fill(text);
  await dialog.getByRole("button", { name: "Send message" }).click();
}

test.describe("chat widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("gm-chat"));
  });

  test("opens from the help button with the greeting, note, quick replies and links", async ({
    page,
  }) => {
    const dialog = await openChat(page);
    await expect(dialog.getByRole("textbox", { name: "Your message" })).toBeFocused();
    await expect(dialog).toContainText("Please don't share patient information.");
    await expect(dialog.getByRole("log", { name: "Chat messages" })).toContainText(
      "GlobalMed's assistant",
    );
    const replies = dialog.getByRole("group", { name: "Suggested replies" }).getByRole("button");
    await expect(replies).toHaveText([
      "CPC® / CPB® courses",
      "Billing & transcription services",
      "Talk to a person",
    ]);
    await expect(dialog.getByRole("link", { name: /Continue on WhatsApp/ })).toHaveAttribute(
      "href",
      "https://wa.me/923004198760",
    );
    await expect(dialog.getByRole("link", { name: /Call/ })).toHaveAttribute(
      "href",
      "tel:+924235946342",
    );
    await expect(dialog.getByRole("link", { name: /Email/ })).toHaveAttribute(
      "href",
      "mailto:info@globalmedtranscriptions.com",
    );
  });

  test("keeps focus inside, closes with Escape and returns focus to the button", async ({
    page,
  }) => {
    const dialog = await openChat(page);
    for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Help and support" })).toBeFocused();
  });

  test("fits a 360px screen", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    const dialog = await openChat(page);
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(360);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      360,
    );
  });

  test("the chat code isn't loaded until the first click", async ({ page }) => {
    const chatChunks: string[] = [];
    page.on("request", (req) => {
      if (/chat-widget|api\/chat/.test(req.url())) chatChunks.push(req.url());
    });
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    expect(chatChunks.filter((u) => u.includes("api/chat"))).toHaveLength(0);
    await openChat(page);
    await expect.poll(() => chatChunks.some((u) => u.includes("api/chat/config"))).toBe(true);
  });

  test("fails closed in production while the chat keys aren't set", async ({ page }) => {
    test.skip(Boolean(process.env.E2E_CHAT_DRY_RUN), "dry run answers instead");
    await openChat(page);
    await ask(page, "How much is the CPC course?");
    await expect(page.getByRole("log", { name: "Chat messages" })).toContainText(
      /isn't available right now|couldn't confirm you're not a robot/,
    );
  });
});

test.describe("chat conversation (local dry run)", () => {
  test.skip(!process.env.E2E_CHAT_DRY_RUN, "needs FORMS_DRY_RUN on next dev");
  // `next dev` compiles the chat route on first use.
  test.use({ actionTimeout: 20_000 });
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("gm-chat"));
  });

  test("answers the CPC® price from the site data", async ({ page }) => {
    await openChat(page);
    await ask(page, "How much does the CPC course cost?");
    const log = page.getByRole("log", { name: "Chat messages" });
    await expect(log).toContainText("USD 1,050", { timeout: 30_000 });
    await expect(log).toContainText("16 weeks");
    await expect(
      page.getByRole("group", { name: "Suggested replies" }).getByRole("button", {
        name: "Have the team contact me about a course",
      }),
    ).toBeVisible();
  });

  test("refuses patient information without repeating it", async ({ page }) => {
    await openChat(page);
    await ask(page, "My patient John Smith DOB 01/02/1960 needs coding help");
    const log = page.getByRole("log", { name: "Chat messages" });
    await expect(log).toContainText("Please don't share patient information here");
  });

  test("talk to a person → handoff, lead capture, and the agent's reply appears", async ({
    page,
    request,
  }) => {
    const dialog = await openChat(page);
    await dialog.getByRole("button", { name: "Talk to a person" }).click();
    const log = page.getByRole("log", { name: "Chat messages" });
    await expect(log).toContainText("asked a member of our team");
    await expect(dialog).toContainText("A member of our team will reply here");
    await ask(page, "Ayesha Khan");
    await expect(log).toContainText("email address or WhatsApp");
    await ask(page, "ayesha@example.com");
    await expect(log).toContainText(
      "A member of our team will reply here, or contact you directly",
    );

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("gm-chat") ?? "{}"));
    expect(saved.status).toBe("handoff");
    const res = await request.post("/api/chat/test-agent-reply", {
      data: {
        conversationId: saved.conversationId,
        message: "Hi Ayesha, this is Sara from GlobalMed.",
      },
    });
    expect(res.ok()).toBe(true);
    await expect(log).toContainText("Hi Ayesha, this is Sara from GlobalMed.", { timeout: 15_000 });
    await expect(log).toContainText("GlobalMed team");
  });

  test("course lead capture from the quick reply", async ({ page }) => {
    await openChat(page);
    await ask(page, "What are the course fees?");
    await page.getByRole("button", { name: "Have the team contact me about a course" }).click();
    await ask(page, "Bilal");
    await ask(page, "+92 300 1234567");
    await expect(page.getByRole("log", { name: "Chat messages" })).toContainText(
      "Our team will contact you about the AAPC course",
    );
  });
});

test.describe("sales inbox (needs Supabase)", () => {
  test.skip(!process.env.E2E_SUPABASE, "needs a linked Supabase project and a sales user");

  test("a handed-off chat appears in the inbox and the agent reply shows in the widget", async ({
    browser,
  }) => {
    const visitor = await browser.newPage();
    await visitor.goto("/");
    await openChat(visitor);
    await visitor.getByRole("button", { name: "Talk to a person" }).click();
    await expect(visitor.getByRole("log", { name: "Chat messages" })).toContainText(
      "asked a member of our team",
    );

    const agent = await browser.newPage();
    await agent.goto("/login?next=/dashboard/sales/inbox");
    await agent.getByLabel("Email").fill(process.env.E2E_SALES_EMAIL ?? "");
    await agent.getByLabel("Password").fill(process.env.E2E_SALES_PASSWORD ?? "");
    await agent.getByRole("button", { name: /log in|sign in/i }).click();
    await agent.getByRole("link", { name: "Talk to a person" }).first().click();
    await agent.getByLabel("Reply").fill("Hello from the Sales team.");
    await agent.getByRole("button", { name: "Send reply" }).click();

    await expect(visitor.getByRole("log", { name: "Chat messages" })).toContainText(
      "Hello from the Sales team.",
      { timeout: 15_000 },
    );
  });
});

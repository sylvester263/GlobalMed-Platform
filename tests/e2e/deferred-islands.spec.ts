import { expect, test } from "@playwright/test";

// Deferred code (2026-10-01 performance work): these load on first use or near the screen,
// and must behave exactly as before.

// Since Phase 7A (2026-10-01) the help button opens the chat panel (features.chatbotWidget);
// the panel keeps the WhatsApp, call and email links of the old menu.
test("help button opens the chat on the first click and closes with Escape", async ({ page }) => {
  await page.goto("/about");
  const button = page.getByRole("button", { name: "Help and support" });
  await button.click();
  const panel = page.getByRole("dialog", { name: "GlobalMed assistant" });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("link", { name: /Continue on WhatsApp/ })).toHaveAttribute(
    "href",
    "https://wa.me/923004198760",
  );
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.getByRole("button", { name: "Help and support" })).toBeFocused();
});

test("help button opens with the keyboard", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("button", { name: "Help and support" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "GlobalMed assistant" })).toBeVisible();
});

test("registration form works once it is on screen", async ({ page }) => {
  await page.goto("/education/cpc");
  const form = page.locator("#register form");
  await form.scrollIntoViewIfNeeded();
  await form.getByRole("button", { name: "Register Now" }).click();
  // Client-side validation (react-hook-form + zod) is running: empty fields are marked invalid.
  await expect(form.getByLabel(/Full name/)).toHaveAttribute("aria-invalid", "true");
});

test("the slider controls work after load", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("load");
  await page
    .getByRole("button", { name: /slide 2/i })
    .first()
    .click();
  await expect(page.locator(".hero-slide[data-active]")).toHaveAttribute(
    "aria-label",
    "Slide 2 of 3",
  );
});

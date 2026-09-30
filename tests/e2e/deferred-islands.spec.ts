import { expect, test } from "@playwright/test";

// Deferred code (2026-10-01 performance work): these load on first use or near the screen,
// and must behave exactly as before.

test("help button opens its menu on the first click and closes with Escape", async ({ page }) => {
  await page.goto("/about");
  const button = page.getByRole("button", { name: "Help and support" });
  await button.click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: /Chat on WhatsApp/ })).toHaveAttribute(
    "href",
    "https://wa.me/923004198760",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Help and support" })).toBeFocused();
});

test("help button opens with the keyboard", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("button", { name: "Help and support" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menu")).toBeVisible();
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

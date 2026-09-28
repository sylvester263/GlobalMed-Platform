import { expect, test } from "@playwright/test";

// "Register for AAPC Training": Address replaces City (client, 2026-09-28).

test.describe("AAPC registration form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/education/aapc-certification-pakistan#register");
    await page.waitForLoadState("networkidle");
  });

  test("shows Address (2-row textarea, 250 max) and no City field", async ({ page }) => {
    const form = page.locator("form", { has: page.getByLabel(/^WhatsApp number/) });
    await expect(form.getByLabel("City")).toHaveCount(0);
    const address = form.getByLabel(/^Address/);
    await expect(address).toBeVisible();
    await expect(address).toHaveAttribute("rows", "2");
    await expect(address).toHaveAttribute("maxlength", "250");
    await expect(address).toHaveAttribute("placeholder", "House / street, area, city");
    await expect(address).toHaveAttribute("required", "");
    await expect(form.getByText("0/250 characters")).toBeVisible();
  });

  test("explains what to fix when the address is too short", async ({ page }) => {
    const form = page.locator("form", { has: page.getByLabel(/^WhatsApp number/) });
    await form.getByLabel(/^Full name/).fill("Ayesha Khan");
    await form.getByLabel(/^Email/).fill("ayesha@example.com");
    await form.getByLabel(/^WhatsApp number/).fill("+92 300 1234567");
    // Trimmed, "Lahore" is under 10 characters: the error shows when the field is left.
    await form.getByLabel(/^Address/).fill("  Lahore  ");
    await form.getByLabel(/^Address/).press("Tab");
    const error = form.getByText(/Enter your full address: house or street, area and city/);
    await expect(error).toBeVisible();

    await form.getByLabel(/^Course/).selectOption("CPC®");
    await form.getByLabel(/^Current background/).selectOption("Graduate");
    await form.getByLabel(/^Preferred contact time/).selectOption("Any time");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Register Now" }).click();

    // Submitting moves focus to the field to fix.
    await expect(error).toBeVisible();
    await expect(form.getByLabel(/^Address/)).toBeFocused();

    // A valid address clears the error. `next start` is production and Turnstile isn't
    // configured, so the server then refuses rather than silently accepting (docs/11 §4).
    await form.getByLabel(/^Address/).fill("House 12, Street 4, Model Town, Lahore");
    await expect(form.getByText("38/250 characters")).toBeVisible();
    await form.getByRole("button", { name: "Register Now" }).click();
    await expect(form.locator("[data-slot=alert]")).toContainText(/robot/i);
  });
});

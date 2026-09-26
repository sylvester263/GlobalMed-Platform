import { expect, test } from "@playwright/test";

import { features } from "@/config/features";

/**
 * Phase 3 auth checks that don't need a live Supabase project. Full sign-up → verify →
 * login → role-routing flows run once staging Supabase exists (docs/13 §1 E2E).
 */
test.describe("protected routes fail closed", () => {
  // The student area redirects to the AAPC page while the learning platform is hidden.
  for (const path of [
    "/dashboard",
    ...(features.learningPlatform ? ["/dashboard/student"] : []),
    "/dashboard/admin/users",
    "/dashboard/account",
  ]) {
    test(`${path} redirects to login and remembers where you were going`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`/login\\?next=${encodeURIComponent(path)}`));
      await expect(page.getByRole("heading", { name: "Log in to GlobalMed" })).toBeVisible();
    });
  }
});

test.describe("auth pages", () => {
  test("login explains accounts aren't open yet when Supabase is not configured", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(
      page.getByText(
        features.learningPlatform ? "Student accounts open soon" : "Sign-in is for GlobalMed staff",
      ),
    ).toBeVisible();
    await page.getByLabel(/^Email/).fill("person@example.com");
    await page.getByLabel(/^Password/).fill("not-a-real-password");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.locator("[data-slot=alert]").last()).toContainText("aren't available yet");
  });

  test("password field can be revealed and hidden", async ({ page }) => {
    await page.goto("/login");
    const password = page.getByLabel(/^Password/);
    await password.fill("secret-value");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(password).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(password).toHaveAttribute("type", "password");
  });

  test("sign-up from a course returns to that course's checkout", async ({ page }) => {
    test.skip(!features.learningPlatform, "Student sign-up is hidden (ADR-026)");
    await page.goto("/signup?course=cpc-exam-preparation");
    await expect(page.getByText(/come back to CPC Exam Preparation/)).toBeVisible();
    await expect(page.locator('input[name="next"]').first()).toHaveValue(
      "/dashboard/student/checkout/cpc-exam-preparation",
    );
  });

  test("an off-site next parameter is ignored", async ({ page }) => {
    await page.goto("/login?next=https://evil.example/phish");
    await expect(page.locator('input[name="next"]').first()).toHaveValue("/dashboard");
  });

  test("expired reset link shows a way forward", async ({ page }) => {
    await page.goto("/reset-password/update");
    await expect(page.getByRole("heading", { name: "This reset link has expired" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Request a new link" })).toBeVisible();
  });

  test("bad email links land on login with an explanation", async ({ page }) => {
    await page.goto("/auth/confirm?token_hash=bogus&type=signup");
    await expect(page).toHaveURL(/\/login\?error=link/);
    await expect(page.getByText(/link has expired/)).toBeVisible();
  });
});

test.describe("dashboard shell (sample data)", () => {
  test("collapses the sidebar and opens menus", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/styleguide/screens/dashboard-shell");
    await page.getByRole("button", { name: "Collapse sidebar" }).click();
    await expect(page.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await page.getByRole("button", { name: /Notifications, 1 unread/ }).click();
    await expect(page.getByText("Welcome to GlobalMed")).toBeVisible();
  });

  test("opens the navigation sheet on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/styleguide/screens/dashboard-shell");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("link", { name: "My courses" })).toBeVisible();
  });
});

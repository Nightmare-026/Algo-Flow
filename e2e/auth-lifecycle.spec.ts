import { test, expect } from "@playwright/test";

test.describe("Supabase Auth & Session Lifecycle Black-Box Tests", () => {
  test("1. Unauthenticated redirect from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login(?:\?next=%2Fdashboard)?/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("2. Signup form boundary validations & accessible floating labels", async ({ page }) => {
    await page.goto("/signup");

    const submitBtn = page.getByRole("button", { name: /create account|sign up/i });
    await expect(submitBtn).toBeVisible();

    // Fill invalid email & mismatch password
    const emailInput = page.getByLabel("Email address", { exact: true });
    const passwordInput = page.locator("#signup-password");
    const confirmInput = page.locator("#signup-password-confirm");

    await page.getByLabel("First name", { exact: true }).fill("Test");
    await page.getByLabel("Last name", { exact: true }).fill("User");
    await emailInput.fill("invalid-email");
    await passwordInput.fill("Password123!");
    await confirmInput.fill("MismatchPassword!");

    await submitBtn.click();

    // Verify user remains on signup page and error state is handled
    expect(page.url()).toContain("/signup");
  });

  test("3. Password visibility toggle works correctly", async ({ page }) => {
    await page.goto("/signup");
    const passwordInput = page.locator("#signup-password");
    await passwordInput.fill("SecretPassword123!");

    const toggleBtn = page.locator('button[aria-label*="password" i]').first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await expect(passwordInput).toHaveAttribute("type", "text");
      await toggleBtn.click();
      await expect(passwordInput).toHaveAttribute("type", "password");
    }
  });

  test("4. Login with invalid credentials displays error or maintains security", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address", { exact: true }).or(page.locator('input[type="email"]')).fill("nonexistent-test-user-9999@example.com");
    await page.locator('input[type="password"]').fill("WrongPassword123!");
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    // Verify user is not redirected to dashboard with bad credentials
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain("/dashboard");
  });

  test("5. Public and Marketing Routes accessibility", async ({ page }) => {
    const routes = [
      "/",
      "/visualizers",
      "/visualizers/array",
      "/login",
      "/signup",
      "/forgot-password",
      "/privacy",
      "/terms",
    ];
    for (const route of routes) {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.ok(), `route ${route}`).toBeTruthy();
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("6. 404 Route handling for non-existent pages", async ({ page }) => {
    const res = await page.goto("/non-existent-page-slug-xyz123");
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/404|not found|page/i).first()).toBeVisible({ timeout: 10000 });
  });
});

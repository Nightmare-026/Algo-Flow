import { expect, test } from "@playwright/test";

test("published catalog and bubble-sort visualizer render", async ({ page }) => {
  await page.goto("/visualizers");
  await expect(page).toHaveURL(/\/visualizers$/);
  await expect(page.locator("body")).toContainText("Visualizers");

  const response = await page.goto("/visualizer/bubble-sort");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/visualizer\/bubble-sort$/);
  await expect(page.locator("body")).toContainText("Bubble Sort");
  await expect(page.getByText(/Build Error|Application error/i)).toHaveCount(0);
});

test("protected dashboard redirects anonymous users to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  await expect(page.locator("body")).toContainText(/sign in|log in/i);
});

test("unknown routes use the accessible custom not-found surface", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse visualizers" })).toBeVisible();
});

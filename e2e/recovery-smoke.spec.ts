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

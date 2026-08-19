import { expect, test } from "@playwright/test";
import { algorithms } from "../src/data/seed/algorithms";

const published = algorithms.filter((algorithm) => algorithm.isPublished);

for (const algorithm of published) {
  test(`${algorithm.slug} initializes with a real trace`, async ({ page }) => {
    test.setTimeout(60_000);
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(`/visualizer/${algorithm.slug}`, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.ok(), `route response for ${algorithm.slug}`).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1, name: algorithm.name })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/^Step 1 \/ [1-9]\d*$/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("tab", { name: "Pseudocode" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: "Play visualization" })).toBeEnabled({
      timeout: 15_000,
    });
    await expect(page.getByText(/could not be loaded/i)).toHaveCount(0);
    expect(pageErrors, `uncaught errors for ${algorithm.slug}`).toEqual([]);
    expect(
      consoleErrors.filter((message) => !message.includes("favicon")),
      `console errors for ${algorithm.slug}`
    ).toEqual([]);
  });
}

import { expect, test, type Page } from "@playwright/test";
import { algorithms } from "../src/data/seed/algorithms";

const publishedAlgorithms = algorithms.filter((algorithm) => algorithm.isPublished);

function collectBrowserErrors(page: Page) {
  const errors: string[] = [];

  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`);
    }
  });

  return errors;
}

test("published algorithm inventory remains exactly 105 entries", () => {
  expect(publishedAlgorithms).toHaveLength(105);
});

for (const algorithm of publishedAlgorithms) {
  test(`${algorithm.slug} renders a real visualizer route`, async ({ page }) => {
    const browserErrors = collectBrowserErrors(page);
    const response = await page.goto(`/visualizer/${algorithm.slug}`, {
      waitUntil: "networkidle",
    });

    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toContainText(algorithm.name);
    await expect(
      page.locator('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay'),
    ).toHaveCount(0);
    await expect(page.getByText("Structural Properties", { exact: false })).toHaveCount(0);
    await expect(page.getByText(/Step 0 \/ 0/)).toHaveCount(0);
    expect(browserErrors).toEqual([]);
  });
}

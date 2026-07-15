import { expect, test, type Page } from "@playwright/test";

const viewportWidths = [320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920] as const;
const routes = [
  "/",
  "/visualizers",
  "/visualizer/bubble-sort",
  "/login",
  "/privacy",
  "/terms",
] as const;

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

for (const width of viewportWidths) {
  test(`public routes render without runtime or horizontal-overflow errors at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    const browserErrors = collectBrowserErrors(page);

    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "networkidle" });

      expect(response?.status(), `${route} should return a successful response`).toBeLessThan(400);
      await expect(page.locator("body"), `${route} should render meaningful content`).not.toHaveText("");
      await expect(
        page.locator('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay'),
        `${route} should not display a framework error overlay`,
      ).toHaveCount(0);

      const overflow = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      expect(
        overflow.documentWidth,
        `${route} should not overflow horizontally at ${width}px`,
      ).toBeLessThanOrEqual(overflow.viewportWidth + 1);
    }

    expect(browserErrors, `browser errors recorded at ${width}px`).toEqual([]);
  });
}

for (const width of [390, 768, 1440] as const) {
  test(`capture representative Phase 0 screenshots at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });

    for (const [name, route] of [
      ["home", "/"],
      ["visualizers", "/visualizers"],
      ["bubble-sort", "/visualizer/bubble-sort"],
    ] as const) {
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBeLessThan(400);
      await page.screenshot({
        path: `docs/baseline-screenshots/local-${name}-${width}x${width < 768 ? 844 : 900}.png`,
        fullPage: true,
      });
    }
  });
}

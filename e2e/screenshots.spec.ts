import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

test.skip(!process.env.CAPTURE_SCREENSHOTS, "Run explicitly with CAPTURE_SCREENSHOTS=1");

test("capture live-before and local-after redesign evidence", async ({ page }) => {
  test.setTimeout(240_000);
  const output = path.resolve("docs/frontend-redesign/screenshots");
  await mkdir(output, { recursive: true });

  const capture = async (url: string, filename: string, fullPage = true) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await expect(page.locator("body")).toBeVisible();
    await page.waitForTimeout(700);
    if (new URL(page.url()).pathname === "/") {
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 700) {
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
        await page.waitForTimeout(80);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(output, filename), fullPage });
  };

  await page.setViewportSize({ width: 1440, height: 900 });
  const live = "https://algo-flow-night-sigma.vercel.app";
  const beforeRoutes = [
    ["/", "before-home-desktop.png"],
    ["/visualizers", "before-library-desktop.png"],
    ["/visualizers/array", "before-category-array-desktop.png"],
    ["/visualizer/bubble-sort", "before-visualizer-array-desktop.png"],
    ["/visualizer/sll-traversal", "before-visualizer-linked-list-desktop.png"],
    ["/visualizer/inorder-traversal", "before-visualizer-tree-desktop.png"],
    ["/visualizer/bfs", "before-visualizer-graph-desktop.png"],
    ["/login", "before-login-desktop.png"],
    ["/signup", "before-signup-desktop.png"],
    ["/dashboard", "before-dashboard-guest-redirect.png"],
  ] as const;

  for (const [route, filename] of beforeRoutes) {
    await capture(`${live}${route}`, filename);
  }

  const afterRoutes = [
    ["/", "after-home-desktop.png"],
    ["/visualizers", "after-library-desktop.png"],
    ["/visualizers/array", "after-category-array-desktop.png"],
    ["/visualizer/bubble-sort", "after-visualizer-array-desktop.png"],
    ["/visualizer/sll-traversal", "after-visualizer-linked-list-desktop.png"],
    ["/visualizer/inorder-traversal", "after-visualizer-tree-desktop.png"],
    ["/visualizer/bfs", "after-visualizer-graph-desktop.png"],
    ["/login", "after-login-desktop.png"],
    ["/signup", "after-signup-desktop.png"],
    ["/dashboard", "after-dashboard-guest-redirect.png"],
  ] as const;

  for (const [route, filename] of afterRoutes) {
    await capture(route, filename);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.screenshot({
    path: path.join(output, "after-mobile-navigation.png"),
    fullPage: false,
  });
  await capture("/visualizer/bubble-sort", "after-mobile-visualizer.png", true);
});

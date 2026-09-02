import { test, expect } from "@playwright/test";

test.describe("Visualizer Engine Interactive & Edge-Case Black-Box Tests", () => {
  const targetAlgorithms = [
    { slug: "binary-search", name: "Binary Search" },
    { slug: "bubble-sort", name: "Bubble Sort" },
    { slug: "sll-reverse", name: "Reverse Linked List" },
    { slug: "bst-deletion", name: "BST Deletion" },
    { slug: "linear-probing", name: "Linear Probing" },
    { slug: "array-stack", name: "Array Stack" },
  ];

  for (const algo of targetAlgorithms) {
    test(`Interactive controls & state verification for ${algo.name} (/visualizer/${algo.slug})`, async ({ page }) => {
      await page.goto(`/visualizer/${algo.slug}`, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1, name: algo.name })).toBeVisible({ timeout: 15000 });

      // 1. Check Initial Step Counter
      const stepCounter = page.getByText(/^Step 1 \/ [1-9]\d*$/);
      await expect(stepCounter).toBeVisible({ timeout: 10000 });

      // 2. Step Forward
      const nextBtn = page.getByRole("button", { name: "Next step" });
      if (await nextBtn.isEnabled()) {
        await nextBtn.press("Enter");
        await expect(page.getByText(/^Step 2 \/ (?:[2-9]|\d{2,})$/)).toBeVisible({ timeout: 5000 });
      }

      // 3. Step Backward
      const prevBtn = page.getByRole("button", { name: "Previous step" });
      if (await prevBtn.isEnabled()) {
        await prevBtn.press("Enter");
        await expect(stepCounter).toBeVisible({ timeout: 5000 });
      }

      // 4. Play & Pause
      const playBtn = page.getByRole("button", { name: "Play visualization" });
      if (await playBtn.isEnabled()) {
        await playBtn.press("Enter");
        await page.waitForTimeout(600);
        const pauseBtn = page.getByRole("button", { name: /pause/i }).first();
        if (await pauseBtn.isVisible()) {
          await pauseBtn.press("Enter");
        }
      }

      // 5. Code Tab & Pseudocode Verification
      const codeTab = page.getByRole("tab", { name: "Code", exact: true });
      if (await codeTab.isVisible()) {
        await codeTab.click({ force: true });
        await expect(page.locator(".is-active-code-line").first()).toBeVisible({ timeout: 10000 });

        // Switch to pseudocode tab
        const pseudocodeTab = page.getByRole("tab", { name: "Pseudocode", exact: true });
        if (await pseudocodeTab.isVisible()) {
          await pseudocodeTab.click({ force: true });
          await expect(page.locator('[data-pseudocode-line]').first()).toBeVisible({ timeout: 10000 });
        }
      }

      // 6. Reset Visualizer
      const restartBtn = page.getByRole("button", { name: "Restart from the first step" });
      if (await restartBtn.isEnabled()) {
        await restartBtn.press("Enter");
        await expect(stepCounter).toBeVisible({ timeout: 5000 });
      }
    });
  }

  test("Continuous playback advances multiple steps automatically", async ({ page }) => {
    await page.goto("/visualizer/bubble-sort", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/^Step 1 \/ [1-9]\d*$/)).toBeVisible({ timeout: 15000 });

    // Set fast speed (2x) so it plays quickly
    await page.getByRole("button", { name: "Set speed to 2.0x" }).click();

    // Start playback
    const playBtn = page.getByRole("button", { name: "Play visualization" });
    await playBtn.press("Enter");

    // Expect step counter to advance past step 1 to step 2, 3, 4
    await expect(page.getByText(/^Step [3-9] \/ \d+$/).or(page.getByText(/^Step [1-9]\d+ \/ \d+$/))).toBeVisible({ timeout: 10000 });

    // Pause playback
    const pauseBtn = page.getByRole("button", { name: "Pause playback" });
    await pauseBtn.press("Enter");
  });

  test("Responsive Canvas and Controls at 390px (Mobile) and 768px (Tablet)", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/visualizer/binary-search", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1, name: "Binary Search" })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("button", { name: "Play visualization" })).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/visualizer/bubble-sort", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1, name: "Bubble Sort" })).toBeVisible({ timeout: 15000 });
  });
});


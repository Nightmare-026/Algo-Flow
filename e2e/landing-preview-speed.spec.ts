import { expect, test } from "@playwright/test";

test.describe("Landing Workbench Preview and Speed Control E2E Tests", () => {
  test("landing workbench preview executes multi-pass trace without freezing", async ({ page }) => {
    test.setTimeout(45_000);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const stepBadge = page.getByText(/^Step \d+\/\d+$/);
    await expect(stepBadge).toBeVisible({ timeout: 15_000 });

    const playButton = page.getByRole("button", { name: "Play Trace" });
    await expect(playButton).toBeVisible();
    await playButton.click();

    // The trace must proceed beyond its first pass and complete the final sorted state.
    await expect
      .poll(
        async () => {
          const text = await stepBadge.innerText();
          const match = text.match(/Step (\d+)\/\d+/);
          return match ? parseInt(match[1], 10) : 0;
        },
        { timeout: 25_000, intervals: [500] }
      )
      .toBeGreaterThan(2);

    await expect
      .poll(
        async () => {
          const text = await stepBadge.innerText();
          const match = text.match(/Step (\d+)\/(\d+)/);
          return match && match[1] === match[2];
        },
        { timeout: 25_000, intervals: [500] }
      )
      .toBe(true);

    await expect(page.getByText("Bubble Sort: Array Sorted")).toBeVisible();

    // Pause playback
    const pauseButton = page.getByRole("button", { name: "Pause" });
    if (await pauseButton.isVisible()) {
      await pauseButton.click();
    }
  });

  test("landing workbench offers a manual, keyboard-accessible fallback for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Manual Mode" })).toBeDisabled();
    const next = page.getByRole("button", { name: "Next preview step" });
    await next.focus();
    await next.press("Enter");
    await expect(page.getByText(/^Step 2\/\d+$/)).toBeVisible();
  });

  test("visualizer workbench supports 0.25x, 0.5x, 0.75x, 1.0x, 2.0x speeds", async ({ page }) => {
    await page.goto("/visualizer/access-by-index", { waitUntil: "domcontentloaded" });

    const speedGroup = page.getByRole("group", { name: "Playback speed" });
    await expect(speedGroup).toBeVisible({ timeout: 15_000 });

    for (const label of ["0.25x", "0.5x", "0.75x", "1.0x", "2.0x"]) {
      const button = speedGroup.getByRole("button", { name: `Set speed to ${label}` });
      await expect(button).toBeVisible();
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
    }
  });
});

import { expect, test } from "@playwright/test";
import { algorithms } from "../src/data/seed/algorithms";

const familySamples = new Map<string, (typeof algorithms)[number]>();
for (const algorithm of algorithms.filter((entry) => entry.isPublished)) {
  if (!familySamples.has(algorithm.dataStructureId)) {
    familySamples.set(algorithm.dataStructureId, algorithm);
  }
}

test("public routes and protected dashboard behavior", async ({ page }) => {
  test.setTimeout(90_000);
  for (const route of [
    "/",
    "/visualizers",
    "/visualizers/array",
    "/login",
    "/signup",
    "/forgot-password",
    "/privacy",
    "/terms",
  ]) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.ok(), route).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  }

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});

test("each data-structure family supports playback navigation and synchronized panels", async ({
  page,
}) => {
  test.setTimeout(180_000);
  for (const algorithm of familySamples.values()) {
    await page.goto(`/visualizer/${algorithm.slug}`, { waitUntil: "domcontentloaded" });
    const stepLabel = page.getByText(/^Step 1 \/ [1-9]\d*$/);
    await expect(stepLabel).toBeVisible({ timeout: 15_000 });

    const next = page.getByRole("button", { name: "Next step" });
    if (await next.isEnabled()) {
      await next.click();
      await expect(page.getByText(/^Step 2 \/ (?:[2-9]|\d{2,})$/)).toBeVisible();
      await page.getByRole("button", { name: "Restart from the first step" }).press("Enter");
      await expect(stepLabel).toBeVisible({ timeout: 15_000 });
    }

    await page.getByRole("tab", { name: "Code", exact: true }).click();
    await expect(page.locator(".is-active-code-line")).toHaveCount(1, { timeout: 15_000 });
    await page.getByRole("tab", { name: "Step Log", exact: true }).click();
    await expect(page.locator('[aria-current="step"]').last()).toBeVisible();
  }
});

test("landing, library, auth, and visualizer remain usable on mobile", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: /menu/i }).click();
  await expect(
    page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Visualizers" })
  ).toBeVisible();

  await page.goto("/visualizers");
  await expect(page.getByRole("searchbox")).toBeVisible();

  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();

  const sample = familySamples.values().next().value;
  expect(sample).toBeDefined();
  await page.goto(`/visualizer/${sample!.slug}`);
  await expect(page.getByText(/^Step 1 \/ [1-9]\d*$/)).toBeVisible();
  await expect(page.locator('[data-pseudocode-line][aria-current="step"]')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
});

test("auth fields use accessible in-field labels without visible examples", async ({ page }) => {
  await page.goto("/signup");

  const firstName = page.getByLabel("First name", { exact: true });
  const firstNameLabel = page.locator('label[for="signup-first-name"]');
  const gender = page.getByLabel("Gender", { exact: true });

  await expect(firstName).toBeVisible();
  await expect(page.getByLabel("Last name", { exact: true })).toBeVisible();
  await expect(gender).toBeVisible();
  await expect(page.getByLabel("Email address", { exact: true })).toBeVisible();
  await expect(page.locator("#signup-password")).toHaveAttribute("placeholder", " ");
  await expect(page.locator("#signup-password-confirm")).toHaveAttribute("placeholder", " ");
  await expect(firstName).toHaveAttribute("placeholder", " ");
  await expect(
    page.locator(
      '[placeholder="Ada"], [placeholder="Lovelace"], [placeholder="name@example.com"], [placeholder="Create a password"], [placeholder="Enter the password again"]'
    )
  ).toHaveCount(0);

  const inputBox = await firstName.boundingBox();
  const restingLabelBox = await firstNameLabel.boundingBox();
  expect(inputBox).not.toBeNull();
  expect(restingLabelBox).not.toBeNull();
  expect(
    Math.abs(
      restingLabelBox!.y + restingLabelBox!.height / 2 - (inputBox!.y + inputBox!.height / 2)
    )
  ).toBeLessThan(5);

  await firstName.focus();
  await expect
    .poll(async () => {
      const labelBox = await firstNameLabel.boundingBox();
      return labelBox ? labelBox.y - inputBox!.y : Number.POSITIVE_INFINITY;
    })
    .toBeLessThan(16);

  await firstName.fill("Ada");
  await firstName.press("Tab");
  await expect(firstName).toHaveValue("Ada");
  await gender.selectOption("Female");
  await expect(gender).toHaveValue("female");
});

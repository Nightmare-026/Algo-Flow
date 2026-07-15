import { expect, test, type Page } from "@playwright/test";

async function activeCodeLines(page: Page) {
  return page.locator(".shiki .line").evaluateAll((lines) =>
    lines.flatMap((line, index) =>
      line.classList.contains("border-primary") ? [index + 1] : [],
    ),
  );
}

test("authored access mapping highlights its one-line implementation", async ({
  page,
}) => {
  await page.goto("/visualizer/access", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Code", exact: true }).click();

  await expect(page.locator(".shiki")).toBeVisible();
  await expect.poll(() => activeCodeLines(page)).toEqual([1]);
});

test("traversal mapping follows logical steps across language tabs", async ({
  page,
}) => {
  await page.goto("/visualizer/forward-traversal", {
    waitUntil: "networkidle",
  });
  await page.getByRole("button", { name: "Code", exact: true }).click();

  await expect.poll(() => activeCodeLines(page)).toEqual([1]);
  await page.getByTitle("Next Step").click();
  await expect.poll(() => activeCodeLines(page)).toEqual([2]);

  await page.getByRole("button", { name: "Python", exact: true }).click();
  await expect.poll(() => activeCodeLines(page)).toEqual([2]);
});

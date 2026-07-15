import { expect, test } from "@playwright/test";

const seedRoutes = [
  "/",
  "/visualizers",
  "/visualizer/bubble-sort",
  "/login",
  "/signup",
  "/privacy",
  "/terms",
] as const;

test("internal links on major public routes resolve without 4xx/5xx responses", async ({ page }) => {
  const hrefs = new Set<string>(seedRoutes);

  for (const route of seedRoutes) {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status(), `${route} should load`).toBeLessThan(400);

    const routeHrefs = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute("href"))
        .filter((href): href is string => Boolean(href))
        .filter((href) => href.startsWith("/") && !href.startsWith("//")),
    );
    routeHrefs.forEach((href) => {
      const normalizedHref = href.split("#", 1)[0];
      if (normalizedHref) hrefs.add(normalizedHref);
    });
  }

  for (const href of hrefs) {
    const response = await page.goto(href, { waitUntil: "domcontentloaded" });
    expect(response, `${href} should produce a navigation response`).not.toBeNull();
    expect(response!.status(), `${href} should not be a dead internal link`).toBeLessThan(400);
  }
});

import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/visualizers",
  "/visualizers/array",
  "/visualizer/bubble-sort",
  "/login",
  "/signup",
  "/forgot-password",
  "/privacy",
  "/terms",
];

test("critical routes expose semantic names, labels, headings, and no horizontal overflow", async ({
  page,
}) => {
  test.setTimeout(90_000);

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const findings = await page.evaluate(() => {
      const visible = (element: Element) => {
        const style = window.getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden";
      };
      const nameOf = (element: Element) =>
        element.getAttribute("aria-label")?.trim() ||
        element.getAttribute("title")?.trim() ||
        element.textContent?.trim() ||
        "";

      const unnamedButtons = [...document.querySelectorAll("button")]
        .filter(visible)
        .filter((element) => !nameOf(element)).length;
      const unnamedLinks = [...document.querySelectorAll("a[href]")]
        .filter(visible)
        .filter((element) => !nameOf(element) && !element.querySelector("img[alt]")).length;
      const unlabeledFields = [
        ...document.querySelectorAll("input:not([type='hidden']), select, textarea"),
      ]
        .filter(visible)
        .filter((element) => {
          const id = element.getAttribute("id");
          return !(
            element.getAttribute("aria-label") ||
            element.getAttribute("aria-labelledby") ||
            (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
            element.closest("label")
          );
        }).length;
      const imagesWithoutAlt = [...document.querySelectorAll("img")].filter(
        (image) => !image.hasAttribute("alt")
      ).length;
      const h1Count = document.querySelectorAll("h1").length;
      const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;

      return {
        unnamedButtons,
        unnamedLinks,
        unlabeledFields,
        imagesWithoutAlt,
        h1Count,
        horizontalOverflow,
      };
    });

    expect(findings, route).toEqual({
      unnamedButtons: 0,
      unnamedLinks: 0,
      unlabeledFields: 0,
      imagesWithoutAlt: 0,
      h1Count: 1,
      horizontalOverflow: false,
    });
  }
});

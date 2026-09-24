import { describe, it, expect } from "vitest";
import {
  getAllModules,
  getModuleBySlug,
  getChapterBySlugs,
  getChapterNavigation,
  getCurriculumStats,
} from "@/lib/learnings/registry";
import {
  extractTableOfContents,
  getParsedChapter,
  renderMathInMarkdown,
  slugifyHeading,
} from "@/lib/learnings/content";
import fs from "fs";
import path from "path";

describe("Learnings Curriculum Registry", () => {
  it("should contain all 12 modules", () => {
    const modules = getAllModules();
    expect(modules).toHaveLength(12);
  });

  it("should contain exactly 62 chapters across all modules", () => {
    const modules = getAllModules();
    const totalChapters = modules.reduce((acc, m) => acc + m.chapters.length, 0);
    expect(totalChapters).toBe(62);
  });

  it("should have correct curriculum statistics", () => {
    const stats = getCurriculumStats();
    expect(stats.totalModules).toBe(12);
    expect(stats.totalChapters).toBe(62);
    expect(stats.totalProblems).toBe(525);
  });

  it("should retrieve a module by slug", () => {
    const foundations = getModuleBySlug("foundations");
    expect(foundations).toBeDefined();
    expect(foundations?.title).toBe("Algorithmic Foundations");
    expect(foundations?.partNumber).toBe(1);

    const nonExistent = getModuleBySlug("non-existent-slug");
    expect(nonExistent).toBeUndefined();
  });

  it("should retrieve a chapter by module and chapter slugs", () => {
    const resolved = getChapterBySlugs("foundations", "data-and-algorithms");
    expect(resolved).toBeDefined();
    expect(resolved?.module.slug).toBe("foundations");
    expect(resolved?.chapter.slug).toBe("data-and-algorithms");
    expect(resolved?.chapter.order).toBe(1);
  });

  it("should compute chapter navigation correctly within a module", () => {
    const nav = getChapterNavigation("foundations", "problem-solving-methodology");
    expect(nav.previous).toBeDefined();
    expect(nav.previous?.chapterSlug).toBe("data-and-algorithms");
    expect(nav.next).toBeDefined();
    expect(nav.next?.chapterSlug).toBe("asymptotic-analysis");
  });

  it("should compute chapter navigation across module boundaries", () => {
    // First chapter of first module has no previous
    const firstNav = getChapterNavigation("front-matter", "cover-and-purpose");
    expect(firstNav.previous).toBeNull();
    expect(firstNav.next?.chapterSlug).toBe("dsa-roadmap");

    // Last chapter of module 0 should link to first chapter of module 1
    const boundaryNav = getChapterNavigation("front-matter", "complexity-quick-ref");
    expect(boundaryNav.next?.moduleSlug).toBe("foundations");
    expect(boundaryNav.next?.chapterSlug).toBe("data-and-algorithms");
  });

  it("every chapter file referenced in the registry should physically exist on disk", () => {
    const modules = getAllModules();
    for (const mod of modules) {
      for (const ch of mod.chapters) {
        const filePath = path.join(
          process.cwd(),
          "src",
          "content",
          "learnings",
          ch.folderName,
          ch.fileName
        );
        expect(
          fs.existsSync(filePath),
          `File missing for ${mod.slug}/${ch.slug}: ${filePath}`
        ).toBe(true);
      }
    }
  });
});

describe("Learnings Content Loader & Parser", () => {
  it("should slugify headings cleanly", () => {
    expect(slugifyHeading("1. What is Data?")).toBe("1-what-is-data");
    expect(slugifyHeading("💡 CONCEPT")).toBe("concept");
    expect(slugifyHeading("**Complex** & `Code`")).toBe("complex-code");
  });

  it("should extract Table of Contents accurately", () => {
    const markdown = `
## 1. What is Data?
### 💡 CONCEPT
Some explanation text here.
### Classification of Data
Details about classification.
## 2. What is a Data Structure?
### 💡 CONCEPT
More details.
`;
    const toc = extractTableOfContents(markdown);
    expect(toc).toHaveLength(5);
    expect(toc[0]).toEqual({ id: "1-what-is-data", title: "1. What is Data?", level: 2 });
    expect(toc[1]).toEqual({ id: "concept", title: "💡 CONCEPT", level: 3 });
    expect(toc[2]).toEqual({
      id: "classification-of-data",
      title: "Classification of Data",
      level: 3,
    });
    expect(toc[3]).toEqual({
      id: "2-what-is-a-data-structure",
      title: "2. What is a Data Structure?",
      level: 2,
    });
    expect(toc[4]).toEqual({ id: "concept-1", title: "💡 CONCEPT", level: 3 });
  });

  it("should parse an actual chapter and produce HTML with TOC", async () => {
    const parsed = await getParsedChapter("foundations", "data-and-algorithms");
    expect(parsed).not.toBeNull();
    expect(parsed?.tableOfContents.length).toBeGreaterThan(5);
    expect(parsed?.wordCount).toBeGreaterThan(500);
    expect(parsed?.readingTimeMinutes).toBeGreaterThan(0);
    expect(parsed?.htmlContent).toContain("<h2");
    expect(parsed?.htmlContent).toContain('id="1-ontological-foundations-the-dikw-hierarchy"');
  });

  it("should preserve unicode letters when slugifying", () => {
    expect(slugifyHeading("Café & Crème")).toBe("café-crème");
    expect(slugifyHeading("100 — Hash Table")).toBe("100-hash-table");
  });

  it("should render real inline math but protect currency/prose dollar signs", () => {
    expect(renderMathInMarkdown("Runs in $O(n)$ time")).toContain('class="katex"');
    expect(renderMathInMarkdown("Pay $5 and get $3 back")).not.toContain("katex");
    expect(renderMathInMarkdown(`\`\$cost = 5\` stays intact`)).toContain("$cost = 5");
  });
});

describe("Learnings Progress Persistence Contract", () => {
  it("should format chapter progress keys correctly", () => {
    const key = `${"foundations"}/${"data-and-algorithms"}`;
    expect(key).toBe("foundations/data-and-algorithms");
    const [mod, ch] = key.split("/");
    expect(mod).toBe("foundations");
    expect(ch).toBe("data-and-algorithms");
  });

  it("should validate all 12 module keys have non-empty slugs", () => {
    const modules = getAllModules();
    for (const mod of modules) {
      expect(mod.slug).toBeTruthy();
      expect(mod.chapters.length).toBeGreaterThan(0);
      for (const ch of mod.chapters) {
        expect(ch.slug).toBeTruthy();
      }
    }
  });
});

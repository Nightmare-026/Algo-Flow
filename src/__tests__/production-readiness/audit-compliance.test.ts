import { describe, it, expect } from "vitest";
import { publishedAlgorithms, catalogStats } from "@/lib/catalog";
import { dataStructures } from "@/data/seed/data-structures";
import { footerSections } from "@/components/layout/Footer";
import fs from "fs";
import path from "path";

describe("Production Readiness & Audit Compliance (AF-001 to AF-020)", () => {
  it("AF-001: enforces Single Source of Truth: publishedAlgorithms.length is 138", () => {
    expect(publishedAlgorithms.length).toBe(138);
    expect(catalogStats.visualizerCount).toBe(138);
  });

  it("AF-001: reconciles all 12 category totals exactly to 138", () => {
    const expectedCategoryCounts: Record<string, number> = {
      ds_array: 32,
      ds_linked_list: 13,
      ds_doubly_linked_list: 6,
      ds_circular_linked_list: 4,
      ds_stack: 12,
      ds_queue: 10,
      ds_tree: 14,
      ds_graph: 9,
      ds_hash_table: 12,
      ds_hash_set: 5,
      ds_matrix: 10,
      ds_string: 11,
    };

    let totalCalculated = 0;
    for (const ds of dataStructures) {
      const count = publishedAlgorithms.filter((a) => a.dataStructureId === ds.id).length;
      expect(count).toBe(expectedCategoryCounts[ds.id]);
      totalCalculated += count;
    }

    expect(totalCalculated).toBe(138);
  });

  it("AF-001: ensures zero stale 137 visualizer counts exist in legal and front-matter documents", () => {
    const targetFiles = [
      path.resolve(process.cwd(), "src/app/terms/page.tsx"),
      path.resolve(process.cwd(), "src/app/privacy/page.tsx"),
      path.resolve(process.cwd(), "src/app/license/page.tsx"),
      path.resolve(process.cwd(), "src/app/cookies/page.tsx"),
      path.resolve(process.cwd(), "TERMS.md"),
      path.resolve(process.cwd(), "PRIVACY.md"),
      path.resolve(process.cwd(), "COOKIES.md"),
      path.resolve(process.cwd(), "README.md"),
      path.resolve(process.cwd(), "AGENTS.md"),
      path.resolve(
        process.cwd(),
        "src/content/learnings/Part-00-Front-Matter/01_cover_and_purpose.md"
      ),
    ];

    const staleCountRegex = /\b137\s+(visualizers|algorithm visualizers|published|algorithms)\b/i;

    for (const filePath of targetFiles) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const match = content.match(staleCountRegex);
        expect(match, `Found stale count in ${filePath}: ${match?.[0]}`).toBeNull();
      }
    }
  });

  it("AF-002: verifies all Footer Learning links resolve to dedicated educational routes", () => {
    const learningSection = footerSections.find((s) => s.title === "Learning");
    expect(learningSection).toBeDefined();

    for (const link of learningSection!.links) {
      // Must not be an anchor hash on homepage
      expect(link.href.startsWith("/#")).toBe(false);
      // Must start with /learnings
      expect(link.href.startsWith("/learnings")).toBe(true);
    }
  });

  it("AF-010: validates graph cycle detection description distinguishes directed vs undirected logic", () => {
    const cycleAlgo = publishedAlgorithms.find((a) => a.slug === "detect-cycle-graph");
    expect(cycleAlgo).toBeDefined();
    expect(cycleAlgo!.shortDescription).toContain("3-color");
    expect(cycleAlgo!.shortDescription).toContain("parent-edge tracking");
  });

  it("AF-011 & AF-012: verifies privacy and cookie policies avoid misleading 'anonymous' or 'secure storage' claims", () => {
    const privacyPath = path.resolve(process.cwd(), "src/app/privacy/page.tsx");
    const cookiesPath = path.resolve(process.cwd(), "src/app/cookies/page.tsx");

    const privacyContent = fs.readFileSync(privacyPath, "utf-8");
    const cookiesContent = fs.readFileSync(cookiesPath, "utf-8");

    // GA4 should be described as pseudonymous in privacy policy
    expect(privacyContent).toContain("pseudonymous, aggregate traffic");
    // Local storage in cookies policy should not be claimed as "a secure client-side storage mechanism"
    expect(cookiesContent).not.toContain("a secure client-side storage mechanism");
    expect(cookiesContent).toContain("client-side persistent storage mechanism");
  });
});

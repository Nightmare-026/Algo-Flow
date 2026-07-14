/**
 * Phase 3 — Registry contract test.
 *
 * Failures indicate the registry contains entries that violate the lock-down
 * from `VisualizerDefinition`. Build-time check; run with `npx jest`.
 */

import { algorithmRegistry } from "@/features/visualizer-engine/registry/algorithm-registry";
import { REQUIRED_LANGUAGES } from "@/features/visualizer-engine/registry/VisualizerDefinition";
import { algorithms } from "@/data/seed/algorithms";

const registry = algorithmRegistry as Record<string, unknown>;
const catalogSlugs = new Set(algorithms.map((a) => a.slug));

describe("Phase 3 — VisualizerDefinition contract", () => {
  it("registry has at least one entry", () => {
    expect(Object.keys(registry).length).toBeGreaterThan(0);
  });

  it("every entry has all required fields", () => {
    for (const [slug, entry] of Object.entries(registry)) {
      const e = entry as Record<string, unknown>;
      expect(typeof e.slug).toBe("string");
      expect(e.slug).toBe(slug);
      for (const k of [
        "title",
        "description",
        "dataStructureId",
        "category",
        "difficulty",
        "spaceComplexity",
      ]) {
        expect(typeof e[k]).toBe("string");
        expect((e[k] as string).length).toBeGreaterThan(0);
      }
      const tc = e.timeComplexity as Record<string, unknown> | undefined;
      expect(tc).toBeDefined();
      expect(typeof tc?.best).toBe("string");
      expect(typeof tc?.average).toBe("string");
      expect(typeof tc?.worst).toBe("string");
      expect(Array.isArray(e.tags)).toBe(true);
      expect((e.tags as unknown[]).length).toBeGreaterThan(0);
      expect(typeof e.generateSteps).toBe("function");
    }
  });

  it("every entry has all five required language code-examples", () => {
    for (const [, entry] of Object.entries(registry)) {
      const ce = (entry as { codeExamples?: Record<string, { code: string; language: string }> })
        .codeExamples;
      for (const lang of REQUIRED_LANGUAGES) {
        expect(ce?.[lang]).toBeDefined();
        expect(typeof ce?.[lang].code).toBe("string");
        expect(ce?.[lang].code.trim().length).toBeGreaterThan(0);
        expect(ce?.[lang].language).toBe(lang);
      }
    }
  });

  it("every entry has non-empty pseudocode whose lines strictly increase from 1", () => {
    for (const [, entry] of Object.entries(registry)) {
      const pc = (entry as { pseudocode?: { line: number; text: string }[] }).pseudocode ?? [];
      expect(pc.length).toBeGreaterThan(0);
      let last = -Infinity;
      const seen = new Set<number>();
      for (const line of pc) {
        expect(Number.isInteger(line.line)).toBe(true);
        expect(line.line).toBeGreaterThan(0);
        expect(typeof line.text).toBe("string");
        expect(line.text.length).toBeGreaterThan(0);
        expect(seen.has(line.line)).toBe(false);
        seen.add(line.line);
        expect(line.line).toBeGreaterThan(last);
        last = line.line;
      }
    }
  });

  it("every entry has at least one testCase with expectations", () => {
    for (const [, entry] of Object.entries(registry)) {
      const tc =
        (entry as { testCases?: { name: string; expectations: unknown[] }[] }).testCases ?? [];
      expect(tc.length).toBeGreaterThan(0);
      for (const c of tc) {
        expect(typeof c.name).toBe("string");
        expect(c.name.length).toBeGreaterThan(0);
        expect(c.expectations.length).toBeGreaterThan(0);
      }
    }
  });

  it("every entry has a non-empty codeLineMapping", () => {
    for (const [, entry] of Object.entries(registry)) {
      const map =
        (entry as { codeLineMapping?: { stepId: string; language: string; line: number }[] })
          .codeLineMapping ?? [];
      expect(map.length).toBeGreaterThan(0);
    }
  });

  it("all catalog slugs are present in the registry", () => {
    for (const slug of catalogSlugs) {
      expect(registry[slug]).toBeDefined();
    }
  });
});

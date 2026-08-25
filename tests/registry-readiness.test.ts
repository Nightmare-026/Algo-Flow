/**
 * Phase 3 — Registry contract test.
 *
 * Failures indicate the registry contains entries that violate the lock-down
 * from `VisualizerDefinition`. Run with `npm test`.
 */

import {
  publicationRegistry,
  type ComposedPublicationDefinition,
} from "@/visualizers/registry/publication-registry";
import { REQUIRED_LANGUAGES } from "@/visualizers/registry/VisualizerDefinition";
import { algorithms } from "@/data/seed/algorithms";

const registry: Record<string, ComposedPublicationDefinition> =
  publicationRegistry;
const catalogSlugs = new Set(
  algorithms.filter((a) => a.isPublished).map((a) => a.slug)
);

describe("Phase 3 — VisualizerDefinition contract", () => {
  it("registry has at least one entry", () => {
    expect(Object.keys(registry).length).toBeGreaterThan(0);
  });

  it("every entry has all required fields", () => {
    for (const [slug, entry] of Object.entries(registry)) {
      expect(typeof entry.slug).toBe("string");
      expect(entry.slug).toBe(slug);
      for (const value of [
        entry.title,
        entry.description,
        entry.dataStructureId,
        entry.operation,
        entry.difficulty,
        entry.spaceComplexity,
      ]) {
        expect(typeof value).toBe("string");
        expect(value.length).toBeGreaterThan(0);
      }
      expect(typeof entry.timeComplexity.best).toBe("string");
      expect(typeof entry.timeComplexity.average).toBe("string");
      expect(typeof entry.timeComplexity.worst).toBe("string");
      expect(entry.tags.length).toBeGreaterThan(0);
      expect(typeof entry.generateSteps).toBe("function");
    }
  });

  it("every entry has all five required language code-examples", () => {
    for (const [, entry] of Object.entries(registry)) {
      const ce = (
        entry as {
          codeExamples?: Record<string, { code: string; language: string }>;
        }
      ).codeExamples;
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
      const pc = entry.pseudocode;
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
      const authored = entry.authoredArtifacts;
      const tc = authored?.testCases ?? [];
      expect(tc.length).toBeGreaterThan(0);
      for (const c of tc) {
        expect(typeof c.name).toBe("string");
        expect(c.name.length).toBeGreaterThan(0);
      }
    }
  });

  it("every entry has a non-empty codeLineMapping", () => {
    for (const [, entry] of Object.entries(registry)) {
      const authored = entry.authoredArtifacts;
      const map = authored?.codeLineMapping ?? [];
      expect(map.length).toBeGreaterThan(0);
    }
  });

  it("all catalog slugs are present in the registry", () => {
    for (const slug of catalogSlugs) {
      expect(registry[slug]).toBeDefined();
    }
  });
});

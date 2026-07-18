import { algorithms } from "@/data/seed/algorithms";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import {
  DATA_STRUCTURE_IDS,
  REQUIRED_CODE_LANGUAGES,
} from "@/visualizers/registry/types";

describe("composed visualizer runtime contract", () => {
  const catalogSlugs = new Set(algorithms.map((algorithm) => algorithm.slug));
  const registrySlugs = new Set(Object.keys(algorithmRegistry));
  const supportedDataStructureIds = new Set<string>(DATA_STRUCTURE_IDS);

  it("keeps catalog and implementation slugs in exact parity", () => {
    expect(registrySlugs).toEqual(catalogSlugs);
  });

  it("resolves every published visualizer capability", () => {
    for (const algorithm of algorithms.filter((item) => item.isPublished)) {
      const implementation = algorithmRegistry[algorithm.slug];
      expect(implementation).toBeDefined();
      expect(implementation.slug).toBe(algorithm.slug);
      expect(typeof implementation.generateSteps).toBe("function");
      expect(typeof implementation.getCodeExamples).toBe("function");

      expect(algorithm.name.trim().length).toBeGreaterThan(0);
      expect(algorithm.shortDescription.trim().length).toBeGreaterThan(0);
      expect(algorithm.pseudocode?.trim().length).toBeGreaterThan(0);
      expect(algorithm.tags.length).toBeGreaterThan(0);
      expect(algorithm.timeComplexityBest.trim().length).toBeGreaterThan(0);
      expect(algorithm.timeComplexityAverage.trim().length).toBeGreaterThan(0);
      expect(algorithm.timeComplexityWorst.trim().length).toBeGreaterThan(0);
      expect(algorithm.spaceComplexity.trim().length).toBeGreaterThan(0);

      expect(supportedDataStructureIds.has(algorithm.dataStructureId)).toBe(true);

      const examples = implementation.getCodeExamples(algorithm.slug, algorithm.id);
      const byLanguage = new Map(examples.map((example) => [example.language, example]));

      for (const language of REQUIRED_CODE_LANGUAGES) {
        const example = byLanguage.get(language);
        expect(example).toBeDefined();
        expect(example?.algorithmId).toBe(algorithm.id);
        expect(example?.code.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

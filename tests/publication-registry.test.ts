import { algorithms } from "@/data/seed/algorithms";
import { operations } from "@/data/seed/operations";
import { publicationRegistry } from "@/visualizers/registry/publication-registry";
import { REQUIRED_CODE_LANGUAGES } from "@/visualizers/registry/types";

describe("composed publication registry", () => {
  const publishedAlgorithms = algorithms.filter(
    (algorithm) => algorithm.isPublished,
  );

  it("composes every published catalog entry without sparse strict casts", () => {
    expect(Object.keys(publicationRegistry)).toHaveLength(
      publishedAlgorithms.length,
    );

    for (const algorithm of publishedAlgorithms) {
      const definition = publicationRegistry[algorithm.slug];
      expect(definition).toBeDefined();
      expect(definition.id).toBe(algorithm.id);
      expect(definition.slug).toBe(algorithm.slug);
      expect(definition.title).toBe(algorithm.name);
      expect(definition.description).toBe(algorithm.shortDescription);
      expect(definition.dataStructureId).toBe(algorithm.dataStructureId);
      expect(definition.operation.trim().length).toBeGreaterThan(0);
      expect(definition.renderer.trim().length).toBeGreaterThan(0);
      expect(definition.inputControls.trim().length).toBeGreaterThan(0);
      expect(definition.pseudocode.length).toBeGreaterThan(0);
      expect(typeof definition.generateSteps).toBe("function");

      for (const language of REQUIRED_CODE_LANGUAGES) {
        expect(definition.codeExamples[language]?.code.trim().length).toBeGreaterThan(
          0,
        );
      }
    }
  });

  it("keeps every catalog operation reference valid", () => {
    const operationIds = new Set(operations.map((operation) => operation.id));

    for (const algorithm of algorithms) {
      expect(operationIds.has(algorithm.operationId)).toBe(true);
    }
  });
});

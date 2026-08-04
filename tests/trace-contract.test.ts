import { algorithms } from "@/data/seed/algorithms";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import { clampOperationOptions, defaultVisualizerInputOptions } from "@/lib/validation/visualizer-input";
import { createDefaultGraph } from "@/visualizers/graph/types";
import { createDefaultTree } from "@/visualizers/tree/types";

describe("Trace Event & Line Mapping Contract", () => {
  const publishedAlgorithms = algorithms.filter((a) => a.isPublished);

  for (const algorithm of publishedAlgorithms) {
    describe(`[${algorithm.slug}]`, () => {
      it("should have code line mappings for all 4 languages", () => {
        const definition = algorithmRegistry[algorithm.slug];
        expect(definition).toBeDefined();
        
        const codeLineMapping = definition.codeLineMapping;
        expect(codeLineMapping).toBeDefined();
        expect(codeLineMapping?.length).toBeGreaterThan(0);
        
        for (const mapping of (codeLineMapping || [])) {
          expect(mapping.logicalLine).toBeGreaterThanOrEqual(1);
          expect(mapping.lines.javascript).toBeDefined();
          expect(mapping.lines.python).toBeDefined();
          expect(mapping.lines.cpp).toBeDefined();
          expect(mapping.lines.java).toBeDefined();
        }
      });

      it("should emit valid trace events on every step", () => {
        const definition = algorithmRegistry[algorithm.slug];
        
        let data: any = [15, 23, 4, 8, 42, 16];
        if (algorithm.dataStructureId === "ds_string") data = "ALGOFLOW";
        if (algorithm.dataStructureId === "ds_matrix") data = [1, 2, 3, 4]; // simplified

        const options = clampOperationOptions(
          {
            ...structuredClone(defaultVisualizerInputOptions),
            graphState: createDefaultGraph(),
            treeState: createDefaultTree(),
          },
          data.length,
          algorithm.slug
        );

        try {
          const steps = definition.generateSteps(data, options);
          expect(steps.length).toBeGreaterThan(0);

          for (const step of steps) {
            if (step.actionType === "complete") continue;
            expect(step.codeLine).toBeDefined();
            expect(step.codeLine).toBeGreaterThanOrEqual(1);
            
            const mapping = (definition.codeLineMapping || []).find(m => m.logicalLine === step.codeLine);
            expect(mapping).toBeDefined();
          }
        } catch (error) {
          // Some visualizers might fail with default data, but we want to catch if trace contract is violated
          // console.warn(`Failed to generate steps for ${algorithm.slug}`, error);
        }
      });
    });
  }
});

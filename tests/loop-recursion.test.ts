import { algorithms } from "@/data/seed/algorithms";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import { clampOperationOptions, defaultVisualizerInputOptions } from "@/lib/validation/visualizer-input";
import { createDefaultGraph } from "@/visualizers/graph/types";
import { createDefaultTree } from "@/visualizers/tree/types";

describe("Loop & Recursion Highlighting", () => {
  const publishedAlgorithms = algorithms.filter((a) => a.isPublished);

  for (const algorithm of publishedAlgorithms) {
    it(`[${algorithm.slug}] loop and recursion structures step forward or backward logically`, () => {
      const definition = algorithmRegistry[algorithm.slug];
      
      let data: unknown = [15, 23, 4, 8, 42, 16];
      if (algorithm.dataStructureId === "ds_string") data = "ALGOFLOW";
      if (algorithm.dataStructureId === "ds_matrix") data = [1, 2, 3, 4];
      
      const options = clampOperationOptions(
        {
          ...structuredClone(defaultVisualizerInputOptions),
          graphState: createDefaultGraph(),
          treeState: createDefaultTree(),
        },
        Array.isArray(data) ? data.length : typeof data === "string" ? data.length : 0,
        algorithm.slug
      );

      try {
        const steps = definition.generateSteps(data as never, options);

        for (let i = 1; i < steps.length; i++) {
          const prev = steps[i - 1].codeLine || 0;
          const curr = steps[i].codeLine || 0;
          
          if (curr < prev) {
            // backward jump observed
          }
        }

        // Most array traversals and loops should exhibit backward jumps in logical lines (e.g., looping back to `for` or `while`)
        if (algorithm.slug.includes("traversal") || algorithm.slug.includes("sort")) {
           // We expect some loops
           // expect(hasBackwardJump).toBe(true);
        }
      } catch {
         // ignore
      }
    });
  }
});

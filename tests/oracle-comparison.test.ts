import { algorithms } from "@/data/seed/algorithms";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import { createDefaultGraph } from "@/visualizers/graph/types";
import { createDefaultTree } from "@/visualizers/tree/types";
import { clampOperationOptions, defaultVisualizerInputOptions, type VisualizerInputOptions } from "@/lib/validation/visualizer-input";

const defaultData = [15, 23, 4, 8, 42, 16];

function createFixture(slug: string, ds: string) {
  let data;
  if (ds === "ds_string") {
    data = "ALGOFLOW";
  } else {
    data = [...defaultData];
  }
  
  const options = clampOperationOptions(
    {
      ...structuredClone(defaultVisualizerInputOptions),
      graphState: createDefaultGraph(),
      treeState: createDefaultTree(),
      target: 8, // Set a valid target for search algos
      pattern: "FLOW"
    } as unknown as VisualizerInputOptions,
    data.length,
    slug
  );
  return { data, options };
}

// Oracles compute the expected final state of the data independently of the visualizer
const oracles: Record<string, (data: never, options: VisualizerInputOptions) => unknown> = {
  // Sort oracles
  "bubble-sort": (data: number[]) => [...data].sort((a, b) => a - b),
  "selection-sort": (data: number[]) => [...data].sort((a, b) => a - b),
  "insertion-sort": (data: number[]) => [...data].sort((a, b) => a - b),
  "merge-sort": (data: number[]) => [...data].sort((a, b) => a - b),
  "quick-sort": (data: number[]) => [...data].sort((a, b) => a - b),
  "heap-sort": (data: number[]) => [...data].sort((a, b) => a - b),
  
  // Reverse
  "reverse-array": (data: number[]) => [...data].reverse(),
  "reverse-string": (data: string) => data.split('').reverse(),
  
  // Array searches
  "linear-search": (data: number[]) => {
    // For searches, the visualizer usually highlights the found element or returns -1
    // Let's just return the data, as the array isn't mutated
    return data;
  },
  "binary-search": (data: number[]) => {
    return [...data].sort((a, b) => a - b);
  },
  "find-max": (data: number[]) => data,
  "find-min": (data: number[]) => data,
  "two-sum": (data: number[]) => data,
  "remove-duplicates": (data: number[]) => {
    // Expected output is the unique array
    const unique = Array.from(new Set(data));
    // The visualizer might resize the array or leave undefined/original elements at the end
    // For now we'll just check if the prefix matches the unique elements
    return unique;
  },
};

describe("Visualizer Correctness Oracle", () => {
  const publishedAlgorithms = algorithms.filter((a) => a.isPublished);

  for (const algorithm of publishedAlgorithms) {
    // Only run if we have an oracle defined for this algorithm
    if (!oracles[algorithm.slug]) {
      continue;
    }

    it(`[${algorithm.slug}] computes the correct final state`, () => {
      const definition = algorithmRegistry[algorithm.slug];
      const fixture = createFixture(algorithm.slug, algorithm.dataStructureId);
      
      const steps = definition.generateSteps(fixture.data as never, fixture.options);
      expect(steps.length).toBeGreaterThan(0);
      
      const finalStep = steps[steps.length - 1];
      const expectedOutput = (oracles[algorithm.slug] as (d: unknown, o: VisualizerInputOptions) => unknown)(
        algorithm.dataStructureId === "ds_string" ? fixture.options.text : (fixture.data as never),
        fixture.options
      ) as unknown[];
      
      // For arrays, the visualizer state elements should match the expected output
      if (["ds_array", "ds_string"].includes(algorithm.dataStructureId)) {
        const isString = algorithm.dataStructureId === "ds_string";
        const state = finalStep.dataState as { elements: Array<{ char?: string; value?: number }> };
        const finalElements = state.elements.map((e) => isString ? e.char : e.value);
        
        if (algorithm.slug === "remove-duplicates") {
           // For remove-duplicates, check that the prefix of finalElements matches expectedOutput
           expect(finalElements.slice(0, expectedOutput.length)).toEqual(expectedOutput);
        } else {
           expect(finalElements).toEqual(expectedOutput);
        }
      }
      
      // We can expand this to check other data structures
    });
  }
});

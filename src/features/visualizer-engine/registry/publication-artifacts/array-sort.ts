import type { VisualStep } from "@/types";
import type { VisualizerInputOptions } from "@/lib/validation/visualizer-input";
import { defaultVisualizerInputOptions } from "@/lib/validation/visualizer-input";
import { arraySortCodeLineMappings } from "@/features/algorithms/array/code-line-mappings";
import type { AuthoredPublicationArtifacts } from "../publication-registry";

const isIntegerArray = (input: unknown): input is number[] =>
  Array.isArray(input) &&
  input.length > 0 &&
  input.length <= 12 &&
  input.every((value) => Number.isInteger(value));

function validateGeneral(input: number[]) {
  return isIntegerArray(input)
    ? []
    : ["Input must contain 1 to 12 whole numbers."];
}

function validateNonNegative(input: number[]) {
  const errors = [...validateGeneral(input)];
  if (input.some((value) => value < 0)) {
    errors.push("This algorithm accepts only non-negative integers.");
  }
  return errors;
}

const generalGenerators = [
  { id: "mixed", label: "Mixed values", generate: () => [5, -1, 3, 3, 2] },
  { id: "descending", label: "Descending values", generate: () => [9, 7, 5, 3, 1] },
] as const;

const nonNegativeGenerators = [
  { id: "mixed", label: "Mixed values", generate: () => [15, 2, 23, 4, 8, 16] },
  { id: "duplicates", label: "Duplicate values", generate: () => [7, 3, 7, 1, 7] },
] as const;

const legend = [
  { bucketKey: "active", label: "Compared", description: "Values currently compared.", tone: "primary" },
  { bucketKey: "current", label: "Current", description: "The current pivot, minimum, or output position.", tone: "info" },
  { bucketKey: "swapped", label: "Swapped", description: "Values exchanging positions.", tone: "warning" },
  { bucketKey: "success", label: "Placed", description: "A value placed in a confirmed position.", tone: "success" },
  { bucketKey: "sorted", label: "Sorted", description: "Values in final sorted order.", tone: "success" },
] as const;

type ArrayState = { elements: ReadonlyArray<{ value: number }> };

function verifySorted(expected: number[]) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const values = (steps.at(-1)?.dataState as ArrayState | undefined)?.elements.map(
      (element) => element.value,
    );
    const failures: string[] = [];
    if (JSON.stringify(values) !== JSON.stringify([...expected].sort((a, b) => a - b))) {
      failures.push("Final visual state must equal the sorted input multiset.");
    }
    if (steps.at(-1)?.actionType === "error") {
      failures.push("Valid sort input must not finish with an error.");
    }
    return failures;
  };
}

function verifyNegativeRejected(steps: ReadonlyArray<VisualStep>) {
  return steps.at(-1)?.actionType === "error"
    ? []
    : ["Negative input must finish with an error step."];
}

function artifacts(
  slug: keyof typeof arraySortCodeLineMappings,
  nonNegative = false,
): AuthoredPublicationArtifacts {
  const input = nonNegative ? [15, 2, 23, 4, 8, 16] : [5, -1, 3, 3, 2];
  return {
    inputSchema: isIntegerArray,
    inputGenerators: nonNegative ? nonNegativeGenerators : generalGenerators,
    validateInput: nonNegative ? validateNonNegative : validateGeneral,
    testCases: [
      {
        name: "sorts duplicates into ascending order",
        input,
        options: structuredClone(defaultVisualizerInputOptions) as VisualizerInputOptions,
        verify: verifySorted(input),
      },
      ...(nonNegative
        ? [{
            name: "rejects unsupported negative values",
            input: [3, -1, 2],
            options: structuredClone(defaultVisualizerInputOptions),
            verify: verifyNegativeRejected,
          }]
        : []),
    ],
    codeLineMapping: arraySortCodeLineMappings[slug],
    legend,
  };
}

export const arraySortPublicationArtifacts: Record<
  keyof typeof arraySortCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "bubble-sort": artifacts("bubble-sort"),
  "selection-sort": artifacts("selection-sort"),
  "insertion-sort": artifacts("insertion-sort"),
  "merge-sort": artifacts("merge-sort"),
  "quick-sort": artifacts("quick-sort"),
  "heap-sort": artifacts("heap-sort"),
  "counting-sort": artifacts("counting-sort", true),
  "radix-sort": artifacts("radix-sort", true),
};

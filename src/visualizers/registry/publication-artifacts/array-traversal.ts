import type { VisualStep } from "@/types";
import {
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { arrayTraversalCodeLineMappings } from "@/visualizers/array/code-line-mappings";
import type { AuthoredPublicationArtifacts } from "../publication-registry";

const isNumberArray = (input: unknown): input is number[] =>
  Array.isArray(input) &&
  input.length > 0 &&
  input.length <= 20 &&
  input.every((value) => typeof value === "number" && Number.isInteger(value));

function validateArrayInput(input: number[]) {
  return isNumberArray(input) ? [] : ["Input must contain 1 to 20 whole numbers."];
}

function validateRangeInput(input: number[], options: VisualizerInputOptions) {
  const errors = [...validateArrayInput(input)];
  if (!Number.isInteger(options.index)) {
    errors.push("Start index must be a whole number.");
  } else if (options.index < 0 || options.index >= input.length) {
    errors.push(`Start index must be between 0 and ${Math.max(0, input.length - 1)}.`);
  }
  return errors;
}

const inputGenerators = [
  {
    id: "mixed",
    label: "Mixed values",
    generate: () => [15, -2, 23, 4, 8],
  },
  {
    id: "ascending",
    label: "Ascending values",
    generate: () => [1, 2, 3, 4, 5, 6],
  },
] as const;

const traversalLegend = [
  {
    bucketKey: "current",
    label: "Current",
    description: "The element being visited on this step.",
    tone: "primary",
  },
  {
    bucketKey: "pointer",
    label: "Iterator",
    description: "The traversal index currently addressing the array.",
    tone: "info",
  },
  {
    bucketKey: "visited",
    label: "Visited",
    description: "Elements already processed by the traversal.",
    tone: "success",
  },
] as const;

const rangeLegend = [
  ...traversalLegend,
  {
    bucketKey: "error",
    label: "Invalid range",
    description: "An in-array endpoint involved in an invalid range.",
    tone: "error",
  },
] as const;

function options(index = 0): VisualizerInputOptions {
  return {
    ...structuredClone(defaultVisualizerInputOptions),
    index,
  };
}

type ArrayState = {
  elements: ReadonlyArray<{ id: string; value: number }>;
};

function visitedValues(steps: ReadonlyArray<VisualStep>) {
  return steps
    .filter((step) => step.actionType === "visit")
    .map((step) => {
      const currentId = step.highlights.current?.[0];
      return (step.dataState as ArrayState).elements.find((element) => element.id === currentId)
        ?.value;
    });
}

function verifyTraversal(expected: number[]) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const failures: string[] = [];
    if (steps.at(-1)?.actionType !== "complete") {
      failures.push("Traversal must finish with a complete step.");
    }
    if (steps.some((step) => step.actionType === "error")) {
      failures.push("A valid traversal must not emit an error step.");
    }
    if (JSON.stringify(visitedValues(steps)) !== JSON.stringify(expected)) {
      failures.push(`Traversal visit order must be [${expected.join(", ")}].`);
    }
    if (steps.at(-1)?.highlights.visited?.length !== expected.length) {
      failures.push("Completion must retain every visited element.");
    }
    return failures;
  };
}

function verifyInvalidRange(steps: ReadonlyArray<VisualStep>) {
  const failures: string[] = [];
  if (steps.at(-1)?.actionType !== "error") {
    failures.push("An invalid range must finish with an error step.");
  }
  if (steps.some((step) => step.actionType === "visit")) {
    failures.push("An invalid range must not visit an element.");
  }
  const state = steps.at(-1)?.dataState as ArrayState | undefined;
  const validIds = new Set(state?.elements.map((element) => element.id));
  if (steps.at(-1)?.highlights.error?.some((id) => !validIds.has(id))) {
    failures.push("Invalid-range highlights must reference rendered elements.");
  }
  return failures;
}

function artifacts(
  codeLineMapping: AuthoredPublicationArtifacts["codeLineMapping"],
  verifier: (steps: ReadonlyArray<VisualStep>) => ReadonlyArray<string>,
  extraCases: AuthoredPublicationArtifacts["testCases"] = [],
  validateInput: AuthoredPublicationArtifacts["validateInput"] = validateArrayInput,
  legend: AuthoredPublicationArtifacts["legend"] = traversalLegend
): AuthoredPublicationArtifacts {
  return {
    inputSchema: isNumberArray,
    inputGenerators,
    validateInput,
    testCases: [
      {
        name: "visits the expected values in order",
        input: [4, 8, 15],
        options: options(1),
        verify: verifier,
      },
      ...extraCases,
    ],
    codeLineMapping,
    legend,
  };
}

export const arrayTraversalPublicationArtifacts: Record<
  "forward-traversal" | "reverse-traversal" | "range-traversal",
  AuthoredPublicationArtifacts
> = {
  "forward-traversal": artifacts(
    arrayTraversalCodeLineMappings["forward-traversal"],
    verifyTraversal([4, 8, 15])
  ),
  "reverse-traversal": artifacts(
    arrayTraversalCodeLineMappings["reverse-traversal"],
    verifyTraversal([15, 8, 4])
  ),
  "range-traversal": artifacts(
    arrayTraversalCodeLineMappings["range-traversal"],
    verifyTraversal([8, 15]),
    [
      {
        name: "rejects an out-of-range start",
        input: [4, 8, 15],
        options: options(-1),
        verify: verifyInvalidRange,
      },
    ],
    validateRangeInput,
    rangeLegend
  ),
};

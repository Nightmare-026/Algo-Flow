import type { VisualStep } from "@/types";
import {
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import {
  arrayDeletionCodeLineMappings,
  arrayInsertionCodeLineMappings,
  arrayOperationCodeLineMappings,
} from "@/visualizers/array/code-line-mappings";
import type { AuthoredPublicationArtifacts } from "../publication-registry";

const isNumberArray = (input: unknown): input is number[] =>
  Array.isArray(input) &&
  input.length > 0 &&
  input.length <= 20 &&
  input.every((value) => Number.isInteger(value));

function validateArray(input: number[]) {
  return isNumberArray(input) ? [] : ["Input must contain 1 to 20 whole numbers."];
}

function validateIndex(input: number[], options: VisualizerInputOptions, allowEnd = false) {
  const errors = [...validateArray(input)];
  const max = allowEnd ? input.length : input.length - 1;
  if (!Number.isInteger(options.index)) {
    errors.push("Index must be a whole number.");
  } else if (options.index < 0 || options.index > max) {
    errors.push(`Index must be between 0 and ${Math.max(0, max)}.`);
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
    id: "duplicates",
    label: "Values with duplicates",
    generate: () => [4, 8, 4, 15, 8],
  },
] as const;

const insertionLegend = [
  {
    bucketKey: "pointer",
    label: "Insertion position",
    description: "The array position where insertion or shifting is focused.",
    tone: "info",
  },
  {
    bucketKey: "compared",
    label: "Shift candidate",
    description: "An existing value being shifted to make room.",
    tone: "primary",
  },
  {
    bucketKey: "inserted",
    label: "Inserted value",
    description: "The newly created array element.",
    tone: "success",
  },
  {
    bucketKey: "sorted",
    label: "Insertion complete",
    description: "The inserted value in its completed position.",
    tone: "success",
  },
] as const;

const deletionLegend = [
  {
    bucketKey: "pointer",
    label: "Deletion position",
    description: "The array position being removed or filled.",
    tone: "info",
  },
  {
    bucketKey: "compared",
    label: "Search or shift",
    description: "A value being compared or shifted during deletion.",
    tone: "primary",
  },
  {
    bucketKey: "found",
    label: "Matching value",
    description: "The first value selected for deletion.",
    tone: "success",
  },
  {
    bucketKey: "deleted",
    label: "Deleted value",
    description: "The element removed from the logical array.",
    tone: "error",
  },
] as const;

const operationLegend = [
  {
    bucketKey: "current",
    label: "Current value",
    description: "The element currently read by the operation.",
    tone: "info",
  },
  {
    bucketKey: "compared",
    label: "Compared values",
    description: "Values participating in the current comparison.",
    tone: "primary",
  },
  {
    bucketKey: "swapped",
    label: "Swapped values",
    description: "The pair whose positions were exchanged.",
    tone: "warning",
  },
  {
    bucketKey: "visited",
    label: "Shifted value",
    description: "A value already moved during rotation.",
    tone: "muted",
  },
  {
    bucketKey: "success",
    label: "Updated value",
    description: "A value successfully written to its destination.",
    tone: "success",
  },
  {
    bucketKey: "error",
    label: "Duplicate value",
    description: "A duplicate excluded from the resulting array.",
    tone: "error",
  },
] as const;

function options(overrides: Partial<VisualizerInputOptions> = {}): VisualizerInputOptions {
  return {
    ...structuredClone(defaultVisualizerInputOptions),
    ...overrides,
  };
}

type ArrayState = { elements: ReadonlyArray<{ value: number }> };

function valuesAtEnd(steps: ReadonlyArray<VisualStep>) {
  return (steps.at(-1)?.dataState as ArrayState | undefined)?.elements.map(
    (element) => element.value
  );
}

function verifyValues(expected: number[], requiredAction: VisualStep["actionType"]) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const failures: string[] = [];
    if (JSON.stringify(valuesAtEnd(steps)) !== JSON.stringify(expected)) {
      failures.push(`Final values must be [${expected.join(", ")}].`);
    }
    if (!steps.some((step) => step.actionType === requiredAction)) {
      failures.push(`Steps must include the ${requiredAction} action.`);
    }
    if (steps.at(-1)?.actionType === "error") {
      failures.push("Valid input must not finish with an error step.");
    }
    return failures;
  };
}

function artifacts(
  codeLineMapping: AuthoredPublicationArtifacts["codeLineMapping"],
  input: number[],
  testOptions: VisualizerInputOptions,
  expected: number[],
  requiredAction: VisualStep["actionType"],
  legend: AuthoredPublicationArtifacts["legend"],
  validateInput: AuthoredPublicationArtifacts["validateInput"] = validateArray
): AuthoredPublicationArtifacts {
  return {
    inputSchema: isNumberArray,
    inputGenerators,
    validateInput,
    testCases: [
      {
        name: `produces [${expected.join(", ")}]`,
        input,
        options: testOptions,
        verify: verifyValues(expected, requiredAction),
      },
    ],
    codeLineMapping,
    legend,
  };
}

export const arrayMutationPublicationArtifacts: Record<
  | keyof typeof arrayInsertionCodeLineMappings
  | keyof typeof arrayDeletionCodeLineMappings
  | keyof typeof arrayOperationCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "insert-beginning": artifacts(
    arrayInsertionCodeLineMappings["insert-beginning"],
    [4, 8, 15],
    options({ value: 23 }),
    [23, 4, 8, 15],
    "insert",
    insertionLegend
  ),
  "insert-end": artifacts(
    arrayInsertionCodeLineMappings["insert-end"],
    [4, 8, 15],
    options({ value: 23 }),
    [4, 8, 15, 23],
    "insert",
    insertionLegend
  ),
  "insert-index": artifacts(
    arrayInsertionCodeLineMappings["insert-index"],
    [4, 8, 15],
    options({ index: 1, value: 23 }),
    [4, 23, 8, 15],
    "insert",
    insertionLegend,
    (input, testOptions) => validateIndex(input, testOptions, true)
  ),
  "delete-beginning": artifacts(
    arrayDeletionCodeLineMappings["delete-beginning"],
    [4, 8, 15],
    options(),
    [8, 15],
    "delete",
    deletionLegend
  ),
  "delete-end": artifacts(
    arrayDeletionCodeLineMappings["delete-end"],
    [4, 8, 15],
    options(),
    [4, 8],
    "delete",
    deletionLegend
  ),
  "delete-index": artifacts(
    arrayDeletionCodeLineMappings["delete-index"],
    [4, 8, 15],
    options({ index: 1 }),
    [4, 15],
    "delete",
    deletionLegend,
    validateIndex
  ),
  "delete-value": artifacts(
    arrayDeletionCodeLineMappings["delete-value"],
    [4, 8, 15],
    options({ value: 8 }),
    [4, 15],
    "delete",
    deletionLegend
  ),
  "update-by-index": artifacts(
    arrayOperationCodeLineMappings["update-by-index"],
    [4, 8, 15],
    options({ index: 1, value: 23 }),
    [4, 23, 15],
    "update",
    operationLegend,
    validateIndex
  ),
  "update-by-value": artifacts(
    arrayOperationCodeLineMappings["update-by-value"],
    [4, 8, 15, 8],
    options({ target: 8, value: 23 }),
    [4, 23, 15, 8],
    "update",
    operationLegend
  ),
  "merge-sorted-arrays": artifacts(
    arrayOperationCodeLineMappings["merge-sorted-arrays"],
    [4, 8, 1, 3],
    options(),
    [1, 3, 4, 8],
    "compare",
    operationLegend
  ),
  "reverse-array": artifacts(
    arrayOperationCodeLineMappings["reverse-array"],
    [4, 8, 15],
    options(),
    [15, 8, 4],
    "swap",
    operationLegend
  ),
  "left-rotation": artifacts(
    arrayOperationCodeLineMappings["left-rotation"],
    [4, 8, 15],
    options(),
    [8, 15, 4],
    "update",
    operationLegend
  ),
  "right-rotation": artifacts(
    arrayOperationCodeLineMappings["right-rotation"],
    [4, 8, 15],
    options(),
    [15, 4, 8],
    "update",
    operationLegend
  ),
  "remove-duplicates": artifacts(
    arrayOperationCodeLineMappings["remove-duplicates"],
    [4, 8, 4, 15, 8],
    options(),
    [4, 8, 15],
    "complete",
    operationLegend
  ),
};

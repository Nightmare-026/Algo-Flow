import type { VisualStep } from "@/types";
import {
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { arraySearchCodeLineMappings } from "@/features/algorithms/array/code-line-mappings";
import type { AuthoredPublicationArtifacts } from "../publication-registry";

const isNumberArray = (input: unknown): input is number[] =>
  Array.isArray(input) &&
  input.length > 0 &&
  input.length <= 20 &&
  input.every(
    (value) => typeof value === "number" && Number.isInteger(value),
  );

function validateSearchInput(
  input: number[],
  options: VisualizerInputOptions,
) {
  const errors: string[] = [];
  if (!isNumberArray(input)) {
    errors.push("Input must contain 1 to 20 whole numbers.");
  }
  if (!Number.isInteger(options.target)) {
    errors.push("Target must be a whole number.");
  }
  return errors;
}

const inputGenerators = [
  {
    id: "unsorted",
    label: "Unsorted values",
    generate: () => [15, 2, 23, 4, 8, 16],
  },
  {
    id: "duplicates",
    label: "Values with duplicates",
    generate: () => [7, 3, 7, 1, 7],
  },
] as const;

const legend = [
  {
    bucketKey: "active",
    label: "Compared",
    description: "The value currently compared with the target.",
    tone: "primary",
  },
  {
    bucketKey: "current",
    label: "Search focus",
    description: "The current probe or live search region.",
    tone: "info",
  },
  {
    bucketKey: "pointer",
    label: "Boundary",
    description: "A current low or high search boundary.",
    tone: "info",
  },
  {
    bucketKey: "visited",
    label: "Eliminated",
    description: "A value or region already ruled out.",
    tone: "muted",
  },
  {
    bucketKey: "found",
    label: "Found",
    description: "An element whose value equals the target.",
    tone: "success",
  },
] as const;

function options(target: number): VisualizerInputOptions {
  return {
    ...structuredClone(defaultVisualizerInputOptions),
    target,
  };
}

type ArrayState = {
  elements: ReadonlyArray<{ id: string; value: number }>;
};

function verifyFound(target: number, requireSorted: boolean) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const failures: string[] = [];
    const finalStep = steps.at(-1);
    if (finalStep?.actionType !== "success") {
      failures.push("A present target must finish with a success step.");
      return failures;
    }
    const foundId = finalStep.highlights.found?.[0];
    const elements = (finalStep.dataState as ArrayState).elements;
    if (elements.find((element) => element.id === foundId)?.value !== target) {
      failures.push("The found highlight must reference the target value.");
    }
    if (
      requireSorted &&
      elements.some(
        (element, index) =>
          index > 0 && element.value < elements[index - 1].value,
      )
    ) {
      failures.push("The search state must be sorted before probing.");
    }
    return failures;
  };
}

function verifyMissing(steps: ReadonlyArray<VisualStep>) {
  const failures: string[] = [];
  if (steps.at(-1)?.actionType !== "error") {
    failures.push("A missing target must finish with an error step.");
  }
  if (steps.some((step) => step.highlights.found?.length)) {
    failures.push("A missing target must never emit a found highlight.");
  }
  return failures;
}

function artifacts(
  codeLineMapping: AuthoredPublicationArtifacts["codeLineMapping"],
  validInput: number[],
  target: number,
  requireSorted: boolean,
  extraCases: AuthoredPublicationArtifacts["testCases"] = [],
): AuthoredPublicationArtifacts {
  return {
    inputSchema: isNumberArray,
    inputGenerators,
    validateInput: validateSearchInput,
    testCases: [
      {
        name: "finds a present target",
        input: validInput,
        options: options(target),
        verify: verifyFound(target, requireSorted),
      },
      {
        name: "terminates when the target is above the maximum",
        input: validInput,
        options: options(99),
        verify: verifyMissing,
      },
      ...extraCases,
    ],
    codeLineMapping,
    legend,
  };
}

export const arraySearchPublicationArtifacts: Record<
  "linear-search" | "binary-search" | "jump-search" | "interpolation-search",
  AuthoredPublicationArtifacts
> = {
  "linear-search": artifacts(
    arraySearchCodeLineMappings["linear-search"],
    [9, 1, 5, 3],
    5,
    false,
  ),
  "binary-search": artifacts(
    arraySearchCodeLineMappings["binary-search"],
    [9, 1, 5, 3],
    5,
    true,
  ),
  "jump-search": artifacts(
    arraySearchCodeLineMappings["jump-search"],
    [9, 1, 5, 3],
    5,
    true,
  ),
  "interpolation-search": artifacts(
    arraySearchCodeLineMappings["interpolation-search"],
    [9, 1, 5, 3],
    5,
    true,
    [
      {
        name: "handles an equal-value range without dividing by zero",
        input: [7, 7, 7],
        options: options(7),
        verify: verifyFound(7, true),
      },
    ],
  ),
};

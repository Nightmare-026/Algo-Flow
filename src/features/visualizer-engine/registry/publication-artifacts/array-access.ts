import type { VisualStep } from "@/types";
import {
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import type { AuthoredPublicationArtifacts } from "../publication-registry";
import { arrayAccessCodeLineMappings } from "@/features/algorithms/array/code-line-mappings";

const isNumberArray = (input: unknown): input is number[] =>
  Array.isArray(input) &&
  input.length > 0 &&
  input.length <= 20 &&
  input.every(
    (value) => typeof value === "number" && Number.isInteger(value),
  );

function validateAccessInput(
  input: number[],
  options: VisualizerInputOptions,
) {
  const errors: string[] = [];
  if (!isNumberArray(input)) {
    errors.push("Input must contain 1 to 20 whole numbers.");
  }
  if (!Number.isInteger(options.index)) {
    errors.push("Index must be a whole number.");
  } else if (options.index < 0 || options.index >= input.length) {
    errors.push(`Index must be between 0 and ${Math.max(0, input.length - 1)}.`);
  }
  return errors;
}

const inputGenerators = [
  {
    id: "balanced",
    label: "Balanced sample",
    generate: () => [15, 23, 4, 8, 42, 16],
  },
  {
    id: "random",
    label: "Random whole numbers",
    generate: () =>
      Array.from({ length: 8 }, () => Math.floor(Math.random() * 101) - 50),
  },
] as const;

const legend = [
  {
    bucketKey: "active",
    label: "Candidate",
    description: "The array element currently being checked for access.",
    tone: "info",
  },
  {
    bucketKey: "current",
    label: "Selected",
    description: "The element addressed by the requested index.",
    tone: "primary",
  },
  {
    bucketKey: "pointer",
    label: "Index pointer",
    description: "The direct array position used for the access.",
    tone: "info",
  },
  {
    bucketKey: "found",
    label: "Returned",
    description: "The value successfully returned from the array.",
    tone: "success",
  },
] as const;

function options(index: number): VisualizerInputOptions {
  return {
    ...structuredClone(defaultVisualizerInputOptions),
    index,
  };
}

function verifyValidAccess(steps: ReadonlyArray<VisualStep>) {
  const failures: string[] = [];
  const finalStep = steps.at(-1);
  if (!finalStep || !["access", "complete"].includes(finalStep.actionType)) {
    failures.push("Valid access must finish with an access/complete step.");
  }
  if (!steps.some((step) => step.highlights.found?.length)) {
    failures.push("Valid access must identify the returned element.");
  }
  if (steps.some((step) => step.actionType === "error")) {
    failures.push("Valid access must not emit an error step.");
  }
  return failures;
}

function verifyInvalidAccess(steps: ReadonlyArray<VisualStep>) {
  const failures: string[] = [];
  if (steps.at(-1)?.actionType !== "error") {
    failures.push("Out-of-range access must finish with an error step.");
  }
  if (
    steps.some((step) =>
      Object.values(step.highlights).some((ids) => ids?.length),
    )
  ) {
    failures.push("An invalid index must not reference a non-existent element.");
  }
  return failures;
}

function artifacts(
  codeLineMapping: AuthoredPublicationArtifacts["codeLineMapping"],
  validVerifier: (steps: ReadonlyArray<VisualStep>) => ReadonlyArray<string>,
): AuthoredPublicationArtifacts {
  return {
    inputSchema: isNumberArray,
    inputGenerators,
    validateInput: validateAccessInput,
    testCases: [
      {
        name: "returns an in-range element",
        input: [4, 8, 15],
        options: options(1),
        verify: validVerifier,
      },
      {
        name: "rejects an out-of-range index",
        input: [4, 8, 15],
        options: options(5),
        verify: verifyInvalidAccess,
      },
    ],
    codeLineMapping,
    legend,
  };
}

export const arrayAccessPublicationArtifacts: Record<
  "access" | "access-by-index" | "random-access",
  AuthoredPublicationArtifacts
> = {
  access: artifacts(arrayAccessCodeLineMappings.access, verifyValidAccess),
  "access-by-index": artifacts(
    arrayAccessCodeLineMappings["access-by-index"],
    verifyValidAccess,
  ),
  "random-access": artifacts(
    arrayAccessCodeLineMappings["random-access"],
    verifyValidAccess,
  ),
};

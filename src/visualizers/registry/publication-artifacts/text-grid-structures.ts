import type { VisualStep } from "@/types";
import {
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { matrixCodeLineMappings } from "@/visualizers/matrix/code-line-mappings";
import { stringCodeLineMappings } from "@/visualizers/string/code-line-mappings";
import type { AuthoredPublicationArtifacts } from "../publication-registry";

const isNumberInput = (input: unknown): input is number[] =>
  Array.isArray(input) &&
  input.length > 0 &&
  input.length <= 20 &&
  input.every((value) => Number.isInteger(value));

function validateMatrixInput(input: number[], options: VisualizerInputOptions) {
  const errors: string[] = [];
  if (!isNumberInput(input)) errors.push("Matrix input must contain 1 to 20 whole numbers.");
  if (!Number.isInteger(options.rows) || options.rows < 1 || options.rows > 4)
    errors.push("Rows must be between 1 and 4.");
  if (!Number.isInteger(options.cols) || options.cols < 1 || options.cols > 4)
    errors.push("Columns must be between 1 and 4.");
  if (input.length < options.rows * options.cols)
    errors.push("Matrix input must provide a value for every cell.");
  return errors;
}

function validateStringInput(input: number[], options: VisualizerInputOptions) {
  const errors = isNumberInput(input) ? [] : ["Visualizer seed input must contain whole numbers."];
  if (!options.text || options.text.length > 40)
    errors.push("Text must contain 1 to 40 characters.");
  if (options.pattern.length > options.text.length)
    errors.push("Pattern cannot be longer than the text.");
  return errors;
}

const matrixGenerators = [
  {
    id: "ascending-grid",
    label: "Ascending 4 by 4 grid",
    generate: () => Array.from({ length: 16 }, (_, index) => index + 1),
  },
  {
    id: "descending-grid",
    label: "Descending 4 by 4 grid",
    generate: () => Array.from({ length: 16 }, (_, index) => 16 - index),
  },
] as const;
const stringGenerators = [
  { id: "short-text", label: "Short text seed", generate: () => [1, 2, 3, 4] },
  { id: "single-seed", label: "Single text seed", generate: () => [1] },
] as const;

const matrixLegend = [
  {
    bucketKey: "active",
    label: "Current cell",
    description: "The matrix cell currently read or updated.",
    tone: "primary",
  },
  {
    bucketKey: "visited",
    label: "Visited cell",
    description: "A cell already processed by traversal or search.",
    tone: "muted",
  },
  {
    bucketKey: "pointer",
    label: "Matrix cursor",
    description: "The row-column cursor or active boundary.",
    tone: "info",
  },
  {
    bucketKey: "target",
    label: "Search target",
    description: "The requested matrix value.",
    tone: "info",
  },
  {
    bucketKey: "compared",
    label: "Compared cell",
    description: "A cell compared with the search target.",
    tone: "warning",
  },
  {
    bucketKey: "found",
    label: "Found cell",
    description: "The cell whose value matches the target.",
    tone: "success",
  },
  {
    bucketKey: "swapped",
    label: "Swapped cells",
    description: "Cells exchanged during matrix rotation.",
    tone: "warning",
  },
  {
    bucketKey: "success",
    label: "Search success",
    description: "The sorted-matrix cell matching the target.",
    tone: "success",
  },
  {
    bucketKey: "error",
    label: "Search miss",
    description: "A boundary state proving the target is absent.",
    tone: "error",
  },
] as const;

const stringLegend = [
  {
    bucketKey: "active",
    label: "Current character",
    description: "The text character currently inspected or changed.",
    tone: "primary",
  },
  {
    bucketKey: "visited",
    label: "Visited character",
    description: "A character already traversed.",
    tone: "muted",
  },
  {
    bucketKey: "pointer",
    label: "String pointer",
    description: "A text, pattern, left, or right pointer.",
    tone: "info",
  },
  {
    bucketKey: "compared",
    label: "Compared characters",
    description: "Text and pattern characters currently compared.",
    tone: "warning",
  },
  {
    bucketKey: "found",
    label: "Pattern found",
    description: "The matching substring or character range.",
    tone: "success",
  },
  {
    bucketKey: "success",
    label: "Confirmed character",
    description: "A character confirmed by the string operation.",
    tone: "success",
  },
  {
    bucketKey: "swapped",
    label: "Swapped characters",
    description: "The character pair exchanged during reversal.",
    tone: "warning",
  },
  {
    bucketKey: "sorted",
    label: "Palindrome confirmed",
    description: "Characters confirmed as part of a palindrome.",
    tone: "success",
  },
  {
    bucketKey: "error",
    label: "Mismatch",
    description: "A mismatch or invalid string index.",
    tone: "error",
  },
] as const;

function options(overrides: Partial<VisualizerInputOptions> = {}) {
  return { ...structuredClone(defaultVisualizerInputOptions), ...overrides };
}

type MatrixState = {
  rows: number;
  cols: number;
  elements: ReadonlyArray<{ id: string; value: number }>;
};
function verifyMatrix(actions: ReadonlyArray<VisualStep["actionType"]>, expectedValues?: number[]) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const failures: string[] = [];
    for (const action of actions)
      if (!steps.some((step) => step.actionType === action))
        failures.push(`Steps must include the ${action} action.`);
    const state = steps.at(-1)?.dataState as MatrixState | undefined;
    if (!state || state.elements.length !== state.rows * state.cols)
      failures.push("Final matrix state must contain every declared cell.");
    if (
      expectedValues &&
      JSON.stringify(state?.elements.map((element) => element.value)) !==
        JSON.stringify(expectedValues)
    )
      failures.push(`Final matrix values must be [${expectedValues.join(", ")}].`);
    if (steps.at(-1)?.actionType === "error")
      failures.push("Valid matrix input must not finish with an error.");
    return failures;
  };
}

function verifyMatrixSearch(steps: ReadonlyArray<VisualStep>) {
  const failures = verifyMatrix(["compare", "found"])(steps);
  const final = steps.at(-1);
  const state = final?.dataState as MatrixState | undefined;
  const foundId = final?.highlights.found?.[0];
  if (state?.elements[Number(foundId)]?.value !== 3)
    failures.push("Found highlight must reference matrix value 3.");
  return failures;
}

type StringState = { elements: ReadonlyArray<{ char: string }> };
function finalText(steps: ReadonlyArray<VisualStep>) {
  return (steps.at(-1)?.dataState as StringState | undefined)?.elements
    .map((element) => element.char)
    .join("");
}
function verifyString(actions: ReadonlyArray<VisualStep["actionType"]>, expectedText?: string) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const failures: string[] = [];
    for (const action of actions)
      if (!steps.some((step) => step.actionType === action))
        failures.push(`Steps must include the ${action} action.`);
    if (expectedText !== undefined && finalText(steps) !== expectedText)
      failures.push(`Final string must be "${expectedText}".`);
    if (steps.at(-1)?.actionType === "error")
      failures.push("Valid string input must not finish with an error.");
    return failures;
  };
}

function matrixArtifacts(
  slug: keyof typeof matrixCodeLineMappings,
  input: number[],
  testOptions: VisualizerInputOptions,
  verify: AuthoredPublicationArtifacts["testCases"][number]["verify"]
): AuthoredPublicationArtifacts {
  return {
    inputSchema: isNumberInput,
    inputGenerators: matrixGenerators,
    validateInput: validateMatrixInput,
    testCases: [
      { name: "satisfies the authored matrix outcome", input, options: testOptions, verify },
    ],
    codeLineMapping: matrixCodeLineMappings[slug],
    legend: matrixLegend,
  };
}
function stringArtifacts(
  slug: keyof typeof stringCodeLineMappings,
  testOptions: VisualizerInputOptions,
  verify: AuthoredPublicationArtifacts["testCases"][number]["verify"]
): AuthoredPublicationArtifacts {
  return {
    inputSchema: isNumberInput,
    inputGenerators: stringGenerators,
    validateInput: validateStringInput,
    testCases: [
      { name: "satisfies the authored string outcome", input: [1], options: testOptions, verify },
    ],
    codeLineMapping: stringCodeLineMappings[slug],
    legend: stringLegend,
  };
}

const grid = [1, 2, 3, 4];
const gridOptions = options({ rows: 2, cols: 2, target: 3 });
export const matrixPublicationArtifacts: Record<
  keyof typeof matrixCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "row-wise-traversal": matrixArtifacts(
    "row-wise-traversal",
    grid,
    gridOptions,
    verifyMatrix(["visit", "complete"], grid)
  ),
  "matrix-row-traversal": matrixArtifacts(
    "matrix-row-traversal",
    grid,
    gridOptions,
    verifyMatrix(["visit", "complete"], grid)
  ),
  "col-wise-traversal": matrixArtifacts(
    "col-wise-traversal",
    grid,
    gridOptions,
    verifyMatrix(["visit", "complete"], grid)
  ),
  "spiral-traversal": matrixArtifacts(
    "spiral-traversal",
    grid,
    gridOptions,
    verifyMatrix(["visit", "complete"], grid)
  ),
  "matrix-search": matrixArtifacts("matrix-search", grid, gridOptions, verifyMatrixSearch),
  "row-column-sorted-search": matrixArtifacts(
    "row-column-sorted-search",
    grid,
    gridOptions,
    verifyMatrix(["compare", "success"])
  ),
  "transpose-matrix": matrixArtifacts(
    "transpose-matrix",
    grid,
    gridOptions,
    verifyMatrix(["update"], [1, 3, 2, 4])
  ),
  "rotate-matrix-90": matrixArtifacts(
    "rotate-matrix-90",
    grid,
    gridOptions,
    verifyMatrix(["swap", "success"], [3, 1, 4, 2])
  ),
  "matrix-multiplication": matrixArtifacts(
    "matrix-multiplication",
    grid,
    gridOptions,
    verifyMatrix(["update", "success"])
  ),
  "matrix-addition": matrixArtifacts(
    "matrix-addition",
    grid,
    gridOptions,
    verifyMatrix(["update", "success"])
  ),
  "matrix-subtraction": matrixArtifacts(
    "matrix-subtraction",
    grid,
    gridOptions,
    verifyMatrix(["update", "success"])
  ),
};

const textOptions = options({ text: "ALGO", pattern: "GO", target: 2 });
export const stringPublicationArtifacts: Record<
  keyof typeof stringCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "string-forward-traversal": stringArtifacts(
    "string-forward-traversal",
    textOptions,
    verifyString(["visit", "complete"], "ALGO")
  ),
  "string-reverse-traversal": stringArtifacts(
    "string-reverse-traversal",
    textOptions,
    verifyString(["visit", "complete"], "ALGO")
  ),
  "string-palindrome": stringArtifacts(
    "string-palindrome",
    options({ text: "LEVEL", pattern: "" }),
    verifyString(["compare", "success"], "LEVEL")
  ),
  "string-naive-search": stringArtifacts(
    "string-naive-search",
    textOptions,
    verifyString(["compare", "found"], "ALGO")
  ),
  "string-kmp-search": stringArtifacts(
    "string-kmp-search",
    textOptions,
    verifyString(["compare", "found"], "ALGO")
  ),
  "string-rabin-karp": stringArtifacts(
    "string-rabin-karp",
    textOptions,
    verifyString(["compare", "found"], "ALGO")
  ),
  "reverse-string": stringArtifacts(
    "reverse-string",
    textOptions,
    verifyString(["swap", "complete"], "OGLA")
  ),
  "string-insert": stringArtifacts(
    "string-insert",
    textOptions,
    verifyString(["success"], "ALXGO")
  ),
  "string-delete": stringArtifacts("string-delete", textOptions, verifyString(["success"], "ALO")),
  "string-replace": stringArtifacts(
    "string-replace",
    textOptions,
    verifyString(["success"], "ALYO")
  ),
  "string-change-case": stringArtifacts(
    "string-change-case",
    textOptions,
    verifyString(["update", "success"], "algo")
  ),
};

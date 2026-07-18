import type { VisualStep } from "@/types";
import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { stringCodeLineMappings } from "./code-line-mappings";
import { coordinateStringSteps } from "./pseudocode-line-mappings";
import { getStringCodeExamples } from "./code-examples";
import {
  generateStringForwardTraversalSteps,
  generateStringReverseTraversalSteps,
} from "./traversal";
import { generateNaiveSearchSteps, generateKMPSearchSteps, generateRabinKarpSteps } from "./search";
import { generatePalindromeCheckSteps } from "./palindrome";
import {
  generateReverseStringSteps,
  generateStringInsertSteps,
  generateStringDeleteSteps,
  generateStringReplaceSteps,
  generateStringChangeCaseSteps,
} from "./transform";

function withLogicalLines(
  steps: VisualStep[],
  lines: Partial<Record<VisualStep["actionType"], number>>
) {
  return steps.map((step) => ({
    ...step,
    codeLine: step.codeLine ?? lines[step.actionType] ?? step.pseudocodeLine,
  }));
}

const rawStringRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "string-forward-traversal",
    generateSteps: (_, opts) =>
      withLogicalLines(generateStringForwardTraversalSteps(opts.text!), {
        initialize: 1,
        visit: 3,
        complete: 4,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-forward-traversal"],
  },
  {
    slug: "string-reverse-traversal",
    generateSteps: (_, opts) =>
      withLogicalLines(generateStringReverseTraversalSteps(opts.text!), {
        initialize: 1,
        visit: 3,
        complete: 4,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-reverse-traversal"],
  },
  {
    slug: "string-palindrome",
    generateSteps: (_, opts) =>
      withLogicalLines(generatePalindromeCheckSteps(opts.text!), {
        initialize: 1,
        compare: 3,
        error: 4,
        update: 6,
        success: 8,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-palindrome"],
  },
  {
    slug: "string-naive-search",
    generateSteps: (_, opts) =>
      withLogicalLines(generateNaiveSearchSteps(opts.text!, opts.pattern!), {
        initialize: 1,
        "move-pointer": 3,
        compare: 4,
        found: 6,
        "not-found": 8,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-naive-search"],
  },
  {
    slug: "string-kmp-search",
    generateSteps: (_, opts) =>
      withLogicalLines(generateKMPSearchSteps(opts.text!, opts.pattern!), {
        initialize: 1,
        highlight: 2,
        compare: 4,
        "move-pointer": 6,
        found: 12,
        "not-found": 12,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-kmp-search"],
  },
  {
    slug: "string-rabin-karp",
    generateSteps: (_, opts) =>
      withLogicalLines(generateRabinKarpSteps(opts.text!, opts.pattern!), {
        initialize: 1,
        highlight: 2,
        compare: 4,
        "move-pointer": 10,
        found: 6,
        "not-found": 12,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-rabin-karp"],
  },
  {
    slug: "reverse-string",
    generateSteps: (_, opts) =>
      withLogicalLines(generateReverseStringSteps(opts.text!), {
        initialize: 1,
        compare: 3,
        swap: 4,
        complete: 6,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["reverse-string"],
  },
  {
    slug: "string-insert",
    generateSteps: (_, opts) =>
      withLogicalLines(generateStringInsertSteps(opts.text!, String(opts.target!), "X"), {
        initialize: 1,
        error: 2,
        success: 3,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-insert"],
  },
  {
    slug: "string-delete",
    generateSteps: (_, opts) =>
      withLogicalLines(generateStringDeleteSteps(opts.text!, String(opts.target!)), {
        initialize: 1,
        error: 2,
        success: 3,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-delete"],
  },
  {
    slug: "string-replace",
    generateSteps: (_, opts) =>
      withLogicalLines(generateStringReplaceSteps(opts.text!, String(opts.target!), "Y"), {
        initialize: 1,
        error: 2,
        success: 3,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-replace"],
  },
  {
    slug: "string-change-case",
    generateSteps: (_, opts) =>
      withLogicalLines(generateStringChangeCaseSteps(opts.text!), {
        initialize: 1,
        update: 3,
        success: 4,
      }),
    getCodeExamples: getStringCodeExamples,
    codeLineMapping: stringCodeLineMappings["string-change-case"],
  },
];

export const stringRegistry: AlgorithmVisualizerDefinition[] = rawStringRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateStringSteps(definition.slug, definition.generateSteps(data, options)),
  })
);

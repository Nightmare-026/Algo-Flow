import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { getStackCodeExamples } from "./code-examples";
import { stackCodeLineMappings } from "./code-line-mappings";
import { coordinateStackSteps } from "./pseudocode-line-mappings";
import { generateStackPushSteps } from "./push";
import { generateStackPopSteps } from "./pop";
import {
  generateStackIsEmptySteps,
  generateStackIsFullSteps,
  generateStackPeekSteps,
  generateStackSizeSteps,
  generateArrayStackSteps,
} from "./status";
import {
  generateBalancedParenthesesSteps,
  generateInfixToPostfixSteps,
  generatePostfixEvaluationSteps,
  generateMinStackSteps,
  generateNextGreaterElementSteps,
} from "./applications";

const rawStackRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "array-stack",
    generateSteps: (data, opts) => generateArrayStackSteps(data, opts.capacity!),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["array-stack"],
  },
  {
    slug: "stack-push",
    generateSteps: (data, opts) => generateStackPushSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["stack-push"],
  },
  {
    slug: "stack-pop",
    generateSteps: (data, opts) => generateStackPopSteps(data, opts.capacity!),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["stack-pop"],
  },
  {
    slug: "stack-peek",
    generateSteps: (data, opts) => generateStackPeekSteps(data, opts.capacity!),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["stack-peek"],
  },
  {
    slug: "stack-is-empty",
    generateSteps: (data, opts) => generateStackIsEmptySteps(data, opts.capacity!),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["stack-is-empty"],
  },
  {
    slug: "stack-is-full",
    generateSteps: (data, opts) => generateStackIsFullSteps(data, opts.capacity!),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["stack-is-full"],
  },
  {
    slug: "stack-size",
    generateSteps: (data, opts) => generateStackSizeSteps(data, opts.capacity!),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["stack-size"],
  },
  {
    slug: "balanced-parentheses",
    generateSteps: (_data, opts) =>
      generateBalancedParenthesesSteps(
        opts.text && /[()\[\]{}]/.test(opts.text) ? opts.text : "{[()]}"
      ),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["balanced-parentheses"],
  },
  {
    slug: "infix-to-postfix",
    generateSteps: (_data, opts) =>
      generateInfixToPostfixSteps(
        opts.text && /[+\-*/^()]/.test(opts.text) ? opts.text : "A + B * C"
      ),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["infix-to-postfix"],
  },
  {
    slug: "postfix-evaluation",
    generateSteps: (_data, opts) =>
      generatePostfixEvaluationSteps(
        opts.text && /[+\-*/^]/.test(opts.text) ? opts.text : "5 3 + 2 *"
      ),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["postfix-evaluation"],
  },
  {
    slug: "min-stack",
    generateSteps: (data) => generateMinStackSteps(data),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["min-stack"],
  },
  {
    slug: "next-greater-element",
    generateSteps: (data) => generateNextGreaterElementSteps(data),
    getCodeExamples: getStackCodeExamples,
    codeLineMapping: stackCodeLineMappings["next-greater-element"],
  },
];

export const stackRegistry: AlgorithmVisualizerDefinition[] = rawStackRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateStackSteps(definition.slug, definition.generateSteps(data, options)),
  })
);

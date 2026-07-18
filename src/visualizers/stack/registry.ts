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
];

export const stackRegistry: AlgorithmVisualizerDefinition[] = rawStackRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateStackSteps(definition.slug, definition.generateSteps(data, options)),
  })
);

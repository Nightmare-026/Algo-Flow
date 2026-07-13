import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getStackCodeExamples } from "./code-examples";
import { generateStackPushSteps } from "./push";
import { generateStackPopSteps } from "./pop";
import { generateStackIsEmptySteps, generateStackIsFullSteps, generateStackPeekSteps, generateStackSizeSteps, generateArrayStackSteps } from "./status";

export const stackRegistry: AlgorithmVisualizerDefinition[] = [
  { slug: "array-stack", generateSteps: (data, opts) => generateArrayStackSteps(data, opts.capacity!), getCodeExamples: getStackCodeExamples },
  { slug: "stack-push", generateSteps: (data, opts) => generateStackPushSteps(data, opts.value!, opts.capacity!), getCodeExamples: getStackCodeExamples },
  { slug: "stack-pop", generateSteps: (data, opts) => generateStackPopSteps(data, opts.capacity!), getCodeExamples: getStackCodeExamples },
  { slug: "stack-peek", generateSteps: (data, opts) => generateStackPeekSteps(data, opts.capacity!), getCodeExamples: getStackCodeExamples },
  { slug: "stack-is-empty", generateSteps: (data, opts) => generateStackIsEmptySteps(data, opts.capacity!), getCodeExamples: getStackCodeExamples },
  { slug: "stack-is-full", generateSteps: (data, opts) => generateStackIsFullSteps(data, opts.capacity!), getCodeExamples: getStackCodeExamples },
  { slug: "stack-size", generateSteps: (data, opts) => generateStackSizeSteps(data, opts.capacity!), getCodeExamples: getStackCodeExamples },
];

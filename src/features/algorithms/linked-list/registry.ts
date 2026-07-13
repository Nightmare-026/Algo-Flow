import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getLinkedListCodeExamples } from "./code-examples";
import { generateSLLTraversalSteps } from "./traversal";
import { generateSLLSearchSteps } from "./search";
import { generateSLLInsertHeadSteps, generateSLLInsertTailSteps } from "./insertion";
import { generateSLLDeleteSteps } from "./deletion";
import { generateLinkedListTypesSteps, generateSLLInsertPositionSteps, generateSLLDeleteHeadSteps, generateSLLReverseSteps, generateSLLDetectCycleSteps } from "./additional";

export const linkedListRegistry: AlgorithmVisualizerDefinition[] = [
  { slug: "linked-list-types", generateSteps: (data) => generateLinkedListTypesSteps(data), getCodeExamples: getLinkedListCodeExamples },
  { slug: "sll-traversal", generateSteps: (data) => generateSLLTraversalSteps(data), getCodeExamples: getLinkedListCodeExamples },
  { slug: "sll-search", generateSteps: (data, opts) => generateSLLSearchSteps(data, opts.target!), getCodeExamples: getLinkedListCodeExamples },
  { slug: "sll-insert-head", generateSteps: (data, opts) => generateSLLInsertHeadSteps(data, opts.value!), getCodeExamples: getLinkedListCodeExamples },
  { slug: "sll-insert-tail", generateSteps: (data, opts) => generateSLLInsertTailSteps(data, opts.value!), getCodeExamples: getLinkedListCodeExamples },
  { slug: "sll-insert-position", generateSteps: (data, opts) => generateSLLInsertPositionSteps(data, opts.value!, opts.index!), getCodeExamples: getLinkedListCodeExamples },
  { slug: "sll-delete", generateSteps: (data, opts) => generateSLLDeleteSteps(data, opts.target!), getCodeExamples: getLinkedListCodeExamples },
  { slug: "sll-delete-head", generateSteps: (data) => generateSLLDeleteHeadSteps(data), getCodeExamples: getLinkedListCodeExamples },
  { slug: "sll-reverse", generateSteps: (data) => generateSLLReverseSteps(data), getCodeExamples: getLinkedListCodeExamples },
  { slug: "sll-detect-cycle", generateSteps: (data) => generateSLLDetectCycleSteps(data), getCodeExamples: getLinkedListCodeExamples },
];

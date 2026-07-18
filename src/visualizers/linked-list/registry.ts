import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { getLinkedListCodeExamples } from "./code-examples";
import { linkedListCodeLineMappings } from "./code-line-mappings";
import { coordinateLinkedListSteps } from "./pseudocode-line-mappings";
import { generateSLLTraversalSteps } from "./traversal";
import { generateSLLSearchSteps } from "./search";
import { generateSLLInsertHeadSteps, generateSLLInsertTailSteps } from "./insertion";
import { generateSLLDeleteSteps } from "./deletion";
import {
  generateLinkedListTypesSteps,
  generateSLLInsertPositionSteps,
  generateSLLDeleteHeadSteps,
  generateSLLReverseSteps,
  generateSLLDetectCycleSteps,
} from "./additional";

const rawLinkedListRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "linked-list-types",
    generateSteps: (data) => generateLinkedListTypesSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["linked-list-types"],
  },
  {
    slug: "sll-traversal",
    generateSteps: (data) => generateSLLTraversalSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-traversal"],
  },
  {
    slug: "sll-search",
    generateSteps: (data, opts) => generateSLLSearchSteps(data, opts.target!),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-search"],
  },
  {
    slug: "sll-insert-head",
    generateSteps: (data, opts) => generateSLLInsertHeadSteps(data, opts.value!),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-insert-head"],
  },
  {
    slug: "sll-insert-tail",
    generateSteps: (data, opts) => generateSLLInsertTailSteps(data, opts.value!),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-insert-tail"],
  },
  {
    slug: "sll-insert-position",
    generateSteps: (data, opts) => generateSLLInsertPositionSteps(data, opts.value!, opts.index!),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-insert-position"],
  },
  {
    slug: "sll-delete",
    generateSteps: (data, opts) => generateSLLDeleteSteps(data, opts.target!),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-delete"],
  },
  {
    slug: "sll-delete-head",
    generateSteps: (data) => generateSLLDeleteHeadSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-delete-head"],
  },
  {
    slug: "sll-reverse",
    generateSteps: (data) => generateSLLReverseSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-reverse"],
  },
  {
    slug: "sll-detect-cycle",
    generateSteps: (data) => generateSLLDetectCycleSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-detect-cycle"],
  },
];

export const linkedListRegistry: AlgorithmVisualizerDefinition[] = rawLinkedListRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateLinkedListSteps(definition.slug, definition.generateSteps(data, options)),
  })
);

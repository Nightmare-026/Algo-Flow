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
import {
  generateSLLDeleteTailSteps,
  generateSLLFindMiddleSteps,
  generateSLLRemoveDuplicatesSteps,
} from "./sll-advanced";
import {
  generateDLLTraversalSteps,
  generateDLLInsertHeadSteps,
  generateDLLInsertTailSteps,
  generateDLLDeleteHeadSteps,
  generateDLLDeleteTailSteps,
  generateDLLReverseSteps,
} from "./doubly-linked-list";
import {
  generateCLLTraversalSteps,
  generateCLLInsertHeadSteps,
  generateCLLInsertTailSteps,
  generateCLLDeleteHeadSteps,
} from "./circular-linked-list";

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
    slug: "sll-delete-tail",
    generateSteps: (data) => generateSLLDeleteTailSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-delete-tail"],
  },
  {
    slug: "sll-reverse",
    generateSteps: (data) => generateSLLReverseSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-reverse"],
  },
  {
    slug: "sll-find-middle",
    generateSteps: (data) => generateSLLFindMiddleSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-find-middle"],
  },
  {
    slug: "sll-remove-duplicates",
    generateSteps: (data) => generateSLLRemoveDuplicatesSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-remove-duplicates"],
  },
  {
    slug: "sll-detect-cycle",
    generateSteps: (data) => generateSLLDetectCycleSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["sll-detect-cycle"],
  },

  // Doubly Linked List
  {
    slug: "dll-traversal",
    generateSteps: (data) => generateDLLTraversalSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["dll-traversal"],
  },
  {
    slug: "dll-insert-head",
    generateSteps: (data, opts) => generateDLLInsertHeadSteps(data, opts.value ?? 10),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["dll-insert-head"],
  },
  {
    slug: "dll-insert-tail",
    generateSteps: (data, opts) => generateDLLInsertTailSteps(data, opts.value ?? 99),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["dll-insert-tail"],
  },
  {
    slug: "dll-delete-head",
    generateSteps: (data) => generateDLLDeleteHeadSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["dll-delete-head"],
  },
  {
    slug: "dll-delete-tail",
    generateSteps: (data) => generateDLLDeleteTailSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["dll-delete-tail"],
  },
  {
    slug: "dll-reverse",
    generateSteps: (data) => generateDLLReverseSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["dll-reverse"],
  },

  // Circular Linked List
  {
    slug: "cll-traversal",
    generateSteps: (data) => generateCLLTraversalSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["cll-traversal"],
  },
  {
    slug: "cll-insert-head",
    generateSteps: (data, opts) => generateCLLInsertHeadSteps(data, opts.value ?? 10),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["cll-insert-head"],
  },
  {
    slug: "cll-insert-tail",
    generateSteps: (data, opts) => generateCLLInsertTailSteps(data, opts.value ?? 99),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["cll-insert-tail"],
  },
  {
    slug: "cll-delete-head",
    generateSteps: (data) => generateCLLDeleteHeadSteps(data),
    getCodeExamples: getLinkedListCodeExamples,
    codeLineMapping: linkedListCodeLineMappings["cll-delete-head"],
  },
];

export const linkedListRegistry: AlgorithmVisualizerDefinition[] = rawLinkedListRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateLinkedListSteps(definition.slug, definition.generateSteps(data, options)),
  })
);

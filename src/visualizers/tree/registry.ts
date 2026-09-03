import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { getTreeCodeExamples } from "./code-examples";
import { treeCodeLineMappings } from "./code-line-mappings";
import { coordinateTreeSteps } from "./pseudocode-line-mappings";
import {
  generateTreeInorderSteps,
  generateTreePreorderSteps,
  generateTreePostorderSteps,
  generateTreeLevelOrderSteps,
} from "./traversal";
import { generateBSTSearchSteps, generateBSTInsertSteps } from "./bst-operations";
import { generateBSTDeleteSteps } from "./bst-deletion";
import { generateAVLRotationsSteps } from "./avl-rotations";
import { generateHeapExtractMaxSteps, generateHeapifySteps } from "./heap-operations";
import { generateTrieSearchSteps } from "./trie-search";
import {
  generateHeapInsertSteps,
  generateTrieInsertWordSteps,
  generateSegmentTreeBuildSteps,
} from "./additional";
import { createDefaultTree } from "./types";

const rawTreeRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "inorder-traversal",
    generateSteps: (data, opts) => generateTreeInorderSteps(data, opts.treeState || createDefaultTree()),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["inorder-traversal"],
  },
  {
    slug: "preorder-traversal",
    generateSteps: (data, opts) => generateTreePreorderSteps(data, opts.treeState || createDefaultTree()),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["preorder-traversal"],
  },
  {
    slug: "postorder-traversal",
    generateSteps: (data, opts) => generateTreePostorderSteps(data, opts.treeState || createDefaultTree()),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["postorder-traversal"],
  },
  {
    slug: "level-order-traversal",
    generateSteps: (data, opts) => generateTreeLevelOrderSteps(data, opts.treeState || createDefaultTree()),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["level-order-traversal"],
  },
  {
    slug: "bst-search",
    generateSteps: (data, opts) => generateBSTSearchSteps(data, opts.target!, opts.treeState!),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["bst-search"],
  },
  {
    slug: "bst-insertion",
    generateSteps: (data, opts) => generateBSTInsertSteps(data, opts.value!, opts.treeState!),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["bst-insertion"],
  },
  {
    slug: "bst-deletion",
    generateSteps: (data, opts) => generateBSTDeleteSteps(data, opts.target ?? 3, opts.treeState),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["bst-deletion"],
  },
  {
    slug: "avl-rotations",
    generateSteps: (data, opts) => generateAVLRotationsSteps(opts?.pattern || "LL", opts?.treeState),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["avl-rotations"],
  },
  {
    slug: "heap-insert",
    generateSteps: (data, opts) => generateHeapInsertSteps(data, opts.value!),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["heap-insert"],
  },
  {
    slug: "heap-extract-max",
    generateSteps: (data) => generateHeapExtractMaxSteps(data),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["heap-extract-max"],
  },
  {
    slug: "heapify",
    generateSteps: (data) => generateHeapifySteps(data),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["heapify"],
  },
  {
    slug: "trie-insert-word",
    generateSteps: () => generateTrieInsertWordSteps(),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["trie-insert-word"],
  },
  {
    slug: "trie-search",
    generateSteps: (_, opts) => generateTrieSearchSteps(opts.text || "CODE"),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["trie-search"],
  },
  {
    slug: "build-segment-tree",
    generateSteps: (data) => generateSegmentTreeBuildSteps(data),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["build-segment-tree"],
  },
];

export const treeRegistry: AlgorithmVisualizerDefinition[] = rawTreeRegistry.map((definition) => ({
  ...definition,
  generateSteps: (data, options) =>
    coordinateTreeSteps(definition.slug, definition.generateSteps(data, options)),
}));

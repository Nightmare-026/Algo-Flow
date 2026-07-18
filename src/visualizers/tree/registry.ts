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
import {
  generateHeapInsertSteps,
  generateTrieInsertWordSteps,
  generateSegmentTreeBuildSteps,
} from "./additional";

const rawTreeRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "inorder-traversal",
    generateSteps: (data, opts) => generateTreeInorderSteps(data, opts.treeState!),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["inorder-traversal"],
  },
  {
    slug: "preorder-traversal",
    generateSteps: (data, opts) => generateTreePreorderSteps(data, opts.treeState!),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["preorder-traversal"],
  },
  {
    slug: "postorder-traversal",
    generateSteps: (data, opts) => generateTreePostorderSteps(data, opts.treeState!),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["postorder-traversal"],
  },
  {
    slug: "level-order-traversal",
    generateSteps: (data, opts) => generateTreeLevelOrderSteps(data, opts.treeState!),
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
    slug: "heap-insert",
    generateSteps: (data, opts) => generateHeapInsertSteps(data, opts.value!),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["heap-insert"],
  },
  {
    slug: "trie-insert-word",
    generateSteps: () => generateTrieInsertWordSteps(),
    getCodeExamples: getTreeCodeExamples,
    codeLineMapping: treeCodeLineMappings["trie-insert-word"],
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

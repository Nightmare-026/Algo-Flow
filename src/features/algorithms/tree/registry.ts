import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getTreeCodeExamples } from "./code-examples";
import { generateTreeInorderSteps, generateTreePreorderSteps, generateTreePostorderSteps, generateTreeLevelOrderSteps } from "./traversal";
import { generateBSTSearchSteps, generateBSTInsertSteps } from "./bst-operations";
import { generateHeapInsertSteps, generateTrieInsertWordSteps, generateSegmentTreeBuildSteps } from "./additional";

export const treeRegistry: AlgorithmVisualizerDefinition[] = [
  { slug: "inorder-traversal", generateSteps: (data, opts) => generateTreeInorderSteps(data, opts.treeState!), getCodeExamples: getTreeCodeExamples },
  { slug: "preorder-traversal", generateSteps: (data, opts) => generateTreePreorderSteps(data, opts.treeState!), getCodeExamples: getTreeCodeExamples },
  { slug: "postorder-traversal", generateSteps: (data, opts) => generateTreePostorderSteps(data, opts.treeState!), getCodeExamples: getTreeCodeExamples },
  { slug: "level-order-traversal", generateSteps: (data, opts) => generateTreeLevelOrderSteps(data, opts.treeState!), getCodeExamples: getTreeCodeExamples },
  { slug: "bst-search", generateSteps: (data, opts) => generateBSTSearchSteps(data, opts.target!, opts.treeState!), getCodeExamples: getTreeCodeExamples },
  { slug: "bst-insertion", generateSteps: (data, opts) => generateBSTInsertSteps(data, opts.value!, opts.treeState!), getCodeExamples: getTreeCodeExamples },
  { slug: "heap-insert", generateSteps: (data, opts) => generateHeapInsertSteps(data, opts.value!), getCodeExamples: getTreeCodeExamples },
  { slug: "trie-insert-word", generateSteps: () => generateTrieInsertWordSteps(), getCodeExamples: getTreeCodeExamples },
  { slug: "build-segment-tree", generateSteps: (data) => generateSegmentTreeBuildSteps(data), getCodeExamples: getTreeCodeExamples },
];

import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getArrayCodeExamples } from "./code-examples";
import {
  arrayAccessCodeLineMappings,
  arraySearchCodeLineMappings,
  arraySortCodeLineMappings,
  arrayTraversalCodeLineMappings,
} from "./code-line-mappings";
import { generateAccessElementSteps, generateAccessByIndexSteps } from "./access";
import { generateForwardTraversalSteps, generateReverseTraversalSteps, generateRangeTraversalSteps } from "./traversal";
import { generateLinearSearchSteps, generateBinarySearchSteps, generateJumpSearchSteps, generateInterpolationSearchSteps } from "./search";
import { generateBubbleSortSteps, generateInsertionSortSteps, generateMergeSortSteps, generateQuickSortSteps, generateSelectionSortSteps, generateHeapSortSteps, generateCountingSortSteps, generateRadixSortSteps } from "./sort";
import { generateInsertBeginningSteps, generateInsertEndSteps, generateInsertIndexSteps } from "./insertion";
import { generateDeleteBeginningSteps, generateDeleteEndSteps, generateDeleteIndexSteps, generateDeleteValueSteps } from "./deletion";
import { generateUpdateByIndexSteps, generateUpdateByValueSteps, generateMergeSortedArraysSteps, generateReverseArraySteps, generateLeftRotationSteps, generateRightRotationSteps, generateRemoveDuplicatesSteps } from "./operations";

export const arrayRegistry: AlgorithmVisualizerDefinition[] = [
  { slug: "access", generateSteps: (data, opts) => generateAccessElementSteps(data, opts.index), getCodeExamples: getArrayCodeExamples, codeLineMapping: arrayAccessCodeLineMappings.access },
  { slug: "access-by-index", generateSteps: (data, opts) => generateAccessByIndexSteps(data, opts.index), getCodeExamples: getArrayCodeExamples, codeLineMapping: arrayAccessCodeLineMappings["access-by-index"] },
  { slug: "random-access", generateSteps: (data, opts) => generateAccessByIndexSteps(data, opts.index), getCodeExamples: getArrayCodeExamples, codeLineMapping: arrayAccessCodeLineMappings["random-access"] },
  { slug: "forward-traversal", generateSteps: (data) => generateForwardTraversalSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arrayTraversalCodeLineMappings["forward-traversal"] },
  { slug: "reverse-traversal", generateSteps: (data) => generateReverseTraversalSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arrayTraversalCodeLineMappings["reverse-traversal"] },
  { slug: "range-traversal", generateSteps: (data, opts) => generateRangeTraversalSteps(data, Math.min(opts.index, data.length - 1), data.length - 1), getCodeExamples: getArrayCodeExamples, codeLineMapping: arrayTraversalCodeLineMappings["range-traversal"] },
  { slug: "linear-search", generateSteps: (data, opts) => generateLinearSearchSteps(data, opts.target), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySearchCodeLineMappings["linear-search"] },
  { slug: "binary-search", generateSteps: (data, opts) => generateBinarySearchSteps(data, opts.target), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySearchCodeLineMappings["binary-search"] },
  { slug: "jump-search", generateSteps: (data, opts) => generateJumpSearchSteps(data, opts.target), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySearchCodeLineMappings["jump-search"] },
  { slug: "interpolation-search", generateSteps: (data, opts) => generateInterpolationSearchSteps(data, opts.target), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySearchCodeLineMappings["interpolation-search"] },
  { slug: "bubble-sort", generateSteps: (data) => generateBubbleSortSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySortCodeLineMappings["bubble-sort"] },
  { slug: "selection-sort", generateSteps: (data) => generateSelectionSortSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySortCodeLineMappings["selection-sort"] },
  { slug: "insertion-sort", generateSteps: (data) => generateInsertionSortSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySortCodeLineMappings["insertion-sort"] },
  { slug: "merge-sort", generateSteps: (data) => generateMergeSortSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySortCodeLineMappings["merge-sort"] },
  { slug: "quick-sort", generateSteps: (data) => generateQuickSortSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySortCodeLineMappings["quick-sort"] },
  { slug: "heap-sort", generateSteps: (data) => generateHeapSortSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySortCodeLineMappings["heap-sort"] },
  { slug: "counting-sort", generateSteps: (data) => generateCountingSortSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySortCodeLineMappings["counting-sort"] },
  { slug: "radix-sort", generateSteps: (data) => generateRadixSortSteps(data), getCodeExamples: getArrayCodeExamples, codeLineMapping: arraySortCodeLineMappings["radix-sort"] },
  { slug: "insert-beginning", generateSteps: (data, opts) => generateInsertBeginningSteps(data, opts.value), getCodeExamples: getArrayCodeExamples },
  { slug: "insert-end", generateSteps: (data, opts) => generateInsertEndSteps(data, opts.value), getCodeExamples: getArrayCodeExamples },
  { slug: "insert-index", generateSteps: (data, opts) => generateInsertIndexSteps(data, opts.value, opts.index), getCodeExamples: getArrayCodeExamples },
  { slug: "delete-beginning", generateSteps: (data) => generateDeleteBeginningSteps(data), getCodeExamples: getArrayCodeExamples },
  { slug: "delete-end", generateSteps: (data) => generateDeleteEndSteps(data), getCodeExamples: getArrayCodeExamples },
  { slug: "delete-index", generateSteps: (data, opts) => generateDeleteIndexSteps(data, opts.index), getCodeExamples: getArrayCodeExamples },
  { slug: "delete-value", generateSteps: (data, opts) => generateDeleteValueSteps(data, opts.value), getCodeExamples: getArrayCodeExamples },
  { slug: "update-by-index", generateSteps: (data, opts) => generateUpdateByIndexSteps(data, opts.value, opts.index), getCodeExamples: getArrayCodeExamples },
  { slug: "update-by-value", generateSteps: (data, opts) => generateUpdateByValueSteps(data, opts.target, opts.value), getCodeExamples: getArrayCodeExamples },
  { slug: "merge-sorted-arrays", generateSteps: (data) => generateMergeSortedArraysSteps(data), getCodeExamples: getArrayCodeExamples },
  { slug: "reverse-array", generateSteps: (data) => generateReverseArraySteps(data), getCodeExamples: getArrayCodeExamples },
  { slug: "left-rotation", generateSteps: (data) => generateLeftRotationSteps(data), getCodeExamples: getArrayCodeExamples },
  { slug: "right-rotation", generateSteps: (data) => generateRightRotationSteps(data), getCodeExamples: getArrayCodeExamples },
  { slug: "remove-duplicates", generateSteps: (data) => generateRemoveDuplicatesSteps(data), getCodeExamples: getArrayCodeExamples },
];

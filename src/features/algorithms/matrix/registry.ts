import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getMatrixCodeExamples } from "./code-examples";
import {
  generateRowWiseTraversalSteps,
  generateColWiseTraversalSteps,
  generateSpiralTraversalSteps,
} from "./traversal";
import { generateMatrixSearchSteps, generateSortedMatrixSearchSteps } from "./search";
import {
  generateTransposeMatrixSteps,
  generateRotateMatrixSteps,
  generateMatrixMultiplicationSteps,
  generateMatrixAdditionSteps,
  generateMatrixSubtractionSteps,
} from "./math";

export const matrixRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "row-wise-traversal",
    generateSteps: (data, opts) =>
      generateRowWiseTraversalSteps(data, opts.rows || 3, opts.cols || 3),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "matrix-row-traversal",
    generateSteps: (data, opts) =>
      generateRowWiseTraversalSteps(data, opts.rows || 3, opts.cols || 3),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "col-wise-traversal",
    generateSteps: (data, opts) =>
      generateColWiseTraversalSteps(data, opts.rows || 3, opts.cols || 3),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "spiral-traversal",
    generateSteps: (data, opts) =>
      generateSpiralTraversalSteps(data, opts.rows || 3, opts.cols || 3),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "matrix-search",
    generateSteps: (data, opts) =>
      generateMatrixSearchSteps(data, opts.rows || 3, opts.cols || 3, opts.target!),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "row-column-sorted-search",
    generateSteps: (data, opts) =>
      generateSortedMatrixSearchSteps(data, opts.rows || 3, opts.cols || 3, opts.target!),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "transpose-matrix",
    generateSteps: (data, opts) =>
      generateTransposeMatrixSteps(data, opts.rows || 3, opts.cols || 3),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "rotate-matrix-90",
    generateSteps: (data, opts) => generateRotateMatrixSteps(data, opts.rows || 3, opts.cols || 3),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "matrix-multiplication",
    generateSteps: (data, opts) =>
      generateMatrixMultiplicationSteps(data, opts.rows || 3, opts.cols || 3),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "matrix-addition",
    generateSteps: (data, opts) =>
      generateMatrixAdditionSteps(data, opts.rows || 3, opts.cols || 3),
    getCodeExamples: getMatrixCodeExamples,
  },
  {
    slug: "matrix-subtraction",
    generateSteps: (data, opts) =>
      generateMatrixSubtractionSteps(data, opts.rows || 3, opts.cols || 3),
    getCodeExamples: getMatrixCodeExamples,
  },
];

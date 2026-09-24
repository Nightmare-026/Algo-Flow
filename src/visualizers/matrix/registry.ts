import type { VisualStep } from "@/types";
import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { matrixCodeLineMappings } from "./code-line-mappings";
import { coordinateMatrixSteps } from "./pseudocode-line-mappings";
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
function withLogicalLines(
  steps: VisualStep[],
  lines: Partial<Record<VisualStep["actionType"], number>>
) {
  return steps.map((step) => ({
    ...step,
    codeLine: step.codeLine ?? lines[step.actionType] ?? step.pseudocodeLine,
  }));
}

const rawMatrixRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "row-wise-traversal",
    generateSteps: (data, opts) =>
      withLogicalLines(generateRowWiseTraversalSteps(data, opts.rows || 3, opts.cols || 3), {
        initialize: 1,
        visit: 3,
        complete: 4,
      }),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["row-wise-traversal"],
  },
  {
    slug: "col-wise-traversal",
    generateSteps: (data, opts) =>
      withLogicalLines(generateColWiseTraversalSteps(data, opts.rows || 3, opts.cols || 3), {
        initialize: 1,
        visit: 3,
        complete: 4,
      }),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["col-wise-traversal"],
  },
  {
    slug: "spiral-traversal",
    generateSteps: (data, opts) =>
      withLogicalLines(generateSpiralTraversalSteps(data, opts.rows || 3, opts.cols || 3), {
        initialize: 1,
        visit: 3,
        complete: 4,
      }),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["spiral-traversal"],
  },
  {
    slug: "matrix-search",
    generateSteps: (data, opts) =>
      withLogicalLines(
        generateMatrixSearchSteps(data, opts.rows || 3, opts.cols || 3, opts.target!),
        { initialize: 1, compare: 3, found: 4, "not-found": 6 }
      ),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["matrix-search"],
  },
  {
    slug: "row-column-sorted-search",
    generateSteps: (data, opts) =>
      withLogicalLines(
        generateSortedMatrixSearchSteps(data, opts.rows || 3, opts.cols || 3, opts.target!),
        { initialize: 1, compare: 3, update: 4, found: 4, success: 4, "not-found": 6 }
      ),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["row-column-sorted-search"],
  },
  {
    slug: "transpose-matrix",
    generateSteps: (data, opts) =>
      withLogicalLines(generateTransposeMatrixSteps(data, opts.rows || 3, opts.cols || 3), {
        initialize: 1,
        compare: 3,
        update: 4,
      }),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["transpose-matrix"],
  },
  {
    slug: "rotate-matrix-90",
    generateSteps: (data, opts) =>
      withLogicalLines(generateRotateMatrixSteps(data, opts.rows || 3, opts.cols || 3), {
        initialize: 1,
        compare: 3,
        swap: 4,
        success: 6,
      }),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["rotate-matrix-90"],
  },
  {
    slug: "matrix-multiplication",
    generateSteps: (data, opts) =>
      withLogicalLines(
        generateMatrixMultiplicationSteps(data, opts.rows || 3, opts.cols || 3, opts.matrixB),
        {
          initialize: 1,
          update: 4,
          success: 6,
        }
      ),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["matrix-multiplication"],
  },
  {
    slug: "matrix-addition",
    generateSteps: (data, opts) =>
      withLogicalLines(
        generateMatrixAdditionSteps(data, opts.rows || 3, opts.cols || 3, opts.matrixB),
        {
          initialize: 1,
          update: 4,
          success: 6,
        }
      ),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["matrix-addition"],
  },
  {
    slug: "matrix-subtraction",
    generateSteps: (data, opts) =>
      withLogicalLines(
        generateMatrixSubtractionSteps(data, opts.rows || 3, opts.cols || 3, opts.matrixB),
        {
          initialize: 1,
          update: 4,
          success: 6,
        }
      ),
    getCodeExamples: getMatrixCodeExamples,
    codeLineMapping: matrixCodeLineMappings["matrix-subtraction"],
  },
];

export const matrixRegistry: AlgorithmVisualizerDefinition[] = rawMatrixRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateMatrixSteps(definition.slug, definition.generateSteps(data, options)),
  })
);

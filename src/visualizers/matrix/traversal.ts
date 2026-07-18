import { VisualStep } from "@/types";
import { createMatrixElements, MatrixVisualState } from "./types";

export function generateRowWiseTraversalSteps(
  arr: number[],
  rows: number,
  cols: number
): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createMatrixElements(arr, rows, cols);

  const baseState: MatrixVisualState = {
    rows,
    cols,
    elements,
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize Matrix",
    description: `A ${rows}x${cols} matrix is initialized. Row-wise traversal visits elements row by row, left to right.`,
    operation: "Row-wise Traversal",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { r: "-", c: "-" },
    pseudocodeLine: 1,
  });

  const visited: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      stepNumber++;
      const flatIndex = r * cols + c;
      const idStr = flatIndex.toString();

      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Visit Matrix[${r}][${c}]`,
        description: `Accessing element at row ${r}, column ${c}.`,
        operation: "Row-wise Traversal",
        actionType: "visit",
        dataState: baseState,
        highlights: {
          active: [idStr],
          visited: [...visited],
          pointer: [idStr],
        },
        variables: { r, c, val: elements[flatIndex].value },
        pseudocodeLine: 3,
      });

      visited.push(idStr);
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Traversal Complete",
    description: "All elements in the matrix have been visited row by row.",
    operation: "Row-wise Traversal",
    actionType: "complete",
    dataState: baseState,
    highlights: {
      visited: [...visited],
    },
    variables: { r: "-", c: "-" },
    pseudocodeLine: 4,
  });

  return steps;
}

export function generateColWiseTraversalSteps(
  arr: number[],
  rows: number,
  cols: number
): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createMatrixElements(arr, rows, cols);

  const baseState: MatrixVisualState = {
    rows,
    cols,
    elements,
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize Matrix",
    description: `A ${rows}x${cols} matrix is initialized. Column-wise traversal visits elements column by column, top to bottom.`,
    operation: "Column-wise Traversal",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { r: "-", c: "-" },
    pseudocodeLine: 1,
  });

  const visited: string[] = [];

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      stepNumber++;
      const flatIndex = r * cols + c;
      const idStr = flatIndex.toString();

      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Visit Matrix[${r}][${c}]`,
        description: `Accessing element at row ${r}, column ${c}.`,
        operation: "Column-wise Traversal",
        actionType: "visit",
        dataState: baseState,
        highlights: {
          active: [idStr],
          visited: [...visited],
          pointer: [idStr],
        },
        variables: { r, c, val: elements[flatIndex].value },
        pseudocodeLine: 3,
      });

      visited.push(idStr);
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Traversal Complete",
    description: "All elements in the matrix have been visited column by column.",
    operation: "Column-wise Traversal",
    actionType: "complete",
    dataState: baseState,
    highlights: {
      visited: [...visited],
    },
    variables: { r: "-", c: "-" },
    pseudocodeLine: 4,
  });

  return steps;
}

export function generateSpiralTraversalSteps(
  arr: number[],
  rows: number,
  cols: number
): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createMatrixElements(arr, rows, cols);

  const baseState: MatrixVisualState = {
    rows,
    cols,
    elements,
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize Matrix",
    description: `A ${rows}x${cols} matrix is initialized. Spiral traversal visits elements in a spiral order from the outside inwards.`,
    operation: "Spiral Traversal",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { r: "-", c: "-" },
    pseudocodeLine: 1,
  });

  const visited: string[] = [];

  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;

  while (top <= bottom && left <= right) {
    // Traverse from left to right across the top row
    for (let c = left; c <= right; c++) {
      stepNumber++;
      const flatIndex = top * cols + c;
      const idStr = flatIndex.toString();

      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Visit Matrix[${top}][${c}]`,
        description: `Moving right along the top row. Accessing element at row ${top}, column ${c}.`,
        operation: "Spiral Traversal",
        actionType: "visit",
        dataState: baseState,
        highlights: {
          active: [idStr],
          visited: [...visited],
          pointer: [idStr],
        },
        variables: { r: top, c, val: elements[flatIndex].value },
      });

      visited.push(idStr);
    }
    top++;

    // Traverse from top to bottom down the right column
    for (let r = top; r <= bottom; r++) {
      stepNumber++;
      const flatIndex = r * cols + right;
      const idStr = flatIndex.toString();

      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Visit Matrix[${r}][${right}]`,
        description: `Moving down the right column. Accessing element at row ${r}, column ${right}.`,
        operation: "Spiral Traversal",
        actionType: "visit",
        dataState: baseState,
        highlights: {
          active: [idStr],
          visited: [...visited],
          pointer: [idStr],
        },
        variables: { r, c: right, val: elements[flatIndex].value },
      });

      visited.push(idStr);
    }
    right--;

    if (top <= bottom) {
      // Traverse from right to left across the bottom row
      for (let c = right; c >= left; c--) {
        stepNumber++;
        const flatIndex = bottom * cols + c;
        const idStr = flatIndex.toString();

        steps.push({
          id: `step-${stepNumber}`,
          stepNumber,
          title: `Visit Matrix[${bottom}][${c}]`,
          description: `Moving left along the bottom row. Accessing element at row ${bottom}, column ${c}.`,
          operation: "Spiral Traversal",
          actionType: "visit",
          dataState: baseState,
          highlights: {
            active: [idStr],
            visited: [...visited],
            pointer: [idStr],
          },
          variables: { r: bottom, c, val: elements[flatIndex].value },
        });

        visited.push(idStr);
      }
      bottom--;
    }

    if (left <= right) {
      // Traverse from bottom to top up the left column
      for (let r = bottom; r >= top; r--) {
        stepNumber++;
        const flatIndex = r * cols + left;
        const idStr = flatIndex.toString();

        steps.push({
          id: `step-${stepNumber}`,
          stepNumber,
          title: `Visit Matrix[${r}][${left}]`,
          description: `Moving up the left column. Accessing element at row ${r}, column ${left}.`,
          operation: "Spiral Traversal",
          actionType: "visit",
          dataState: baseState,
          highlights: {
            active: [idStr],
            visited: [...visited],
            pointer: [idStr],
          },
          variables: { r, c: left, val: elements[flatIndex].value },
        });

        visited.push(idStr);
      }
      left++;
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Traversal Complete",
    description: "All elements in the matrix have been visited in spiral order.",
    operation: "Spiral Traversal",
    actionType: "complete",
    dataState: baseState,
    highlights: {
      visited: [...visited],
    },
    variables: { r: "-", c: "-" },
  });

  return steps;
}

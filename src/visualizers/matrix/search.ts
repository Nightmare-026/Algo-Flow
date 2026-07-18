import { VisualStep } from "@/types";
import { createMatrixElements, MatrixVisualState } from "./types";

export function generateMatrixSearchSteps(
  arr: number[],
  rows: number,
  cols: number,
  target: number
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
    title: "Initialize Matrix Search",
    description: `Searching for target value ${target} in the ${rows}x${cols} matrix using row-wise traversal.`,
    operation: "Matrix Search",
    actionType: "initialize",
    dataState: baseState,
    highlights: { target: [] }, // No target highlighted in grid yet
    variables: { r: "-", c: "-", target },
    pseudocodeLine: 1,
  });

  const visited: string[] = [];
  let found = false;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (found) break;

      stepNumber++;
      const flatIndex = r * cols + c;
      const idStr = flatIndex.toString();
      const val = elements[flatIndex].value;

      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Compare Matrix[${r}][${c}]`,
        description: `Comparing element ${val} at row ${r}, column ${c} with target ${target}.`,
        operation: "Matrix Search",
        actionType: "compare",
        dataState: baseState,
        highlights: {
          compared: [idStr],
          visited: [...visited],
          pointer: [idStr],
        },
        variables: { r, c, val, target },
        pseudocodeLine: 3,
      });

      if (val === target) {
        stepNumber++;
        steps.push({
          id: `step-${stepNumber}`,
          stepNumber,
          title: "Target Found!",
          description: `Target ${target} found at row ${r}, column ${c}. Search terminates.`,
          operation: "Matrix Search",
          actionType: "found",
          dataState: baseState,
          highlights: {
            found: [idStr],
            visited: [...visited],
          },
          variables: { r, c, val, target },
          pseudocodeLine: 4,
        });
        found = true;
        break;
      }

      visited.push(idStr);
    }
    if (found) break;
  }

  if (!found) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Target Not Found",
      description: `Target ${target} was not found in the matrix.`,
      operation: "Matrix Search",
      actionType: "not-found",
      dataState: baseState,
      highlights: {
        visited: [...visited],
        error: visited, // Highlight all visited as error/not-found
      },
      variables: { r: "-", c: "-", target },
      pseudocodeLine: 6,
    });
  }

  return steps;
}

export function generateSortedMatrixSearchSteps(
  arr: number[],
  rows: number,
  cols: number,
  target: number
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
    title: "Initialize Sorted Matrix Search",
    description: `Searching for target value ${target} in a row-and-column sorted ${rows}x${cols} matrix. Starting from top-right corner.`,
    operation: "Sorted Matrix Search",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { r: "-", c: "-", target },
  });

  const visited: string[] = [];
  let r = 0;
  let c = cols - 1;
  let found = false;

  while (r < rows && c >= 0) {
    stepNumber++;
    const flatIndex = r * cols + c;
    const idStr = flatIndex.toString();
    const val = elements[flatIndex].value;

    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: `Compare Matrix[${r}][${c}]`,
      description: `Comparing element ${val} at row ${r}, column ${c} with target ${target}.`,
      operation: "Sorted Matrix Search",
      actionType: "compare",
      dataState: baseState,
      highlights: {
        compared: [idStr],
        visited: [...visited],
        pointer: [idStr],
      },
      variables: { r, c, val, target },
    });

    visited.push(idStr);

    if (val === target) {
      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Target Found",
        description: `Target ${target} found at row ${r}, column ${c}!`,
        operation: "Sorted Matrix Search",
        actionType: "success",
        dataState: baseState,
        highlights: {
          success: [idStr],
          visited: [...visited],
        },
        variables: { r, c, val, target },
      });
      found = true;
      break;
    } else if (val > target) {
      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Move Left",
        description: `Value ${val} > target ${target}. The target must be to the left, so we move one column left.`,
        operation: "Sorted Matrix Search",
        actionType: "update",
        dataState: baseState,
        highlights: {
          active: [idStr],
          visited: [...visited],
        },
        variables: { r, c, val, target },
      });
      c--;
    } else {
      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Move Down",
        description: `Value ${val} < target ${target}. The target must be below, so we move one row down.`,
        operation: "Sorted Matrix Search",
        actionType: "update",
        dataState: baseState,
        highlights: {
          active: [idStr],
          visited: [...visited],
        },
        variables: { r, c, val, target },
      });
      r++;
    }
  }

  if (!found) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Target Not Found",
      description: `Target ${target} is not present in the matrix. Out of bounds.`,
      operation: "Sorted Matrix Search",
      actionType: "not-found",
      dataState: baseState,
      highlights: {
        error: [],
        visited: [...visited],
      },
      variables: { r, c, target },
    });
  }

  return steps;
}

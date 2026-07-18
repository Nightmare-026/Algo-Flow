import { VisualStep } from "@/types";
import { createMatrixElements, MatrixElement, MatrixVisualState } from "./types";

// 1. Transpose Matrix
export function generateTransposeMatrixSteps(
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
    elements: structuredClone(elements),
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Transpose",
    description: `Transposing a ${rows}x${cols} matrix into a ${cols}x${rows} matrix.`,
    operation: "Transpose",
    actionType: "initialize",
    dataState: structuredClone(baseState),
    highlights: {},
    variables: { r: "-", c: "-" },
  });

  const transposedElements = new Array<MatrixElement>(rows * cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const srcIndex = r * cols + c;
      const destIndex = c * rows + r;
      transposedElements[destIndex] = { ...elements[srcIndex] };
    }
  }

  const transposedState: MatrixVisualState = {
    rows: cols,
    cols: rows,
    elements: transposedElements,
  };

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Transpose Matrix",
    description: `Rows become columns and columns become rows. Dimension is now ${cols}x${rows}.`,
    operation: "Transpose",
    actionType: "update",
    dataState: transposedState,
    highlights: {
      active: transposedElements.map((_, index) => index.toString()),
    },
    variables: { r: "-", c: "-" },
  });

  return steps;
}

// 2. Rotate 90 Degrees (Square Matrix)
export function generateRotateMatrixSteps(arr: number[], rows: number, cols: number): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createMatrixElements(arr, rows, cols);

  const baseState: MatrixVisualState = {
    rows,
    cols,
    elements: structuredClone(elements),
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Rotation",
    description: `Rotating a ${rows}x${cols} matrix by 90 degrees clockwise.`,
    operation: "Rotate",
    actionType: "initialize",
    dataState: structuredClone(baseState),
    highlights: {},
    variables: { r: "-", c: "-" },
  });

  if (rows !== cols) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Error",
      description: `Rotation usually applies to square matrices. Dimensions: ${rows}x${cols}.`,
      operation: "Rotate",
      actionType: "error",
      dataState: structuredClone(baseState),
      highlights: { error: [] },
      variables: {},
    });
    return steps;
  }

  const n = rows;
  // Step 1: Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const idx1 = i * n + j;
      const idx2 = j * n + i;

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Transpose",
        description: `Swapping Matrix[${i}][${j}] with Matrix[${j}][${i}] for transpose.`,
        operation: "Rotate",
        actionType: "compare",
        dataState: { rows, cols, elements: structuredClone(elements) },
        highlights: { active: [idx1.toString(), idx2.toString()] },
        variables: { i, j },
      });

      const temp = elements[idx1];
      elements[idx1] = elements[idx2];
      elements[idx2] = temp;

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Swapped",
        description: `Elements swapped.`,
        operation: "Rotate",
        actionType: "swap",
        dataState: { rows, cols, elements: structuredClone(elements) },
        highlights: { swapped: [idx1.toString(), idx2.toString()] },
        variables: { i, j },
      });
    }
  }

  // Step 2: Reverse each row
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < Math.floor(n / 2); j++) {
      const idx1 = i * n + j;
      const idx2 = i * n + (n - 1 - j);

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Reverse Row",
        description: `Reversing row ${i}. Swapping elements at col ${j} and col ${n - 1 - j}.`,
        operation: "Rotate",
        actionType: "compare",
        dataState: { rows, cols, elements: structuredClone(elements) },
        highlights: { active: [idx1.toString(), idx2.toString()] },
        variables: { i, j },
      });

      const temp = elements[idx1];
      elements[idx1] = elements[idx2];
      elements[idx2] = temp;

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Swapped",
        description: `Elements swapped in row ${i}.`,
        operation: "Rotate",
        actionType: "swap",
        dataState: { rows, cols, elements: structuredClone(elements) },
        highlights: { swapped: [idx1.toString(), idx2.toString()] },
        variables: { i, j },
      });
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Rotation Complete",
    description: `Matrix rotated 90 degrees clockwise successfully.`,
    operation: "Rotate",
    actionType: "success",
    dataState: { rows, cols, elements: structuredClone(elements) },
    highlights: {},
    variables: { i: "-", j: "-" },
  });

  return steps;
}

// 3. Matrix Multiplication
export function generateMatrixMultiplicationSteps(
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
    elements: structuredClone(elements),
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Multiplication",
    description: `In a real scenario, this involves two matrices. For demonstration on a single matrix grid, we square this matrix (A * A).`,
    operation: "Multiplication",
    actionType: "initialize",
    dataState: structuredClone(baseState),
    highlights: {},
    variables: { r: "-", c: "-" },
  });

  if (rows !== cols) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Error",
      description: `Can only square a matrix if it's a square matrix (rows == cols). Dimensions: ${rows}x${cols}.`,
      operation: "Multiplication",
      actionType: "error",
      dataState: structuredClone(baseState),
      highlights: { error: [] },
      variables: {},
    });
    return steps;
  }

  const n = rows;
  const resultElements: MatrixElement[] = new Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      resultElements[i * n + j] = { id: `res-${i}-${j}`, value: 0, originalRow: i, originalCol: j };
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Result Matrix Initialized",
    description: `A new ${n}x${n} result matrix is created (initialized with 0s).`,
    operation: "Multiplication",
    actionType: "initialize",
    dataState: { rows: n, cols: n, elements: structuredClone(resultElements) },
    highlights: {},
    variables: { r: "-", c: "-" },
  });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        const idxA = i * n + k;
        const idxB = k * n + j;

        sum += elements[idxA].value * elements[idxB].value;
      }
      const resIdx = i * n + j;
      resultElements[resIdx].value = sum;

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Compute Result[${i}][${j}]`,
        description: `Dot product of row ${i} and col ${j} is ${sum}.`,
        operation: "Multiplication",
        actionType: "update",
        dataState: { rows: n, cols: n, elements: structuredClone(resultElements) },
        highlights: { active: [resultElements[resIdx].id] },
        variables: { i, j, sum },
      });
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Multiplication Complete",
    description: `Matrix squared successfully.`,
    operation: "Multiplication",
    actionType: "success",
    dataState: { rows: n, cols: n, elements: structuredClone(resultElements) },
    highlights: {},
    variables: { i: "-", j: "-" },
  });

  return steps;
}

// 4. Matrix Addition
export function generateMatrixAdditionSteps(
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
    elements: structuredClone(elements),
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Addition",
    description: `In a real scenario, this involves two matrices. For demonstration, we add this matrix to itself (A + A).`,
    operation: "Addition",
    actionType: "initialize",
    dataState: structuredClone(baseState),
    highlights: {},
    variables: { r: "-", c: "-" },
  });

  const resultElements: MatrixElement[] = new Array(rows * cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      resultElements[i * cols + j] = {
        id: `res-${i}-${j}`,
        value: 0,
        originalRow: i,
        originalCol: j,
      };
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Result Matrix Initialized",
    description: `A new ${rows}x${cols} result matrix is created.`,
    operation: "Addition",
    actionType: "initialize",
    dataState: { rows, cols, elements: structuredClone(resultElements) },
    highlights: {},
    variables: { r: "-", c: "-" },
  });

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const idx = i * cols + j;
      const sum = elements[idx].value + elements[idx].value;
      resultElements[idx].value = sum;

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Compute Result[${i}][${j}]`,
        description: `${elements[idx].value} + ${elements[idx].value} = ${sum}.`,
        operation: "Addition",
        actionType: "update",
        dataState: { rows, cols, elements: structuredClone(resultElements) },
        highlights: { active: [resultElements[idx].id] },
        variables: { i, j, sum },
      });
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Addition Complete",
    description: `Matrix doubled successfully.`,
    operation: "Addition",
    actionType: "success",
    dataState: { rows, cols, elements: structuredClone(resultElements) },
    highlights: {},
    variables: { i: "-", j: "-" },
  });

  return steps;
}

// 5. Matrix Subtraction
export function generateMatrixSubtractionSteps(
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
    elements: structuredClone(elements),
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Subtraction",
    description: `In a real scenario, this involves two matrices. For demonstration, we subtract this matrix from itself (A - A), resulting in a zero matrix.`,
    operation: "Subtraction",
    actionType: "initialize",
    dataState: structuredClone(baseState),
    highlights: {},
    variables: { r: "-", c: "-" },
  });

  const resultElements: MatrixElement[] = new Array(rows * cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      resultElements[i * cols + j] = {
        id: `res-${i}-${j}`,
        value: 0,
        originalRow: i,
        originalCol: j,
      };
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Result Matrix Initialized",
    description: `A new ${rows}x${cols} result matrix is created.`,
    operation: "Subtraction",
    actionType: "initialize",
    dataState: { rows, cols, elements: structuredClone(resultElements) },
    highlights: {},
    variables: { r: "-", c: "-" },
  });

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const idx = i * cols + j;
      const diff = elements[idx].value - elements[idx].value;
      resultElements[idx].value = diff;

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Compute Result[${i}][${j}]`,
        description: `${elements[idx].value} - ${elements[idx].value} = ${diff}.`,
        operation: "Subtraction",
        actionType: "update",
        dataState: { rows, cols, elements: structuredClone(resultElements) },
        highlights: { active: [resultElements[idx].id] },
        variables: { i, j, diff },
      });
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Subtraction Complete",
    description: `Matrix subtracted successfully.`,
    operation: "Subtraction",
    actionType: "success",
    dataState: { rows, cols, elements: structuredClone(resultElements) },
    highlights: {},
    variables: { i: "-", j: "-" },
  });

  return steps;
}

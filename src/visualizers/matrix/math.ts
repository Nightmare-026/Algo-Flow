import { VisualStep } from "@/types";
import {
  createMatrixElements,
  generateDefaultMatrixB,
  matrixSizeValidationSteps,
  MatrixElement,
  MatrixVisualState,
} from "./types";

// 1. Transpose Matrix
export function generateTransposeMatrixSteps(
  arr: number[],
  rows: number,
  cols: number
): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const sizeErr = matrixSizeValidationSteps(arr.length, rows, cols, "Transpose", stepNumber);
  if (sizeErr) return sizeErr;
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
    pseudocodeLine: 1,
  });

  const isSquare = rows === cols;
  const currentElements = structuredClone(elements);

  if (isSquare) {
    // In-place symmetrical pair swaps
    for (let r = 0; r < rows; r++) {
      for (let c = r + 1; c < cols; c++) {
        const idx1 = r * cols + c;
        const idx2 = c * rows + r;

        stepNumber++;
        steps.push({
          id: `step-${stepNumber}`,
          stepNumber,
          title: `Inspect [${r}][${c}] and [${c}][${r}]`,
          description: `Comparing cell (${r}, ${c}) [val: ${currentElements[idx1].value}] with symmetrical cell (${c}, ${r}) [val: ${currentElements[idx2].value}].`,
          operation: "Transpose",
          actionType: "compare",
          dataState: { rows, cols, elements: structuredClone(currentElements) },
          highlights: { active: [idx1.toString(), idx2.toString()] },
          variables: { r, c },
          pseudocodeLine: 3,
        });

        // Swap the elements
        const temp = currentElements[idx1];
        currentElements[idx1] = currentElements[idx2];
        currentElements[idx2] = temp;

        stepNumber++;
        steps.push({
          id: `step-${stepNumber}`,
          stepNumber,
          title: `Swap [${r}][${c}] with [${c}][${r}]`,
          description: `Exchanged values between cell (${r}, ${c}) and (${c}, ${r}).`,
          operation: "Transpose",
          actionType: "update",
          dataState: { rows, cols, elements: structuredClone(currentElements) },
          highlights: { swapped: [idx1.toString(), idx2.toString()] },
          variables: { r, c },
          pseudocodeLine: 4,
        });
      }
    }
  } else {
    // Non-square matrix: cell-by-cell coordinate mapping
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const srcIndex = r * cols + c;

        stepNumber++;
        steps.push({
          id: `step-${stepNumber}`,
          stepNumber,
          title: `Transfer [${r}][${c}] → [${c}][${r}]`,
          description: `Mapping element ${elements[srcIndex].value} from row ${r}, col ${c} to transposed row ${c}, col ${r}.`,
          operation: "Transpose",
          actionType: "update",
          dataState: { rows, cols, elements: structuredClone(currentElements) },
          highlights: { active: [srcIndex.toString()] },
          variables: { r, c },
          pseudocodeLine: 4,
        });
      }
    }
  }

  // Final Transposed State
  const finalTransposed = new Array<MatrixElement>(rows * cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const srcIndex = r * cols + c;
      const destIndex = c * rows + r;
      finalTransposed[destIndex] = { ...elements[srcIndex] };
    }
  }

  const finalState: MatrixVisualState = {
    rows: cols,
    cols: rows,
    elements: isSquare ? currentElements : finalTransposed,
  };

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Transpose Complete",
    description: `Matrix transposition complete. New dimensions: ${cols}x${rows}.`,
    operation: "Transpose",
    actionType: "update",
    dataState: finalState,
    highlights: {
      success: (isSquare ? currentElements : finalTransposed).map((_, index) => index.toString()),
    },
    variables: { r: "-", c: "-" },
    pseudocodeLine: 4,
  });

  return steps;
}

// 2. Rotate 90 Degrees (Square Matrix)
export function generateRotateMatrixSteps(arr: number[], rows: number, cols: number): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const sizeErr = matrixSizeValidationSteps(arr.length, rows, cols, "Rotate", stepNumber);
  if (sizeErr) return sizeErr;
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
        title: "Transpose Swap",
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
        title: "Reverse Swap",
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

// 3. Matrix Multiplication (A × B = C)
export function generateMatrixMultiplicationSteps(
  arr: number[],
  rows: number,
  cols: number,
  arrB?: number[]
): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const rowsA = rows;
  const colsA = cols;
  const rowsB = cols;
  const colsB = cols; // Square or rectangular multiplication where result is rowsA x colsB

  const sizeErr = matrixSizeValidationSteps(
    arr.length,
    rowsA,
    colsA,
    "Matrix Multiplication",
    stepNumber
  );
  if (sizeErr) return sizeErr;
  const elementsA = createMatrixElements(arr, rowsA, colsA);
  const dataB =
    arrB && arrB.length >= rowsB * colsB
      ? arrB
      : generateDefaultMatrixB(arr, rowsB, colsB, "matrix-multiplication");
  const elementsB = createMatrixElements(dataB, rowsB, colsB);

  const resultElements: MatrixElement[] = [];
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      resultElements.push({
        id: `res-${i}-${j}`,
        value: 0,
        originalRow: i,
        originalCol: j,
      });
    }
  }

  const baseState: MatrixVisualState = {
    rows: rowsA,
    cols: colsB,
    elements: structuredClone(resultElements),
    matrixA: {
      label: "Matrix A",
      rows: rowsA,
      cols: colsA,
      elements: structuredClone(elementsA),
    },
    matrixB: {
      label: "Matrix B",
      rows: rowsB,
      cols: colsB,
      elements: structuredClone(elementsB),
    },
    resultLabel: "Result (A × B)",
    operationSymbol: "×",
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Multiplication",
    description: `Multiplying Matrix A (${rowsA}×${colsA}) by Matrix B (${rowsB}×${colsB}). Result Matrix C will have dimensions ${rowsA}×${colsB}.`,
    operation: "Multiplication",
    actionType: "initialize",
    dataState: structuredClone(baseState),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { i: "-", j: "-", k: "-" },
  });

  const computedResultIds: string[] = [];

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      const terms: string[] = [];
      const activeAIds: string[] = [];
      const activeBIds: string[] = [];

      for (let k = 0; k < colsA; k++) {
        const idxA = i * colsA + k;
        const idxB = k * colsB + j;
        const valA = elementsA[idxA].value;
        const valB = elementsB[idxB].value;
        sum += valA * valB;
        terms.push(`(${valA} × ${valB})`);
        activeAIds.push(elementsA[idxA].id);
        activeBIds.push(elementsB[idxB].id);
      }

      const resIdx = i * colsB + j;
      resultElements[resIdx].value = sum;
      computedResultIds.push(resultElements[resIdx].id);

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Compute Result[${i}][${j}]`,
        description: `Row ${i} of Matrix A · Column ${j} of Matrix B = ${terms.join(" + ")} = ${sum}. Stored in Result[${i}][${j}].`,
        operation: "Multiplication",
        actionType: "update",
        dataState: {
          rows: rowsA,
          cols: colsB,
          elements: structuredClone(resultElements),
          matrixA: {
            label: "Matrix A",
            rows: rowsA,
            cols: colsA,
            elements: structuredClone(elementsA),
          },
          matrixB: {
            label: "Matrix B",
            rows: rowsB,
            cols: colsB,
            elements: structuredClone(elementsB),
          },
          resultLabel: "Result (A × B)",
          operationSymbol: "×",
        },
        highlights: {
          active: [...activeAIds, ...activeBIds, resultElements[resIdx].id, resIdx.toString()],
          pointer: [resultElements[resIdx].id],
          visited: [...computedResultIds],
        },
        codeLine: 4,
        pseudocodeLine: 4,
        variables: { i, j, sum },
      });
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Multiplication Complete",
    description: `Matrix A and Matrix B multiplied successfully into Result Matrix.`,
    operation: "Multiplication",
    actionType: "success",
    dataState: {
      rows: rowsA,
      cols: colsB,
      elements: structuredClone(resultElements),
      matrixA: {
        label: "Matrix A",
        rows: rowsA,
        cols: colsA,
        elements: structuredClone(elementsA),
      },
      matrixB: {
        label: "Matrix B",
        rows: rowsB,
        cols: colsB,
        elements: structuredClone(elementsB),
      },
      resultLabel: "Result (A × B)",
      operationSymbol: "×",
    },
    highlights: {
      success: resultElements.map((e) => e.id),
    },
    codeLine: 6,
    pseudocodeLine: 4,
    variables: { i: "-", j: "-" },
  });

  return steps;
}

// 4. Matrix Addition (A + B = C)
export function generateMatrixAdditionSteps(
  arr: number[],
  rows: number,
  cols: number,
  arrB?: number[]
): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const sizeErr = matrixSizeValidationSteps(arr.length, rows, cols, "Matrix Addition", stepNumber);
  if (sizeErr) return sizeErr;
  const elementsA = createMatrixElements(arr, rows, cols);
  const dataB =
    arrB && arrB.length >= rows * cols
      ? arrB
      : generateDefaultMatrixB(arr, rows, cols, "matrix-addition");
  const elementsB = createMatrixElements(dataB, rows, cols);

  const resultElements: MatrixElement[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      resultElements.push({
        id: `res-${i}-${j}`,
        value: 0,
        originalRow: i,
        originalCol: j,
      });
    }
  }

  const baseState: MatrixVisualState = {
    rows,
    cols,
    elements: structuredClone(resultElements),
    matrixA: {
      label: "Matrix A",
      rows,
      cols,
      elements: structuredClone(elementsA),
    },
    matrixB: {
      label: "Matrix B",
      rows,
      cols,
      elements: structuredClone(elementsB),
    },
    resultLabel: "Result (A + B)",
    operationSymbol: "+",
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Matrix Addition",
    description: `Adding two ${rows}×${cols} matrices: Matrix A and Matrix B. Corresponding elements at (r, c) are added into Result Matrix.`,
    operation: "Matrix Addition",
    actionType: "initialize",
    dataState: structuredClone(baseState),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { r: "-", c: "-" },
  });

  const computedResultIds: string[] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const idx = i * cols + j;
      const valA = elementsA[idx].value;
      const valB = elementsB[idx].value;
      const sum = valA + valB;
      resultElements[idx].value = sum;
      computedResultIds.push(resultElements[idx].id);

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Compute Result[${i}][${j}]`,
        description: `Matrix A[${i}][${j}] (${valA}) + Matrix B[${i}][${j}] (${valB}) = ${sum}. Storing in Result[${i}][${j}].`,
        operation: "Matrix Addition",
        actionType: "update",
        dataState: {
          rows,
          cols,
          elements: structuredClone(resultElements),
          matrixA: {
            label: "Matrix A",
            rows,
            cols,
            elements: structuredClone(elementsA),
          },
          matrixB: {
            label: "Matrix B",
            rows,
            cols,
            elements: structuredClone(elementsB),
          },
          resultLabel: "Result (A + B)",
          operationSymbol: "+",
        },
        highlights: {
          active: [elementsA[idx].id, elementsB[idx].id, resultElements[idx].id, idx.toString()],
          pointer: [elementsA[idx].id, elementsB[idx].id, resultElements[idx].id],
          visited: [...computedResultIds],
        },
        codeLine: 4,
        pseudocodeLine: 4,
        variables: { r: i, c: j, "A[r][c]": valA, "B[r][c]": valB, sum },
      });
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Addition Complete",
    description: `Matrix A and Matrix B added successfully into Result Matrix.`,
    operation: "Matrix Addition",
    actionType: "success",
    dataState: {
      rows,
      cols,
      elements: structuredClone(resultElements),
      matrixA: {
        label: "Matrix A",
        rows,
        cols,
        elements: structuredClone(elementsA),
      },
      matrixB: {
        label: "Matrix B",
        rows,
        cols,
        elements: structuredClone(elementsB),
      },
      resultLabel: "Result (A + B)",
      operationSymbol: "+",
    },
    highlights: {
      success: resultElements.map((e) => e.id),
    },
    codeLine: 6,
    pseudocodeLine: 4,
    variables: { r: "-", c: "-" },
  });

  return steps;
}

// 5. Matrix Subtraction (A − B = C)
export function generateMatrixSubtractionSteps(
  arr: number[],
  rows: number,
  cols: number,
  arrB?: number[]
): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const sizeErr = matrixSizeValidationSteps(
    arr.length,
    rows,
    cols,
    "Matrix Subtraction",
    stepNumber
  );
  if (sizeErr) return sizeErr;
  const elementsA = createMatrixElements(arr, rows, cols);
  const dataB =
    arrB && arrB.length >= rows * cols
      ? arrB
      : generateDefaultMatrixB(arr, rows, cols, "matrix-subtraction");
  const elementsB = createMatrixElements(dataB, rows, cols);

  const resultElements: MatrixElement[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      resultElements.push({
        id: `res-${i}-${j}`,
        value: 0,
        originalRow: i,
        originalCol: j,
      });
    }
  }

  const baseState: MatrixVisualState = {
    rows,
    cols,
    elements: structuredClone(resultElements),
    matrixA: {
      label: "Matrix A",
      rows,
      cols,
      elements: structuredClone(elementsA),
    },
    matrixB: {
      label: "Matrix B",
      rows,
      cols,
      elements: structuredClone(elementsB),
    },
    resultLabel: "Result (A − B)",
    operationSymbol: "−",
  };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Matrix Subtraction",
    description: `Subtracting Matrix B (${rows}×${cols}) from Matrix A (${rows}×${cols}). Elements at (r, c) are subtracted into Result Matrix.`,
    operation: "Matrix Subtraction",
    actionType: "initialize",
    dataState: structuredClone(baseState),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { r: "-", c: "-" },
  });

  const computedResultIds: string[] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const idx = i * cols + j;
      const valA = elementsA[idx].value;
      const valB = elementsB[idx].value;
      const diff = valA - valB;
      resultElements[idx].value = diff;
      computedResultIds.push(resultElements[idx].id);

      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Compute Result[${i}][${j}]`,
        description: `Matrix A[${i}][${j}] (${valA}) − Matrix B[${i}][${j}] (${valB}) = ${diff}. Storing in Result[${i}][${j}].`,
        operation: "Matrix Subtraction",
        actionType: "update",
        dataState: {
          rows,
          cols,
          elements: structuredClone(resultElements),
          matrixA: {
            label: "Matrix A",
            rows,
            cols,
            elements: structuredClone(elementsA),
          },
          matrixB: {
            label: "Matrix B",
            rows,
            cols,
            elements: structuredClone(elementsB),
          },
          resultLabel: "Result (A − B)",
          operationSymbol: "−",
        },
        highlights: {
          active: [elementsA[idx].id, elementsB[idx].id, resultElements[idx].id, idx.toString()],
          pointer: [elementsA[idx].id, elementsB[idx].id, resultElements[idx].id],
          visited: [...computedResultIds],
        },
        codeLine: 4,
        pseudocodeLine: 4,
        variables: { r: i, c: j, "A[r][c]": valA, "B[r][c]": valB, diff },
      });
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Subtraction Complete",
    description: `Matrix B subtracted from Matrix A successfully into Result Matrix.`,
    operation: "Matrix Subtraction",
    actionType: "success",
    dataState: {
      rows,
      cols,
      elements: structuredClone(resultElements),
      matrixA: {
        label: "Matrix A",
        rows,
        cols,
        elements: structuredClone(elementsA),
      },
      matrixB: {
        label: "Matrix B",
        rows,
        cols,
        elements: structuredClone(elementsB),
      },
      resultLabel: "Result (A − B)",
      operationSymbol: "−",
    },
    highlights: {
      success: resultElements.map((e) => e.id),
    },
    codeLine: 6,
    pseudocodeLine: 4,
    variables: { r: "-", c: "-" },
  });

  return steps;
}

import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";

export interface MatrixElement {
  id: string; // Unique ID to track element across animations for Framer Motion layout
  value: number;
  originalRow: number;
  originalCol: number;
}

export interface MatrixGridData {
  label: string;
  rows: number;
  cols: number;
  elements: MatrixElement[];
}

export interface MatrixVisualState {
  rows: number;
  cols: number;
  elements: MatrixElement[];
  matrixA?: MatrixGridData;
  matrixB?: MatrixGridData;
  resultLabel?: string;
  operationSymbol?: string;
}

export function createMatrixElements(arr: number[], rows: number, cols: number): MatrixElement[] {
  const elements: MatrixElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= arr.length) break; // Never fabricate cells the user did not provide.
      elements.push({ id: uuidv4(), value: arr[idx], originalRow: r, originalCol: c });
    }
  }
  return elements;
}

export function matrixSizeValidationSteps(
  arrLength: number,
  rows: number,
  cols: number,
  operation: string,
  stepNumber: number
): VisualStep[] | null {
  const expected = rows * cols;
  if (arrLength === expected) return null;
  return [
    {
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Matrix Size Mismatch",
      description: `A ${rows} × ${cols} matrix needs exactly ${expected} values, but ${arrLength} were provided. Enter exactly ${expected} comma-separated values or adjust the matrix size.`,
      operation,
      actionType: "error",
      dataState: { rows, cols, elements: [] } as MatrixVisualState,
      highlights: {},
      variables: {},
      pseudocodeLine: 1,
    },
  ];
}

export function generateDefaultMatrixB(
  arrA: number[],
  rows: number,
  cols: number,
  _slug: string = ""
): number[] {
  void _slug;
  const length = rows * cols;
  const defaults: number[] = [3, 7, 2, 5, 8, 1, 9, 4, 6, 2, 8, 3, 5, 7, 1, 4];
  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    if (i < defaults.length) {
      let val = defaults[i];
      if (arrA[i] !== undefined && val === arrA[i]) {
        val = (val % 9) + 1;
      }
      result.push(val);
    } else {
      result.push(((i * 3 + 5) % 19) + 1);
    }
  }
  return result;
}

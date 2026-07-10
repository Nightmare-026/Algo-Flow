import { v4 as uuidv4 } from "uuid";

export interface MatrixElement {
  id: string; // Unique ID to track element across animations for Framer Motion layout
  value: number;
  originalRow: number;
  originalCol: number;
}

export interface MatrixVisualState {
  rows: number;
  cols: number;
  elements: MatrixElement[];
}

export function createMatrixElements(arr: number[], rows: number, cols: number): MatrixElement[] {
  const elements: MatrixElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const val = idx < arr.length ? arr[idx] : 0; // Pad with 0 if arr is smaller
      elements.push({ id: uuidv4(), value: val, originalRow: r, originalCol: c });
    }
  }
  return elements;
}

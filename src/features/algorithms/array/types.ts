import { v4 as uuidv4 } from "uuid";

export interface ArrayElement {
  id: string; // Unique ID to track element across sorts/shifts for Framer Motion layout
  value: number;
  originalIndex: number;
}

export interface ArrayVisualState {
  elements: ArrayElement[];
}

export function createElements(arr: number[]): ArrayElement[] {
  return arr.map((val, idx) => ({ id: uuidv4(), value: val, originalIndex: idx }));
}

export const createArrayElements = createElements;


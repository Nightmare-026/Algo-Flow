import { v4 as uuidv4 } from "uuid";

export interface StackElement {
  id: string; // Unique ID to track element for layout animations
  value: number;
}

export interface StackVisualState {
  elements: StackElement[];
  maxCapacity?: number;
}

export function createStackElements(arr: number[]): StackElement[] {
  return arr.map((val) => ({ id: uuidv4(), value: val }));
}

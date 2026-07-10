import { v4 as uuidv4 } from "uuid";

export interface QueueElement {
  id: string; // Unique ID to track element for layout animations
  value: number;
}

export interface QueueVisualState {
  elements: QueueElement[];
  maxCapacity?: number;
}

export function createQueueElements(arr: number[]): QueueElement[] {
  return arr.map((val) => ({ id: uuidv4(), value: val }));
}

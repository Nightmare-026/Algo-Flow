import { v4 as uuidv4 } from "uuid";

export interface StackElement {
  id: string; // Unique ID to track element for layout animations
  value: number | string;
}

export interface InputToken {
  id: string;
  label: string;
  status?: "scanned" | "current" | "pending" | "matched" | "error";
}

export interface OutputToken {
  id: string;
  label: string;
}

export interface StackVisualState {
  elements: StackElement[];
  maxCapacity?: number;
  inputTokens?: InputToken[];
  activeTokenIndex?: number;
  outputTokens?: OutputToken[];
  minElements?: StackElement[];
  computation?: { formula: string; result: number | string };
  statusMessage?: { text: string; type: "success" | "error" | "info" | "warning" };
  resultMapping?: Array<{ id: string; index: number; value: number; result: number | string }>;
}

export function createStackElements(arr: Array<number | string>): StackElement[] {
  return arr.map((val) => ({ id: uuidv4(), value: val }));
}

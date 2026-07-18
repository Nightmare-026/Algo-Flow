import { v4 as uuidv4 } from "uuid";

export interface StringElement {
  id: string; // Unique ID to track character across animations
  char: string;
  originalIndex: number;
}

export interface StringVisualState {
  elements: StringElement[];
  patternElements?: StringElement[];
}

export function createStringElements(str: string): StringElement[] {
  return str.split("").map((char, idx) => ({
    id: uuidv4(),
    char,
    originalIndex: idx,
  }));
}

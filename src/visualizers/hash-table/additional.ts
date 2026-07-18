import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";

const clone = <T>(value: T): T => structuredClone(value);

function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input, codeLine: input.codeLine ?? input.pseudocodeLine };
}

import { createInitialHashTableState, HashEntry, HashTableVisualState } from "./types";

function entryIds(state: HashTableVisualState) {
  return (state.buckets as (HashEntry | null)[])
    .filter((entry): entry is HashEntry => entry !== null)
    .map((entry) => entry.id);
}

function initializeHashTable(values: number[], size: number): HashTableVisualState {
  const state = createInitialHashTableState(size, "linear-probing");
  const buckets = state.buckets as (HashEntry | null)[];
  for (const value of values) {
    let index = value % size;
    while (buckets[index]) index = (index + 1) % size;
    buckets[index] = { id: uuidv4(), key: value };
    state.elementCount++;
  }
  state.loadFactor = state.elementCount / size;
  return state;
}

export function generateDivisionHashSteps(value: number, size = 7): VisualStep[] {
  const state = createInitialHashTableState(size, "linear-probing");
  const index = value % size;
  return [
    visualStep({
      stepNumber: 1,
      title: "Apply Division Hash",
      description: `Compute bucket = key % tableSize = ${value} % ${size}.`,
      operation: "Hashing",
      actionType: "hash",
      dataState: clone(state),
      highlights: { active: [`bucket-${index}`] },
      variables: { key: value, tableSize: size, bucket: index },
      pseudocodeLine: 2,
    }),
  ];
}

export function generateRehashingSteps(data: number[], size = 7): VisualStep[] {
  const values = data.slice(0, Math.max(1, Math.min(data.length, size - 1)));
  const oldState = initializeHashTable(values, size);
  const newSize = size * 2 + 1;
  const newState = initializeHashTable(values, newSize);
  return [
    visualStep({
      stepNumber: 1,
      title: "Detect High Load Factor",
      description:
        "When load factor crosses the threshold, the table is resized to reduce future collisions.",
      operation: "Rehashing",
      actionType: "compare",
      dataState: clone(oldState),
      highlights: { compared: entryIds(oldState) },
      variables: { loadFactor: oldState.loadFactor.toFixed(2), threshold: 0.75 },
      pseudocodeLine: 1,
    }),
    visualStep({
      stepNumber: 2,
      title: "Allocate Larger Table",
      description: `Create a larger table with size ${newSize}.`,
      operation: "Rehashing",
      actionType: "build",
      dataState: createInitialHashTableState(newSize, "linear-probing"),
      highlights: {},
      variables: { oldSize: size, newSize },
      pseudocodeLine: 2,
    }),
    visualStep({
      stepNumber: 3,
      title: "Reinsert Every Key",
      description: "Each existing key is hashed again because bucket indexes depend on table size.",
      operation: "Rehashing",
      actionType: "insert",
      dataState: clone(newState),
      highlights: { inserted: entryIds(newState) },
      variables: { moved: values.length, loadFactor: newState.loadFactor.toFixed(2) },
      pseudocodeLine: 4,
    }),
  ];
}

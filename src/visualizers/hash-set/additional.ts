import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";

function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input, codeLine: input.codeLine ?? input.pseudocodeLine };
}

import {
  createInitialHashSetState,
  HashSetEntry,
  HashSetVisualState,
  normalizeBucketIndex,
  isValidTableSize,
} from "./types";

function entryIds(state: HashSetVisualState) {
  return (state.buckets as (HashSetEntry | null)[])
    .filter((entry): entry is HashSetEntry => entry !== null)
    .map((entry) => entry.id);
}

function initializeHashSet(values: number[], size: number): HashSetVisualState {
  const safeSize = isValidTableSize(size) ? size : 11;
  const state = createInitialHashSetState(safeSize, "linear-probing");
  const buckets = state.buckets as (HashSetEntry | null)[];
  for (const value of new Set(values)) {
    let index = normalizeBucketIndex(value, safeSize);
    while (buckets[index]) index = (index + 1) % safeSize;
    buckets[index] = { id: uuidv4(), key: value };
    state.elementCount++;
  }
  state.loadFactor = state.elementCount / safeSize;
  return state;
}

export function generateHashSetUnionSteps(data: number[], value: number, size = 11): VisualStep[] {
  const left = data.slice(0, 4);
  const right = [value, ...data.slice(2, 5)];
  const union = Array.from(new Set([...left, ...right]));
  const resultState = initializeHashSet(union, size);
  return [
    visualStep({
      stepNumber: 1,
      title: "Build First Set",
      description: `First set contains ${left.join(", ")}.`,
      operation: "Set Union",
      actionType: "initialize",
      dataState: initializeHashSet(left, size),
      highlights: {},
      variables: { leftSize: left.length },
      pseudocodeLine: 1,
    }),
    visualStep({
      stepNumber: 2,
      title: "Insert Values from Second Set",
      description: `Add every unique value from ${right.join(", ")} into the result set.`,
      operation: "Set Union",
      actionType: "insert",
      dataState: resultState,
      highlights: { inserted: entryIds(resultState) },
      variables: { resultSize: union.length },
      pseudocodeLine: 3,
    }),
  ];
}

export function generateHashSetIntersectionSteps(
  data: number[],
  value: number,
  size = 11
): VisualStep[] {
  const left = data.slice(0, 4);
  const right = [left[0], left[1], ...data.slice(2, 5)];
  const intersection = left.filter((x) => right.includes(x));
  const resultState = initializeHashSet(intersection, size);
  return [
    visualStep({
      stepNumber: 1,
      title: "Build Both Sets",
      description: `First set contains ${left.join(", ")}. Second set contains ${right.join(", ")}.`,
      operation: "Set Intersection",
      actionType: "initialize",
      dataState: initializeHashSet(left, size),
      highlights: {},
      variables: { leftSize: left.length, rightSize: right.length },
      pseudocodeLine: 1,
    }),
    visualStep({
      stepNumber: 2,
      title: "Find Intersection",
      description: `Keep only elements present in both sets. The intersection is ${intersection.join(", ")}.`,
      operation: "Set Intersection",
      actionType: "insert",
      dataState: resultState,
      highlights: { inserted: entryIds(resultState) },
      variables: { resultSize: intersection.length },
      pseudocodeLine: 3,
    }),
  ];
}

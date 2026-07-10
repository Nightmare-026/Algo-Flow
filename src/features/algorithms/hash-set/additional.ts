import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";


function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input };
}

import { createInitialHashSetState, HashSetEntry, HashSetVisualState } from "./types";

function initializeHashSet(values: number[], size: number): HashSetVisualState {
  const state = createInitialHashSetState(size, "linear-probing");
  const buckets = state.buckets as (HashSetEntry | null)[];
  for (const value of new Set(values)) {
    let index = value % size;
    while (buckets[index]) index = (index + 1) % size;
    buckets[index] = { id: uuidv4(), key: value };
    state.elementCount++;
  }
  state.loadFactor = state.elementCount / size;
  return state;
}

export function generateHashSetUnionSteps(data: number[], value: number, size = 11): VisualStep[] {
  const left = data.slice(0, 4);
  const right = [value, ...data.slice(2, 5)];
  const union = Array.from(new Set([...left, ...right]));
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
      dataState: initializeHashSet(union, size),
      highlights: {},
      variables: { resultSize: union.length },
      pseudocodeLine: 3,
    }),
  ];
}

export function generateHashSetIntersectionSteps(data: number[], value: number, size = 11): VisualStep[] {
  const left = data.slice(0, 4);
  const right = [left[0], left[1], ...data.slice(2, 5)];
  const intersection = left.filter(x => right.includes(x));
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
      dataState: initializeHashSet(intersection, size),
      highlights: {},
      variables: { resultSize: intersection.length },
      pseudocodeLine: 3,
    }),
  ];
}

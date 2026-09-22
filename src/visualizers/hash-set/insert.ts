import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import {
  HashSetVisualState,
  HashSetEntry,
  createInitialHashSetState,
  normalizeBucketIndex,
  isValidTableSize,
} from "./types";

function invalidSizeSteps(size: number, operation: string): VisualStep[] {
  return [
    {
      id: uuidv4(),
      stepNumber: 1,
      title: "Invalid Set Size",
      description: `Set size must be a whole number of at least 1 (received ${size}). Increase the capacity and retry.`,
      operation,
      actionType: "error",
      dataState: createInitialHashSetState(1, "linear-probing"),
      highlights: {},
      codeLine: 1,
      pseudocodeLine: 1,
      variables: { Size: size },
    },
  ];
}

function initializeState(initialArray: number[], setSize: number): HashSetVisualState {
  const state = createInitialHashSetState(setSize, "linear-probing");
  const buckets = state.buckets as (HashSetEntry | null)[];
  for (const val of initialArray) {
    if (state.elementCount >= setSize) break;
    let idx = normalizeBucketIndex(val, setSize);
    while (buckets[idx] !== null && !buckets[idx]!.isDeleted) {
      if (buckets[idx]!.key === val) break;
      idx = (idx + 1) % setSize;
    }
    if (buckets[idx]?.key !== val || buckets[idx]?.isDeleted) {
      buckets[idx] = { id: uuidv4(), key: val };
      state.elementCount++;
    }
  }
  state.loadFactor = state.elementCount / setSize;
  return state;
}

export function generateHashSetInsertSteps(
  initialArray: number[],
  valueToInsert: number,
  setSize: number = 7
): VisualStep[] {
  if (!isValidTableSize(setSize)) return invalidSizeSteps(setSize, "Insert");
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, setSize);
  const buckets = state.buckets as (HashSetEntry | null)[];
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Set Insert",
    description: `Attempting to insert key ${valueToInsert} into the Hash Set.`,
    operation: "Insert",
    actionType: "initialize",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Key: valueToInsert, Size: setSize },
  });

  if (state.elementCount >= setSize) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Set Full",
      description: "The hash set is full. Cannot insert new element.",
      operation: "Insert",
      actionType: "error",
      dataState: structuredClone(state),
      highlights: {},
      codeLine: 2,
      pseudocodeLine: 2,
      variables: { Key: valueToInsert },
    });
    return steps;
  }

  const hashIndex = normalizeBucketIndex(valueToInsert, setSize);
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate Hash",
    description: `Hash function: ${valueToInsert} % ${setSize} = ${hashIndex}. Initial target index is ${hashIndex}.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${hashIndex}`] },
    codeLine: 4,
    pseudocodeLine: 4,
    variables: { Key: valueToInsert, "Hash Index": hashIndex },
  });

  let currentIndex = hashIndex;

  while (buckets[currentIndex] !== null && !buckets[currentIndex]!.isDeleted) {
    if (buckets[currentIndex]!.key === valueToInsert) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Duplicate Key",
        description: `Bucket ${currentIndex} already contains ${valueToInsert}. Hash Set does not allow duplicates.`,
        operation: "Insert",
        actionType: "error",
        dataState: structuredClone(state),
        highlights: { active: [`bucket-${currentIndex}`], error: [buckets[currentIndex]!.id] },
        codeLine: 5,
        pseudocodeLine: 5,
        variables: { Index: currentIndex, Key: valueToInsert },
      });
      return steps;
    }

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Collision Detected",
      description: `Bucket ${currentIndex} is occupied by ${buckets[currentIndex]!.key}. Probing to next index.`,
      operation: "Probe",
      actionType: "collision",
      dataState: structuredClone(state),
      highlights: {
        active: [`bucket-${currentIndex}`],
        compared: [buckets[currentIndex]!.id],
      },
      codeLine: 7,
      pseudocodeLine: 7,
      variables: { Index: currentIndex, Target: valueToInsert },
    });

    currentIndex = (currentIndex + 1) % setSize;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Linear Probe",
      description: `Checking next index: ${currentIndex}.`,
      operation: "Probe",
      actionType: "probe",
      dataState: structuredClone(state),
      highlights: { active: [`bucket-${currentIndex}`] },
      codeLine: 8,
      pseudocodeLine: 8,
      variables: { "New Index": currentIndex },
    });
  }

  const newEntry: HashSetEntry = { id: uuidv4(), key: valueToInsert };
  buckets[currentIndex] = newEntry;
  state.elementCount++;
  state.loadFactor = state.elementCount / setSize;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Insert Element",
    description: `Found empty (or deleted) slot at index ${currentIndex}. Inserted ${valueToInsert}.`,
    operation: "Insert",
    actionType: "insert",
    dataState: structuredClone(state),
    highlights: { inserted: [newEntry.id], active: [`bucket-${currentIndex}`] },
    codeLine: 10,
    pseudocodeLine: 10,
    variables: { Index: currentIndex },
  });

  return steps;
}

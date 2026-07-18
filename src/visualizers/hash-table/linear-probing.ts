import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { HashTableVisualState, HashEntry, createInitialHashTableState } from "./types";

function initializeState(initialArray: number[], tableSize: number): HashTableVisualState {
  const state = createInitialHashTableState(tableSize, "linear-probing");
  const buckets = state.buckets as (HashEntry | null)[];
  for (const val of initialArray) {
    if (state.elementCount >= tableSize) break;
    let idx = val % tableSize;
    while (buckets[idx] !== null && !buckets[idx]!.isDeleted) {
      if (buckets[idx]!.key === val) break; // Avoid duplicates in Set
      idx = (idx + 1) % tableSize;
    }
    // If it's a duplicate, we skip
    if (buckets[idx]?.key !== val || buckets[idx]?.isDeleted) {
      buckets[idx] = { id: uuidv4(), key: val };
      state.elementCount++;
    }
  }
  state.loadFactor = state.elementCount / tableSize;
  return state;
}

export function generateLinearProbingInsertSteps(
  initialArray: number[],
  valueToInsert: number,
  tableSize: number = 7
): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, tableSize);
  const buckets = state.buckets as (HashEntry | null)[];
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Linear Probing Insert",
    description: `Attempting to insert key ${valueToInsert} into the Hash Table using Linear Probing.`,
    operation: "Insert",
    actionType: "initialize",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Key: valueToInsert, Size: tableSize },
  });

  if (state.elementCount >= tableSize) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Table Full",
      description: "The hash table is full. Cannot insert new element.",
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

  const hashIndex = valueToInsert % tableSize;
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate Hash",
    description: `Hash function: ${valueToInsert} % ${tableSize} = ${hashIndex}. Initial target index is ${hashIndex}.`,
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

    currentIndex = (currentIndex + 1) % tableSize;

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

  const newEntry: HashEntry = { id: uuidv4(), key: valueToInsert };
  buckets[currentIndex] = newEntry;
  state.elementCount++;
  state.loadFactor = state.elementCount / tableSize;

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

export function generateLinearProbingSearchSteps(
  initialArray: number[],
  targetValue: number,
  tableSize: number = 7
): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, tableSize);
  const buckets = state.buckets as (HashEntry | null)[];
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Linear Probing Search",
    description: `Searching for key ${targetValue} in the Hash Table.`,
    operation: "Search",
    actionType: "initialize",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Target: targetValue, Size: tableSize },
  });

  const hashIndex = targetValue % tableSize;
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate Hash",
    description: `Hash function: ${targetValue} % ${tableSize} = ${hashIndex}. Start searching at index ${hashIndex}.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${hashIndex}`] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: { Target: targetValue, "Hash Index": hashIndex },
  });

  let currentIndex = hashIndex;
  const startIndex = hashIndex;

  while (buckets[currentIndex] !== null) {
    const currentEntry = buckets[currentIndex]!;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Check Bucket",
      description: currentEntry.isDeleted
        ? `Bucket ${currentIndex} contains a deleted item (tombstone). Continuing search.`
        : `Comparing target ${targetValue} with value ${currentEntry.key} at index ${currentIndex}.`,
      operation: "Compare",
      actionType: "compare",
      dataState: structuredClone(state),
      highlights: {
        active: [`bucket-${currentIndex}`],
        compared: [currentEntry.id],
      },
      codeLine: 4,
      pseudocodeLine: 4,
      variables: { Index: currentIndex, Target: targetValue },
    });

    if (!currentEntry.isDeleted && currentEntry.key === targetValue) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Value Found",
        description: `Successfully found ${targetValue} at index ${currentIndex}.`,
        operation: "Search",
        actionType: "found",
        dataState: structuredClone(state),
        highlights: {
          active: [`bucket-${currentIndex}`],
          found: [currentEntry.id],
        },
        codeLine: 5,
        pseudocodeLine: 5,
        variables: { Index: currentIndex, Found: "true" },
      });
      return steps;
    }

    currentIndex = (currentIndex + 1) % tableSize;

    if (currentIndex === startIndex) {
      break;
    }

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Linear Probe",
      description: `Probing to next index: ${currentIndex}.`,
      operation: "Probe",
      actionType: "probe",
      dataState: structuredClone(state),
      highlights: { active: [`bucket-${currentIndex}`] },
      codeLine: 7,
      pseudocodeLine: 7,
      variables: { "New Index": currentIndex },
    });
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Value Not Found",
    description: `Reached an empty slot or searched entire table. The value ${targetValue} does not exist.`,
    operation: "Search",
    actionType: "not-found",
    dataState: structuredClone(state),
    highlights: { error: [`bucket-${currentIndex}`] },
    codeLine: 10,
    pseudocodeLine: 10,
    variables: { Found: "false" },
  });

  return steps;
}

export function generateLinearProbingDeleteSteps(
  initialArray: number[],
  targetValue: number,
  tableSize: number = 7
): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, tableSize);
  const buckets = state.buckets as (HashEntry | null)[];
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Linear Probing Delete",
    description: `Deleting key ${targetValue} from the Hash Table using Lazy Deletion.`,
    operation: "Delete",
    actionType: "initialize",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Target: targetValue, Size: tableSize },
  });

  const hashIndex = targetValue % tableSize;
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate Hash",
    description: `Hash function: ${targetValue} % ${tableSize} = ${hashIndex}. Start searching at index ${hashIndex}.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${hashIndex}`] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: { Target: targetValue, "Hash Index": hashIndex },
  });

  let currentIndex = hashIndex;
  const startIndex = hashIndex;

  while (buckets[currentIndex] !== null) {
    const currentEntry = buckets[currentIndex]!;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Check Bucket",
      description: currentEntry.isDeleted
        ? `Bucket ${currentIndex} contains a deleted item (tombstone). Continuing search.`
        : `Comparing target ${targetValue} with value ${currentEntry.key} at index ${currentIndex}.`,
      operation: "Compare",
      actionType: "compare",
      dataState: structuredClone(state),
      highlights: {
        active: [`bucket-${currentIndex}`],
        compared: [currentEntry.id],
      },
      codeLine: 4,
      pseudocodeLine: 4,
      variables: { Index: currentIndex, Target: targetValue },
    });

    if (!currentEntry.isDeleted && currentEntry.key === targetValue) {
      // Perform deletion (Tombstone)
      currentEntry.isDeleted = true;
      state.elementCount--;
      state.loadFactor = state.elementCount / tableSize;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Delete Value",
        description: `Found ${targetValue} at index ${currentIndex}. Marking as deleted (Tombstone).`,
        operation: "Delete",
        actionType: "delete",
        dataState: structuredClone(state),
        highlights: {
          active: [`bucket-${currentIndex}`],
          deleted: [currentEntry.id],
        },
        codeLine: 6,
        pseudocodeLine: 6,
        variables: { Index: currentIndex, Deleted: "true" },
      });
      return steps;
    }

    currentIndex = (currentIndex + 1) % tableSize;

    if (currentIndex === startIndex) {
      break;
    }

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Linear Probe",
      description: `Probing to next index: ${currentIndex}.`,
      operation: "Probe",
      actionType: "probe",
      dataState: structuredClone(state),
      highlights: { active: [`bucket-${currentIndex}`] },
      codeLine: 8,
      pseudocodeLine: 8,
      variables: { "New Index": currentIndex },
    });
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Value Not Found",
    description: `Reached an empty slot or searched entire table. The value ${targetValue} was not found to delete.`,
    operation: "Delete",
    actionType: "not-found",
    dataState: structuredClone(state),
    highlights: { error: [`bucket-${currentIndex}`] },
    codeLine: 11,
    pseudocodeLine: 11,
    variables: { Deleted: "false" },
  });

  return steps;
}

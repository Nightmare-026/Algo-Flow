import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { HashTableVisualState, HashEntry, createInitialHashTableState } from "./types";

function initializeState(initialArray: number[], tableSize: number): HashTableVisualState {
  const state = createInitialHashTableState(tableSize, "chaining");
  const buckets = state.buckets as HashEntry[][];
  for (const val of initialArray) {
    const idx = val % tableSize;
    // Check for duplicates
    if (!buckets[idx].find((entry) => entry.key === val)) {
      buckets[idx].push({ id: uuidv4(), key: val });
      state.elementCount++;
    }
  }
  state.loadFactor = state.elementCount / tableSize;
  return state;
}

export function generateChainingInsertSteps(
  initialArray: number[],
  valueToInsert: number,
  tableSize: number = 7
): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, tableSize);
  const buckets = state.buckets as HashEntry[][];
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Separate Chaining Insert",
    description: `Attempting to insert key ${valueToInsert} into the Hash Table using Separate Chaining.`,
    operation: "Insert",
    actionType: "initialize",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Key: valueToInsert, Size: tableSize },
  });

  const hashIndex = valueToInsert % tableSize;
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate Hash",
    description: `Hash function: ${valueToInsert} % ${tableSize} = ${hashIndex}. Target bucket is ${hashIndex}.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${hashIndex}`] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: { Key: valueToInsert, "Hash Index": hashIndex },
  });

  const bucket = buckets[hashIndex];

  for (let i = 0; i < bucket.length; i++) {
    const entry = bucket[i];
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Traverse Chain",
      description: `Comparing target ${valueToInsert} with existing entry ${entry.key} in the chain.`,
      operation: "Compare",
      actionType: "compare",
      dataState: structuredClone(state),
      highlights: {
        active: [`bucket-${hashIndex}`],
        compared: [entry.id],
      },
      codeLine: 4,
      pseudocodeLine: 4,
      variables: { Index: hashIndex, Current: entry.key },
    });

    if (entry.key === valueToInsert) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Duplicate Key",
        description: `Key ${valueToInsert} already exists in bucket ${hashIndex}. Hash Set does not allow duplicates.`,
        operation: "Insert",
        actionType: "error",
        dataState: structuredClone(state),
        highlights: { active: [`bucket-${hashIndex}`], error: [entry.id] },
        codeLine: 5,
        pseudocodeLine: 5,
        variables: { Index: hashIndex, Key: valueToInsert },
      });
      return steps;
    }
  }

  const newEntry: HashEntry = { id: uuidv4(), key: valueToInsert };
  bucket.push(newEntry);
  state.elementCount++;
  state.loadFactor = state.elementCount / tableSize;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Insert Element",
    description: `Appended ${valueToInsert} to the end of bucket ${hashIndex}'s chain.`,
    operation: "Insert",
    actionType: "insert",
    dataState: structuredClone(state),
    highlights: { inserted: [newEntry.id], active: [`bucket-${hashIndex}`] },
    codeLine: 8,
    pseudocodeLine: 8,
    variables: { Index: hashIndex },
  });

  return steps;
}

export function generateChainingSearchSteps(
  initialArray: number[],
  targetValue: number,
  tableSize: number = 7
): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, tableSize);
  const buckets = state.buckets as HashEntry[][];
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Separate Chaining Search",
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
    description: `Hash function: ${targetValue} % ${tableSize} = ${hashIndex}. Search bucket ${hashIndex}.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${hashIndex}`] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: { Target: targetValue, "Hash Index": hashIndex },
  });

  const bucket = buckets[hashIndex];

  if (bucket.length === 0) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Empty Bucket",
      description: `Bucket ${hashIndex} is empty. Value ${targetValue} does not exist.`,
      operation: "Search",
      actionType: "not-found",
      dataState: structuredClone(state),
      highlights: { error: [`bucket-${hashIndex}`] },
      codeLine: 4,
      pseudocodeLine: 4,
      variables: { Index: hashIndex },
    });
    return steps;
  }

  for (let i = 0; i < bucket.length; i++) {
    const entry = bucket[i];
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Traverse Chain",
      description: `Comparing target ${targetValue} with existing entry ${entry.key} in the chain.`,
      operation: "Compare",
      actionType: "compare",
      dataState: structuredClone(state),
      highlights: {
        active: [`bucket-${hashIndex}`],
        compared: [entry.id],
      },
      codeLine: 6,
      pseudocodeLine: 6,
      variables: { Index: hashIndex, Target: targetValue, Current: entry.key },
    });

    if (entry.key === targetValue) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Value Found",
        description: `Successfully found ${targetValue} in bucket ${hashIndex}.`,
        operation: "Search",
        actionType: "found",
        dataState: structuredClone(state),
        highlights: { active: [`bucket-${hashIndex}`], found: [entry.id] },
        codeLine: 7,
        pseudocodeLine: 7,
        variables: { Index: hashIndex, Found: "true" },
      });
      return steps;
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Value Not Found",
    description: `Reached the end of the chain in bucket ${hashIndex}. Value ${targetValue} does not exist.`,
    operation: "Search",
    actionType: "not-found",
    dataState: structuredClone(state),
    highlights: { error: [`bucket-${hashIndex}`] },
    codeLine: 10,
    pseudocodeLine: 10,
    variables: { Index: hashIndex, Found: "false" },
  });

  return steps;
}

export function generateChainingDeleteSteps(
  initialArray: number[],
  targetValue: number,
  tableSize: number = 7
): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, tableSize);
  const buckets = state.buckets as HashEntry[][];
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Separate Chaining Delete",
    description: `Deleting key ${targetValue} from the Hash Table.`,
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
    description: `Hash function: ${targetValue} % ${tableSize} = ${hashIndex}. Target bucket is ${hashIndex}.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${hashIndex}`] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: { Target: targetValue, "Hash Index": hashIndex },
  });

  const bucket = buckets[hashIndex];

  if (bucket.length === 0) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Empty Bucket",
      description: `Bucket ${hashIndex} is empty. Value ${targetValue} cannot be deleted.`,
      operation: "Delete",
      actionType: "error",
      dataState: structuredClone(state),
      highlights: { error: [`bucket-${hashIndex}`] },
      codeLine: 4,
      pseudocodeLine: 4,
      variables: { Index: hashIndex },
    });
    return steps;
  }

  for (let i = 0; i < bucket.length; i++) {
    const entry = bucket[i];
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Traverse Chain",
      description: `Comparing target ${targetValue} with existing entry ${entry.key} in the chain.`,
      operation: "Compare",
      actionType: "compare",
      dataState: structuredClone(state),
      highlights: {
        active: [`bucket-${hashIndex}`],
        compared: [entry.id],
      },
      codeLine: 6,
      pseudocodeLine: 6,
      variables: { Index: hashIndex, Target: targetValue, Current: entry.key },
    });

    if (entry.key === targetValue) {
      const deletedEntry = bucket[i];
      const removalState = structuredClone(state);
      bucket.splice(i, 1);
      state.elementCount--;
      state.loadFactor = state.elementCount / tableSize;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Delete Value",
        description: `Successfully removed ${targetValue} from bucket ${hashIndex}.`,
        operation: "Delete",
        actionType: "delete",
        dataState: removalState,
        highlights: { active: [`bucket-${hashIndex}`], deleted: [deletedEntry.id] },
        codeLine: 8,
        pseudocodeLine: 8,
        variables: { Index: hashIndex, Deleted: "true" },
      });
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Deletion Complete",
        description: `${targetValue} is no longer present in bucket ${hashIndex}.`,
        operation: "Delete",
        actionType: "complete",
        dataState: structuredClone(state),
        highlights: { active: [`bucket-${hashIndex}`] },
        codeLine: 9,
        pseudocodeLine: 9,
        variables: { Index: hashIndex, Deleted: "true" },
      });
      return steps;
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Value Not Found",
    description: `Reached the end of the chain in bucket ${hashIndex}. Value ${targetValue} does not exist to delete.`,
    operation: "Delete",
    actionType: "not-found",
    dataState: structuredClone(state),
    highlights: { error: [`bucket-${hashIndex}`] },
    codeLine: 11,
    pseudocodeLine: 11,
    variables: { Index: hashIndex, Deleted: "false" },
  });

  return steps;
}

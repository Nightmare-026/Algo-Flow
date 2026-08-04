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
  const tableSize = Math.max(1, size);
  const values = data.slice(0, Math.min(data.length, tableSize));
  const oldState = initializeHashTable(values, tableSize);
  const newSize = tableSize * 2 + 1;
  const newState = createInitialHashTableState(newSize, "linear-probing");
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const stateWithOldTable = (): HashTableVisualState => ({
    ...clone(newState),
    rehash: {
      oldTableSize: oldState.tableSize,
      oldBuckets: (oldState.buckets as (HashEntry | null)[]).map((entry) =>
        entry ? { ...clone(entry), id: `old-${entry.id}` } : null
      ),
    },
  });

  const thresholdPredicate = {
    operator: ">=" as const,
    left: oldState.loadFactor,
    right: 0.75,
    result: oldState.loadFactor >= 0.75,
  };

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Check Load Factor",
      description: thresholdPredicate.result
        ? `Load factor ${oldState.loadFactor.toFixed(2)} >= 0.75, so rehashing starts.`
        : `Load factor ${oldState.loadFactor.toFixed(2)} < 0.75, so rehashing is not required.`,
      operation: "Rehashing",
      actionType: "compare",
      dataState: clone(oldState),
      beforeState: clone(oldState),
      afterState: clone(oldState),
      predicate: thresholdPredicate,
      highlights: { compared: entryIds(oldState) },
      variables: {
        loadFactor: oldState.loadFactor.toFixed(2),
        threshold: 0.75,
        comparison: ">=",
        elementCount: oldState.elementCount,
      },
      pseudocodeLine: 1,
    })
  );

  if (!thresholdPredicate.result) {
    steps.push(
      visualStep({
        stepNumber,
        title: "Rehash Not Needed",
        description: "The table remains unchanged because the threshold was not reached.",
        operation: "Rehashing",
        actionType: "complete",
        dataState: clone(oldState),
        highlights: { success: entryIds(oldState) },
        variables: { moved: 0, elementCount: oldState.elementCount },
        output: values,
        pseudocodeLine: 9,
      })
    );
    return steps;
  }

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Allocate Larger Table",
      description: `Create an empty table with capacity ${newSize}; keep the old table visible.`,
      operation: "Rehashing",
      actionType: "build",
      dataState: stateWithOldTable(),
      highlights: {},
      variables: { oldSize: tableSize, newSize, elementCount: values.length },
      pseudocodeLine: 2,
    })
  );

  const oldBuckets = oldState.buckets as (HashEntry | null)[];
  const newBuckets = newState.buckets as (HashEntry | null)[];

  for (let oldIndex = 0; oldIndex < oldBuckets.length; oldIndex++) {
    const entry = oldBuckets[oldIndex];
    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: `Read Old Bucket ${oldIndex}`,
        description: entry
          ? `Old bucket ${oldIndex} contains key ${entry.key}.`
          : `Old bucket ${oldIndex} is empty.`,
        operation: "Rehashing",
        actionType: "read",
        dataState: stateWithOldTable(),
        highlights: { active: [`old-bucket-${oldIndex}`] },
        variables: { oldIndex, key: entry?.key ?? "empty" },
        pseudocodeLine: 3,
      })
    );

    if (!entry) {
      steps.push(
        visualStep({
          stepNumber: stepNumber++,
          title: "Skip Empty Bucket",
          description: `Bucket ${oldIndex} is empty, so continue to the next old bucket.`,
          operation: "Rehashing",
          actionType: "read",
          dataState: stateWithOldTable(),
          highlights: { active: [`old-bucket-${oldIndex}`] },
          variables: { oldIndex, action: "continue" },
          pseudocodeLine: 4,
        })
      );
      continue;
    }

    let newIndex = ((entry.key % newSize) + newSize) % newSize;
    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: "Compute New Bucket",
        description: `hash(${entry.key}) % ${newSize} = ${newIndex}.`,
        operation: "Rehashing",
        actionType: "hash",
        dataState: stateWithOldTable(),
        highlights: { active: [`old-bucket-${oldIndex}`, `bucket-${newIndex}`] },
        variables: { oldIndex, key: entry.key, newIndex, newCapacity: newSize },
        pseudocodeLine: 5,
      })
    );

    while (newBuckets[newIndex]) {
      const occupiedBy = newBuckets[newIndex]!.key;
      steps.push(
        visualStep({
          stepNumber: stepNumber++,
          title: "Probe Occupied Bucket",
          description: `New bucket ${newIndex} contains ${occupiedBy}; probe the next bucket.`,
          operation: "Rehashing",
          actionType: "probe",
          dataState: stateWithOldTable(),
          highlights: { error: [`bucket-${newIndex}`], active: [`old-bucket-${oldIndex}`] },
          variables: { oldIndex, key: entry.key, newIndex, occupiedBy },
          pseudocodeLine: 6,
        })
      );
      newIndex = (newIndex + 1) % newSize;
    }

    newBuckets[newIndex] = clone(entry);
    newState.elementCount++;
    newState.loadFactor = newState.elementCount / newSize;
    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: `Insert Key ${entry.key}`,
        description: `Move key ${entry.key} from old bucket ${oldIndex} to new bucket ${newIndex}.`,
        operation: "Rehashing",
        actionType: "insert",
        dataState: stateWithOldTable(),
        highlights: { inserted: [entry.id], active: [`bucket-${newIndex}`] },
        variables: {
          oldIndex,
          key: entry.key,
          newIndex,
          moved: newState.elementCount,
          remaining: values.length - newState.elementCount,
        },
        pseudocodeLine: 7,
      })
    );

    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: "Advance Old Bucket",
        description: `Key ${entry.key} is preserved; advance beyond old bucket ${oldIndex}.`,
        operation: "Rehashing",
        actionType: "move-pointer",
        dataState: stateWithOldTable(),
        highlights: { visited: [entry.id] },
        variables: { oldIndex, nextOldIndex: oldIndex + 1 },
        pseudocodeLine: 8,
      })
    );
  }

  steps.push(
    visualStep({
      stepNumber,
      title: "Rehash Complete",
      description: `Moved all ${newState.elementCount} keys into the ${newSize}-bucket table.`,
      operation: "Rehashing",
      actionType: "complete",
      dataState: stateWithOldTable(),
      highlights: { success: entryIds(newState) },
      variables: {
        moved: newState.elementCount,
        elementCount: newState.elementCount,
        loadFactor: newState.loadFactor.toFixed(2),
      },
      output: values,
      pseudocodeLine: 9,
    })
  );

  return steps;
}

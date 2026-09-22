import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import {
  HashTableVisualState,
  HashEntry,
  createInitialHashTableState,
  normalizeBucketIndex,
  isValidTableSize,
  ProbingStrategy,
} from "./types";

function invalidSizeSteps(size: number, operation: string): VisualStep[] {
  return [
    {
      id: uuidv4(),
      stepNumber: 1,
      title: "Invalid Table Size",
      description: `Table size must be a whole number of at least 1 (received ${size}). Increase the capacity and retry.`,
      operation,
      actionType: "error",
      dataState: createInitialHashTableState(1, "linear-probing"),
      highlights: {},
      codeLine: 1,
      pseudocodeLine: 1,
      variables: { Size: size },
    },
  ];
}

function getStrategyName(strategy: ProbingStrategy = "linear"): string {
  if (strategy === "quadratic") return "Quadratic Probing";
  if (strategy === "double-hashing") return "Double Hashing";
  return "Linear Probing";
}

function computeProbeIndex(
  h1: number,
  probeIndex: number,
  key: number,
  tableSize: number,
  strategy: ProbingStrategy = "linear"
): { index: number; formula: string } {
  if (strategy === "quadratic") {
    const offset = probeIndex * probeIndex;
    const index = (h1 + offset) % tableSize;
    return {
      index,
      formula: `(${h1} + ${probeIndex}²) % ${tableSize} = ${index}`,
    };
  }
  if (strategy === "double-hashing") {
    const modulus = Math.max(1, tableSize - 1);
    const h2 = 1 + normalizeBucketIndex(key, modulus);
    const offset = probeIndex * h2;
    const index = (h1 + offset) % tableSize;
    return {
      index,
      formula: `(${h1} + ${probeIndex} × ${h2}) % ${tableSize} = ${index}`,
    };
  }
  // Linear Probing
  const index = (h1 + probeIndex) % tableSize;
  return {
    index,
    formula: `(${h1} + ${probeIndex}) % ${tableSize} = ${index}`,
  };
}

function initializeState(
  initialArray: number[],
  tableSize: number,
  strategy: ProbingStrategy = "linear"
): HashTableVisualState {
  const resolution =
    strategy === "quadratic"
      ? "quadratic-probing"
      : strategy === "double-hashing"
        ? "double-hashing"
        : "linear-probing";

  const state = createInitialHashTableState(tableSize, resolution);
  const buckets = state.buckets as (HashEntry | null)[];

  for (const val of initialArray) {
    if (state.elementCount >= tableSize) break;
    const h1 = normalizeBucketIndex(val, tableSize);
    let found = false;
    let firstTombstone = -1;

    for (let i = 0; i < tableSize; i++) {
      const { index } = computeProbeIndex(h1, i, val, tableSize, strategy);
      const slot = buckets[index];
      if (slot === null) {
        if (firstTombstone === -1) {
          firstTombstone = index;
        }
        break;
      }
      if (slot.isDeleted) {
        if (firstTombstone === -1) {
          firstTombstone = index;
        }
      } else if (slot.key === val) {
        found = true;
        break;
      }
    }

    if (!found && firstTombstone !== -1) {
      buckets[firstTombstone] = { id: uuidv4(), key: val };
      state.elementCount++;
    }
  }

  state.loadFactor = state.elementCount / tableSize;
  return state;
}

export function generateLinearProbingInsertSteps(
  initialArray: number[],
  valueToInsert: number,
  tableSize: number = 7,
  strategy: ProbingStrategy = "linear"
): VisualStep[] {
  if (!isValidTableSize(tableSize)) return invalidSizeSteps(tableSize, "Insert");
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, tableSize, strategy);
  const buckets = state.buckets as (HashEntry | null)[];
  let stepNumber = 1;
  const strategyTitle = getStrategyName(strategy);

  state.activeFormula = `h1(k) = ${valueToInsert} % ${tableSize}`;
  state.probeHistory = [];

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Initialize ${strategyTitle} Insert`,
    description: `Attempting to insert key ${valueToInsert} into the table using ${strategyTitle}. Table size = ${tableSize}.`,
    operation: "Insert",
    actionType: "initialize",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Key: valueToInsert, Size: tableSize, Strategy: strategyTitle },
  });

  if (state.elementCount >= tableSize) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Table Full",
      description: "The hash table is at maximum capacity. Cannot insert new element.",
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

  const h1 = normalizeBucketIndex(valueToInsert, tableSize);
  state.activeFormula = `h1(${valueToInsert}) = ${valueToInsert} % ${tableSize} = ${h1}`;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate Primary Hash",
    description: `Primary hash function: h1(${valueToInsert}) = ${valueToInsert} % ${tableSize} = ${h1}. Starting probe sequence at index ${h1}.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${h1}`] },
    codeLine: 4,
    pseudocodeLine: 4,
    variables: { Key: valueToInsert, "Initial Hash": h1 },
  });

  let firstTombstoneIndex = -1;
  let finalIndex = -1;

  for (let i = 0; i < tableSize; i++) {
    const { index, formula } = computeProbeIndex(h1, i, valueToInsert, tableSize, strategy);
    state.activeFormula = formula;
    const currentEntry = buckets[index];

    if (currentEntry === null) {
      state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "empty" });

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Empty Slot Reached",
        description: `Probe ${i}: Bucket ${index} is empty (${formula}). Verified key ${valueToInsert} does not already exist in the cluster.`,
        operation: "Probe",
        actionType: "probe",
        dataState: structuredClone(state),
        highlights: { active: [`bucket-${index}`] },
        codeLine: 7,
        pseudocodeLine: 7,
        variables: { Probe: i, Index: index, Formula: formula },
      });

      if (firstTombstoneIndex === -1) {
        finalIndex = index;
      } else {
        finalIndex = firstTombstoneIndex;
      }
      break;
    }

    if (currentEntry.isDeleted) {
      if (firstTombstoneIndex === -1) {
        firstTombstoneIndex = index;
      }
      state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "tombstone" });

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Tombstone Encountered",
        description: `Probe ${i}: Bucket ${index} has a tombstone (DELETED). Remembering index ${index} as candidate, continuing probe to guarantee key is unique.`,
        operation: "Probe",
        actionType: "probe",
        dataState: structuredClone(state),
        highlights: {
          active: [`bucket-${index}`],
          compared: [currentEntry.id],
        },
        codeLine: 7,
        pseudocodeLine: 7,
        variables: { Probe: i, Index: index, "First Tombstone": firstTombstoneIndex },
      });
      continue;
    }

    // Active entry
    if (currentEntry.key === valueToInsert) {
      state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "found" });

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Duplicate Key Detected",
        description: `Probe ${i}: Bucket ${index} already contains key ${valueToInsert}. Duplicate keys are not allowed.`,
        operation: "Insert",
        actionType: "error",
        dataState: structuredClone(state),
        highlights: { active: [`bucket-${index}`], error: [currentEntry.id] },
        codeLine: 5,
        pseudocodeLine: 5,
        variables: { Index: index, Key: valueToInsert },
      });
      return steps;
    }

    // Collision with another key
    state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "occupied" });

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Collision Detected",
      description: `Probe ${i}: Bucket ${index} is occupied by key ${currentEntry.key}. Probing next slot (${formula}).`,
      operation: "Probe",
      actionType: "collision",
      dataState: structuredClone(state),
      highlights: {
        active: [`bucket-${index}`],
        compared: [currentEntry.id],
      },
      codeLine: 8,
      pseudocodeLine: 8,
      variables: { Probe: i, Index: index, Occupant: currentEntry.key },
    });
  }

  if (finalIndex === -1 && firstTombstoneIndex !== -1) {
    finalIndex = firstTombstoneIndex;
  }

  if (finalIndex === -1) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Table Full / Cycle Exhausted",
      description: `Probed ${tableSize} slots without finding an available bucket. Insertion failed.`,
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

  const wasTombstone = finalIndex === firstTombstoneIndex;
  const newEntry: HashEntry = { id: uuidv4(), key: valueToInsert };
  buckets[finalIndex] = newEntry;
  state.elementCount++;
  state.loadFactor = state.elementCount / tableSize;
  state.activeFormula = `Inserted ${valueToInsert} at index ${finalIndex}${wasTombstone ? " (reused tombstone)" : ""}`;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Insert Element",
    description: wasTombstone
      ? `Reused deleted tombstone slot at index ${finalIndex}. Successfully inserted ${valueToInsert}.`
      : `Found available slot at index ${finalIndex}. Successfully inserted ${valueToInsert}.`,
    operation: "Insert",
    actionType: "insert",
    dataState: structuredClone(state),
    highlights: { inserted: [newEntry.id], active: [`bucket-${finalIndex}`] },
    codeLine: 10,
    pseudocodeLine: 10,
    variables: {
      Index: finalIndex,
      Key: valueToInsert,
      LoadFactor: state.loadFactor.toFixed(2),
    },
  });

  return steps;
}

export function generateLinearProbingSearchSteps(
  initialArray: number[],
  targetValue: number,
  tableSize: number = 7,
  strategy: ProbingStrategy = "linear"
): VisualStep[] {
  if (!isValidTableSize(tableSize)) return invalidSizeSteps(tableSize, "Search");
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, tableSize, strategy);
  const buckets = state.buckets as (HashEntry | null)[];
  let stepNumber = 1;
  const strategyTitle = getStrategyName(strategy);

  state.activeFormula = `h1(${targetValue}) = ${targetValue} % ${tableSize}`;
  state.probeHistory = [];

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Initialize ${strategyTitle} Search`,
    description: `Searching for key ${targetValue} using ${strategyTitle}. Table size = ${tableSize}.`,
    operation: "Search",
    actionType: "initialize",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Target: targetValue, Size: tableSize, Strategy: strategyTitle },
  });

  const h1 = normalizeBucketIndex(targetValue, tableSize);
  state.activeFormula = `h1(${targetValue}) = ${targetValue} % ${tableSize} = ${h1}`;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate Primary Hash",
    description: `Primary hash function: h1(${targetValue}) = ${targetValue} % ${tableSize} = ${h1}. Starting search at index ${h1}.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${h1}`] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: { Target: targetValue, "Initial Hash": h1 },
  });

  for (let i = 0; i < tableSize; i++) {
    const { index, formula } = computeProbeIndex(h1, i, targetValue, tableSize, strategy);
    state.activeFormula = formula;
    const currentEntry = buckets[index];

    if (currentEntry === null) {
      state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "empty" });

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Empty Bucket Encountered",
        description: `Probe ${i}: Bucket ${index} is empty (${formula}). Search chain terminates; key ${targetValue} does not exist.`,
        operation: "Search",
        actionType: "not-found",
        dataState: structuredClone(state),
        highlights: { error: [`bucket-${index}`] },
        codeLine: 10,
        pseudocodeLine: 10,
        variables: { Probe: i, Index: index, Found: "false" },
      });
      return steps;
    }

    if (currentEntry.isDeleted) {
      state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "tombstone" });

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Tombstone Encountered",
        description: `Probe ${i}: Bucket ${index} contains a deleted tombstone. Skipping and continuing search chain.`,
        operation: "Probe",
        actionType: "probe",
        dataState: structuredClone(state),
        highlights: {
          active: [`bucket-${index}`],
          compared: [currentEntry.id],
        },
        codeLine: 7,
        pseudocodeLine: 7,
        variables: { Probe: i, Index: index },
      });
      continue;
    }

    // Active entry
    if (currentEntry.key === targetValue) {
      state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "found" });

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Key Found!",
        description: `Probe ${i}: Found key ${targetValue} at index ${index} after ${i + 1} probe(s).`,
        operation: "Search",
        actionType: "found",
        dataState: structuredClone(state),
        highlights: {
          active: [`bucket-${index}`],
          found: [currentEntry.id],
        },
        codeLine: 5,
        pseudocodeLine: 5,
        variables: { Probe: i, Index: index, Found: "true" },
      });
      return steps;
    }

    // Mismatch
    state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "occupied" });

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Key Mismatch",
      description: `Probe ${i}: Bucket ${index} holds ${currentEntry.key} != ${targetValue}. Probing next slot (${formula}).`,
      operation: "Compare",
      actionType: "compare",
      dataState: structuredClone(state),
      highlights: {
        active: [`bucket-${index}`],
        compared: [currentEntry.id],
      },
      codeLine: 4,
      pseudocodeLine: 4,
      variables: { Probe: i, Index: index, Key: currentEntry.key },
    });

    if (i < tableSize - 1) {
      const nextProbe = computeProbeIndex(h1, i + 1, targetValue, tableSize, strategy);
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Probe Next Slot",
        description: `Probing next bucket in sequence: index ${nextProbe.index} (${nextProbe.formula}).`,
        operation: "Probe",
        actionType: "probe",
        dataState: structuredClone(state),
        highlights: { active: [`bucket-${nextProbe.index}`] },
        codeLine: 7,
        pseudocodeLine: 7,
        variables: { "Next Probe": i + 1, "Next Index": nextProbe.index },
      });
    }
  }

  // Full table cycle exhausted
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Value Not Found (Cycle Complete)",
    description: `Checked all ${tableSize} slots in the table. Key ${targetValue} is not present.`,
    operation: "Search",
    actionType: "not-found",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 10,
    pseudocodeLine: 10,
    variables: { Found: "false" },
  });

  return steps;
}

export function generateLinearProbingDeleteSteps(
  initialArray: number[],
  targetValue: number,
  tableSize: number = 7,
  strategy: ProbingStrategy = "linear"
): VisualStep[] {
  if (!isValidTableSize(tableSize)) return invalidSizeSteps(tableSize, "Delete");
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, tableSize, strategy);
  const buckets = state.buckets as (HashEntry | null)[];
  let stepNumber = 1;
  const strategyTitle = getStrategyName(strategy);

  state.activeFormula = `h1(${targetValue}) = ${targetValue} % ${tableSize}`;
  state.probeHistory = [];

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Initialize ${strategyTitle} Delete`,
    description: `Deleting key ${targetValue} using ${strategyTitle} (Lazy Deletion / Tombstone).`,
    operation: "Delete",
    actionType: "initialize",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Target: targetValue, Size: tableSize, Strategy: strategyTitle },
  });

  const h1 = normalizeBucketIndex(targetValue, tableSize);
  state.activeFormula = `h1(${targetValue}) = ${targetValue} % ${tableSize} = ${h1}`;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate Primary Hash",
    description: `Primary hash function: h1(${targetValue}) = ${targetValue} % ${tableSize} = ${h1}. Searching for key to remove.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${h1}`] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: { Target: targetValue, "Initial Hash": h1 },
  });

  for (let i = 0; i < tableSize; i++) {
    const { index, formula } = computeProbeIndex(h1, i, targetValue, tableSize, strategy);
    state.activeFormula = formula;
    const currentEntry = buckets[index];

    if (currentEntry === null) {
      state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "empty" });

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Empty Bucket Encountered",
        description: `Probe ${i}: Bucket ${index} is empty (${formula}). Key ${targetValue} was not found to delete.`,
        operation: "Delete",
        actionType: "not-found",
        dataState: structuredClone(state),
        highlights: { error: [`bucket-${index}`] },
        codeLine: 11,
        pseudocodeLine: 11,
        variables: { Deleted: "false" },
      });
      return steps;
    }

    if (currentEntry.isDeleted) {
      state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "tombstone" });

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Tombstone Encountered",
        description: `Probe ${i}: Bucket ${index} has an existing tombstone. Continuing probe chain.`,
        operation: "Probe",
        actionType: "probe",
        dataState: structuredClone(state),
        highlights: {
          active: [`bucket-${index}`],
          compared: [currentEntry.id],
        },
        codeLine: 8,
        pseudocodeLine: 8,
        variables: { Probe: i, Index: index },
      });
      continue;
    }

    // Active entry
    if (currentEntry.key === targetValue) {
      currentEntry.isDeleted = true;
      state.elementCount--;
      state.loadFactor = state.elementCount / tableSize;
      state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "tombstone" });

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Delete Key (Mark Tombstone)",
        description: `Found key ${targetValue} at index ${index}. Marked as deleted (Tombstone) to preserve probe chains for subsequent keys.`,
        operation: "Delete",
        actionType: "delete",
        dataState: structuredClone(state),
        highlights: {
          active: [`bucket-${index}`],
          deleted: [currentEntry.id],
        },
        codeLine: 6,
        pseudocodeLine: 6,
        variables: { Index: index, Deleted: "true", Remaining: state.elementCount },
      });
      return steps;
    }

    // Mismatch
    state.probeHistory.push({ probeIndex: i, bucketIndex: index, status: "occupied" });

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Key Mismatch",
      description: `Probe ${i}: Bucket ${index} holds ${currentEntry.key} != ${targetValue}. Probing next slot (${formula}).`,
      operation: "Compare",
      actionType: "compare",
      dataState: structuredClone(state),
      highlights: {
        active: [`bucket-${index}`],
        compared: [currentEntry.id],
      },
      codeLine: 4,
      pseudocodeLine: 4,
      variables: { Probe: i, Index: index, Key: currentEntry.key },
    });

    if (i < tableSize - 1) {
      const nextProbe = computeProbeIndex(h1, i + 1, targetValue, tableSize, strategy);
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Probe Next Slot",
        description: `Probing next bucket in sequence: index ${nextProbe.index} (${nextProbe.formula}).`,
        operation: "Probe",
        actionType: "probe",
        dataState: structuredClone(state),
        highlights: { active: [`bucket-${nextProbe.index}`] },
        codeLine: 8,
        pseudocodeLine: 8,
        variables: { "Next Probe": i + 1, "Next Index": nextProbe.index },
      });
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Value Not Found (Cycle Complete)",
    description: `Searched all ${tableSize} slots without finding key ${targetValue}. Nothing was deleted.`,
    operation: "Delete",
    actionType: "not-found",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 11,
    pseudocodeLine: 11,
    variables: { Deleted: "false" },
  });

  return steps;
}

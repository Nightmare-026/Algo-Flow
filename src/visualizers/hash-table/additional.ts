import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { createInitialHashTableState, HashEntry, HashTableVisualState } from "./types";

const clone = <T>(value: T): T => structuredClone(value);

function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input, codeLine: input.codeLine ?? input.pseudocodeLine };
}

function entryIds(state: HashTableVisualState) {
  return (state.buckets as (HashEntry | null)[])
    .filter((entry): entry is HashEntry => entry !== null && !entry.isDeleted)
    .map((entry) => entry.id);
}

function initializeHashTable(values: number[], size: number): HashTableVisualState {
  const state = createInitialHashTableState(size, "linear-probing");
  const buckets = state.buckets as (HashEntry | null)[];
  const seen = new Set<number>();

  for (const value of values) {
    if (state.elementCount >= size) break;
    if (seen.has(value)) continue; // skip duplicates in initial table
    seen.add(value);

    let index = ((value % size) + size) % size;
    let probes = 0;
    while (buckets[index] && !buckets[index]!.isDeleted && probes < size) {
      if (buckets[index]!.key === value) break;
      index = (index + 1) % size;
      probes++;
    }
    if (!buckets[index] || buckets[index]!.isDeleted) {
      buckets[index] = { id: uuidv4(), key: value };
      state.elementCount++;
    }
  }
  state.loadFactor = state.elementCount / size;
  return state;
}

export function generateDivisionHashSteps(
  data: number[] | number,
  value?: number,
  size = 7
): VisualStep[] {
  // Support both array of numbers or single value for backwards compatibility
  let keysToHash: number[] = [];
  if (Array.isArray(data)) {
    keysToHash = [...data];
    if (value !== undefined && !keysToHash.includes(value)) {
      keysToHash.push(value);
    }
  } else if (typeof data === "number") {
    keysToHash = [data];
  } else if (value !== undefined) {
    keysToHash = [value];
  } else {
    keysToHash = [15, 23, 4, 8, 42];
  }

  const tableSize = Math.max(2, size);
  const state = createInitialHashTableState(tableSize, "linear-probing");
  const buckets = state.buckets as (HashEntry | null)[];
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  state.activeFormula = `h(k) = k % ${tableSize}`;

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Initialize Division Hash Method",
      description: `Exploring key distribution using formula: h(k) = k mod ${tableSize}. Capacity m = ${tableSize}.`,
      operation: "Hashing",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      variables: { tableSize, keysCount: keysToHash.length },
      pseudocodeLine: 1,
    })
  );

  let collisionCount = 0;

  for (let i = 0; i < keysToHash.length; i++) {
    const key = keysToHash[i];
    const index = ((key % tableSize) + tableSize) % tableSize;
    state.activeFormula = `h(${key}) = ${key} % ${tableSize} = ${index}`;

    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: `Hash Key ${key}`,
        description: `Computing hash: h(${key}) = ${key} mod ${tableSize} = ${index}. Target bucket is ${index}.`,
        operation: "Hashing",
        actionType: "hash",
        dataState: clone(state),
        highlights: { active: [`bucket-${index}`] },
        variables: { key, tableSize, bucket: index },
        pseudocodeLine: 2,
      })
    );

    if (buckets[index] === null) {
      const entry: HashEntry = { id: uuidv4(), key };
      buckets[index] = entry;
      state.elementCount++;
      state.loadFactor = state.elementCount / tableSize;

      steps.push(
        visualStep({
          stepNumber: stepNumber++,
          title: `Place Key ${key}`,
          description: `Bucket ${index} is empty. Placed key ${key} in bucket ${index}. (Load factor = ${state.loadFactor.toFixed(2)})`,
          operation: "Insert",
          actionType: "insert",
          dataState: clone(state),
          highlights: { inserted: [entry.id], active: [`bucket-${index}`] },
          variables: { key, bucket: index, loadFactor: state.loadFactor.toFixed(2) },
          pseudocodeLine: 2,
        })
      );
    } else {
      collisionCount++;
      const existingEntry = buckets[index]!;

      steps.push(
        visualStep({
          stepNumber: stepNumber++,
          title: `Collision at Bucket ${index}`,
          description: `Bucket ${index} is already occupied by key ${existingEntry.key}! Collision #${collisionCount} occurred.`,
          operation: "Collision",
          actionType: "collision",
          dataState: clone(state),
          highlights: { active: [`bucket-${index}`], error: [existingEntry.id] },
          variables: {
            key,
            bucket: index,
            occupant: existingEntry.key,
            collisions: collisionCount,
          },
          pseudocodeLine: 2,
        })
      );

      // Probe to demonstrate open addressing placement if table not full
      let probeIdx = (index + 1) % tableSize;
      let placed = false;
      while (probeIdx !== index) {
        if (buckets[probeIdx] === null) {
          const entry: HashEntry = { id: uuidv4(), key };
          buckets[probeIdx] = entry;
          state.elementCount++;
          state.loadFactor = state.elementCount / tableSize;
          placed = true;

          steps.push(
            visualStep({
              stepNumber: stepNumber++,
              title: `Resolve Collision via Probing`,
              description: `Linear probed to bucket ${probeIdx}. Placed key ${key} at bucket ${probeIdx}.`,
              operation: "Insert",
              actionType: "insert",
              dataState: clone(state),
              highlights: { inserted: [entry.id], active: [`bucket-${probeIdx}`] },
              variables: { key, bucket: probeIdx, resolvedFrom: index },
              pseudocodeLine: 2,
            })
          );
          break;
        }
        probeIdx = (probeIdx + 1) % tableSize;
      }

      if (!placed) {
        steps.push(
          visualStep({
            stepNumber: stepNumber++,
            title: "Table Full",
            description: `Table is completely full. Cannot place remaining keys.`,
            operation: "Hashing",
            actionType: "error",
            dataState: clone(state),
            highlights: {},
            variables: { key },
            pseudocodeLine: 2,
          })
        );
        break;
      }
    }
  }

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Division Hash Distribution Complete",
      description: `Hashed ${state.elementCount} keys into ${tableSize} buckets. Total collisions: ${collisionCount}. Final load factor: ${state.loadFactor.toFixed(2)}.`,
      operation: "Hashing",
      actionType: "complete",
      dataState: clone(state),
      highlights: { success: entryIds(state) },
      variables: {
        keysCount: state.elementCount,
        collisions: collisionCount,
        loadFactor: state.loadFactor.toFixed(2),
      },
      pseudocodeLine: 2,
    })
  );

  return steps;
}

export function generateRehashingSteps(data: number[], size = 7): VisualStep[] {
  const tableSize = Math.max(2, size);
  // Ensure enough unique keys to hit load factor threshold of 0.75 so rehash is always demonstrated
  const uniqueData = Array.from(new Set(data));
  const minRequired = Math.ceil(tableSize * 0.75);
  const triggerDefaults = [11, 23, 37, 49, 61, 73, 85, 97];

  for (const fallback of triggerDefaults) {
    if (uniqueData.length >= minRequired) break;
    if (!uniqueData.includes(fallback)) {
      uniqueData.push(fallback);
    }
  }

  const values = uniqueData.slice(0, Math.min(uniqueData.length, tableSize));
  const oldState = initializeHashTable(values, tableSize);
  const newSize = tableSize * 2 + 1;
  const newState = createInitialHashTableState(newSize, "linear-probing");
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const stateWithOldTable = (
    activeOld?: number | null,
    activeNew?: number | null,
    migratingKey?: number | null
  ): HashTableVisualState => ({
    ...clone(newState),
    activeFormula: `Old Size: ${tableSize} → New Size: ${newSize}`,
    rehash: {
      oldTableSize: oldState.tableSize,
      oldBuckets: (oldState.buckets as (HashEntry | null)[]).map((entry) =>
        entry ? { ...clone(entry), id: `old-${entry.id}` } : null
      ),
      oldElementCount: oldState.elementCount,
      oldLoadFactor: oldState.loadFactor,
      activeOldIndex: activeOld ?? null,
      activeNewIndex: activeNew ?? null,
      migratingKey: migratingKey ?? null,
    },
  });

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Evaluate Load Factor Threshold",
      description: `Old table load factor is ${oldState.loadFactor.toFixed(2)} (${oldState.elementCount}/${tableSize}) >= 0.75 threshold. Dynamic rehashing triggered!`,
      operation: "Rehashing",
      actionType: "compare",
      dataState: clone(oldState),
      beforeState: clone(oldState),
      afterState: clone(oldState),
      predicate: {
        operator: ">=",
        left: oldState.loadFactor,
        right: 0.75,
        result: true,
      },
      highlights: { compared: entryIds(oldState) },
      variables: {
        loadFactor: oldState.loadFactor.toFixed(2),
        threshold: 0.75,
        elementCount: oldState.elementCount,
        oldCapacity: tableSize,
      },
      pseudocodeLine: 1,
    })
  );

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Allocate Doubled Table",
      description: `Created new table with capacity ${newSize} (oldSize × 2 + 1). Keeping old table visible for transfer.`,
      operation: "Rehashing",
      actionType: "build",
      dataState: stateWithOldTable(),
      highlights: {},
      variables: { oldSize: tableSize, newSize, keysToTransfer: values.length },
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
        title: `Scan Old Bucket ${oldIndex}`,
        description: entry
          ? `Old bucket ${oldIndex} contains key ${entry.key}. Preparing to re-hash into new table.`
          : `Old bucket ${oldIndex} is empty. Advancing to next bucket.`,
        operation: "Rehashing",
        actionType: "read",
        dataState: stateWithOldTable(oldIndex, null, entry?.key),
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
          description: `Old bucket ${oldIndex} is empty; skipping to next index.`,
          operation: "Rehashing",
          actionType: "read",
          dataState: stateWithOldTable(oldIndex, null),
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
        title: `Re-Compute Hash for Key ${entry.key}`,
        description: `New hash calculation: h(${entry.key}) = ${entry.key} mod ${newSize} = ${newIndex}.`,
        operation: "Rehashing",
        actionType: "hash",
        dataState: stateWithOldTable(oldIndex, newIndex, entry.key),
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
          title: "Probe Occupied Bucket in New Table",
          description: `New bucket ${newIndex} is already occupied by ${occupiedBy}. Probing to next slot in new table.`,
          operation: "Rehashing",
          actionType: "probe",
          dataState: stateWithOldTable(oldIndex, newIndex, entry.key),
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
        title: `Migrate Key ${entry.key} → New Bucket ${newIndex}`,
        description: `Transferred key ${entry.key} from old bucket ${oldIndex} to new bucket ${newIndex}. (New load factor: ${newState.loadFactor.toFixed(2)})`,
        operation: "Rehashing",
        actionType: "insert",
        dataState: stateWithOldTable(oldIndex, newIndex, entry.key),
        highlights: { inserted: [entry.id], active: [`bucket-${newIndex}`] },
        variables: {
          oldIndex,
          key: entry.key,
          newIndex,
          migrated: newState.elementCount,
          newLoadFactor: newState.loadFactor.toFixed(2),
        },
        pseudocodeLine: 7,
      })
    );

    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: `Mark Old Bucket ${oldIndex} Processed`,
        description: `Key ${entry.key} successfully rehashed. Advancing old pointer past index ${oldIndex}.`,
        operation: "Rehashing",
        actionType: "move-pointer",
        dataState: stateWithOldTable(null, newIndex),
        highlights: { visited: [`old-bucket-${oldIndex}`] },
        variables: { oldIndex, nextOldIndex: oldIndex + 1 },
        pseudocodeLine: 8,
      })
    );
  }

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Rehashing Complete",
      description: `All ${newState.elementCount} keys successfully transferred into ${newSize}-bucket table. Load factor decreased from ${oldState.loadFactor.toFixed(2)} down to ${newState.loadFactor.toFixed(2)}!`,
      operation: "Rehashing",
      actionType: "complete",
      dataState: stateWithOldTable(),
      highlights: { success: entryIds(newState) },
      variables: {
        transferredKeys: newState.elementCount,
        oldCapacity: tableSize,
        newCapacity: newSize,
        finalLoadFactor: newState.loadFactor.toFixed(2),
      },
      output: values,
      pseudocodeLine: 9,
    })
  );

  return steps;
}

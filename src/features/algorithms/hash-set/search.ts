import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { HashSetVisualState, HashSetEntry, createInitialHashSetState } from "./types";

function initializeState(initialArray: number[], setSize: number): HashSetVisualState {
  const state = createInitialHashSetState(setSize, "linear-probing");
  const buckets = state.buckets as (HashSetEntry | null)[];
  for (const val of initialArray) {
    if (state.elementCount >= setSize) break;
    let idx = val % setSize;
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

export function generateHashSetSearchSteps(
  initialArray: number[],
  targetValue: number,
  setSize: number = 7
): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = initializeState(initialArray, setSize);
  const buckets = state.buckets as (HashSetEntry | null)[];
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Set Search",
    description: `Searching for key ${targetValue} in the Hash Set.`,
    operation: "Search",
    actionType: "initialize",
    dataState: structuredClone(state),
    highlights: {},
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Target: targetValue, Size: setSize }
  });

  const hashIndex = targetValue % setSize;
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate Hash",
    description: `Hash function: ${targetValue} % ${setSize} = ${hashIndex}. Start searching at index ${hashIndex}.`,
    operation: "Hash",
    actionType: "hash",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${hashIndex}`] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: { Target: targetValue, "Hash Index": hashIndex }
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
        compared: [currentEntry.id] 
      },
      codeLine: 4,
      pseudocodeLine: 4,
      variables: { Index: currentIndex, Target: targetValue }
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
          found: [currentEntry.id] 
        },
        codeLine: 5,
        pseudocodeLine: 5,
        variables: { Index: currentIndex, Found: "true" }
      });
      return steps;
    }

    currentIndex = (currentIndex + 1) % setSize;

    if (currentIndex === startIndex) {
      break;
    }

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Linear Probe",
      description: `Collision or mismatch. Probing to next index: ${currentIndex}.`,
      operation: "Probe",
      actionType: "probe",
      dataState: structuredClone(state),
      highlights: { active: [`bucket-${currentIndex}`] },
      codeLine: 7,
      pseudocodeLine: 7,
      variables: { "New Index": currentIndex }
    });
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Value Not Found",
    description: `Reached an empty bucket or scanned entire set. ${targetValue} is not in the set.`,
    operation: "Search",
    actionType: "error",
    dataState: structuredClone(state),
    highlights: { active: [`bucket-${currentIndex}`] },
    codeLine: 10,
    pseudocodeLine: 10,
    variables: { Found: "false" }
  });

  return steps;
}

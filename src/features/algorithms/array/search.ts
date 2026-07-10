import { VisualStep } from "@/types";
import { ArrayVisualState, createElements } from "./types";

// 1. Linear Search
export function generateLinearSearchSteps(arr: number[], target: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  let found = false;

  // Initial State
  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Linear Search",
    description: `Searching for target value ${target} by checking each element one by one.`,
    operation: "search",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2 // Assuming code block has initialization
  });

  for (let i = 0; i < elements.length; i++) {
    // Highlighting current element to check
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Check Element",
      description: `Checking if element at index ${i} (value: ${elements[i].value}) equals target ${target}.`,
      operation: "search",
      actionType: "compare",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: { [elements[i].id]: "active" },
      codeLine: 4
    });

    if (elements[i].value === target) {
      // Found
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Target Found",
        description: `Target ${target} found at index ${i}!`,
        operation: "search",
        actionType: "success",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: { [elements[i].id]: "success" },
        codeLine: 5
      });
      found = true;
      break;
    } else {
      // Not found, mark as visited
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Element Does Not Match",
        description: `${elements[i].value} != ${target}. Moving to next element.`,
        operation: "search",
        actionType: "compare",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: { [elements[i].id]: "visited" },
        codeLine: 4
      });
    }
  }

  if (!found) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Target Not Found",
      description: `Reached the end of the array. Target ${target} was not found.`,
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 8
    });
  }

  return steps;
}

// 2. Binary Search
export function generateBinarySearchSteps(arr: number[], target: number): VisualStep[] {
  const steps: VisualStep[] = [];
  
  // Create a copy of elements and actually sort them if they aren't sorted, 
  // since Binary Search ONLY works on sorted arrays.
  const sortedArr = [...arr].sort((a, b) => a - b);
  const elements = createElements(sortedArr);
  let stepCount = 1;

  // Add initial step (if array was unsorted, we note that we sorted it)
  const isSortedBefore = arr.every((val, i) => i === 0 || val >= arr[i - 1]);
  let initDesc = `Array must be sorted for Binary Search. Target: ${target}.`;
  if (!isSortedBefore) {
    initDesc = `Array was automatically sorted. Target: ${target}.`;
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Binary Search",
    description: initDesc,
    operation: "search",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2
  });

  let low = 0;
  let high = elements.length - 1;
  let found = false;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    
    // Highlight the current search bounds
    const boundsHighlights: Record<string, string> = {};
    for (let i = low; i <= high; i++) {
      boundsHighlights[elements[i].id] = i === mid ? "active" : "highlight";
    }

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Calculate Midpoint",
      description: `Search space is from index ${low} to ${high}. Midpoint is index ${mid} (value: ${elements[mid].value}).`,
      operation: "search",
      actionType: "compare",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: boundsHighlights,
      codeLine: 4
    });

    if (elements[mid].value === target) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Target Found",
        description: `Target ${target} found at index ${mid}!`,
        operation: "search",
        actionType: "success",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: { [elements[mid].id]: "success" },
        codeLine: 6
      });
      found = true;
      break;
    } else if (elements[mid].value < target) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Adjust Search Space",
        description: `${elements[mid].value} is less than ${target}. Search right half (index ${mid + 1} to ${high}).`,
        operation: "search",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: { [elements[mid].id]: "visited" },
        codeLine: 8
      });
      low = mid + 1;
    } else {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Adjust Search Space",
        description: `${elements[mid].value} is greater than ${target}. Search left half (index ${low} to ${mid - 1}).`,
        operation: "search",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: { [elements[mid].id]: "visited" },
        codeLine: 10
      });
      high = mid - 1;
    }
  }

  if (!found) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Target Not Found",
      description: `Search space is empty (low > high). Target ${target} was not found.`,
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 13
    });
  }

  return steps;
}

// 3. Jump Search
export function generateJumpSearchSteps(arr: number[], target: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = arr.length;
  
  if (n === 0) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Start Jump Search",
      description: "Array is empty.",
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 1
    });
    return steps;
  }

  // Jump size
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Jump Search",
    description: `Searching for target value ${target}. Jump step is √${n} ≈ ${step}.`,
    operation: "search",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2
  });

  // Jump phase
  while (elements[Math.min(step, n) - 1].value < target) {
    const nextPrev = prev;
    prev = step;
    
    const h: Record<string, string> = {};
    h[elements[prev - 1].id] = "active";
    for (let i = nextPrev; i < prev - 1; i++) h[elements[i].id] = "processed";

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Jump",
      description: `Value at index ${prev - 1} is ${elements[prev - 1].value} < ${target}. Jumping ahead to index ${Math.min(prev + step, n) - 1}.`,
      operation: "search",
      actionType: "access",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: h,
      codeLine: 4
    });

    if (prev >= n) break;
  }

  // Linear search phase
  const hBlock: Record<string, string> = {};
  hBlock[elements[prev].id] = "active";

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Block Found",
    description: `Target should be in the block starting at index ${prev}. Doing linear search.`,
    operation: "search",
    actionType: "access",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: hBlock,
    codeLine: 7
  });

  let found = false;
  for (let i = prev; i < Math.min(prev + step, n); i++) {
    const hSearch: Record<string, string> = {};
    hSearch[elements[i].id] = "active";
    for (let j = prev; j < i; j++) hSearch[elements[j].id] = "processed";

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Linear Search",
      description: `Checking value at index ${i}: ${elements[i].value}`,
      operation: "search",
      actionType: "access",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: hSearch,
      codeLine: 8
    });

    if (elements[i].value === target) {
      found = true;
      const hFound: Record<string, string> = {};
      hFound[elements[i].id] = "success";
      
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Target Found",
        description: `Target ${target} found at index ${i}!`,
        operation: "search",
        actionType: "success",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: hFound,
        codeLine: 10
      });
      break;
    }
  }

  if (!found) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Target Not Found",
      description: `Reached end of block or array. Target ${target} was not found.`,
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 13
    });
  }

  return steps;
}

// 4. Interpolation Search
export function generateInterpolationSearchSteps(arr: number[], target: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = arr.length;
  
  if (n === 0) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Start Interpolation Search",
      description: "Array is empty.",
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 1
    });
    return steps;
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Interpolation Search",
    description: `Searching for target value ${target} using interpolation.`,
    operation: "search",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2
  });

  let low = 0;
  let high = n - 1;
  let found = false;

  while (low <= high && target >= elements[low].value && target <= elements[high].value) {
    if (low === high) {
      if (elements[low].value === target) {
        found = true;
        const hFoundLow: Record<string, string> = {};
        hFoundLow[elements[low].id] = "success";

        steps.push({
          id: `step-${stepCount}`,
          stepNumber: stepCount++,
          title: "Target Found",
          description: `Target ${target} found at index ${low}!`,
          operation: "search",
          actionType: "success",
          dataState: { elements: structuredClone(elements) } as ArrayVisualState,
          highlights: hFoundLow,
          codeLine: 10
        });
      }
      break;
    }

    // Probing the position with keeping uniform distribution in mind
    const pos = low + Math.floor(((high - low) / (elements[high].value - elements[low].value)) * (target - elements[low].value));

    const hProbe: Record<string, string> = {};
    hProbe[elements[pos].id] = "active";
    if (low !== pos) hProbe[elements[low].id] = "processed";
    if (high !== pos) hProbe[elements[high].id] = "processed";

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Probe Position",
      description: `Estimated position is ${pos}. Checking value: ${elements[pos].value}`,
      operation: "search",
      actionType: "access",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: hProbe,
      codeLine: 6
    });

    if (elements[pos].value === target) {
      found = true;
      const hFoundPos: Record<string, string> = {};
      hFoundPos[elements[pos].id] = "success";

      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Target Found",
        description: `Target ${target} found at index ${pos}!`,
        operation: "search",
        actionType: "success",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: hFoundPos,
        codeLine: 7
      });
      break;
    }

    if (elements[pos].value < target) {
      const hRight: Record<string, string> = {};
      hRight[elements[pos].id] = "active";

      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Adjust Range",
        description: `Value ${elements[pos].value} < ${target}. Searching right half.`,
        operation: "search",
        actionType: "access",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: hRight,
        codeLine: 9
      });
      low = pos + 1;
    } else {
      const hLeft: Record<string, string> = {};
      hLeft[elements[pos].id] = "active";

      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Adjust Range",
        description: `Value ${elements[pos].value} > ${target}. Searching left half.`,
        operation: "search",
        actionType: "access",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: hLeft,
        codeLine: 11
      });
      high = pos - 1;
    }
  }

  if (!found) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Target Not Found",
      description: `Target ${target} was not found in the array.`,
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 14
    });
  }

  return steps;
}

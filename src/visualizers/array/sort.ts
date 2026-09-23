/**
 * Phase 3 — Array sort step-generators rewritten to emit canonical
 * `VisualStepHighlights` shapes via `highlights` helpers, rather than the
 * legacy inverted `{[elementId]: "bucket"}` literals which tsc could not
 * catch but which the renderers read as bucket→ids and silently failed to
 * paint (audit A-03 / RR-01).
 */

import { VisualStep } from "@/types";
import { ArrayElement, ArrayVisualState, createElements } from "./types";
import {
  compare,
  conjunct,
  currentTarget,
  markBucket,
  sortedHighlight,
  succeeded,
  swap,
} from "@/visualizers/shared/highlights";
import { formatPredicateDecision } from "@/visualizers/shared/explanations";

// Helper to swap two elements in a deep copy
function swapElements(elements: ArrayElement[], i: number, j: number) {
  const temp = elements[i];
  elements[i] = elements[j];
  elements[j] = temp;
}

// 1. Bubble Sort
export function generateBubbleSortSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Bubble Sort",
    description:
      "Repeatedly step through the list, compare adjacent elements and swap them if they are in the wrong order.",
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
    pseudocodeLine: 1,
  });

  const n = elements.length;
  let swapped: boolean;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      const left = elements[j].value;
      const right = elements[j + 1].value;
      const predicate = {
        operator: ">" as const,
        left,
        right,
        result: left > right,
      };
      const beforeState = { elements: structuredClone(elements) } as ArrayVisualState;

      // Compare the two elements being compared.
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Compare Elements",
        description: `Is ${left} > ${right}?`,
        operation: "sort",
        actionType: "compare",
        dataState: beforeState,
        beforeState,
        afterState: beforeState,
        predicate,
        highlights: compare([elements[j].id, elements[j + 1].id]),
        codeLine: 6,
        pseudocodeLine: 5,
      });

      if (predicate.result) {
        swapElements(elements, j, j + 1);
        swapped = true;
        const afterState = { elements: structuredClone(elements) } as ArrayVisualState;

        steps.push({
          id: `step-${stepCount}`,
          stepNumber: stepCount++,
          title: "Swap Elements",
          description: formatPredicateDecision(predicate, "Swap them.", "Keep their order."),
          operation: "sort",
          actionType: "swap",
          dataState: afterState,
          beforeState,
          afterState,
          predicate,
          highlights: swap([elements[j].id, elements[j + 1].id]),
          codeLine: 8,
          pseudocodeLine: 6,
          variables: { left, right, predicateResult: predicate.result },
        });
      }
    }

    // After each outer pass, the trailing elements are sorted.
    const sortedIds: string[] = [];
    for (let k = n - 1; k >= n - 1 - i; k--) {
      sortedIds.push(elements[k].id);
    }

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Element Sorted",
      description: `Pass complete. Element ${elements[n - 1 - i].value} is now in its final position.`,
      operation: "sort",
      actionType: "success",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: sortedHighlight(sortedIds),
      codeLine: 13,
      pseudocodeLine: 2,
    });

    if (!swapped) {
      break;
    }
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Sort Complete",
    description: "Array is fully sorted.",
    operation: "sort",
    actionType: "success",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: sortedHighlight(elements.map((e) => e.id)),
    codeLine: 16,
    pseudocodeLine: 1,
  });

  return steps;
}

// 2. Selection Sort
export function generateSelectionSortSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Selection Sort",
    description:
      "Divide the list into a sorted and an unsorted region. Repeatedly select the smallest element from the unsorted region and swap it to the end of the sorted region.",
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "New Pass",
      description: `Assuming element at index ${i} (value: ${elements[minIdx].value}) is the minimum.`,
      operation: "sort",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: currentTarget([elements[minIdx].id]),
      codeLine: 4,
    });

    for (let j = i + 1; j < n; j++) {
      // "active" = current min; "current" = element we are scanning.
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Find Minimum",
        description: `Comparing current min ${elements[minIdx].value} with ${elements[j].value}.`,
        operation: "sort",
        actionType: "compare",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: conjunct([currentTarget([elements[minIdx].id]), compare([elements[j].id])]),
        codeLine: 6,
      });

      if (elements[j].value < elements[minIdx].value) {
        minIdx = j;
        steps.push({
          id: `step-${stepCount}`,
          stepNumber: stepCount++,
          title: "New Minimum Found",
          description: `Found a smaller element: ${elements[minIdx].value}.`,
          operation: "sort",
          actionType: "update",
          dataState: { elements: structuredClone(elements) } as ArrayVisualState,
          highlights: currentTarget([elements[minIdx].id]),
          codeLine: 7,
        });
      }
    }

    if (minIdx !== i) {
      swapElements(elements, i, minIdx);
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Swap to Sorted Region",
        description: `Swapping minimum element ${elements[i].value} with element ${elements[minIdx].value}.`,
        operation: "sort",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: swap([elements[i].id, elements[minIdx].id]),
        codeLine: 10,
      });
    }

    const sortedIds: string[] = [];
    for (let k = 0; k <= i; k++) {
      sortedIds.push(elements[k].id);
    }

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Element Sorted",
      description: `Element ${elements[i].value} is now part of the sorted region.`,
      operation: "sort",
      actionType: "success",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: sortedHighlight(sortedIds),
      codeLine: 12,
    });
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Sort Complete",
    description: "Array is fully sorted.",
    operation: "sort",
    actionType: "success",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: sortedHighlight(elements.map((e) => e.id)),
    codeLine: 14,
  });

  return steps;
}

// 3. Insertion Sort
export function generateInsertionSortSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Insertion Sort",
    description:
      "Build the final sorted array one item at a time, by repeatedly taking the next unsorted element and inserting it into its correct position.",
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  for (let i = 1; i < n; i++) {
    let j = i;

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Pick Element",
      description: `Taking element ${elements[i].value} to insert into the sorted region.`,
      operation: "sort",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: currentTarget([elements[i].id]),
      codeLine: 4,
    });

    while (j > 0) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Compare for Insertion",
        description: `Comparing ${elements[j].value} with ${elements[j - 1].value}.`,
        operation: "sort",
        actionType: "compare",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: conjunct([currentTarget([elements[j].id]), compare([elements[j - 1].id])]),
        codeLine: 6,
      });

      if (elements[j].value < elements[j - 1].value) {
        const currentValue = elements[j].value;
        const previousValue = elements[j - 1].value;
        swapElements(elements, j, j - 1);
        steps.push({
          id: `step-${stepCount}`,
          stepNumber: stepCount++,
          title: "Swap Elements",
          description: `${currentValue} < ${previousValue}. Swapping them to shift ${previousValue} right.`,
          operation: "sort",
          actionType: "update",
          dataState: { elements: structuredClone(elements) } as ArrayVisualState,
          highlights: swap([elements[j].id, elements[j - 1].id]),
          codeLine: 8,
          pseudocodeLine: 6,
        });
        j--;
      } else {
        steps.push({
          id: `step-${stepCount}`,
          stepNumber: stepCount++,
          title: "Position Found",
          description: `${elements[j].value} is greater than or equal to ${elements[j - 1].value}. Correct position found.`,
          operation: "sort",
          actionType: "success",
          dataState: { elements: structuredClone(elements) } as ArrayVisualState,
          highlights: succeeded([elements[j].id]),
          codeLine: 10,
        });
        break;
      }
    }
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Sort Complete",
    description: "Array is fully sorted.",
    operation: "sort",
    actionType: "success",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: sortedHighlight(elements.map((e) => e.id)),
    codeLine: 14,
  });

  return steps;
}

// 4. Merge Sort (In-Place visual representation)
export function generateMergeSortSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Merge Sort",
    description:
      "Divide the array into halves until each subarray contains a single element. Then merge them back in sorted order.",
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  function merge(left: number, mid: number, right: number) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Merging Subarrays",
      description: `Merging the sorted left half [${left}-${mid}] with the sorted right half [${mid + 1}-${right}].`,
      operation: "sort",
      actionType: "compare",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: markBucket(
        elements.slice(left, right + 1).map((e) => e.id),
        "current"
      ),
      codeLine: 10,
    });

    const n1 = mid - left + 1;
    const n2 = right - mid;

    const L = elements.slice(left, mid + 1);
    const R = elements.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    const merged: ArrayElement[] = [];

    while (i < n1 && j < n2) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Compare for Merge",
        description: `Comparing ${L[i].value} (from left) and ${R[j].value} (from right).`,
        operation: "sort",
        actionType: "compare",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: compare([L[i].id, R[j].id]),
        codeLine: 15,
      });

      if (L[i].value <= R[j].value) {
        const selected = L[i];
        merged.push(selected);
        steps.push({
          id: `step-${stepCount}`,
          stepNumber: stepCount++,
          title: "Select Element",
          description: `${selected.value} is next in the merged order.`,
          operation: "sort",
          actionType: "update",
          dataState: { elements: structuredClone(elements) } as ArrayVisualState,
          highlights: currentTarget([selected.id]),
          codeLine: 17,
        });
        i++;
      } else {
        const selected = R[j];
        merged.push(selected);
        steps.push({
          id: `step-${stepCount}`,
          stepNumber: stepCount++,
          title: "Select Element",
          description: `${selected.value} is next in the merged order.`,
          operation: "sort",
          actionType: "update",
          dataState: { elements: structuredClone(elements) } as ArrayVisualState,
          highlights: currentTarget([selected.id]),
          codeLine: 20,
        });
        j++;
      }
    }

    while (i < n1) {
      const selected = L[i];
      merged.push(selected);
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Copy Remaining",
        description: `Appending remaining element ${selected.value} from the left half.`,
        operation: "sort",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: currentTarget([selected.id]),
        codeLine: 25,
      });
      i++;
    }

    while (j < n2) {
      const selected = R[j];
      merged.push(selected);
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Copy Remaining",
        description: `Appending remaining element ${selected.value} from the right half.`,
        operation: "sort",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: currentTarget([selected.id]),
        codeLine: 29,
      });
      j++;
    }

    elements.splice(left, merged.length, ...merged);
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Apply Merged Order",
      description: `Placed the merged values into positions ${left} through ${right}.`,
      operation: "sort",
      actionType: "merge",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: currentTarget(merged.map((element) => element.id)),
      codeLine: 31,
    });
  }

  function mergeSort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor(left + (right - left) / 2);

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Divide",
      description: `Dividing array from index ${left} to ${right} at midpoint ${mid}.`,
      operation: "sort",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: currentTarget(elements.slice(left, right + 1).map((element) => element.id)),
      codeLine: 4,
    });

    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSort(0, elements.length - 1);

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Sort Complete",
    description: "Array is fully sorted.",
    operation: "sort",
    actionType: "success",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: sortedHighlight(elements.map((e) => e.id)),
    codeLine: 35,
  });

  return steps;
}

// 5. Quick Sort
export function generateQuickSortSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Quick Sort",
    description:
      "Pick a pivot element and partition the array around it, such that smaller elements are to its left and larger to its right.",
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  function partition(low: number, high: number): number {
    const pivot = elements[high];

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Select Pivot",
      description: `Selected pivot ${pivot.value} at index ${high}. Partitioning array from ${low} to ${high}.`,
      operation: "sort",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: currentTarget([pivot.id]),
      codeLine: 9,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Compare with Pivot",
        description: `Is ${elements[j].value} < ${pivot.value}?`,
        operation: "sort",
        actionType: "compare",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: conjunct([currentTarget([pivot.id]), compare([elements[j].id])]),
        codeLine: 11,
      });

      if (elements[j].value < pivot.value) {
        i++;
        if (i !== j) {
          swapElements(elements, i, j);
          steps.push({
            id: `step-${stepCount}`,
            stepNumber: stepCount++,
            title: "Swap Element",
            description: `Yes, ${elements[i].value} is smaller. Swapping to the left side.`,
            operation: "sort",
            actionType: "update",
            dataState: { elements: structuredClone(elements) } as ArrayVisualState,
            highlights: conjunct([
              currentTarget([pivot.id]),
              swap([elements[i].id, elements[j].id]),
            ]),
            codeLine: 13,
            pseudocodeLine: 2,
          });
        }
      }
    }

    swapElements(elements, i + 1, high);
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Place Pivot",
      description: `Partitioning complete. Placing pivot ${pivot.value} in its correct sorted position.`,
      operation: "sort",
      actionType: "success",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: succeeded([elements[i + 1].id]),
      codeLine: 18,
    });

    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }

  quickSort(0, elements.length - 1);

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Sort Complete",
    description: "Array is fully sorted.",
    operation: "sort",
    actionType: "success",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: sortedHighlight(elements.map((e) => e.id)),
    codeLine: 25,
  });

  return steps;
}

// 6. Heap Sort
export function generateHeapSortSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Heap Sort",
    description:
      "Build a max heap from the array, then repeatedly extract the maximum element and place it at the end.",
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  function heapify(n: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n && elements[l].value > elements[largest].value) {
      largest = l;
    }

    if (r < n && elements[r].value > elements[largest].value) {
      largest = r;
    }

    if (largest !== i) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Heapify Swap",
        description: `Swapping ${elements[i].value} with larger child ${elements[largest].value}.`,
        operation: "sort",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: swap([elements[i].id, elements[largest].id]),
        codeLine: 12,
      });

      swapElements(elements, i, largest);

      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "After Heapify Swap",
        description: `Elements swapped.`,
        operation: "sort",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: compare([elements[i].id, elements[largest].id]),
        codeLine: 13,
      });

      heapify(n, largest);
    }
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Build Max Heap",
    description: "Transforming the array into a max heap structure.",
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 4,
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Extract Max",
      description: `Moving current max element ${elements[0].value} to the end of the array.`,
      operation: "sort",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: swap([elements[0].id, elements[i].id]),
      codeLine: 18,
    });

    swapElements(elements, 0, i);

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Element Sorted",
      description: `Element ${elements[i].value} is now in its sorted position.`,
      operation: "sort",
      actionType: "success",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: succeeded([elements[i].id]),
      codeLine: 20,
    });

    heapify(i, 0);
  }

  if (n > 0) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Element Sorted",
      description: `First element is now in its sorted position.`,
      operation: "sort",
      actionType: "success",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: succeeded([elements[0].id]),
      codeLine: 23,
    });
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Sort Complete",
    description: "Array is fully sorted.",
    operation: "sort",
    actionType: "success",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: sortedHighlight(elements.map((e) => e.id)),
    codeLine: 25,
  });

  return steps;
}

// 7. Counting Sort
export function generateCountingSortSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Counting Sort",
    description: "Sort by counting the number of occurrences of each unique element.",
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  if (n === 0) return steps;
  if (elements.some((element) => element.value < 0)) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Unsupported Negative Value",
      description: "This counting-sort visualizer accepts only non-negative integers.",
      operation: "sort",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 2,
    });
    return steps;
  }

  let max = elements[0].value;
  for (let i = 1; i < n; i++) {
    if (elements[i].value > max) {
      max = elements[i].value;
    }
  }

  const MAX_COUNTING_VALUE = 10000;
  if (max > MAX_COUNTING_VALUE) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Value Range Too Large",
      description: `Maximum value ${max} exceeds the visualizer limit of ${MAX_COUNTING_VALUE}. Counting sort needs a count array of size max + 1; use smaller values.`,
      operation: "sort",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 2,
    });
    return steps;
  }

  const count = new Array(max + 1).fill(0);

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Find Maximum",
    description: `Maximum value in array is ${max}. Creating count array of size ${max + 1}.`,
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 5,
  });

  for (let i = 0; i < n; i++) {
    count[elements[i].value]++;
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Count Element",
      description: `Counting occurrence of ${elements[i].value}. Count of ${elements[i].value} is now ${count[elements[i].value]}.`,
      operation: "sort",
      actionType: "access",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: currentTarget([elements[i].id]),
      codeLine: 7,
    });
  }

  let index = 0;
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      const oldElement = elements[index];
      elements[index] = { ...oldElement, value: i };
      count[i]--;

      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Place Element",
        description: `Placing ${i} into position ${index}.`,
        operation: "sort",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: succeeded([elements[index].id]),
        codeLine: 12,
      });
      index++;
    }
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Sort Complete",
    description: "Array is fully sorted using counting sort.",
    operation: "sort",
    actionType: "success",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: sortedHighlight(elements.map((e) => e.id)),
    codeLine: 15,
  });

  return steps;
}

// 8. Radix Sort
export function generateRadixSortSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Radix Sort",
    description:
      "Sort by processing each digit position starting from the least significant digit.",
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  if (n === 0) return steps;
  if (elements.some((element) => element.value < 0)) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Unsupported Negative Value",
      description: "This radix-sort visualizer accepts only non-negative integers.",
      operation: "sort",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 2,
    });
    return steps;
  }

  let max = elements[0].value;
  for (let i = 1; i < n; i++) if (elements[i].value > max) max = elements[i].value;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Find Maximum",
    description: `Maximum value is ${max}. Sorting will proceed digit by digit.`,
    operation: "sort",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 5,
  });

  const countSort = (exp: number) => {
    const output = new Array<ArrayElement>(n);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(elements[i].value / exp) % 10;
      count[digit]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(elements[i].value / exp) % 10;
      output[count[digit] - 1] = elements[i];
      count[digit]--;
    }

    for (let i = 0; i < n; i++) {
      elements[i] = output[i];
    }

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Digit Pass Complete",
      description: `Array sorted by digit placed at ${exp}'s place.`,
      operation: "sort",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: currentTarget(elements.map((element) => element.id)),
      codeLine: 12,
    });
  };

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Sort by Digit",
      description: `Sorting array elements by digit at ${exp}'s place.`,
      operation: "sort",
      actionType: "initialize",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 8,
    });

    countSort(exp);
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Sort Complete",
    description: "Array is fully sorted using Radix Sort.",
    operation: "sort",
    actionType: "success",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: sortedHighlight(elements.map((e) => e.id)),
    codeLine: 18,
  });

  return steps;
}

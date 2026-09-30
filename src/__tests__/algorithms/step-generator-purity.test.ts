import { describe, it, expect } from "vitest";
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
} from "@/visualizers/array/sort";
import { generateLinearSearchSteps, generateBinarySearchSteps } from "@/visualizers/array/search";
import { generateRowWiseTraversalSteps } from "@/visualizers/matrix/traversal";
import { VisualStep } from "@/types";

describe("Step Generator Purity & Determinism Contract", () => {
  const sampleArray = [29, 10, 14, 37, 13, 25, 40, 1];

  describe("Purity: Input data is not mutated in-place", () => {
    it("bubble sort does not mutate frozen input array", () => {
      const frozenInput = Object.freeze([...sampleArray]) as number[];
      expect(() => generateBubbleSortSteps(frozenInput)).not.toThrow();
    });

    it("selection sort does not mutate frozen input array", () => {
      const frozenInput = Object.freeze([...sampleArray]) as number[];
      expect(() => generateSelectionSortSteps(frozenInput)).not.toThrow();
    });

    it("insertion sort does not mutate frozen input array", () => {
      const frozenInput = Object.freeze([...sampleArray]) as number[];
      expect(() => generateInsertionSortSteps(frozenInput)).not.toThrow();
    });

    it("merge sort does not mutate frozen input array", () => {
      const frozenInput = Object.freeze([...sampleArray]) as number[];
      expect(() => generateMergeSortSteps(frozenInput)).not.toThrow();
    });

    it("quick sort does not mutate frozen input array", () => {
      const frozenInput = Object.freeze([...sampleArray]) as number[];
      expect(() => generateQuickSortSteps(frozenInput)).not.toThrow();
    });

    it("heap sort does not mutate frozen input array", () => {
      const frozenInput = Object.freeze([...sampleArray]) as number[];
      expect(() => generateHeapSortSteps(frozenInput)).not.toThrow();
    });

    it("linear search does not mutate frozen input array", () => {
      const frozenInput = Object.freeze([...sampleArray]) as number[];
      expect(() => generateLinearSearchSteps(frozenInput, 25)).not.toThrow();
    });

    it("binary search does not mutate frozen input array", () => {
      const sorted = [...sampleArray].sort((a, b) => a - b);
      const frozenInput = Object.freeze(sorted) as number[];
      expect(() => generateBinarySearchSteps(frozenInput, 25)).not.toThrow();
    });

    it("matrix row-wise traversal does not mutate frozen input array", () => {
      const matrixData = Object.freeze([1, 2, 3, 4, 5, 6]) as number[];
      expect(() => generateRowWiseTraversalSteps(matrixData, 2, 3)).not.toThrow();
    });
  });

  describe("Determinism: Identical inputs produce identical step traces", () => {
    const extractComparableState = (dataState: unknown) => {
      if (!dataState || typeof dataState !== "object") return dataState;
      const state = dataState as Record<string, unknown>;
      if (Array.isArray(state.elements)) {
        return {
          ...state,
          elements: (state.elements as Array<{ value: number; originalIndex?: number }>).map(
            (el) => ({
              value: el.value,
              originalIndex: el.originalIndex,
            })
          ),
        };
      }
      return dataState;
    };

    const assertDeterministic = (name: string, fn: () => VisualStep[]) => {
      const run1 = fn();
      const run2 = fn();

      expect(run1.length).toBe(run2.length);
      expect(run1.length).toBeGreaterThan(0);

      run1.forEach((step1, idx) => {
        const step2 = run2[idx];
        expect(step1.id).toBe(step2.id);
        expect(step1.stepNumber).toBe(step2.stepNumber);
        expect(step1.title).toBe(step2.title);
        expect(step1.description).toBe(step2.description);
        expect(step1.actionType).toBe(step2.actionType);
        expect(extractComparableState(step1.dataState)).toEqual(
          extractComparableState(step2.dataState)
        );
      });
    };

    it("bubble sort is 100% deterministic", () => {
      assertDeterministic("bubbleSort", () => generateBubbleSortSteps([...sampleArray]));
    });

    it("merge sort is 100% deterministic", () => {
      assertDeterministic("mergeSort", () => generateMergeSortSteps([...sampleArray]));
    });

    it("quick sort is 100% deterministic", () => {
      assertDeterministic("quickSort", () => generateQuickSortSteps([...sampleArray]));
    });

    it("binary search is 100% deterministic", () => {
      const sorted = [...sampleArray].sort((a, b) => a - b);
      assertDeterministic("binarySearch", () => generateBinarySearchSteps(sorted, 25));
    });
  });

  describe("Structure & Step Invariant Rules", () => {
    it("enforces valid monotonic step numbers and non-empty titles and descriptions", () => {
      const steps = generateBubbleSortSteps([5, 1, 4, 2, 8]);
      expect(steps.length).toBeGreaterThan(0);

      steps.forEach((step, idx) => {
        expect(step.stepNumber).toBe(idx + 1);
        expect(step.title).toBeTruthy();
        expect(typeof step.title).toBe("string");
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.description).toBeTruthy();
        expect(typeof step.description).toBe("string");
        expect(step.description.trim().length).toBeGreaterThan(0);
        expect(step.dataState).toBeDefined();
      });
    });
  });
});

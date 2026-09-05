import { describe, it, expect } from "vitest";
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
} from "@/visualizers/array/sort";
import { ArrayVisualState } from "@/visualizers/array/types";

describe("Sorting Algorithm Invariants", () => {
  const sample = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  const expectedSorted = [...sample].sort((a, b) => a - b);

  const testSortGenerator = (
    name: string,
    generator: (arr: number[]) => ReturnType<typeof generateBubbleSortSteps>
  ) => {
    describe(`${name}`, () => {
      it("correctly sorts a random unsorted array", () => {
        const steps = generator([...sample]);
        expect(steps.length).toBeGreaterThan(0);

        const lastStep = steps[steps.length - 1];
        const finalState = lastStep.dataState as ArrayVisualState;
        const finalValues = finalState.elements.map((el) => el.value);

        expect(finalValues).toEqual(expectedSorted);
      });

      it("handles single-element arrays gracefully", () => {
        const steps = generator([42]);
        expect(steps.length).toBeGreaterThan(0);

        const lastStep = steps[steps.length - 1];
        const finalState = lastStep.dataState as ArrayVisualState;
        expect(finalState.elements.map((el) => el.value)).toEqual([42]);
      });

      it("handles already sorted arrays correctly", () => {
        const steps = generator([1, 2, 3, 4, 5]);
        expect(steps.length).toBeGreaterThan(0);

        const lastStep = steps[steps.length - 1];
        const finalState = lastStep.dataState as ArrayVisualState;
        expect(finalState.elements.map((el) => el.value)).toEqual([1, 2, 3, 4, 5]);
      });

      it("emits valid sequential step numbers and metadata", () => {
        const steps = generator([3, 1, 2]);
        steps.forEach((step, idx) => {
          expect(step.stepNumber).toBe(idx + 1);
          expect(typeof step.title).toBe("string");
          expect(step.title.length).toBeGreaterThan(0);
          expect(typeof step.description).toBe("string");
        });
      });
    });
  };

  testSortGenerator("Bubble Sort", generateBubbleSortSteps);
  testSortGenerator("Selection Sort", generateSelectionSortSteps);
  testSortGenerator("Insertion Sort", generateInsertionSortSteps);
  testSortGenerator("Merge Sort", generateMergeSortSteps);
  testSortGenerator("Quick Sort", generateQuickSortSteps);
  testSortGenerator("Heap Sort", generateHeapSortSteps);
});

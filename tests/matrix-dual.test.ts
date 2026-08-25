import {
  generateMatrixAdditionSteps,
  generateMatrixSubtractionSteps,
  generateMatrixMultiplicationSteps,
} from "@/visualizers/matrix/math";
import type { MatrixVisualState } from "@/visualizers/matrix/types";

describe("Dual Matrix Arithmetic Visualizers", () => {
  describe("Matrix Addition", () => {
    it("adds two 2x2 matrices correctly step-by-step", () => {
      const arrA = [1, 2, 3, 4];
      const arrB = [5, 6, 7, 8];
      const steps = generateMatrixAdditionSteps(arrA, 2, 2, arrB);

      expect(steps.length).toBe(6); // 1 init + 4 updates + 1 complete

      // Initial step
      const initStep = steps[0];
      expect(initStep.actionType).toBe("initialize");
      const initState = initStep.dataState as MatrixVisualState;
      expect(initState.matrixA?.elements.map((e) => e.value)).toEqual([1, 2, 3, 4]);
      expect(initState.matrixB?.elements.map((e) => e.value)).toEqual([5, 6, 7, 8]);
      expect(initState.operationSymbol).toBe("+");

      // Check computation steps
      const updateSteps = steps.filter((s) => s.actionType === "update");
      expect(updateSteps.length).toBe(4);

      // Final step
      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("success");
      const finalState = finalStep.dataState as MatrixVisualState;
      expect(finalState.elements.map((e) => e.value)).toEqual([6, 8, 10, 12]);
      expect(finalState.resultLabel).toBe("Result (A + B)");
    });
  });

  describe("Matrix Subtraction", () => {
    it("subtracts two 2x2 matrices correctly step-by-step", () => {
      const arrA = [10, 20, 30, 40];
      const arrB = [1, 2, 3, 4];
      const steps = generateMatrixSubtractionSteps(arrA, 2, 2, arrB);

      expect(steps.length).toBe(6); // 1 init + 4 updates + 1 complete

      // Initial step
      const initStep = steps[0];
      expect(initStep.actionType).toBe("initialize");
      const initState = initStep.dataState as MatrixVisualState;
      expect(initState.matrixA?.elements.map((e) => e.value)).toEqual([10, 20, 30, 40]);
      expect(initState.matrixB?.elements.map((e) => e.value)).toEqual([1, 2, 3, 4]);
      expect(initState.operationSymbol).toBe("−");

      // Final step
      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("success");
      const finalState = finalStep.dataState as MatrixVisualState;
      expect(finalState.elements.map((e) => e.value)).toEqual([9, 18, 27, 36]);
      expect(finalState.resultLabel).toBe("Result (A − B)");
    });
  });

  describe("Matrix Multiplication", () => {
    it("multiplies two 2x2 matrices correctly using dot product", () => {
      const arrA = [1, 2, 3, 4];
      const arrB = [2, 0, 1, 2];
      // A x B:
      // [1*2 + 2*1, 1*0 + 2*2] = [4, 4]
      // [3*2 + 4*1, 3*0 + 4*2] = [10, 8]
      const steps = generateMatrixMultiplicationSteps(arrA, 2, 2, arrB);

      expect(steps.length).toBe(6);

      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("success");
      const finalState = finalStep.dataState as MatrixVisualState;
      expect(finalState.elements.map((e) => e.value)).toEqual([4, 4, 10, 8]);
      expect(finalState.matrixA?.elements.map((e) => e.value)).toEqual([1, 2, 3, 4]);
      expect(finalState.matrixB?.elements.map((e) => e.value)).toEqual([2, 0, 1, 2]);
      expect(finalState.operationSymbol).toBe("×");
    });
  });
});

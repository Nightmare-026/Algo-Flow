import { describe, it, expect } from "vitest";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import { MatrixVisualState } from "@/visualizers/matrix/types";

describe("Matrix Visualizers Step Generation & Highlighting Integrity", () => {
  const matrixSlugs = [
    "row-wise-traversal",
    "col-wise-traversal",
    "spiral-traversal",
    "matrix-search",
    "row-column-sorted-search",
    "transpose-matrix",
    "rotate-matrix-90",
    "matrix-multiplication",
    "matrix-addition",
    "matrix-subtraction",
  ];

  it("all 10 matrix visualizers are registered and defined", () => {
    matrixSlugs.forEach((slug) => {
      const def = algorithmRegistry[slug];
      expect(def, `Missing registry definition for ${slug}`).toBeDefined();
      expect(typeof def.generateSteps).toBe("function");
    });
  });

  describe("Single-Matrix Traversals", () => {
    const data4x4 = [15, 23, 4, 8, 42, 16, 9, 31, 7, 18, 27, 12, 36, 2, 21, 11];
    const opts4x4 = { rows: 4, cols: 4 };

    it("generates correct row-wise traversal steps with visited highlights", () => {
      const def = algorithmRegistry["row-wise-traversal"];
      const steps = def.generateSteps(data4x4 as never, opts4x4 as never);

      // 1 init + 16 visits + 1 complete = 18 steps
      expect(steps.length).toBe(18);
      expect(steps[0].actionType).toBe("initialize");
      expect(steps[steps.length - 1].actionType).toBe("complete");

      // Check step 4 (visit [0][2], flat index 2)
      const step4 = steps[3];
      expect(step4.title).toContain("Matrix[0][2]");
      expect(step4.highlights.active).toContain("2");
      expect(step4.highlights.visited).toEqual(["0", "1"]);
      expect(step4.highlights.pointer).toContain("2");
    });

    it("generates correct col-wise traversal steps with visited highlights", () => {
      const def = algorithmRegistry["col-wise-traversal"];
      const steps = def.generateSteps(data4x4 as never, opts4x4 as never);

      expect(steps.length).toBe(18);
      // Col-wise visits (0,0), then (1,0), then (2,0), etc.
      const step2 = steps[1]; // [0][0]
      const step3 = steps[2]; // [1][0]
      expect(step2.title).toContain("Matrix[0][0]");
      expect(step3.title).toContain("Matrix[1][0]");
      expect(step3.highlights.visited).toContain("0");
    });

    it("generates correct spiral traversal steps covering all cells", () => {
      const def = algorithmRegistry["spiral-traversal"];
      const steps = def.generateSteps(data4x4 as never, opts4x4 as never);

      expect(steps.length).toBe(18);
      const lastStep = steps[steps.length - 1];
      expect(lastStep.actionType).toBe("complete");
      expect(lastStep.highlights.visited?.length).toBe(16);
    });
  });

  describe("Matrix Search Visualizers", () => {
    const data4x4 = [15, 23, 4, 8, 42, 16, 9, 31, 7, 18, 27, 12, 36, 2, 21, 11];

    it("matrix-search finds existing target and produces found highlight", () => {
      const def = algorithmRegistry["matrix-search"];
      const steps = def.generateSteps(data4x4 as never, { rows: 4, cols: 4, target: 23 } as never);

      const foundStep = steps.find((s) => s.actionType === "found");
      expect(foundStep).toBeDefined();
      expect(foundStep?.title).toContain("Target Found");
      expect(foundStep?.highlights.found).toContain("1");
    });

    it("matrix-search reports not-found when target is absent", () => {
      const def = algorithmRegistry["matrix-search"];
      const steps = def.generateSteps(data4x4 as never, { rows: 4, cols: 4, target: 999 } as never);

      const notFoundStep = steps.find((s) => s.actionType === "not-found");
      expect(notFoundStep).toBeDefined();
      expect(notFoundStep?.highlights.visited?.length).toBe(16);
    });

    it("row-column-sorted-search finds target on monotonic matrix", () => {
      const sortedData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      const def = algorithmRegistry["row-column-sorted-search"];
      const steps = def.generateSteps(
        sortedData as never,
        { rows: 4, cols: 4, target: 10 } as never
      );

      const successStep = steps.find((s) => s.actionType === "success");
      expect(successStep).toBeDefined();
      expect(successStep?.title).toContain("Target Found");
    });

    it("row-column-sorted-search reports not-found with error highlights on searched path", () => {
      const sortedData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      const def = algorithmRegistry["row-column-sorted-search"];
      const steps = def.generateSteps(
        sortedData as never,
        { rows: 4, cols: 4, target: 99 } as never
      );

      const notFoundStep = steps.find((s) => s.actionType === "not-found");
      expect(notFoundStep).toBeDefined();
      expect(notFoundStep?.highlights.error?.length).toBeGreaterThan(0);
      expect(notFoundStep?.highlights.error).toEqual(notFoundStep?.highlights.visited);
      expect(notFoundStep?.variables?.r).toBe("-");
      expect(notFoundStep?.variables?.c).toBe("-");
    });
  });

  describe("Matrix Transformations", () => {
    it("transpose-matrix performs step-by-step transposition and updates dimensions", () => {
      const data2x3 = [1, 2, 3, 4, 5, 6];
      const def = algorithmRegistry["transpose-matrix"];
      const steps = def.generateSteps(data2x3 as never, { rows: 2, cols: 3 } as never);

      // Step-by-step: 1 init + 6 cell transfers + 1 complete = 8 steps
      expect(steps.length).toBe(8);
      const lastStep = steps[steps.length - 1];
      expect(lastStep.actionType).toBe("update");
      expect(lastStep.title).toBe("Transpose Complete");
      const state = lastStep.dataState as MatrixVisualState;
      expect(state.rows).toBe(3);
      expect(state.cols).toBe(2);
      expect(state.elements.map((e) => e.value)).toEqual([1, 4, 2, 5, 3, 6]);
      expect(lastStep.highlights.success?.length).toBe(6);
    });

    it("transpose-matrix performs in-place symmetrical swaps for square matrices", () => {
      const data2x2 = [1, 2, 3, 4];
      const def = algorithmRegistry["transpose-matrix"];
      const steps = def.generateSteps(data2x2 as never, { rows: 2, cols: 2 } as never);

      // 1 init + 1 inspect + 1 swap + 1 complete = 4 steps
      expect(steps.length).toBe(4);
      expect(steps[1].actionType).toBe("compare");
      expect(steps[2].actionType).toBe("update");
      expect(steps[2].highlights.swapped).toEqual(["1", "2"]);
      const lastStep = steps[3];
      const state = lastStep.dataState as MatrixVisualState;
      expect(state.elements.map((e) => e.value)).toEqual([1, 3, 2, 4]);
    });

    it("rotate-matrix-90 validates square dimension and generates swap steps with distinct titles", () => {
      const data3x3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const def = algorithmRegistry["rotate-matrix-90"];
      const steps = def.generateSteps(data3x3 as never, { rows: 3, cols: 3 } as never);

      expect(steps.length).toBeGreaterThan(5);
      const transposeSwap = steps.find((s) => s.title === "Transpose Swap");
      expect(transposeSwap).toBeDefined();
      expect(transposeSwap?.actionType).toBe("swap");

      const reverseSwap = steps.find((s) => s.title === "Reverse Swap");
      expect(reverseSwap).toBeDefined();
      expect(reverseSwap?.actionType).toBe("swap");

      const successStep = steps[steps.length - 1];
      expect(successStep.actionType).toBe("success");
    });
  });

  describe("Dual-Matrix Arithmetic Visualizers", () => {
    const dataA = [1, 2, 3, 4];
    const dataB = [5, 6, 7, 8];
    const opts2x2 = { rows: 2, cols: 2, matrixB: dataB };

    it("matrix-addition computes correct sum and sets dual matrix states", () => {
      const def = algorithmRegistry["matrix-addition"];
      const steps = def.generateSteps(dataA as never, opts2x2 as never);

      expect(steps.length).toBe(6); // 1 init + 4 cell updates + 1 success
      const state = steps[0].dataState as MatrixVisualState;
      expect(state.matrixA).toBeDefined();
      expect(state.matrixB).toBeDefined();
      expect(state.operationSymbol).toBe("+");

      // Final result elements: [1+5=6, 2+6=8, 3+7=10, 4+8=12]
      const lastState = steps[steps.length - 2].dataState as MatrixVisualState;
      expect(lastState.elements.map((e) => e.value)).toEqual([6, 8, 10, 12]);
    });

    it("matrix-subtraction computes correct difference", () => {
      const def = algorithmRegistry["matrix-subtraction"];
      const steps = def.generateSteps(dataA as never, opts2x2 as never);

      expect(steps.length).toBe(6);
      const state = steps[0].dataState as MatrixVisualState;
      expect(state.operationSymbol).toBe("−");

      // Final result elements: [1-5=-4, 2-6=-4, 3-7=-4, 4-8=-4]
      const lastState = steps[steps.length - 2].dataState as MatrixVisualState;
      expect(lastState.elements.map((e) => e.value)).toEqual([-4, -4, -4, -4]);
    });

    it("matrix-multiplication computes correct dot product", () => {
      // Matrix A = [[1, 2], [3, 4]], Matrix B = [[5, 6], [7, 8]]
      // C[0][0] = 1*5 + 2*7 = 19
      // C[0][1] = 1*6 + 2*8 = 22
      // C[1][0] = 3*5 + 4*7 = 43
      // C[1][1] = 3*6 + 4*8 = 50
      const def = algorithmRegistry["matrix-multiplication"];
      const steps = def.generateSteps(dataA as never, opts2x2 as never);

      expect(steps.length).toBe(6);
      const lastState = steps[steps.length - 2].dataState as MatrixVisualState;
      expect(lastState.elements.map((e) => e.value)).toEqual([19, 22, 43, 50]);
    });
  });
});

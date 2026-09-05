import { describe, it, expect } from "vitest";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import { parseNumberList } from "@/lib/validation/visualizer-input";

describe("Linked List Visualizers Step Generation Robustness", () => {
  const testDataSets = [
    [10],
    [5, 12],
    [40, 20, 10, 30],
    [10, 10, 20, 30, 30, 40], // with duplicates
    [1, 2, 3, 4, 5, 6, 7, 8],
    [99, 88, 77, 66, 55],
  ];

  const sllSlugs = [
    "sll-traversal",
    "sll-reverse",
    "sll-delete-head",
    "sll-delete-tail",
    "sll-detect-cycle",
    "sll-find-middle",
    "sll-remove-duplicates",
  ];

  const dllSlugs = [
    "dll-traversal",
    "dll-delete-head",
    "dll-delete-tail",
    "dll-reverse",
  ];

  const cllSlugs = [
    "cll-traversal",
    "cll-delete-head",
  ];

  sllSlugs.forEach((slug) => {
    it(`generates valid steps for ${slug} across various data sets`, () => {
      const def = algorithmRegistry[slug];
      expect(def).toBeDefined();

      for (const data of testDataSets) {
        const steps = def.generateSteps(data as never, {} as never);
        expect(steps.length).toBeGreaterThan(0);
        expect(steps[0].dataState).toBeDefined();
        expect(steps[steps.length - 1].dataState).toBeDefined();
      }
    });
  });

  dllSlugs.forEach((slug) => {
    it(`generates valid steps for DLL ${slug} across various data sets`, () => {
      const def = algorithmRegistry[slug];
      expect(def).toBeDefined();

      for (const data of testDataSets) {
        const steps = def.generateSteps(data as never, {} as never);
        expect(steps.length).toBeGreaterThan(0);
      }
    });
  });

  cllSlugs.forEach((slug) => {
    it(`generates valid steps for CLL ${slug} across various data sets`, () => {
      const def = algorithmRegistry[slug];
      expect(def).toBeDefined();

      for (const data of testDataSets) {
        const steps = def.generateSteps(data as never, {} as never);
        expect(steps.length).toBeGreaterThan(0);
      }
    });
  });

  it("generates valid steps for sll-search with target present and missing", () => {
    const def = algorithmRegistry["sll-search"];
    expect(def).toBeDefined();

    // Target present
    const stepsFound = def.generateSteps([10, 20, 30] as never, { target: 20 } as never);
    expect(stepsFound.length).toBeGreaterThan(0);

    // Target missing
    const stepsNotFound = def.generateSteps([10, 20, 30] as never, { target: 99 } as never);
    expect(stepsNotFound.length).toBeGreaterThan(0);
  });

  it("generates valid steps for sll-insert-position with valid indices", () => {
    const def = algorithmRegistry["sll-insert-position"];
    expect(def).toBeDefined();

    const stepsHead = def.generateSteps([10, 20, 30] as never, { value: 5, index: 0 } as never);
    expect(stepsHead.length).toBeGreaterThan(0);

    const stepsMid = def.generateSteps([10, 20, 30] as never, { value: 15, index: 1 } as never);
    expect(stepsMid.length).toBeGreaterThan(0);

    const stepsTail = def.generateSteps([10, 20, 30] as never, { value: 35, index: 3 } as never);
    expect(stepsTail.length).toBeGreaterThan(0);
  });

  it("parses custom number lists accurately", () => {
    const valid = parseNumberList("10, 20, 30, 40", 10);
    expect(valid.error).toBeNull();
    expect(valid.values).toEqual([10, 20, 30, 40]);

    const withSpaces = parseNumberList("  5 ,  15 ,  25  ", 10);
    expect(withSpaces.error).toBeNull();
    expect(withSpaces.values).toEqual([5, 15, 25]);

    const invalid = parseNumberList("10, abc, 30", 10);
    expect(invalid.error).toContain("not a valid number");

    const tooLong = parseNumberList("1,2,3,4,5,6,7,8,9,10,11", 10);
    expect(tooLong.error).toContain("Use 10 values or fewer");
  });
});

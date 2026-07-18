import {
  generateCountingSortSteps,
  generateRadixSortSteps,
} from "@/visualizers/array/sort";

describe("non-negative integer sorting guards", () => {
  it.each([
    ["counting sort", generateCountingSortSteps],
    ["radix sort", generateRadixSortSteps],
  ] as const)("%s rejects negative values safely", (_name, generateSteps) => {
    const steps = generateSteps([3, -1, 2]);
    expect(steps.at(-1)?.actionType).toBe("error");
    expect(steps.at(-1)?.description).toContain("non-negative integers");
    expect(steps).toHaveLength(2);
  });
});

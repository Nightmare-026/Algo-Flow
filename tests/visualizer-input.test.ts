import { describe, expect, it } from "@jest/globals";
import { parseNumberList, validateCapacity, validateIndex } from "@/lib/validation/visualizer-input";

describe("visualizer input validation", () => {
  it("parses comma-separated whole numbers", () => {
    expect(parseNumberList("5, 2, 9")).toEqual({ values: [5, 2, 9], error: null });
  });

  it("returns a friendly error for invalid numeric input", () => {
    expect(parseNumberList("5, nope, 9").error).toContain("not a valid number");
  });

  it("validates normal and insertion indexes", () => {
    expect(validateIndex(2, 3)).toBeNull();
    expect(validateIndex(3, 3)).toContain("between 0 and 2");
    expect(validateIndex(3, 3, true)).toBeNull();
  });

  it("validates capacity against current data size", () => {
    expect(validateCapacity(8, 4)).toBeNull();
    expect(validateCapacity(3, 4)).toContain("cannot be smaller");
  });
});


import { resolvePhysicalCodeLine } from "@/visualizers/registry/code-line-mapping";
import type { CodeLineMapping } from "@/visualizers/registry/types";

const mappings: ReadonlyArray<CodeLineMapping> = [
  {
    logicalLine: 7,
    lines: {
      javascript: 2,
      python: 3,
      cpp: 4,
      java: 5,
    },
  },
];

describe("resolvePhysicalCodeLine", () => {
  it.each([
    ["javascript", 2],
    ["python", 3],
    ["cpp", 4],
    ["java", 5],
  ] as const)("maps logical lines for %s", (language, expected) => {
    expect(resolvePhysicalCodeLine(mappings, 7, language)).toBe(expected);
  });

  it("preserves direct-line behavior for unmigrated definitions", () => {
    expect(resolvePhysicalCodeLine(undefined, 7, "javascript")).toBe(7);
  });

  it("does not guess when an authored mapping is incomplete", () => {
    expect(resolvePhysicalCodeLine(mappings, 8, "javascript")).toBeUndefined();
    expect(resolvePhysicalCodeLine(mappings, 7, "typescript")).toBeUndefined();
  });
});

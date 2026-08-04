import type { VisualStep } from "@/types";
import { usePlaybackStore } from "@/stores/playback-store";
import { generateBubbleSortSteps } from "@/visualizers/array/sort";
import { generateSLLInsertPositionSteps } from "@/visualizers/linked-list/additional";
import type { LinkedListVisualState } from "@/visualizers/linked-list/types";
import {
  generateTreeInorderSteps,
  generateTreeLevelOrderSteps,
  generateTreePostorderSteps,
  generateTreePreorderSteps,
} from "@/visualizers/tree/traversal";
import type { TreeVisualState } from "@/visualizers/tree/types";
import { generateRehashingSteps } from "@/visualizers/hash-table/additional";
import type { HashTableVisualState } from "@/visualizers/hash-table/types";
import { generateKMPSearchSteps } from "@/visualizers/string/search";
import type { StringVisualState } from "@/visualizers/string/types";

function arrayValues(state: unknown): number[] {
  return (state as { elements: Array<{ value: number }> }).elements.map((element) => element.value);
}

function linkedListValues(state: LinkedListVisualState): number[] {
  const values: number[] = [];
  const seen = new Set<string>();
  let nodeId = state.headId;

  while (nodeId) {
    expect(seen.has(nodeId)).toBe(false);
    seen.add(nodeId);
    const node = state.nodes.find((candidate) => candidate.id === nodeId);
    expect(node).toBeDefined();
    values.push(node!.value);
    nodeId = node!.nextId;
  }

  return values;
}

function finalLinkedList(data: number[], value: number, position: number): number[] {
  const steps = generateSLLInsertPositionSteps(data, value, position);
  return linkedListValues(steps.at(-1)!.dataState as LinkedListVisualState);
}

function step(id: string, stepNumber: number): VisualStep {
  return {
    id,
    stepNumber,
    title: id,
    description: id,
    operation: "test",
    actionType: "read",
    dataState: { id },
    highlights: {},
  };
}

describe("AF-VIZ-001 ? Bubble Sort explanation facts", () => {
  it("keeps the predicate, explanation, before state, and after state consistent", () => {
    const steps = generateBubbleSortSteps([15, 23, 4, 8, 42, 16]);
    const swap = steps.find(
      (candidate) =>
        candidate.actionType === "swap" &&
        candidate.predicate?.left === 23 &&
        candidate.predicate.right === 4
    );

    expect(swap).toBeDefined();
    expect(swap!.predicate).toEqual({ operator: ">", left: 23, right: 4, result: true });
    expect(swap!.description).toBe("Yes, 23 > 4. Swap them.");
    expect(arrayValues(swap!.beforeState)).toEqual([15, 23, 4, 8, 42, 16]);
    expect(arrayValues(swap!.afterState)).toEqual([15, 4, 23, 8, 42, 16]);
    expect(arrayValues(swap!.dataState)).toEqual(arrayValues(swap!.afterState));
  });
});

describe("AF-INPUT-003 ? linked-list position validation", () => {
  it.each([
    { name: "head", data: [1, 2], value: 9, position: 0, expected: [9, 1, 2] },
    { name: "middle", data: [1, 2], value: 9, position: 1, expected: [1, 9, 2] },
    { name: "tail", data: [1, 2], value: 9, position: 2, expected: [1, 2, 9] },
    { name: "empty list", data: [], value: 9, position: 0, expected: [9] },
    { name: "single-node list", data: [1], value: 9, position: 1, expected: [1, 9] },
  ])("inserts at the exact $name position", ({ data, value, position, expected }) => {
    expect(finalLinkedList(data, value, position)).toEqual(expected);
  });

  it.each([
    { position: -1, label: "negative" },
    { position: 3, label: "too large" },
    { position: 1.5, label: "non-integer" },
  ])("rejects a $label position instead of clamping", ({ position }) => {
    expect(() => generateSLLInsertPositionSteps([1, 2], 9, position)).toThrow(
      "Position must be an integer between 0 and 2."
    );
  });
});

describe("AF-SYNC-002 ? canonical committed step", () => {
  afterEach(() => {
    usePlaybackStore.setState({
      steps: [],
      totalSteps: 0,
      currentStepIndex: 0,
      committedStepId: null,
      phase: "idle",
      isPlaying: false,
      isComplete: false,
    });
  });

  it("commits the index, id, phase, and completion status in one store update", () => {
    usePlaybackStore.getState().loadSteps([step("first", 1), step("second", 2)]);
    expect(usePlaybackStore.getState()).toMatchObject({
      currentStepIndex: 0,
      committedStepId: "first",
      phase: "committed",
      isComplete: false,
    });

    usePlaybackStore.getState().nextStep();
    expect(usePlaybackStore.getState()).toMatchObject({
      currentStepIndex: 1,
      committedStepId: "second",
      phase: "committed",
      isComplete: true,
    });
  });
});

describe("AF-TREE-004 ? traversal learning output", () => {
  const cases = [
    {
      name: "inorder",
      generate: generateTreeInorderSteps,
      expected: [4, 2, 5, 1, 6, 3, 7],
      completionLine: 6,
      recursive: true,
    },
    {
      name: "preorder",
      generate: generateTreePreorderSteps,
      expected: [1, 2, 4, 5, 3, 6, 7],
      completionLine: 6,
      recursive: true,
    },
    {
      name: "postorder",
      generate: generateTreePostorderSteps,
      expected: [4, 5, 2, 6, 7, 3, 1],
      completionLine: 6,
      recursive: true,
    },
    {
      name: "level-order",
      generate: generateTreeLevelOrderSteps,
      expected: [1, 2, 3, 4, 5, 6, 7],
      completionLine: 9,
      recursive: false,
    },
  ] as const;

  it.each(cases)("keeps the $name output visible at completion", (testCase) => {
    const steps = testCase.generate([1, 2, 3, 4, 5, 6, 7]);
    const finalStep = steps.at(-1)!;
    const finalState = finalStep.dataState as TreeVisualState;

    expect(finalStep.actionType).toBe("complete");
    expect(finalStep.output).toEqual(testCase.expected);
    expect(finalState.traversalOutput).toEqual(testCase.expected);
    expect(finalState.callStack).toEqual([]);
    expect(finalStep.highlights.visited).toHaveLength(7);
    expect(finalStep.highlights.success).toHaveLength(7);
    expect(finalStep.pseudocodeLine).toBe(testCase.completionLine);

    if (testCase.recursive) {
      expect(
        steps.some((candidate) => {
          const state = candidate.dataState as TreeVisualState;
          return (state.callStack?.length ?? 0) > 1;
        })
      ).toBe(true);
    }
  });
});

describe("AF-LOOP-005 ? per-bucket rehashing", () => {
  it("scans every old bucket and preserves all 7 requested keys", () => {
    const values = [0, 7, 14, 1, 8, 15, 2];
    const steps = generateRehashingSteps(values, 7);
    const finalStep = steps.at(-1)!;
    const finalState = finalStep.dataState as HashTableVisualState;

    expect(steps.filter((candidate) => candidate.title.startsWith("Read Old Bucket"))).toHaveLength(7);
    expect(steps.filter((candidate) => candidate.actionType === "insert")).toHaveLength(7);
    expect(steps.some((candidate) => candidate.actionType === "probe")).toBe(true);
    expect(finalState.rehash?.oldBuckets).toHaveLength(7);
    expect(finalState.tableSize).toBe(15);
    expect(finalState.elementCount).toBe(7);
    expect(finalStep.output).toEqual(values);
  });
});

describe("AF-KMP-006 ? visible preprocessing and complete search", () => {
  function finalMatches(text: string, pattern: string): number[] {
    return generateKMPSearchSteps(text, pattern).at(-1)!.output as number[];
  }

  it("builds the repeated-prefix LPS table one commit at a time", () => {
    const steps = generateKMPSearchSteps("ZZABABCABABYY", "ABABCABAB");
    const preprocessing = steps.find((candidate) => candidate.title === "LPS Preprocessing Complete")!;
    const state = preprocessing.dataState as StringVisualState;

    expect(state.lps).toEqual([0, 0, 1, 2, 0, 1, 2, 3, 4]);
    expect(steps.some((candidate) => candidate.title === "Fallback Within LPS")).toBe(true);
    expect(finalMatches("ZZABABCABABYY", "ABABCABAB")).toEqual([2]);
  });

  it.each([
    { name: "all-same overlap", text: "AAAAAA", pattern: "AAA", expected: [0, 1, 2, 3] },
    { name: "fallback chain", text: "AAACAAAAACAAACAAAAAC", pattern: "AAACAAAAAC", expected: [0, 10] },
    { name: "empty pattern", text: "ABC", pattern: "", expected: [0] },
    { name: "pattern longer than text", text: "ABC", pattern: "ABCD", expected: [] },
    { name: "no match", text: "ABCDEF", pattern: "XYZ", expected: [] },
    { name: "overlapping matches", text: "ABABA", pattern: "ABA", expected: [0, 2] },
  ])("handles $name", ({ text, pattern, expected }) => {
    expect(finalMatches(text, pattern)).toEqual(expected);
  });
});

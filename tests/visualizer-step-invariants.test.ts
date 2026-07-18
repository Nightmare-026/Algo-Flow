import { algorithms } from "@/data/seed/algorithms";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import { createDefaultGraph } from "@/visualizers/graph/types";
import { createDefaultTree } from "@/visualizers/tree/types";
import {
  clampOperationOptions,
  defaultVisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import type { VisualStepHighlights } from "@/types";

const defaultData = [15, 23, 4, 8, 42, 16];
const highlightBuckets = new Set<keyof VisualStepHighlights>([
  "current",
  "compared",
  "swapped",
  "sorted",
  "visited",
  "target",
  "error",
  "found",
  "inserted",
  "deleted",
  "pointer",
  "path",
  "active",
  "success",
]);

function createFixture(slug: string) {
  const data = [...defaultData];
  const options = clampOperationOptions(
    {
      ...structuredClone(defaultVisualizerInputOptions),
      graphState: createDefaultGraph(),
      treeState: createDefaultTree(),
    },
    data.length,
    slug,
  );

  return { data, options };
}

function resetTestUuidSequence() {
  (
    globalThis as typeof globalThis & {
      resetTestUuidSequence: () => void;
    }
  ).resetTestUuidSequence();
}

function asRecord(value: unknown): Record<string, unknown> {
  expect(value).not.toBeNull();
  expect(typeof value).toBe("object");
  return value as Record<string, unknown>;
}

function collectEntityIds(value: unknown): string[] {
  const ids: string[] = [];
  const seen = new WeakSet<object>();

  function visit(candidate: unknown) {
    if (!candidate || typeof candidate !== "object") return;
    if (seen.has(candidate)) return;
    seen.add(candidate);

    if (Array.isArray(candidate)) {
      candidate.forEach(visit);
      return;
    }

    const record = candidate as Record<string, unknown>;
    if (typeof record.id === "string") ids.push(record.id);
    Object.values(record).forEach(visit);
  }

  visit(value);
  return ids;
}

function validateStateAndGetRenderTokens(
  dataStructureId: string,
  stateValue: unknown,
): Set<string> {
  const state = asRecord(stateValue);
  const entityIds = collectEntityIds(state);
  expect(new Set(entityIds).size).toBe(entityIds.length);
  const tokens = new Set(entityIds);

  if (
    ["ds_array", "ds_stack", "ds_queue", "ds_string"].includes(
      dataStructureId,
    )
  ) {
    expect(Array.isArray(state.elements)).toBe(true);
  }

  if (dataStructureId === "ds_matrix") {
    expect(Number.isInteger(state.rows)).toBe(true);
    expect(Number.isInteger(state.cols)).toBe(true);
    expect(Array.isArray(state.elements)).toBe(true);
    const elements = state.elements as unknown[];
    expect(elements.length).toBe((state.rows as number) * (state.cols as number));
    elements.forEach((_, index) => tokens.add(String(index)));
  }

  if (dataStructureId === "ds_string") {
    (state.elements as unknown[]).forEach((_, index) =>
      tokens.add(String(index)),
    );
    if (Array.isArray(state.patternElements)) {
      state.patternElements.forEach((_, index) => tokens.add(`p-${index}`));
    }
  }

  if (dataStructureId === "ds_linked_list") {
    expect(Array.isArray(state.nodes)).toBe(true);
    const nodeIds = new Set(
      (state.nodes as Array<Record<string, unknown>>).map((node) => node.id),
    );
    expect(state.headId === null || nodeIds.has(state.headId)).toBe(true);
    for (const node of state.nodes as Array<Record<string, unknown>>) {
      expect(node.nextId === null || nodeIds.has(node.nextId)).toBe(true);
    }
  }

  if (dataStructureId === "ds_tree") {
    expect(Object.hasOwn(state, "root")).toBe(true);
  }

  if (dataStructureId === "ds_graph") {
    expect(Array.isArray(state.nodes)).toBe(true);
    expect(Array.isArray(state.edges)).toBe(true);
    const nodeIds = new Set(
      (state.nodes as Array<Record<string, unknown>>).map((node) => node.id),
    );
    for (const edge of state.edges as Array<Record<string, unknown>>) {
      expect(nodeIds.has(edge.source)).toBe(true);
      expect(nodeIds.has(edge.target)).toBe(true);
    }
  }

  if (
    dataStructureId === "ds_hash_table" ||
    dataStructureId === "ds_hash_set"
  ) {
    expect(Array.isArray(state.buckets)).toBe(true);
    const size =
      dataStructureId === "ds_hash_table" ? state.tableSize : state.setSize;
    expect(Number.isInteger(size)).toBe(true);
    expect((state.buckets as unknown[]).length).toBe(size);
    (state.buckets as unknown[]).forEach((_, index) =>
      tokens.add(`bucket-${index}`),
    );
  }

  return tokens;
}

describe("published visualizer step invariants", () => {
  for (const algorithm of algorithms.filter((item) => item.isPublished)) {
    it(`${algorithm.slug} emits deterministic, isolated, well-formed steps`, () => {
      const definition = algorithmRegistry[algorithm.slug];
      resetTestUuidSequence();
      const firstFixture = createFixture(algorithm.slug);
      const originalData = structuredClone(firstFixture.data);
      const originalOptions = structuredClone(firstFixture.options);

      const firstRun = definition.generateSteps(
        firstFixture.data,
        firstFixture.options,
      );
      const firstRunSnapshot = structuredClone(firstRun);
      resetTestUuidSequence();
      const secondFixture = createFixture(algorithm.slug);
      const secondRun = definition.generateSteps(
        secondFixture.data,
        secondFixture.options,
      );

      expect(firstRun.length).toBeGreaterThan(0);
      expect(firstRun).toEqual(secondRun);
      expect(firstRun).toEqual(firstRunSnapshot);
      expect(firstFixture.data).toEqual(originalData);
      expect(firstFixture.options).toEqual(originalOptions);

      const stepIds = new Set<string>();
      for (const [index, step] of firstRun.entries()) {
        expect(step.id.trim().length).toBeGreaterThan(0);
        expect(stepIds.has(step.id)).toBe(false);
        stepIds.add(step.id);

        expect(step.stepNumber).toBe(index + 1);
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.description.trim().length).toBeGreaterThan(0);
        expect(step.description).not.toMatch(/\b(undefined|NaN)\b/);
        expect(step.operation.trim().length).toBeGreaterThan(0);
        expect(step.dataState).toBeDefined();
        const renderTokens = validateStateAndGetRenderTokens(
          algorithm.dataStructureId,
          step.dataState,
        );

        for (const [bucket, ids] of Object.entries(step.highlights)) {
          expect(highlightBuckets.has(bucket as keyof VisualStepHighlights)).toBe(
            true,
          );
          expect(Array.isArray(ids)).toBe(true);
          expect(
            ids?.every(
              (id: unknown) => typeof id === "string" && id.length > 0,
            ),
          ).toBe(true);
          expect(new Set(ids as string[]).size).toBe(ids?.length);
          expect(
            (ids as string[]).every((id) => renderTokens.has(id)),
          ).toBe(true);
        }
      }
    });
  }
});

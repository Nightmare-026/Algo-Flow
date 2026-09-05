import { describe, it, expect } from "vitest";
import { algorithms } from "@/data/seed/algorithms";
import { dataStructures } from "@/data/seed/data-structures";
import { operations } from "@/data/seed/operations";

describe("Catalog Integrity", () => {
  it("has unique algorithm IDs", () => {
    const seenIds = new Set<string>();
    const duplicates: string[] = [];

    for (const algo of algorithms) {
      if (seenIds.has(algo.id)) {
        duplicates.push(algo.id);
      }
      seenIds.add(algo.id);
    }

    expect(duplicates).toEqual([]);
  });

  it("has unique algorithm slugs", () => {
    const seenSlugs = new Set<string>();
    const duplicates: string[] = [];

    for (const algo of algorithms) {
      if (seenSlugs.has(algo.slug)) {
        duplicates.push(algo.slug);
      }
      seenSlugs.add(algo.slug);
    }

    expect(duplicates).toEqual([]);
  });

  it("every algorithm references a valid dataStructure and operation", () => {
    const dsIds = new Set(dataStructures.map((ds) => ds.id));
    const opIds = new Set(operations.map((op) => op.id));

    for (const algo of algorithms) {
      expect(dsIds.has(algo.dataStructureId)).toBe(true);
      expect(opIds.has(algo.operationId)).toBe(true);
    }
  });

  it("linked list category has no duplicate algorithms", () => {
    const llAlgos = algorithms.filter((a) => a.dataStructureId === "ds_linked_list");
    const slugs = llAlgos.map((a) => a.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });
});

import { algorithms } from "@/data/seed/algorithms";
import { dataStructures } from "@/data/seed/data-structures";
import { catalogStats, publishedAlgorithms, publishedDataStructures } from "@/lib/catalog";

describe("catalog projections", () => {
  it("derives the published visualizer count from the catalog", () => {
    expect(publishedAlgorithms).toEqual(algorithms.filter((algorithm) => algorithm.isPublished));
    expect(catalogStats.visualizerCount).toBe(publishedAlgorithms.length);
  });

  it("derives the published structure count from the catalog", () => {
    expect(publishedDataStructures).toEqual(
      dataStructures.filter((structure) => structure.isPublished)
    );
    expect(catalogStats.structureCount).toBe(publishedDataStructures.length);
  });
});

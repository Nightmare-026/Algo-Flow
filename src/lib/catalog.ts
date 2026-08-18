import { algorithms } from "@/data/seed/algorithms";
import { dataStructures } from "@/data/seed/data-structures";

/**
 * Canonical published catalog projections.
 *
 * Keep public-facing counts and listings derived from the seed catalog rather
 * than duplicating a manually maintained number in page metadata or copy.
 */
export const publishedAlgorithms = algorithms.filter((algorithm) => algorithm.isPublished);
export const publishedDataStructures = dataStructures.filter((structure) => structure.isPublished);

export const catalogStats = {
  visualizerCount: publishedAlgorithms.length,
  structureCount: publishedDataStructures.length,
} as const;

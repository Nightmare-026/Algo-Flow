import { algorithms } from "@/data/seed/algorithms";
import { dataStructures } from "@/data/seed/data-structures";
import { operations } from "@/data/seed/operations";
import { REQUIRED_CODE_LANGUAGES } from "@/visualizers/registry/types";

/**
 * Canonical published catalog projections.
 *
 * Keep public-facing counts and listings derived from the seed catalog rather
 * than duplicating a manually maintained number in page metadata or copy.
 */
export const publishedAlgorithms = algorithms.filter((algorithm) => algorithm.isPublished);
export const publishedDataStructures = dataStructures.filter((structure) => structure.isPublished);
export const publishedOperations = operations.filter((operation) => operation.isPublished);

export const catalogStats = {
  visualizerCount: publishedAlgorithms.length,
  structureCount: publishedDataStructures.length,
  operationCount: publishedOperations.length,
  languageCount: REQUIRED_CODE_LANGUAGES.length,
} as const;

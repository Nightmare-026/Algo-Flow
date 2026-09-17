import type { Algorithm } from "@/types";
import { dataStructures } from "@/data/seed/data-structures";

export interface CategoryProgress {
  totalAlgorithms: number;
  completedCount: number;
  progressPercent: number;
  totalXP: number;
  linearCount: number;
  linearCompleted: number;
  linearProgress: number;
  nonLinearCount: number;
  nonLinearCompleted: number;
  nonLinearProgress: number;
  hashCount: number;
  hashCompleted: number;
  hashProgress: number;
}

export function computeCategoryProgress(
  algorithms: Algorithm[],
  completedIds: string[],
  overrideTotalXP?: number
): CategoryProgress {
  const publishedAlgorithms = algorithms.filter((a) => a.isPublished);
  const totalAlgorithms = publishedAlgorithms.length;
  const completedCount = completedIds.length;
  const progressPercent =
    totalAlgorithms > 0 ? Math.round((completedCount / totalAlgorithms) * 100) : 0;

  // Use authentic XP when provided, or base XP calculation
  const totalXP = overrideTotalXP !== undefined ? overrideTotalXP : completedCount * 100;

  // Build a map of data structure ID to its category
  const dsCategoryMap = new Map<string, string>();
  for (const ds of dataStructures) {
    dsCategoryMap.set(ds.id, ds.category);
  }

  const getCategory = (dsId: string): string => {
    return dsCategoryMap.get(dsId) || "linear";
  };

  // Linear: array, lists, stacks, queues, strings, matrices
  const linearAlgos = publishedAlgorithms.filter(
    (a) => getCategory(a.dataStructureId) === "linear"
  );
  const linearCount = linearAlgos.length;
  const linearCompleted = completedIds.filter((id) => {
    const a = algorithms.find((alg) => alg.id === id);
    return a && getCategory(a.dataStructureId) === "linear";
  }).length;
  const linearProgress = linearCount > 0 ? Math.round((linearCompleted / linearCount) * 100) : 0;

  // Non-Linear: trees, graphs
  const nonLinearAlgos = publishedAlgorithms.filter(
    (a) => getCategory(a.dataStructureId) === "non-linear"
  );
  const nonLinearCount = nonLinearAlgos.length;
  const nonLinearCompleted = completedIds.filter((id) => {
    const a = algorithms.find((alg) => alg.id === id);
    return a && getCategory(a.dataStructureId) === "non-linear";
  }).length;
  const nonLinearProgress =
    nonLinearCount > 0 ? Math.round((nonLinearCompleted / nonLinearCount) * 100) : 0;

  // Hash-based: hash table, hash set
  const hashAlgos = publishedAlgorithms.filter(
    (a) => getCategory(a.dataStructureId) === "hash-based"
  );
  const hashCount = hashAlgos.length;
  const hashCompleted = completedIds.filter((id) => {
    const a = algorithms.find((alg) => alg.id === id);
    return a && getCategory(a.dataStructureId) === "hash-based";
  }).length;
  const hashProgress = hashCount > 0 ? Math.round((hashCompleted / hashCount) * 100) : 0;

  return {
    totalAlgorithms,
    completedCount,
    progressPercent,
    totalXP,
    linearCount,
    linearCompleted,
    linearProgress,
    nonLinearCount,
    nonLinearCompleted,
    nonLinearProgress,
    hashCount,
    hashCompleted,
    hashProgress,
  };
}

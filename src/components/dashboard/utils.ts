import type { Algorithm } from "@/types";

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
}

export function computeCategoryProgress(
  algorithms: Algorithm[],
  completedIds: string[]
): CategoryProgress {
  const publishedAlgorithms = algorithms.filter((a) => a.isPublished);
  const totalAlgorithms = publishedAlgorithms.length;
  const completedCount = completedIds.length;
  const progressPercent =
    totalAlgorithms > 0 ? Math.round((completedCount / totalAlgorithms) * 100) : 0;
  const totalXP = completedCount * 150;

  const isLinear = (dataStructureId: string) =>
    dataStructureId.includes("list") ||
    dataStructureId.includes("stack") ||
    dataStructureId.includes("queue") ||
    dataStructureId.includes("array");

  const isNonLinear = (dataStructureId: string) =>
    dataStructureId.includes("tree") || dataStructureId.includes("graph");

  const linearCount = publishedAlgorithms.filter((a) => isLinear(a.dataStructureId)).length;
  const linearCompleted = completedIds.filter((id) => {
    const a = algorithms.find((alg) => alg.id === id);
    return a && isLinear(a.dataStructureId);
  }).length;
  const linearProgress = linearCount > 0 ? Math.round((linearCompleted / linearCount) * 100) : 0;

  const nonLinearCount = publishedAlgorithms.filter((a) => isNonLinear(a.dataStructureId)).length;
  const nonLinearCompleted = completedIds.filter((id) => {
    const a = algorithms.find((alg) => alg.id === id);
    return a && isNonLinear(a.dataStructureId);
  }).length;
  const nonLinearProgress =
    nonLinearCount > 0 ? Math.round((nonLinearCompleted / nonLinearCount) * 100) : 0;

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
  };
}

import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getHashTableCodeExamples } from "./code-examples";
import { generateLinearProbingInsertSteps, generateLinearProbingSearchSteps, generateLinearProbingDeleteSteps } from "./linear-probing";
import { generateChainingInsertSteps, generateChainingSearchSteps, generateChainingDeleteSteps } from "./chaining";
import { generateDivisionHashSteps, generateRehashingSteps } from "./additional";

function getCodeExamples(algorithmId: string, algorithmName: string, isChaining: boolean) {
  const baseSlug = isChaining ? "separate-chaining" : "linear-probing";
  return getHashTableCodeExamples(baseSlug, algorithmId);
}

export const hashTableRegistry: AlgorithmVisualizerDefinition[] = [
  { slug: "division-hash-method", generateSteps: (data, opts) => generateDivisionHashSteps(opts.value!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, false) },
  { slug: "hash-insert", generateSteps: (data, opts) => generateLinearProbingInsertSteps(data, opts.value!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, false) },
  { slug: "linear-probing", generateSteps: (data, opts) => generateLinearProbingInsertSteps(data, opts.value!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, false) },
  { slug: "probing-insert", generateSteps: (data, opts) => generateLinearProbingInsertSteps(data, opts.value!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, false) },
  { slug: "hash-search", generateSteps: (data, opts) => generateLinearProbingSearchSteps(data, opts.target!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, false) },
  { slug: "probing-search", generateSteps: (data, opts) => generateLinearProbingSearchSteps(data, opts.target!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, false) },
  { slug: "hash-delete", generateSteps: (data, opts) => generateLinearProbingDeleteSteps(data, opts.target!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, false) },
  { slug: "probing-delete", generateSteps: (data, opts) => generateLinearProbingDeleteSteps(data, opts.target!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, false) },
  { slug: "rehashing", generateSteps: (data, opts) => generateRehashingSteps(data, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, false) },
  { slug: "chaining-insert", generateSteps: (data, opts) => generateChainingInsertSteps(data, opts.value!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, true) },
  { slug: "chaining-search", generateSteps: (data, opts) => generateChainingSearchSteps(data, opts.target!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, true) },
  { slug: "chaining-delete", generateSteps: (data, opts) => generateChainingDeleteSteps(data, opts.target!, opts.capacity!), getCodeExamples: (id, name) => getCodeExamples(id, name, true) },
];

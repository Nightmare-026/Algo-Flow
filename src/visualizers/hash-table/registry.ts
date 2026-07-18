import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { getHashTableCodeExamples } from "./code-examples";
import { hashTableCodeLineMappings } from "./code-line-mappings";
import { coordinateHashTableSteps } from "./pseudocode-line-mappings";
import {
  generateLinearProbingInsertSteps,
  generateLinearProbingSearchSteps,
  generateLinearProbingDeleteSteps,
} from "./linear-probing";
import {
  generateChainingInsertSteps,
  generateChainingSearchSteps,
  generateChainingDeleteSteps,
} from "./chaining";
import { generateDivisionHashSteps, generateRehashingSteps } from "./additional";

function getCodeExamples(slug: string, algorithmId: string, isChaining: boolean) {
  const baseSlug = isChaining ? "separate-chaining" : "linear-probing";
  return getHashTableCodeExamples(baseSlug, algorithmId);
}

const rawHashTableRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "division-hash-method",
    generateSteps: (data, opts) => generateDivisionHashSteps(opts.value!, opts.capacity!),
    getCodeExamples: getHashTableCodeExamples,
    codeLineMapping: hashTableCodeLineMappings["division-hash-method"],
  },
  {
    slug: "hash-insert",
    generateSteps: (data, opts) =>
      generateLinearProbingInsertSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, false),
    codeLineMapping: hashTableCodeLineMappings["hash-insert"],
  },
  {
    slug: "linear-probing",
    generateSteps: (data, opts) =>
      generateLinearProbingInsertSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, false),
    codeLineMapping: hashTableCodeLineMappings["linear-probing"],
  },
  {
    slug: "probing-insert",
    generateSteps: (data, opts) =>
      generateLinearProbingInsertSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, false),
    codeLineMapping: hashTableCodeLineMappings["probing-insert"],
  },
  {
    slug: "hash-search",
    generateSteps: (data, opts) =>
      generateLinearProbingSearchSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, false),
    codeLineMapping: hashTableCodeLineMappings["hash-search"],
  },
  {
    slug: "probing-search",
    generateSteps: (data, opts) =>
      generateLinearProbingSearchSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, false),
    codeLineMapping: hashTableCodeLineMappings["probing-search"],
  },
  {
    slug: "hash-delete",
    generateSteps: (data, opts) =>
      generateLinearProbingDeleteSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, false),
    codeLineMapping: hashTableCodeLineMappings["hash-delete"],
  },
  {
    slug: "probing-delete",
    generateSteps: (data, opts) =>
      generateLinearProbingDeleteSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, false),
    codeLineMapping: hashTableCodeLineMappings["probing-delete"],
  },
  {
    slug: "rehashing",
    generateSteps: (data, opts) => generateRehashingSteps(data, opts.capacity!),
    getCodeExamples: getHashTableCodeExamples,
    codeLineMapping: hashTableCodeLineMappings["rehashing"],
  },
  {
    slug: "chaining-insert",
    generateSteps: (data, opts) => generateChainingInsertSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, true),
    codeLineMapping: hashTableCodeLineMappings["chaining-insert"],
  },
  {
    slug: "chaining-search",
    generateSteps: (data, opts) => generateChainingSearchSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, true),
    codeLineMapping: hashTableCodeLineMappings["chaining-search"],
  },
  {
    slug: "chaining-delete",
    generateSteps: (data, opts) => generateChainingDeleteSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: (slug, id) => getCodeExamples(slug, id, true),
    codeLineMapping: hashTableCodeLineMappings["chaining-delete"],
  },
];

export const hashTableRegistry: AlgorithmVisualizerDefinition[] = rawHashTableRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateHashTableSteps(definition.slug, definition.generateSteps(data, options)),
  })
);

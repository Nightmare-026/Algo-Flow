import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getHashSetCodeExamples } from "./multilanguage-code-examples";
import { generateHashSetInsertSteps } from "./insert";
import { generateHashSetSearchSteps } from "./search";
import { generateHashSetDeleteSteps } from "./delete";
import { generateHashSetUnionSteps, generateHashSetIntersectionSteps } from "./additional";

export const hashSetRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "hash-set-insert",
    generateSteps: (data, opts) => generateHashSetInsertSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
  },
  {
    slug: "hash-set-search",
    generateSteps: (data, opts) => generateHashSetSearchSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
  },
  {
    slug: "hash-set-delete",
    generateSteps: (data, opts) => generateHashSetDeleteSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
  },
  {
    slug: "set-union",
    generateSteps: (data, opts) => generateHashSetUnionSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
  },
  {
    slug: "set-intersection",
    generateSteps: (data, opts) =>
      generateHashSetIntersectionSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
  },
];

import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { getHashSetCodeExamples } from "./code-examples";
import { hashSetCodeLineMappings } from "./code-line-mappings";
import { coordinateHashSetSteps } from "./pseudocode-line-mappings";
import { generateHashSetInsertSteps } from "./insert";
import { generateHashSetSearchSteps } from "./search";
import { generateHashSetDeleteSteps } from "./delete";
import { generateHashSetUnionSteps, generateHashSetIntersectionSteps } from "./additional";

const rawHashSetRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "hash-set-insert",
    generateSteps: (data, opts) => generateHashSetInsertSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
    codeLineMapping: hashSetCodeLineMappings["hash-set-insert"],
  },
  {
    slug: "hash-set-search",
    generateSteps: (data, opts) => generateHashSetSearchSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
    codeLineMapping: hashSetCodeLineMappings["hash-set-search"],
  },
  {
    slug: "hash-set-delete",
    generateSteps: (data, opts) => generateHashSetDeleteSteps(data, opts.target!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
    codeLineMapping: hashSetCodeLineMappings["hash-set-delete"],
  },
  {
    slug: "set-union",
    generateSteps: (data, opts) => generateHashSetUnionSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
    codeLineMapping: hashSetCodeLineMappings["set-union"],
  },
  {
    slug: "set-intersection",
    generateSteps: (data, opts) =>
      generateHashSetIntersectionSteps(data, opts.value!, opts.capacity!),
    getCodeExamples: getHashSetCodeExamples,
    codeLineMapping: hashSetCodeLineMappings["set-intersection"],
  },
];

export const hashSetRegistry: AlgorithmVisualizerDefinition[] = rawHashSetRegistry.map(
  (definition) => ({
    ...definition,
    generateSteps: (data, options) =>
      coordinateHashSetSteps(definition.slug, definition.generateSteps(data, options)),
  })
);

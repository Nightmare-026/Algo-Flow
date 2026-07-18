/**
 * Runtime visualizer registry validator.
 *
 * The application composes a published visualizer from three sources:
 * algorithm metadata/pseudocode, an algorithm implementation, and a
 * data-structure renderer/control definition. This validator checks that
 * composed contract without pretending unfinished Phase 3 readiness artifacts
 * already exist.
 */

import { algorithms } from "../src/data/seed/algorithms";
import { algorithmRegistry } from "../src/visualizers/registry/algorithm-registry";
import {
  DATA_STRUCTURE_IDS,
  REQUIRED_CODE_LANGUAGES,
} from "../src/visualizers/registry/types";
import type { CodeExample } from "../src/types";

type Issue = {
  severity: "error" | "warning";
  where: string;
  message: string;
};

const issues: Issue[] = [];

function report(severity: Issue["severity"], where: string, message: string): void {
  issues.push({ severity, where, message });
}

function requireText(value: unknown, where: string, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    report("error", where, `${field} must be a non-empty string`);
  }
}

const catalogBySlug = new Map<string, (typeof algorithms)[number]>();
const supportedDataStructureIds = new Set<string>(DATA_STRUCTURE_IDS);

for (const algorithm of algorithms) {
  const where = `catalog.${algorithm.slug || "<missing-slug>"}`;

  requireText(algorithm.slug, where, "slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(algorithm.slug)) {
    report("error", where, "slug must be lowercase kebab-case");
  }

  if (catalogBySlug.has(algorithm.slug)) {
    report("error", where, "duplicate catalog slug");
    continue;
  }
  catalogBySlug.set(algorithm.slug, algorithm);

  for (const [field, value] of [
    ["id", algorithm.id],
    ["name", algorithm.name],
    ["shortDescription", algorithm.shortDescription],
    ["dataStructureId", algorithm.dataStructureId],
    ["operationId", algorithm.operationId],
    ["difficulty", algorithm.difficulty],
    ["timeComplexityBest", algorithm.timeComplexityBest],
    ["timeComplexityAverage", algorithm.timeComplexityAverage],
    ["timeComplexityWorst", algorithm.timeComplexityWorst],
    ["spaceComplexity", algorithm.spaceComplexity],
  ] as const) {
    requireText(value, where, field);
  }

  if (!Array.isArray(algorithm.tags) || algorithm.tags.length === 0) {
    report("error", where, "tags must contain at least one value");
  }

  if (!algorithm.isPublished) {
    continue;
  }

  const implementation = algorithmRegistry[algorithm.slug];
  if (!implementation) {
    report("error", where, "published catalog entry has no algorithm implementation");
    continue;
  }

  if (implementation.slug !== algorithm.slug) {
    report("error", where, "registry key and implementation slug do not match");
  }
  if (typeof implementation.generateSteps !== "function") {
    report("error", where, "generateSteps must be a function");
  }
  if (typeof implementation.getCodeExamples !== "function") {
    report("error", where, "getCodeExamples must be a function");
  }

  if (!supportedDataStructureIds.has(algorithm.dataStructureId)) {
    report("error", where, "dataStructureId has no typed renderer/control registration");
  }

  requireText(algorithm.pseudocode, where, "pseudocode");

  let examples: CodeExample[] = [];
  try {
    examples = implementation.getCodeExamples(algorithm.slug, algorithm.id);
  } catch (error) {
    report(
      "error",
      where,
      `getCodeExamples threw: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!Array.isArray(examples)) {
    report("error", where, "getCodeExamples must return an array");
    examples = [];
  }

  const examplesByLanguage = new Map<string, CodeExample>();
  for (const example of examples) {
    if (examplesByLanguage.has(example.language)) {
      report("error", where, `duplicate code example for ${example.language}`);
    }
    examplesByLanguage.set(example.language, example);
    requireText(example.code, where, `codeExamples.${example.language}.code`);
    if (example.algorithmId !== algorithm.id) {
      report("error", where, `codeExamples.${example.language}.algorithmId must match catalog id`);
    }
  }

  for (const language of REQUIRED_CODE_LANGUAGES) {
    if (!examplesByLanguage.has(language)) {
      report("error", where, `missing required ${language} code example`);
    }
  }
}

for (const [slug, implementation] of Object.entries(algorithmRegistry)) {
  const where = `registry.${slug}`;
  if (implementation.slug !== slug) {
    report("error", where, "registry key and implementation slug do not match");
  }
  if (!catalogBySlug.has(slug)) {
    report(
      "warning",
      where,
      "implementation is not published in the catalog; remove or explicitly catalog it"
    );
  }
}

const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warning");

console.log(
  `\nRegistry summary: ${catalogBySlug.size} catalog entries, ${Object.keys(algorithmRegistry).length} implementations`
);
console.log(`Validation result: ${errors.length} error(s), ${warnings.length} warning(s)\n`);

for (const issue of issues) {
  const marker = issue.severity === "error" ? "ERROR" : "WARN";
  console.log(`[${marker}] ${issue.where}: ${issue.message}`);
}

if (errors.length > 0) {
  console.error(`\nvalidate:registry FAILED with ${errors.length} error(s).`);
  process.exitCode = 1;
} else {
  console.log("validate:registry PASSED");
}

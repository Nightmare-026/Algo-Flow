/**
 * Publication-readiness validator.
 *
 * Unlike the runtime registry, a published definition must include authored
 * input, semantic-test, code-mapping, and legend artifacts. The composed
 * publication registry resolves metadata, pseudocode, code examples,
 * generators, renderers, and controls from their authoritative sources first;
 * this validator therefore reports only genuine remaining artifacts.
 */

import { algorithms } from "../src/data/seed/algorithms";
import {
  publicationRegistry,
  type ComposedPublicationDefinition,
} from "../src/features/visualizer-engine/registry/publication-registry";
import { REQUIRED_CODE_LANGUAGES } from "../src/features/visualizer-engine/registry/types";
import type { VisualStepHighlights } from "../src/types";

type Issue = {
  severity: "error" | "warning";
  where: string;
  message: string;
};

const issues: Issue[] = [];
const validHighlightBuckets = new Set<keyof VisualStepHighlights>([
  "current",
  "compared",
  "swapped",
  "sorted",
  "visited",
  "target",
  "error",
  "found",
  "inserted",
  "deleted",
  "pointer",
  "path",
  "active",
  "success",
]);

function report(
  severity: Issue["severity"],
  where: string,
  message: string,
) {
  issues.push({ severity, where, message });
}

function requireText(value: unknown, where: string, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    report("error", where, `${field} must be a non-empty string`);
  }
}

function codeLineCount(code: string) {
  return code.split(/\r?\n/).length;
}

function validateAuthoredArtifacts(
  where: string,
  entry: ComposedPublicationDefinition,
) {
  const artifacts = entry.authoredArtifacts;
  if (!artifacts) return;

  for (const generator of artifacts.inputGenerators) {
    const generatorWhere = `${where}.inputGenerators.${generator.id}`;
    requireText(generator.id, generatorWhere, "id");
    requireText(generator.label, generatorWhere, "label");
    try {
      const input = generator.generate();
      if (!artifacts.inputSchema(input, entry.defaultOptions)) {
        report("error", generatorWhere, "generated input fails inputSchema");
        continue;
      }
      const validationErrors = artifacts.validateInput(
        input,
        entry.defaultOptions,
      );
      if (validationErrors.length > 0) {
        report(
          "error",
          generatorWhere,
          `generated input fails validateInput: ${validationErrors.join("; ")}`,
        );
      }
    } catch (error) {
      report(
        "error",
        generatorWhere,
        `generator threw: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  const mappings = new Map<number, (typeof artifacts.codeLineMapping)[number]>();
  for (const mapping of artifacts.codeLineMapping) {
    const mappingWhere = `${where}.codeLineMapping.${mapping.logicalLine}`;
    if (!Number.isInteger(mapping.logicalLine) || mapping.logicalLine < 1) {
      report("error", mappingWhere, "logicalLine must be a positive integer");
      continue;
    }
    if (mappings.has(mapping.logicalLine)) {
      report("error", mappingWhere, "logicalLine must be unique");
    }
    mappings.set(mapping.logicalLine, mapping);

    for (const language of REQUIRED_CODE_LANGUAGES) {
      const line = mapping.lines[language];
      const example = entry.codeExamples[language];
      if (!Number.isInteger(line) || line < 1) {
        report(
          "error",
          mappingWhere,
          `${language} line must be a positive integer`,
        );
      } else if (example && line > codeLineCount(example.code)) {
        report(
          "error",
          mappingWhere,
          `${language} line ${line} exceeds the ${codeLineCount(example.code)}-line example`,
        );
      }
    }
  }

  const legendBuckets = new Set(
    artifacts.legend.map((item) => item.bucketKey),
  );
  for (const testCase of artifacts.testCases) {
    const testWhere = `${where}.testCases.${testCase.name}`;
    requireText(testCase.name, testWhere, "name");
    if (!artifacts.inputSchema(testCase.input, testCase.options)) {
      report("error", testWhere, "test input fails inputSchema");
      continue;
    }

    try {
      const steps = entry.generateSteps(testCase.input, testCase.options);
      if (steps.length === 0) {
        report("error", testWhere, "generateSteps returned no steps");
        continue;
      }
      const failures = testCase.verify(steps);
      for (const failure of failures) {
        report("error", testWhere, failure);
      }

      for (const step of steps) {
        if (!Number.isInteger(step.codeLine) || (step.codeLine ?? 0) < 1) {
          report(
            "error",
            testWhere,
            `step ${step.stepNumber} has no positive logical codeLine`,
          );
        } else if (!mappings.has(step.codeLine!)) {
          report(
            "error",
            testWhere,
            `step ${step.stepNumber} references unmapped logical codeLine ${step.codeLine}`,
          );
        }

        for (const bucket of Object.keys(
          step.highlights,
        ) as (keyof VisualStepHighlights)[]) {
          if (!legendBuckets.has(bucket)) {
            report(
              "error",
              testWhere,
              `step ${step.stepNumber} uses highlight bucket ${bucket} without a legend entry`,
            );
          }
        }
      }
    } catch (error) {
      report(
        "error",
        testWhere,
        `semantic test threw: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

function validateComposedDefinition(
  slug: string,
  entry: ComposedPublicationDefinition,
) {
  const where = `publication.${slug}`;

  for (const [field, value] of [
    ["id", entry.id],
    ["slug", entry.slug],
    ["title", entry.title],
    ["description", entry.description],
    ["dataStructureId", entry.dataStructureId],
    ["operation", entry.operation],
    ["difficulty", entry.difficulty],
    ["priority", entry.priority],
    ["spaceComplexity", entry.spaceComplexity],
  ] as const) {
    requireText(value, where, field);
  }

  if (entry.slug !== slug) {
    report("error", where, "registry key and slug do not match");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
    report("error", where, "slug must be lowercase kebab-case");
  }

  for (const [field, value] of Object.entries(entry.timeComplexity)) {
    requireText(value, where, `timeComplexity.${field}`);
  }
  if (entry.tags.length === 0) {
    report("error", where, "tags must be non-empty");
  }
  if (!Array.isArray(entry.defaultInput)) {
    report("error", where, "defaultInput must be an array");
  }
  if (!entry.defaultOptions || typeof entry.defaultOptions !== "object") {
    report("error", where, "defaultOptions must be present");
  }
  if (typeof entry.generateSteps !== "function") {
    report("error", where, "generateSteps must be a function");
  }
  requireText(entry.renderer, where, "renderer");
  requireText(entry.inputControls, where, "inputControls");

  for (const language of REQUIRED_CODE_LANGUAGES) {
    const example = entry.codeExamples[language];
    if (!example || example.code.trim().length === 0) {
      report("error", where, `codeExamples.${language} is missing`);
    } else if (example.language !== language) {
      report(
        "error",
        where,
        `codeExamples.${language}.language must equal ${language}`,
      );
    }
  }

  if (entry.pseudocode.length === 0) {
    report("error", where, "pseudocode must be non-empty");
  }
  entry.pseudocode.forEach((line, index) => {
    if (line.line !== index + 1 || line.text.trim().length === 0) {
      report(
        "error",
        where,
        "pseudocode lines must be non-empty and sequential from 1",
      );
    }
  });

  const artifacts = entry.authoredArtifacts;
  if (typeof artifacts?.inputSchema !== "function") {
    report("error", where, "authored inputSchema is missing");
  }
  if (!artifacts?.inputGenerators?.length) {
    report("error", where, "authored inputGenerators are missing");
  }
  if (typeof artifacts?.validateInput !== "function") {
    report("error", where, "authored validateInput is missing");
  }
  if (!artifacts?.testCases?.length) {
    report("error", where, "authored semantic testCases are missing");
  }
  if (!artifacts?.codeLineMapping?.length) {
    report("error", where, "authored codeLineMapping is missing");
  }
  if (!artifacts?.legend?.length) {
    report("error", where, "authored legend is missing");
  } else {
    for (const item of artifacts.legend) {
      if (!validHighlightBuckets.has(item.bucketKey)) {
        report(
          "error",
          where,
          `legend references unknown bucket ${String(item.bucketKey)}`,
        );
      }
    }
  }

  if (artifacts) validateAuthoredArtifacts(where, entry);
}

const publishedSlugs = new Set(
  algorithms
    .filter((algorithm) => algorithm.isPublished)
    .map((algorithm) => algorithm.slug),
);
const publicationSlugs = new Set(Object.keys(publicationRegistry));

for (const slug of publishedSlugs) {
  const entry = publicationRegistry[slug];
  if (!entry) {
    report(
      "error",
      `catalog.${slug}`,
      "published catalog entry has no composed publication definition",
    );
    continue;
  }
  validateComposedDefinition(slug, entry);
}

for (const slug of publicationSlugs) {
  if (!publishedSlugs.has(slug)) {
    report(
      "warning",
      `publication.${slug}`,
      "definition is not present in the published catalog",
    );
  }
}

const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warning");

console.log(
  `\nReadiness summary: ${publishedSlugs.size} published entries, ${publicationSlugs.size} composed definitions`,
);
console.log(
  `Genuine authored-artifact gaps: ${errors.length} error(s), ${warnings.length} warning(s)\n`,
);

for (const issue of issues) {
  console.log(
    `[${issue.severity === "error" ? "ERROR" : "WARN"}] ${issue.where}: ${issue.message}`,
  );
}

if (errors.length > 0) {
  console.error(
    `\nvalidate:registry:readiness FAILED with ${errors.length} genuine gap(s).`,
  );
  process.exitCode = 1;
} else {
  console.log("validate:registry:readiness PASSED");
}

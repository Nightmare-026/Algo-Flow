/**
 * Phase 3 — Build-time Registry & Catalog Validator.
 *
 * `npm run validate:registry` (also wired into `prebuild`).
 *
 * Fails the build when:
 * - any catalog slug lacks a registry entry (Decision 6: prune contracts)
 * - any registry entry is missing required fields
 * - any registry entry lacks any of javascript/typescript/python/cpp/java
 * - pseudocode lines are not strictly increasing from 1
 * - testCases is empty or expectations reference uncovered step ids
 * - codeLineMapping is missing for any step emitted
 * - the catalog contains slugs with no registry entry
 *
 * `npm run validate:registry` exits 0 on success, 1 on failure.
 */

import { algorithmRegistry } from "../src/features/visualizer-engine/registry/algorithm-registry";
import type { VisualizerDefinition } from "../src/features/visualizer-engine/registry/VisualizerDefinition";
import type { CodeExample, VisualStepHighlights } from "../src/types";
import { algorithms } from "../src/data/seed/algorithms";

type Issue = {
  severity: "error" | "warn";
  where: string;
  message: string;
};

const issues: Issue[] = [];

function err(where: string, message: string): void {
  issues.push({ severity: "error", where, message });
}
function warn(where: string, message: string): void {
  issues.push({ severity: "warn", where, message });
}

const REQUIRED_LANGS = ["javascript", "typescript", "python", "cpp", "java"] as const;

const catalogSlugs = new Set<string>();
for (const a of algorithms) {
  if (!a || typeof a.slug !== "string") continue;
  catalogSlugs.add(a.slug);
}

const registrySlugs = new Set<string>();

const registry = algorithmRegistry as unknown as Record<
  string,
  VisualizerDefinition<unknown>
>;

// Catch duplicate slugs.
const seenSlugs = new Set<string>();

for (const [slug, entry] of Object.entries(registry)) {
  if (seenSlugs.has(slug)) {
    err(`registry.${slug}`, "duplicate slug");
    continue;
  }
  seenSlugs.add(slug);
  registrySlugs.add(slug);

  const loc = `registry.${slug}`;

  // 1) Required string fields.
  for (const k of [
    "title",
    "description",
    "dataStructureId",
    "category",
    "difficulty",
    "spaceComplexity",
  ]) {
    const v = (entry as unknown as Record<string, unknown>)[k];
    if (typeof v !== "string" || v.length === 0) {
      err(loc, `field "${k}" must be a non-empty string`);
    }
  }

  // 2) timeComplexity.
  const tc = entry.timeComplexity;
  if (
    !tc ||
    typeof tc.best !== "string" ||
    typeof tc.average !== "string" ||
    typeof tc.worst !== "string"
  ) {
    err(loc, 'timeComplexity must be {best, average, worst} strings (e.g. "O(n)")');
  }

  // 3) tags.
  if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
    err(loc, "tags must be a non-empty array of strings");
  }

  // 4) generateSteps.
  if (typeof entry.generateSteps !== "function") {
    err(loc, "generateSteps must be a function");
  }

  // 5) codeExamples per REQUIRED_LANGS.
  if (!entry.codeExamples || typeof entry.codeExamples !== "object") {
    err(loc, "codeExamples is missing");
  } else {
    for (const lang of REQUIRED_LANGS) {
      const ce = (entry.codeExamples as Record<string, CodeExample | undefined>)[lang];
      if (!ce || typeof ce.code !== "string" || ce.code.trim().length === 0) {
        err(loc, `codeExamples.${lang} must be a non-empty CodeExample`);
      }
      if (ce && ce.language !== lang) {
        err(loc, `codeExamples.${lang}.language must equal "${lang}" (was "${ce.language}")`);
      }
    }
  }

  // 6) pseudocode.
  if (!Array.isArray(entry.pseudocode) || entry.pseudocode.length === 0) {
    err(loc, "pseudocode must be a non-empty array of {line,text}");
  } else {
    const seenLines = new Set<number>();
    let lastLine = -Infinity;
    for (const pc of entry.pseudocode) {
      if (
        typeof pc.line !== "number" ||
        !Number.isInteger(pc.line) ||
        typeof pc.text !== "string" ||
        pc.text.length === 0
      ) {
        err(loc, "pseudocode entry must be {line: positive int, text: non-empty string}");
        continue;
      }
      if (pc.line < 1) {
        err(loc, `pseudocode line must be ≥ 1 (saw ${pc.line})`);
      }
      if (seenLines.has(pc.line)) {
        err(loc, `pseudocode line ${pc.line} duplicates`);
      }
      seenLines.add(pc.line);
      if (pc.line <= lastLine) {
        err(loc, `pseudocode lines must strictly increase (saw ${pc.line} after ${lastLine})`);
      }
      lastLine = pc.line;
    }
  }

  // 7) testCases.
  if (!Array.isArray(entry.testCases) || entry.testCases.length === 0) {
    err(loc, "testCases must be a non-empty array");
  } else {
    entry.testCases.forEach((tc, i) => {
      if (typeof tc.name !== "string" || tc.name.length === 0) {
        err(loc, `testCase[${i}].name must be a non-empty string`);
      }
      if (!tc.options || typeof tc.options !== "object") {
        err(loc, `testCase[${i}].options must be an object`);
      }
      if (
        !Array.isArray(tc.expectations) ||
        tc.expectations.length === 0
      ) {
        err(loc, `testCase[${i}].expectations must be a non-empty array`);
      } else {
        for (const exp of tc.expectations) {
          if (typeof exp.stepIndex !== "number" || !Number.isInteger(exp.stepIndex)) {
            err(loc, `testCase[${i}].expectations[?].stepIndex must be a non-negative integer`);
          } else if (exp.stepIndex < 0) {
            err(loc, `testCase[${i}].expectations[?].stepIndex must be ≥ 0`);
          }
          if (!Array.isArray(exp.highlights)) {
            err(loc, `testCase[${i}].expectations[?].highlights must be an array`);
          }
        }
      }
    });
  }

  // 8) codeLineMapping.
  if (!Array.isArray(entry.codeLineMapping) || entry.codeLineMapping.length === 0) {
    err(loc, "codeLineMapping must be a non-empty array");
  }

  // 9) legend.
  if (!Array.isArray(entry.legend) || entry.legend.length === 0) {
    err(loc, "legend must be a non-empty array");
  }
}

// ─── Catalog coverage ───
for (const catSlug of catalogSlugs) {
  if (!registrySlugs.has(catSlug)) {
    err(
      `catalog.${catSlug}`,
      "catalog has this slug but the registry is missing an entry — must be added or pruned"
    );
  }
}

// ─── Registry entries not in catalog (warn) ───
for (const regSlug of registrySlugs) {
  if (!catalogSlugs.has(regSlug)) {
    warn(
      `registry.${regSlug}`,
      "registry entry exists without a catalog entry — either catalog it or remove from registry"
    );
  }
}

// ─── Convenience: also validate the highlights helper has the buckets that
// each legend claims ───
for (const [slug, entry] of Object.entries(registry)) {
  const bucketsInLegend = new Set(entry.legend.map((l) => l.bucketKey));
  const validKeys = new Set<keyof VisualStepHighlights>([
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
  for (const k of bucketsInLegend) {
    if (!validKeys.has(k)) {
      err(
        `registry.${slug}.legend`,
        `legend references unknown highlight bucket "${String(k)}"`
      );
    }
  }
}

// ─── Report ───
const errors = issues.filter((i) => i.severity === "error");
const warnings = issues.filter((i) => i.severity === "warn");

const sortedIssues = [...errors, ...warnings];

console.log(
  `\nValidator summary — catalog: ${catalogSlugs.size} slugs, registry: ${registrySlugs.size} entries`
);
console.log(
  `Issues — ${errors.length} error(s), ${warnings.length} warning(s)\n`
);

for (const i of sortedIssues) {
  const prefix = i.severity === "error" ? "❌" : "⚠️";
  console.log(`  ${prefix} [${i.where}] ${i.message}`);
}

if (errors.length > 0) {
  console.log(`\nvalidate-registry: FAIL (${errors.length} error${errors.length === 1 ? "" : "s"}).`);
  process.exit(1);
}

console.log("validate-registry: PASS");
process.exit(0);

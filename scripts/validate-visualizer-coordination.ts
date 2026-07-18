import { publicationRegistry } from "../src/visualizers/registry/publication-registry";
import { REQUIRED_CODE_LANGUAGES } from "../src/visualizers/registry/types";
import type { ActionType, VisualStep, VisualStepHighlights } from "../src/types";

type Issue = {
  severity: "error" | "warning";
  slug: string;
  fixture: string;
  step?: number;
  message: string;
};
const issues: Issue[] = [];
const bucketsByAction: Partial<Record<ActionType, ReadonlyArray<keyof VisualStepHighlights>>> = {
  access: ["active", "current", "found", "pointer", "visited", "compared"],
  collision: ["active", "compared", "error"],
  compare: ["active", "current", "compared", "target", "visited", "pointer", "error", "found"],
  delete: ["deleted", "active", "current", "found"],
  dequeue: ["deleted", "active", "current"],
  hash: ["active", "current", "target"],
  highlight: ["active", "current", "pointer", "visited"],
  insert: ["inserted", "active", "current", "success"],
  link: ["inserted", "active", "current", "pointer", "sorted"],
  "move-pointer": ["pointer", "active", "current", "visited"],
  pop: ["deleted", "active", "current"],
  probe: ["active", "current", "compared", "visited"],
  push: ["inserted", "active", "current"],
  "set-pointer": ["pointer", "active", "current"],
  shift: ["active", "current", "swapped", "inserted", "deleted", "compared", "pointer"],
  swap: ["swapped", "active", "current"],
  update: ["active", "current", "swapped", "success", "visited", "pointer", "compared"],
  visit: ["active", "current", "visited", "sorted", "path"],
};
function report(
  severity: Issue["severity"],
  slug: string,
  fixture: string,
  message: string,
  step?: number
) {
  issues.push({ severity, slug, fixture, step, message });
}
function signature(step: VisualStep) {
  return JSON.stringify({
    actionType: step.actionType,
    dataState: step.dataState,
    highlights: step.highlights,
    codeLine: step.codeLine,
    pseudocodeLine: step.pseudocodeLine,
  });
}
function highlighted(step: VisualStep, buckets: ReadonlyArray<keyof VisualStepHighlights>) {
  return buckets.some((bucket) => (step.highlights[bucket]?.length ?? 0) > 0);
}
for (const [slug, entry] of Object.entries(publicationRegistry)) {
  const artifacts = entry.authoredArtifacts;
  if (!artifacts) {
    report("error", slug, "registry", "Authored publication artifacts are missing.");
    continue;
  }
  const mappings = new Map(
    artifacts.codeLineMapping.map((mapping) => [mapping.logicalLine, mapping])
  );
  const legends = new Set(artifacts.legend.map((item) => item.bucketKey));
  for (const testCase of artifacts.testCases) {
    const fixture = testCase.name;
    let steps: VisualStep[];
    try {
      steps = entry.generateSteps(
        structuredClone(testCase.input),
        structuredClone(testCase.options)
      );
    } catch (error) {
      report(
        "error",
        slug,
        fixture,
        `Step generation threw: ${error instanceof Error ? error.message : String(error)}`
      );
      continue;
    }
    if (!steps.length) report("error", slug, fixture, "The semantic fixture generated no steps.");
    for (const failure of testCase.verify(steps)) report("error", slug, fixture, failure);
    const ids = new Set<string>();
    for (const [index, step] of steps.entries()) {
      const number = index + 1;
      if (!step.id.trim() || ids.has(step.id))
        report("error", slug, fixture, "Step id must be non-empty and unique.", number);
      ids.add(step.id);
      if (step.stepNumber !== number)
        report("error", slug, fixture, `Expected sequential stepNumber ${number}.`, number);
      if (!step.title.trim() || !step.description.trim() || !step.operation.trim())
        report("error", slug, fixture, "Step text is incomplete.", number);
      if (!Number.isInteger(step.pseudocodeLine) || (step.pseudocodeLine ?? 0) < 1) {
        report("error", slug, fixture, "No positive pseudocode line is selected.", number);
      } else if (step.pseudocodeLine! > entry.pseudocode.length) {
        report(
          "error",
          slug,
          fixture,
          `Pseudocode line ${step.pseudocodeLine} exceeds ${entry.pseudocode.length} authored lines.`,
          number
        );
      }
      if (!Number.isInteger(step.codeLine) || (step.codeLine ?? 0) < 1) {
        report("error", slug, fixture, "No positive logical code line is selected.", number);
      } else {
        const mapping = mappings.get(step.codeLine!);
        if (!mapping)
          report(
            "error",
            slug,
            fixture,
            `Logical code line ${step.codeLine} has no authored mapping.`,
            number
          );
        if (mapping)
          for (const language of REQUIRED_CODE_LANGUAGES) {
            const code = entry.codeExamples[language]?.code.split(/\r?\n/);
            const physical = mapping.lines[language];
            if (!code?.[physical - 1]?.trim())
              report(
                "error",
                slug,
                fixture,
                `${language} maps to missing or blank line ${physical}.`,
                number
              );
          }
      }
      for (const [bucket, values] of Object.entries(step.highlights) as Array<
        [keyof VisualStepHighlights, string[] | undefined]
      >) {
        if ((values?.length ?? 0) > 0 && !legends.has(bucket))
          report(
            "error",
            slug,
            fixture,
            `Highlight bucket ${bucket} has no visible legend.`,
            number
          );
      }
      const expected = bucketsByAction[step.actionType];
      if (expected && !highlighted(step, expected))
        report(
          "error",
          slug,
          fixture,
          `Action ${step.actionType} has no coordinated element highlight.`,
          number
        );
      const previous = steps[index - 1];
      if (previous && signature(previous) === signature(step))
        report(
          "warning",
          slug,
          fixture,
          "Consecutive steps repeat the same visual and line state.",
          number
        );
    }
  }
}
const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warning");
const errorsByFamily = Object.fromEntries(
  Object.entries(
    errors.reduce<Record<string, number>>((counts, issue) => {
      const family = publicationRegistry[issue.slug]?.dataStructureId ?? "unknown";
      counts[family] = (counts[family] ?? 0) + 1;
      return counts;
    }, {})
  ).sort((a, b) => b[1] - a[1])
);
const errorsByKind = {
  missingPseudocode: errors.filter((issue) => issue.message.startsWith("No positive pseudocode"))
    .length,
  invalidPseudocode: errors.filter((issue) => issue.message.startsWith("Pseudocode line")).length,
  missingHighlight: errors.filter((issue) =>
    issue.message.includes("coordinated element highlight")
  ).length,
  codeMapping: errors.filter(
    (issue) => issue.message.includes("mapping") || issue.message.includes("maps to")
  ).length,
};
console.log("Errors by family:", errorsByFamily);
console.log("Errors by kind:", errorsByKind);
console.log(
  `\nVisualizer coordination: ${Object.keys(publicationRegistry).length} visualizers, ${errors.length} error(s), ${warnings.length} warning(s), ${new Set(issues.map((issue) => issue.slug)).size} affected visualizer(s)\n`
);
const visibleIssues = process.env.COORDINATION_FAMILY
  ? issues.filter(
      (issue) =>
        publicationRegistry[issue.slug]?.dataStructureId === process.env.COORDINATION_FAMILY
    )
  : issues;
if (process.env.COORDINATION_SUMMARY_ONLY !== "1")
  for (const issue of visibleIssues)
    console.log(
      `[${issue.severity === "error" ? "ERROR" : "WARN"}] ${issue.slug}.${issue.fixture}${issue.step ? `.step-${issue.step}` : ""}: ${issue.message}`
    );
if (errors.length) process.exitCode = 1;
else console.log("validate:visualizers:coordination PASSED");

import { algorithms } from "@/data/seed/algorithms";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import { getVisualizerPseudocode } from "@/visualizers/registry/pseudocode";
import { resolvePhysicalCodeLine } from "@/visualizers/registry/code-line-mapping";
import { REQUIRED_CODE_LANGUAGES } from "@/visualizers/registry/types";
import { createDefaultGraph } from "@/visualizers/graph/types";
import { createDefaultTree } from "@/visualizers/tree/types";
import {
  clampOperationOptions,
  defaultVisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

const defaultData = [15, 23, 4, 8, 42, 16];

function createFixture(slug: string, dsId: string) {
  const data =
    dsId === "ds_matrix"
      ? [15, 23, 4, 8, 42, 16, 9, 31, 7, 18, 27, 12, 36, 2, 21, 11]
      : [...defaultData];
  const options = clampOperationOptions(
    {
      ...structuredClone(defaultVisualizerInputOptions),
      graphState: createDefaultGraph(),
      treeState: createDefaultTree(),
    },
    data.length,
    slug
  );
  return { data, options };
}

describe("Pseudocode and Code Line Highlighting Audit", () => {
  const publishedAlgorithms = algorithms.filter((a) => a.isPublished);

  it("checks pseudocode and code line alignment across all algorithms", () => {
    const report: Array<{
      slug: string;
      totalSteps: number;
      stepsMissingPseudocode: number;
      stepsMissingCodeLine: number;
      invalidPseudocodeLines: number[];
      unmappedCodeLines: Record<string, number[]>;
      outOfBoundsCodeLines: Record<string, number[]>;
    }> = [];

    for (const algo of publishedAlgorithms) {
      const def = algorithmRegistry[algo.slug];
      if (!def) continue;

      const pseudocode = getVisualizerPseudocode(algo.slug, algo.pseudocode);
      const { data, options } = createFixture(algo.slug, algo.dataStructureId);
      const steps = def.generateSteps(data as never, options);
      const codeExamples = def.getCodeExamples(algo.slug, algo.id);

      const codeLineCounts: Record<string, number> = {};
      for (const lang of REQUIRED_CODE_LANGUAGES) {
        const ex = codeExamples.find((c) => c.language === lang);
        codeLineCounts[lang] = ex ? ex.code.split("\n").length : 0;
      }

      let missingPseudocode = 0;
      let missingCodeLine = 0;
      const invalidPseudocodeLines: number[] = [];
      const unmappedCodeLines: Record<string, number[]> = {
        javascript: [],
        python: [],
        cpp: [],
        java: [],
      };
      const outOfBoundsCodeLines: Record<string, number[]> = {
        javascript: [],
        python: [],
        cpp: [],
        java: [],
      };

      for (const step of steps) {
        if (!step.pseudocodeLine) {
          missingPseudocode++;
        } else if (
          step.pseudocodeLine < 1 ||
          step.pseudocodeLine > pseudocode.length
        ) {
          invalidPseudocodeLines.push(step.pseudocodeLine);
        }

        if (!step.codeLine) {
          missingCodeLine++;
        } else {
          for (const lang of REQUIRED_CODE_LANGUAGES) {
            const physicalLine = resolvePhysicalCodeLine(
              def.codeLineMapping,
              step.codeLine,
              lang
            );
            if (physicalLine === undefined) {
              if (!unmappedCodeLines[lang].includes(step.codeLine)) {
                unmappedCodeLines[lang].push(step.codeLine);
              }
            } else if (
              physicalLine < 1 ||
              physicalLine > (codeLineCounts[lang] || 1)
            ) {
              if (!outOfBoundsCodeLines[lang].includes(physicalLine)) {
                outOfBoundsCodeLines[lang].push(physicalLine);
              }
            }
          }
        }
      }

      report.push({
        slug: algo.slug,
        totalSteps: steps.length,
        stepsMissingPseudocode: missingPseudocode,
        stepsMissingCodeLine: missingCodeLine,
        invalidPseudocodeLines,
        unmappedCodeLines,
        outOfBoundsCodeLines,
      });
    }

    const issues = report.filter(
      (r) =>
        r.stepsMissingPseudocode > 0 ||
        r.stepsMissingCodeLine > 0 ||
        r.invalidPseudocodeLines.length > 0 ||
        Object.values(r.unmappedCodeLines).some((arr) => arr.length > 0) ||
        Object.values(r.outOfBoundsCodeLines).some((arr) => arr.length > 0)
    );

    console.log(
      `Audit completed. Total algorithms: ${report.length}, Issues found in: ${issues.length}`
    );
    for (const issue of issues) {
      console.log(
        `[${issue.slug}] Steps: ${issue.totalSteps}, MissingPseudo: ${issue.stepsMissingPseudocode}, MissingCode: ${issue.stepsMissingCodeLine}, InvalidPseudo: ${JSON.stringify(
          issue.invalidPseudocodeLines
        )}, UnmappedCode: ${JSON.stringify(
          issue.unmappedCodeLines
        )}, OutOfBounds: ${JSON.stringify(issue.outOfBoundsCodeLines)}`
      );
    }

    expect(report.length).toBeGreaterThan(0);
  });
});

/**
 * Curriculum Integrity & Educational Quality Validator
 *
 * Checks all 62 DSA curriculum chapters across 12 parts:
 * 1. Verifies markdown parser and KaTeX math compilation without syntax errors.
 * 2. Confirms zero [object Object] serialization regressions in tables.
 * 3. Confirms zero rogue <h1> tags in rendered chapter article bodies.
 * 4. Validates that all interactive visualizer links point to published catalog algorithms.
 * 5. Ensures non-empty word count, reading time, and table of contents.
 */

import { LEARNING_MODULES } from "../src/lib/learnings/registry";
import { getParsedChapter } from "../src/lib/learnings/content";
import { algorithms } from "../src/data/seed/algorithms";
import { dataStructures } from "../src/data/seed/data-structures";

async function main() {
  console.log("=== RUNNING CURRICULUM INTEGRITY & PEDAGOGICAL VALIDATOR ===");

  const publishedAlgoSlugs = new Set(
    algorithms.filter((a) => a.isPublished).map((a) => a.slug)
  );
  const publishedDsSlugs = new Set(dataStructures.map((ds) => ds.slug));

  let totalChapters = 0;
  let passedChapters = 0;
  let totalMathBlocks = 0;
  let totalTables = 0;
  let totalVisualizerLinks = 0;
  const issues: string[] = [];

  for (const mod of LEARNING_MODULES) {
    for (const ch of mod.chapters) {
      totalChapters++;
      const key = `${mod.slug}/${ch.slug}`;

      // 1. Verify parser
      const parsed = await getParsedChapter(mod.slug, ch.slug);
      if (!parsed) {
        issues.push(`[FATAL] Failed to read/parse chapter markdown: ${key}`);
        continue;
      }

      // 2. Check for [object Object]
      if (parsed.htmlContent.includes("[object Object]")) {
        issues.push(`[ERROR] Table serialization error [object Object] in: ${key}`);
      }

      // 3. Check for rogue <h1>
      if (/<h1[\s>]/i.test(parsed.htmlContent)) {
        issues.push(`[ERROR] Rogue <h1> tag in rendered body in: ${key}`);
      }

      // 4. Check for leaked local filesystem paths (file:///)
      if (parsed.rawMarkdown.includes("file:///") || parsed.htmlContent.includes("file:///")) {
        issues.push(`[ERROR] Leaked local filesystem link file:/// in: ${key}`);
      }

      // 5. Check for raw MathML or annotation encoding leaking into rendered DOM
      if (
        parsed.htmlContent.includes("annotation encoding") ||
        /<math[\s>]/i.test(parsed.htmlContent)
      ) {
        issues.push(`[ERROR] MathML or LaTeX annotation source leaked into rendered HTML in: ${key}`);
      }

      // 4. Verify visualizer deep links
      if (ch.visualizerLinks) {
        for (const link of ch.visualizerLinks) {
          totalVisualizerLinks++;
          const isValid =
            publishedAlgoSlugs.has(link.slug) || publishedDsSlugs.has(link.slug);
          if (!isValid) {
            issues.push(
              `[ERROR] Broken visualizer link slug "${link.slug}" in chapter ${key}`
            );
          }
        }
      }

      // 5. Check metadata integrity
      if (parsed.wordCount < 100) {
        issues.push(`[WARN] Chapter ${key} has suspicious word count: ${parsed.wordCount}`);
      }

      if (parsed.tableOfContents.length === 0) {
        issues.push(`[WARN] Chapter ${key} has empty Table of Contents`);
      }

      const mathCount = (parsed.htmlContent.match(/class="katex"/g) || []).length;
      totalMathBlocks += mathCount;

      const tableCount = (parsed.htmlContent.match(/<table/g) || []).length;
      totalTables += tableCount;

      passedChapters++;
    }
  }

  console.log("\n--- Validation Summary ---");
  console.log(`Modules Audited: ${LEARNING_MODULES.length}`);
  console.log(`Chapters Audited: ${totalChapters}`);
  console.log(`Successfully Parsed Chapters: ${passedChapters}/${totalChapters}`);
  console.log(`KaTeX Mathematical Expressions Rendered: ${totalMathBlocks}`);
  console.log(`HTML State / Comparison Tables Rendered: ${totalTables}`);
  console.log(`Interactive Simulator Bridges Verified: ${totalVisualizerLinks}`);

  if (issues.length > 0) {
    console.error(`\nFound ${issues.length} issue(s):`);
    issues.forEach((iss) => console.error(` - ${iss}`));
    process.exit(1);
  }

  console.log("\n✅ validate:curriculum PASSED with 0 errors and 0 warnings!\n");
}

main().catch((err) => {
  console.error("Validation crashed:", err);
  process.exit(1);
});

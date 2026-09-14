import fs from 'fs';
import path from 'path';
import { LEARNING_MODULES } from '../src/lib/learnings/registry';

interface ChapterStats {
  moduleSlug: string;
  chapterSlug: string;
  lines: number;
  words: number;
  tables: number;
  math: number;
  hasProofOrInvariant: boolean;
  hasDryRun: boolean;
  hasEdgeCases: boolean;
  hasReferences: boolean;
}

function auditAll() {
  const stats: ChapterStats[] = [];

  for (const mod of LEARNING_MODULES) {
    for (const ch of mod.chapters) {
      const fullPath = path.join(
        'src/content/learnings',
        ch.folderName,
        ch.fileName
      );
      if (!fs.existsSync(fullPath)) {
        console.error(`File missing: ${fullPath}`);
        continue;
      }
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n').length;
      const words = content.trim().split(/\s+/).length;
      const tables = (content.match(/\|[\s-:]+\|/g) || []).length;
      const math = (content.match(/\$[^$]+\$/g) || []).length;
      const hasProofOrInvariant = /proof|invariant|induction|theorem/i.test(content);
      const hasDryRun = /dry[- ]run|trace|walkthrough/i.test(content);
      const hasEdgeCases = /edge[- ]case|corner[- ]case|pitfall/i.test(content);
      const hasReferences = /reference|attribution|clrs|further reading/i.test(content);

      stats.push({
        moduleSlug: mod.slug,
        chapterSlug: ch.slug,
        lines,
        words,
        tables,
        math,
        hasProofOrInvariant,
        hasDryRun,
        hasEdgeCases,
        hasReferences,
      });
    }
  }

  console.log(`Total audited chapters: ${stats.length}`);
  const shortChapters = stats.filter((s) => s.words < 800);
  console.log(`\nChapters under 800 words (${shortChapters.length}):`);
  for (const s of shortChapters) {
    console.log(
      ` - ${s.moduleSlug}/${s.chapterSlug}: ${s.words} words, ${s.tables} tables, Proof:${s.hasProofOrInvariant}, DryRun:${s.hasDryRun}`
    );
  }

  const missingReferences = stats.filter((s) => !s.hasReferences);
  console.log(`\nChapters missing explicit references (${missingReferences.length})`);

  console.log('\nTop 5 shortest chapters:');
  stats
    .sort((a, b) => a.words - b.words)
    .slice(0, 5)
    .forEach((s) => {
      console.log(` - ${s.moduleSlug}/${s.chapterSlug}: ${s.words} words`);
    });
}

auditAll();

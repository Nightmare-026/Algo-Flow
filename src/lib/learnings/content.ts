import fs from "fs/promises";
import path from "path";
import { Marked } from "marked";
import { getChapterBySlugs } from "./registry";
import type { ParsedChapterContent, TableOfContentsItem } from "./types";

/**
 * Generates an accessible, clean slug for heading IDs.
 */
export function slugifyHeading(text: string): string {
  const plainText = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]*>/g, "");

  return plainText
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Extracts Table of Contents from markdown lines (H2 and H3).
 */
export function extractTableOfContents(markdown: string): TableOfContentsItem[] {
  const items: TableOfContentsItem[] = [];
  const slugCounts = new Map<string, number>();
  const lines = markdown.split("\n");

  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h2Match) {
      const title = h2Match[1].trim();
      let slug = slugifyHeading(title);
      if (!slug) slug = "section";
      const count = slugCounts.get(slug) || 0;
      slugCounts.set(slug, count + 1);
      const uniqueId = count === 0 ? slug : `${slug}-${count}`;
      items.push({ id: uniqueId, title, level: 2 });
    } else if (h3Match) {
      const title = h3Match[1].trim();
      let slug = slugifyHeading(title);
      if (!slug) slug = "subsection";
      const count = slugCounts.get(slug) || 0;
      slugCounts.set(slug, count + 1);
      const uniqueId = count === 0 ? slug : `${slug}-${count}`;
      items.push({ id: uniqueId, title, level: 3 });
    }
  }

  return items;
}

/**
 * Server-side loader and parser for chapter content.
 */
export async function getParsedChapter(
  moduleSlug: string,
  chapterSlug: string
): Promise<ParsedChapterContent | null> {
  const resolved = getChapterBySlugs(moduleSlug, chapterSlug);
  if (!resolved) return null;

  const { chapter } = resolved;
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "learnings",
    chapter.folderName,
    chapter.fileName
  );

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Remove leading H1 if present to avoid duplication with page hero header
    const cleanedMarkdown = fileContent.replace(/^#\s+[^\n]+\n+/, "");

    // Extract Table of Contents
    const tableOfContents = extractTableOfContents(cleanedMarkdown);

    // Track heading counts during marked rendering to match TOC IDs
    const renderSlugCounts = new Map<string, number>();

    const marked = new Marked();
    marked.use({
      renderer: {
        heading({ tokens, depth, text }) {
          const rawText = text || "";
          let slug = slugifyHeading(rawText);
          if (!slug) slug = depth === 2 ? "section" : "heading";

          const count = renderSlugCounts.get(slug) || 0;
          renderSlugCounts.set(slug, count + 1);
          const uniqueId = count === 0 ? slug : `${slug}-${count}`;

          const inlineHtml = this.parser.parseInline(tokens);

          if (depth === 2) {
            return `<div class="group scroll-mt-24 mt-12 mb-5 pb-2 border-b border-border/60 flex items-center justify-between"><h2 id="${uniqueId}" class="font-extrabold text-2xl text-foreground tracking-tight m-0">${inlineHtml}</h2><a href="#${uniqueId}" class="text-xs text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity ml-2 font-mono px-2 py-1 rounded hover:bg-surface-raised" aria-label="Permalink to section">#</a></div>\n`;
          }

          if (depth === 3) {
            const lower = rawText.toLowerCase();

            // Pedagogical callout header transformations
            if (rawText.includes("💡") || lower.includes("concept")) {
              return `<div class="callout-heading callout-concept scroll-mt-28 mt-8 mb-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between"><div class="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400"><span class="text-lg">💡</span><h3 id="${uniqueId}" class="text-sm md:text-base font-bold m-0 p-0 text-emerald-700 dark:text-emerald-400">${inlineHtml}</h3></div><a href="#${uniqueId}" class="text-xs text-emerald-500/50 hover:text-emerald-500 font-mono px-1">#</a></div>\n`;
            }

            if (rawText.includes("🧠") || lower.includes("intuition")) {
              return `<div class="callout-heading callout-intuition scroll-mt-28 mt-8 mb-3 p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-between"><div class="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-400"><span class="text-lg">🧠</span><h3 id="${uniqueId}" class="text-sm md:text-base font-bold m-0 p-0 text-indigo-700 dark:text-indigo-400">${inlineHtml}</h3></div><a href="#${uniqueId}" class="text-xs text-indigo-500/50 hover:text-indigo-500 font-mono px-1">#</a></div>\n`;
            }

            if (
              rawText.includes("⚠️") ||
              lower.includes("pitfall") ||
              lower.includes("edge case") ||
              lower.includes("warning")
            ) {
              return `<div class="callout-heading callout-warning scroll-mt-28 mt-8 mb-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between"><div class="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400"><span class="text-lg">⚠️</span><h3 id="${uniqueId}" class="text-sm md:text-base font-bold m-0 p-0 text-amber-700 dark:text-amber-400">${inlineHtml}</h3></div><a href="#${uniqueId}" class="text-xs text-amber-500/50 hover:text-amber-500 font-mono px-1">#</a></div>\n`;
            }

            if (
              rawText.includes("⚙️") ||
              lower.includes("memory") ||
              lower.includes("hardware") ||
              lower.includes("layout")
            ) {
              return `<div class="callout-heading callout-memory scroll-mt-28 mt-8 mb-3 p-3 rounded-xl border border-sky-500/30 bg-sky-500/10 flex items-center justify-between"><div class="flex items-center gap-2 font-bold text-sky-700 dark:text-sky-400"><span class="text-lg">⚙️</span><h3 id="${uniqueId}" class="text-sm md:text-base font-bold m-0 p-0 text-sky-700 dark:text-sky-400">${inlineHtml}</h3></div><a href="#${uniqueId}" class="text-xs text-sky-500/50 hover:text-sky-500 font-mono px-1">#</a></div>\n`;
            }

            return `<div class="group scroll-mt-28 mt-7 mb-3 flex items-center justify-between"><h3 id="${uniqueId}" class="font-bold text-lg text-foreground m-0">${inlineHtml}</h3><a href="#${uniqueId}" class="text-xs text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity ml-2 font-mono px-2 py-0.5 rounded hover:bg-surface-raised" aria-label="Permalink to section">#</a></div>\n`;
          }

          if (depth === 4) {
            return `<h4 id="${uniqueId}" class="scroll-mt-28 font-semibold text-base mt-6 mb-2 text-foreground/90">${inlineHtml}</h4>\n`;
          }

          return `<h${depth} id="${uniqueId}" class="scroll-mt-28 font-semibold mt-4 mb-2 text-foreground">${inlineHtml}</h${depth}>\n`;
        },
        table({ header, rows }) {
          return `<div class="overflow-x-auto my-6 rounded-2xl border border-border neu-inset p-1"><table class="w-full text-left text-sm border-collapse">${header}${rows}</table></div>`;
        },
        blockquote({ tokens }) {
          const body = this.parser.parse(tokens);
          return `<blockquote class="border-l-4 border-primary pl-4 py-2 my-5 text-foreground/90 bg-surface-raised/40 rounded-r-xl font-medium">${body}</blockquote>`;
        },
        code({ text, lang }) {
          const language = lang || "text";
          const isAsciiDiagram =
            language === "text" &&
            (text.includes("┌") ||
              text.includes("╔") ||
              text.includes("───") ||
              text.includes("|") ||
              text.includes("RAM") ||
              text.includes("HEAP") ||
              text.includes("STACK"));

          const escaped = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

          return `<div class="code-block-wrapper relative my-6 rounded-2xl overflow-hidden border border-border/80 bg-surface/90 neu-raised group"><div class="flex items-center justify-between px-4 py-2.5 bg-surface-raised/80 border-b border-border/60 text-xs font-mono text-muted-foreground"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-red-500/60 inline-block"></span><span class="w-2.5 h-2.5 rounded-full bg-yellow-500/60 inline-block"></span><span class="w-2.5 h-2.5 rounded-full bg-green-500/60 inline-block"></span><span class="ml-2 font-semibold text-foreground/80">${language}</span>${isAsciiDiagram ? '<span class="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-sans font-bold uppercase tracking-wider">Physical Memory Layout</span>' : ""}</div><button onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').innerText); this.innerText='Copied!'; setTimeout(() => this.innerText='Copy', 2000)" class="text-[11px] font-sans font-medium px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-raised text-foreground/70 hover:text-foreground transition-all cursor-pointer">Copy</button></div><pre class="p-4 md:p-5 text-xs md:text-sm font-mono overflow-x-auto leading-relaxed text-foreground/90 bg-background/50"><code>${escaped}</code></pre></div>`;
        },
      },
    });

    const htmlContent = await marked.parse(cleanedMarkdown);

    // Compute metrics
    const words = fileContent.trim().split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return {
      rawMarkdown: fileContent,
      htmlContent,
      tableOfContents,
      readingTimeMinutes,
      wordCount: words,
    };
  } catch (error) {
    console.error(`Failed to read or parse chapter markdown at ${filePath}:`, error);
    return null;
  }
}

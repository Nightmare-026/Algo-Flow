"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  LearningChapter,
  LearningModule,
  ChapterNavigation,
  ParsedChapterContent,
} from "@/lib/learnings/types";
import {
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  CheckCircle2,
  Compass,
  ArrowRight,
  BookOpen,
  Type,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompletedChapters } from "@/lib/learnings/progress";

interface ChapterReaderProps {
  module: LearningModule;
  chapter: LearningChapter;
  content: ParsedChapterContent;
  navigation: ChapterNavigation;
}

export function ChapterReader({ module, chapter, content, navigation }: ChapterReaderProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<"standard" | "large">("standard");

  const chapterKey = `${module.slug}/${chapter.slug}`;
  const { isCompleted: checkCompleted, toggleCompleted: toggleKey } = useCompletedChapters();
  const isCompleted = checkCompleted(chapterKey);
  const toggleCompleted = () => toggleKey(chapterKey);

  // Keyboard navigation shortcuts: [ for prev, ] for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(targetTag)) return;

      if (e.key === "[" && navigation.previous) {
        e.preventDefault();
        router.push(
          `/learnings/${navigation.previous.moduleSlug}/${navigation.previous.chapterSlug}`
        );
      } else if (e.key === "]" && navigation.next) {
        e.preventDefault();
        router.push(`/learnings/${navigation.next.moduleSlug}/${navigation.next.chapterSlug}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigation, router]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDifficulty = (partNumber: number) => {
    if (partNumber <= 1)
      return { label: "Foundational", color: "text-emerald-500 bg-emerald-500/10" };
    if (partNumber <= 5) return { label: "Core DSA", color: "text-sky-500 bg-sky-500/10" };
    if (partNumber <= 8)
      return { label: "Intermediate", color: "text-indigo-500 bg-indigo-500/10" };
    return { label: "Advanced", color: "text-purple-500 bg-purple-500/10" };
  };

  const difficulty = getDifficulty(module.partNumber);

  return (
    <article
      className={cn(
        "min-w-0 pb-16 transition-all duration-200",
        fontSize === "large" ? "text-lg" : "text-base"
      )}
    >
      {/* Top Header Card */}
      <header className="rounded-2xl border border-border/60 bg-surface-inset/40 p-5 sm:p-7 mb-8 neu-inset">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm text-muted-foreground pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 font-medium flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-xs">
              Part {module.partNumber.toString().padStart(2, "0")}
            </span>
            <span className="text-border">•</span>
            <span>
              Chapter {chapter.order} of {module.chapters.length}
            </span>
            <span className="text-border">•</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${difficulty.color}`}
            >
              {difficulty.label}
            </span>
          </div>

          {/* Reading Actions: Mark Completed, Font Size, Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCompleted}
              aria-label={isCompleted ? "Mark as incomplete" : "Mark chapter as completed"}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs",
                isCompleted
                  ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20"
                  : "border border-border bg-surface hover:bg-surface-raised text-muted-foreground hover:text-foreground"
              )}
            >
              <CheckCircle2
                className={cn("w-3.5 h-3.5", isCompleted ? "text-white" : "text-primary")}
              />
              <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
            </button>

            <button
              onClick={() => setFontSize((prev) => (prev === "standard" ? "large" : "standard"))}
              title="Toggle text size"
              aria-label="Toggle text size"
              className="inline-flex items-center p-1.5 rounded-xl border border-border bg-surface hover:bg-surface-raised text-xs font-medium text-foreground transition-colors shadow-xs cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button
              onClick={handleCopyLink}
              aria-label="Copy chapter link"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-raised text-xs font-medium text-foreground transition-colors shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mt-5 mb-3">
          {chapter.title}
        </h1>

        <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
          {chapter.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/30">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>~{content.readingTimeMinutes} min read</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>{content.wordCount.toLocaleString()} words</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>{content.tableOfContents.length} Sections</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Academic Syllabus &bull; Verified 2026</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/70 hidden sm:flex">
            <span>
              Keys:{" "}
              <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[10px]">
                [
              </kbd>{" "}
              Prev &bull;{" "}
              <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[10px]">
                ]
              </kbd>{" "}
              Next
            </span>
          </div>
        </div>

        {/* Topics covered chips */}
        {chapter.topicsCovered && chapter.topicsCovered.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/30">
            {chapter.topicsCovered.map((topic, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-xs rounded-md bg-surface text-foreground/80 font-mono border border-border/50"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Visualizer Deep Links Callout (Accurate /visualizer/[slug] singular links) */}
      {chapter.visualizerLinks && chapter.visualizerLinks.length > 0 && (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 md:p-6 mb-8 neu-raised">
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
            <Compass className="w-5 h-5 animate-spin-slow" />
            <span>Interactive Simulator Available</span>
          </div>
          <p className="text-xs md:text-sm text-foreground/90 mb-4">
            Reinforce your mental model: run, pause, and inspect live pointers with our interactive
            visualizer:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {chapter.visualizerLinks.map((link) => (
              <Link
                key={link.slug}
                href={`/visualizer/${link.slug}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-primary/20 bg-surface hover:bg-surface-raised transition-all group neu-raised"
              >
                <div className="pr-2">
                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {link.title}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {link.description}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Chapter Content with KaTeX Math & Clean Marked HTML */}
      <div
        className="prose-learnings max-w-none"
        dangerouslySetInnerHTML={{ __html: content.htmlContent }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const btn = target.closest<HTMLButtonElement>("[data-copy-btn]");
          if (btn) {
            const wrapper = btn.closest(".code-block-wrapper");
            const codeEl = wrapper?.querySelector("code");
            if (codeEl) {
              navigator.clipboard.writeText(codeEl.innerText);
              btn.innerText = "Copied!";
              setTimeout(() => {
                btn.innerText = "Copy";
              }, 2000);
            }
          }
        }}
      />

      {/* Chapter Bottom Navigation */}
      <nav
        aria-label="Chapter pagination"
        className="flex flex-col gap-5 mt-16 pt-8 border-t border-border/80"
      >
        {/* Completion Prompt Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-border/70 bg-surface-inset/30 neu-inset">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-primary/10 text-primary"
              )}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {isCompleted ? "Chapter marked as completed!" : "Finished reading this chapter?"}
              </div>
              <div className="text-xs text-muted-foreground">
                Keep track of your study streak across all 62 modules.
              </div>
            </div>
          </div>

          <button
            onClick={toggleCompleted}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-xs",
              isCompleted
                ? "bg-surface border border-border text-muted-foreground hover:text-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary-hover shadow-primary/20"
            )}
          >
            {isCompleted ? "Mark Incomplete" : "Mark as Completed"}
          </button>
        </div>

        {/* Previous / Next Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {navigation.previous ? (
            <Link
              href={`/learnings/${navigation.previous.moduleSlug}/${navigation.previous.chapterSlug}`}
              className="flex items-center gap-3 p-4 rounded-2xl border border-border/80 bg-surface hover:bg-surface-raised transition-all group neu-raised text-left"
            >
              <ChevronLeft className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:-translate-x-1" />
              <div className="overflow-hidden">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <span>Previous Chapter</span>
                  <span
                    className="px-1.5 py-0.5 rounded bg-surface-inset text-[9px] border border-border font-mono text-muted-foreground/80 inline-flex items-center select-none"
                    aria-hidden="true"
                  >
                    Key: [
                  </span>
                </div>
                <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors mt-0.5">
                  {navigation.previous.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {navigation.next ? (
            <Link
              href={`/learnings/${navigation.next.moduleSlug}/${navigation.next.chapterSlug}`}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-border/80 bg-surface hover:bg-surface-raised transition-all group neu-raised text-right sm:col-start-2"
            >
              <div className="overflow-hidden">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-end gap-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded bg-surface-inset text-[9px] border border-border font-mono text-muted-foreground/80 inline-flex items-center select-none"
                    aria-hidden="true"
                  >
                    Key: ]
                  </span>
                  <span>Next Chapter</span>
                </div>
                <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors mt-0.5">
                  {navigation.next.title}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Back to Module Syllabus Button */}
        <div className="text-center pt-2">
          <Link
            href={`/learnings/${module.slug}`}
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr; View Full {module.title} Syllabus</span>
          </Link>
        </div>
      </nav>
    </article>
  );
}

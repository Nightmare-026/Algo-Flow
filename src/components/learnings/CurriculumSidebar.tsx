"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { LearningModule } from "@/lib/learnings/types";
import {
  ChevronDown,
  Search,
  BookOpen,
  X,
  Compass,
  CheckCircle2,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompletedChapters } from "@/lib/learnings/progress";

interface CurriculumSidebarProps {
  modules: LearningModule[];
  currentModuleSlug: string;
  currentChapterSlug: string;
  className?: string;
  onNavigate?: () => void;
}

export function CurriculumSidebar({
  modules,
  currentModuleSlug,
  currentChapterSlug,
  className,
  onNavigate,
}: CurriculumSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { completedSet: completedChapters } = useCompletedChapters();
  const activeChapterRef = useRef<HTMLAnchorElement | null>(null);

  // Initialize with current module open
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => ({
    [currentModuleSlug]: true,
  }));

  // Ensure current module is opened whenever currentModuleSlug changes
  useEffect(() => {
    if (currentModuleSlug) {
      setOpenModules((prev) => ({
        ...prev,
        [currentModuleSlug]: true,
      }));
    }
  }, [currentModuleSlug]);

  // Auto-scroll active chapter into view smoothly
  useEffect(() => {
    if (activeChapterRef.current) {
      activeChapterRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [currentChapterSlug]);

  const toggleModule = useCallback((slug: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  }, []);

  // Filter modules and chapters based on query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;

    const q = searchQuery.toLowerCase().trim();
    return modules
      .map((mod) => {
        const matchingChapters = mod.chapters.filter(
          (ch) =>
            ch.title.toLowerCase().includes(q) ||
            ch.description.toLowerCase().includes(q) ||
            ch.topicsCovered.some((t) => t.toLowerCase().includes(q))
        );

        if (mod.title.toLowerCase().includes(q) || mod.shortDescription.toLowerCase().includes(q)) {
          return mod;
        }

        if (matchingChapters.length > 0) {
          return {
            ...mod,
            chapters: matchingChapters,
          };
        }

        return null;
      })
      .filter((m): m is LearningModule => m !== null);
  }, [modules, searchQuery]);

  // Total and matching counts
  const totalChaptersCount = useMemo(
    () => modules.reduce((acc, m) => acc + m.chapters.length, 0),
    [modules]
  );

  const matchingChaptersCount = useMemo(
    () => filteredModules.reduce((acc, m) => acc + m.chapters.length, 0),
    [filteredModules]
  );

  const completedCount = completedChapters.size;
  const completedPercent = totalChaptersCount > 0
    ? Math.round((completedCount / totalChaptersCount) * 100)
    : 0;

  // Check if all visible modules are expanded
  const areAllExpanded = useMemo(() => {
    if (filteredModules.length === 0) return false;
    return filteredModules.every((mod) => !!openModules[mod.slug]);
  }, [filteredModules, openModules]);

  const toggleExpandAll = () => {
    if (areAllExpanded) {
      // Collapse all except current active module
      setOpenModules({ [currentModuleSlug]: true });
    } else {
      // Expand all modules in view
      const nextState: Record<string, boolean> = {};
      modules.forEach((mod) => {
        nextState[mod.slug] = true;
      });
      setOpenModules(nextState);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <nav
      aria-label="Curriculum Navigation"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-surface/95 shadow-[var(--shadow-raised)] p-3 h-full overflow-hidden transition-colors",
        className
      )}
    >
      {/* Curriculum Header */}
      <div className="flex flex-col pb-2.5 border-b border-border/60 shrink-0 gap-1.5 mb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-primary/10 text-primary shrink-0">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Curriculum
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/80">
                (12 Parts)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Expand / Collapse All Button */}
            <button
              type="button"
              onClick={toggleExpandAll}
              className="flex items-center gap-1 px-1.5 py-1 rounded-md border border-border/60 bg-surface hover:bg-surface-raised text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer select-none"
              title={areAllExpanded ? "Collapse all modules" : "Expand all modules"}
              aria-label={areAllExpanded ? "Collapse all modules" : "Expand all modules"}
            >
              <ChevronsUpDown className="w-3 h-3 text-primary shrink-0" />
              <span className="hidden sm:inline text-[10px]">
                {areAllExpanded ? "Collapse" : "Expand"}
              </span>
            </button>

            {/* Overall Progress Count */}
            <div
              className="flex items-center gap-0.5 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-surface-inset text-muted-foreground border border-border/40"
              title={`${completedCount} of ${totalChaptersCount} chapters completed (${completedPercent}%)`}
            >
              {completedCount > 0 ? (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {completedCount}
                  </span>
                  <span className="text-muted-foreground/60">/{totalChaptersCount}</span>
                </>
              ) : (
                <span>{totalChaptersCount} Ch</span>
              )}
            </div>
          </div>
        </div>

        {/* Subtle Progress Bar if any chapters are completed */}
        {completedCount > 0 && (
          <div
            className="w-full bg-surface-inset rounded-full h-1 overflow-hidden"
            title={`${completedPercent}% curriculum completed`}
          >
            <div
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="relative mb-2 shrink-0">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleClearSearch();
          }}
          placeholder="Filter chapters & topics..."
          aria-label="Filter chapters & topics"
          className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-border/80 bg-surface-inset text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/60 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear filter query"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-raised cursor-pointer transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Search results status message */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground px-1 mb-2 shrink-0">
          <span>
            {matchingChaptersCount} {matchingChaptersCount === 1 ? "chapter" : "chapters"} found
          </span>
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-primary hover:underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {/* Modules & Chapters Accordion Tree */}
      <ol
        role="list"
        aria-label="Curriculum Modules"
        className="flex flex-col gap-1.5 flex-1 overflow-y-auto min-h-0 pr-0.5 custom-scrollbar"
      >
        {filteredModules.length === 0 ? (
          <li role="listitem" className="text-center py-8 px-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">No matching chapters</p>
            <p className="text-[11px] mb-3">Try a different keyword or concept</p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface-raised text-xs text-primary font-medium hover:bg-surface transition-colors cursor-pointer"
            >
              Clear filter
            </button>
          </li>
        ) : (
          filteredModules.map((mod) => {
            const isCurrentModule = mod.slug === currentModuleSlug;
            const isOpen = searchQuery.trim() ? true : !!openModules[mod.slug];

            // Count module completed chapters
            const modCompletedCount = mod.chapters.filter((ch) =>
              completedChapters.has(`${mod.slug}/${ch.slug}`)
            ).length;
            const isModComplete =
              mod.chapters.length > 0 && modCompletedCount === mod.chapters.length;

            return (
              <li
                key={mod.id}
                role="listitem"
                className={cn(
                  "rounded-xl border transition-all duration-200 overflow-hidden",
                  isCurrentModule
                    ? "border-primary/40 bg-surface shadow-xs ring-1 ring-primary/15"
                    : "border-border/60 bg-surface/60 hover:bg-surface hover:border-border"
                )}
              >
                {/* Module Accordion Header Button */}
                <button
                  type="button"
                  id={`mod-header-${mod.slug}`}
                  aria-expanded={isOpen}
                  aria-controls={`mod-chapters-${mod.slug}`}
                  onClick={() => toggleModule(mod.slug)}
                  title={`Part ${mod.partNumber.toString().padStart(2, "0")}: ${mod.title}`}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 p-2 text-left text-xs transition-colors cursor-pointer select-none group",
                    isCurrentModule
                      ? "bg-primary/[0.05] text-primary"
                      : "text-foreground hover:bg-surface-raised/80"
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight shrink-0 transition-colors",
                        isCurrentModule
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-surface-inset text-muted-foreground/90 border border-border/50 group-hover:text-foreground"
                      )}
                    >
                      P{mod.partNumber.toString().padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "truncate text-xs font-semibold leading-tight",
                        isCurrentModule ? "text-primary font-bold" : "text-foreground/90 group-hover:text-foreground"
                      )}
                    >
                      {mod.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                    {isModComplete ? (
                      <span
                        title={`All ${mod.chapters.length} chapters completed`}
                        className="flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {mod.chapters.length}
                      </span>
                    ) : modCompletedCount > 0 ? (
                      <span
                        title={`${modCompletedCount} of ${mod.chapters.length} chapters completed`}
                        className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full"
                      >
                        {modCompletedCount}/{mod.chapters.length}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground/70 bg-surface-inset/80 px-1.5 py-0.5 rounded border border-border/40">
                        {mod.chapters.length} ch
                      </span>
                    )}

                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
                        isOpen ? "rotate-0" : "-rotate-90"
                      )}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {/* Module Chapters Tree List */}
                {isOpen && (
                  <ol
                    id={`mod-chapters-${mod.slug}`}
                    role="list"
                    aria-labelledby={`mod-header-${mod.slug}`}
                    className="relative pl-3 pr-1.5 py-1.5 flex flex-col gap-0.5 border-t border-border/40 bg-surface-inset/30"
                  >
                    {/* Visual Vertical Tree Guide Rail */}
                    <div
                      className="absolute left-[18px] top-2 bottom-2 w-px bg-border/70 pointer-events-none"
                      aria-hidden="true"
                    />

                    {mod.chapters.map((ch) => {
                      const isCurrentChapter = isCurrentModule && ch.slug === currentChapterSlug;
                      const isDone = completedChapters.has(`${mod.slug}/${ch.slug}`);
                      const hasVisualizer = ch.visualizerLinks && ch.visualizerLinks.length > 0;

                      return (
                        <li key={ch.slug} role="listitem">
                          <Link
                            ref={isCurrentChapter ? activeChapterRef : null}
                            href={`/learnings/${mod.slug}/${ch.slug}`}
                            onClick={onNavigate}
                            itemProp="url"
                            aria-current={isCurrentChapter ? "page" : undefined}
                            title={`${ch.order.toString().padStart(2, "0")}. ${ch.title}`}
                            className={cn(
                              "group relative flex items-center gap-2 py-1.5 pl-4 pr-2 rounded-lg text-xs transition-all",
                              isCurrentChapter
                                ? "bg-primary/10 text-primary font-semibold shadow-2xs ring-1 ring-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-surface-raised/75"
                            )}
                          >
                            {/* Active Indicator on Tree Rail */}
                            {isCurrentChapter && (
                              <span
                                className="absolute left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-3.5 rounded-full bg-primary"
                                aria-hidden="true"
                              />
                            )}

                            {/* Status Icon or Order Number */}
                            {isDone ? (
                              <CheckCircle2
                                className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                                aria-label="Completed"
                              />
                            ) : (
                              <span
                                className={cn(
                                  "font-mono text-[10px] shrink-0 w-3.5 text-left",
                                  isCurrentChapter ? "text-primary font-bold" : "text-muted-foreground/60"
                                )}
                              >
                                {ch.order.toString().padStart(2, "0")}
                              </span>
                            )}

                            {/* Chapter Title */}
                            <span
                              itemProp="name"
                              className={cn(
                                "truncate flex-1 font-medium",
                                isCurrentChapter && "font-semibold text-primary",
                                isDone && !isCurrentChapter && "text-foreground/80"
                              )}
                            >
                              {ch.title}
                            </span>

                            {/* Visualizer Badge */}
                            {hasVisualizer && (
                              <span
                                title="Interactive Visualizer available"
                                className={cn(
                                  "inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-mono shrink-0 transition-opacity",
                                  isCurrentChapter
                                    ? "bg-primary/20 text-primary font-bold"
                                    : "bg-primary/10 text-primary/80 group-hover:text-primary group-hover:bg-primary/15"
                                )}
                              >
                                <Compass className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </li>
            );
          })
        )}
      </ol>
    </nav>
  );
}


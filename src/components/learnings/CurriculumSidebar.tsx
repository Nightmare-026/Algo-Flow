"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { LearningModule, TableOfContentsItem } from "@/lib/learnings/types";
import {
  ChevronRight,
  Search,
  BookOpen,
  X,
  Compass,
  CheckCircle2,
  ChevronsUpDown,
  ListTree,
  Crosshair,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompletedChapters } from "@/lib/learnings/progress";

interface CurriculumSidebarProps {
  modules: LearningModule[];
  currentModuleSlug: string;
  currentChapterSlug: string;
  currentTableOfContents?: TableOfContentsItem[];
  className?: string;
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

/** Cleans LaTeX symbols like ($\alpha$) for human-readable sidebar display */
function formatSubtopicTitle(title: string): string {
  return title
    .replace(/\(\$\\alpha\$\)/g, "(α)")
    .replace(/\$([^\$]+)\$/g, "$1")
    .replace(/\\alpha/g, "α")
    .replace(/\\theta/g, "θ")
    .replace(/\\omega/g, "Ω")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥");
}

export function CurriculumSidebar({
  modules,
  currentModuleSlug,
  currentChapterSlug,
  currentTableOfContents,
  className,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
}: CurriculumSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { completedSet: completedChapters } = useCompletedChapters();
  const activeChapterRef = useRef<HTMLDivElement | null>(null);
  const activeModuleRef = useRef<HTMLLIElement | null>(null);
  const scrollContainerRef = useRef<HTMLOListElement | null>(null);

  // Track module open overrides; by default, the active module is open
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  // Track expanded subtopics preview for non-active chapters
  const [expandedChapterSubtopics, setExpandedChapterSubtopics] = useState<Record<string, boolean>>(
    {}
  );

  // Active subtopic heading ID from scrollspy
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>("");

  // Auto-scroll active chapter into view smoothly on mount or chapter change
  useEffect(() => {
    if (activeChapterRef.current) {
      activeChapterRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [currentChapterSlug]);

  // Container-aware scrollspy for subtopics in the active chapter
  useEffect(() => {
    if (!currentTableOfContents || currentTableOfContents.length === 0) return;

    const container = document.getElementById("chapter-reader-container");
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        const isNearBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 60;

        if (isNearBottom) {
          const lastItem = currentTableOfContents[currentTableOfContents.length - 1];
          if (lastItem) {
            setActiveSubtopicId(lastItem.id);
            return;
          }
        }

        const containerTop = container.getBoundingClientRect().top;
        const activationThreshold = containerTop + 120;

        let currentActive = currentTableOfContents[0]?.id || "";

        for (const item of currentTableOfContents) {
          const el = document.getElementById(item.id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= activationThreshold) {
            currentActive = item.id;
          } else {
            break;
          }
        }

        setActiveSubtopicId(currentActive);
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [currentTableOfContents]);

  const toggleModule = useCallback(
    (slug: string) => {
      setOpenModules((prev) => {
        const currentlyOpen = prev[slug] ?? slug === currentModuleSlug;
        return {
          ...prev,
          [slug]: !currentlyOpen,
        };
      });
    },
    [currentModuleSlug]
  );

  const toggleChapterTopics = useCallback((chSlug: string) => {
    setExpandedChapterSubtopics((prev) => ({
      ...prev,
      [chSlug]: !prev[chSlug],
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

  // Level-2 subtopics of active chapter from tableOfContents
  const activeChapterSubtopics = useMemo(() => {
    if (currentTableOfContents && currentTableOfContents.length > 0) {
      const l2 = currentTableOfContents.filter((item) => item.level === 2);
      if (l2.length > 0) return l2;
      return currentTableOfContents;
    }
    return [];
  }, [currentTableOfContents]);

  const totalChaptersCount = useMemo(
    () => modules.reduce((acc, m) => acc + m.chapters.length, 0),
    [modules]
  );

  const matchingChaptersCount = useMemo(
    () => filteredModules.reduce((acc, m) => acc + m.chapters.length, 0),
    [filteredModules]
  );

  const completedCount = completedChapters.size;
  const completedPercent =
    totalChaptersCount > 0 ? Math.round((completedCount / totalChaptersCount) * 100) : 0;

  const areAllExpanded = useMemo(() => {
    if (filteredModules.length === 0) return false;
    return filteredModules.every((mod) => openModules[mod.slug] ?? mod.slug === currentModuleSlug);
  }, [filteredModules, openModules, currentModuleSlug]);

  const toggleExpandAll = () => {
    if (areAllExpanded) {
      const nextState: Record<string, boolean> = {};
      modules.forEach((mod) => {
        nextState[mod.slug] = false;
      });
      setOpenModules(nextState);
    } else {
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

  const scrollToActive = () => {
    if (activeChapterRef.current) {
      activeChapterRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    } else if (activeModuleRef.current) {
      activeModuleRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  const scrollToSubtopic = (id: string) => {
    const el = document.getElementById(id);
    const reader = document.getElementById("chapter-reader-container");
    if (el && reader) {
      const targetTop = el.getBoundingClientRect().top;
      const readerTop = reader.getBoundingClientRect().top;
      const scrollOffset = targetTop - readerTop + reader.scrollTop - 24;
      reader.scrollTo({ top: scrollOffset, behavior: "smooth" });
      history.pushState(null, "", `#${id}`);
      setActiveSubtopicId(id);
      if (onNavigate) onNavigate();
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", `#${id}`);
      setActiveSubtopicId(id);
      if (onNavigate) onNavigate();
    }
  };

  // --- COLLAPSED ICON RAIL VIEW (Notion / Coursera Style) ---
  if (isCollapsed) {
    return (
      <nav
        aria-label="Curriculum Navigation (Collapsed)"
        className={cn(
          "flex flex-col items-center h-full py-2.5 px-1.5 rounded-lg border border-border/80 bg-surface shadow-card select-none transition-all duration-300",
          className
        )}
      >
        {/* Toggle Expand Button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-9 h-9 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-raised border border-border/60 transition-colors cursor-pointer mb-2.5 shadow-xs"
            title="Expand curriculum sidebar"
            aria-label="Expand curriculum sidebar"
          >
            <PanelLeftOpen className="w-4 h-4 text-primary" />
          </button>
        )}

        {/* Mini Completion Pill */}
        <div
          className="w-10 py-1.5 rounded-sm bg-surface-inset border border-border/50 flex flex-col items-center justify-center text-[10px] font-mono text-muted-foreground mb-2.5"
          title={`${completedCount} of ${totalChaptersCount} chapters completed (${completedPercent}%)`}
        >
          <span className="text-emerald-500 font-bold">{completedCount}</span>
          <span className="text-[8px] opacity-60">/{totalChaptersCount}</span>
        </div>

        {/* Module Pill Strip */}
        <ol className="flex flex-col gap-1.5 w-full items-center flex-1 overflow-y-auto min-h-0 py-1 custom-scrollbar">
          {modules.map((mod) => {
            const isCurrentModule = mod.slug === currentModuleSlug;
            const modCompletedCount = mod.chapters.filter((ch) =>
              completedChapters.has(`${mod.slug}/${ch.slug}`)
            ).length;
            const isModComplete =
              mod.chapters.length > 0 && modCompletedCount === mod.chapters.length;

            return (
              <li key={mod.id} className="relative group">
                <Link
                  href={`/learnings/${mod.slug}/${mod.chapters[0]?.slug || ""}`}
                  onClick={onNavigate}
                  title={`Part ${mod.partNumber.toString().padStart(2, "0")}: ${mod.title} (${modCompletedCount}/${mod.chapters.length} completed)`}
                  className={cn(
                    "w-9 h-9 rounded-sm flex flex-col items-center justify-center text-[10px] font-mono font-bold transition-all relative cursor-pointer border",
                    isCurrentModule
                      ? "bg-primary text-white border-primary/40 shadow-xs"
                      : "bg-surface-raised/60 hover:bg-surface-raised text-muted-foreground hover:text-foreground border-border/40 hover:border-border"
                  )}
                >
                  <span>P{mod.partNumber.toString().padStart(2, "0")}</span>
                  {isModComplete ? (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-surface" />
                  ) : modCompletedCount > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-sky-500 ring-2 ring-surface" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ol>

        {/* Jump to active button at bottom of rail */}
        <button
          type="button"
          onClick={scrollToActive}
          className="w-9 h-9 mt-2 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-raised border border-border/40 transition-colors cursor-pointer"
          title="Jump to active chapter"
          aria-label="Jump to active chapter"
        >
          <Crosshair className="w-3.5 h-3.5 text-primary" />
        </button>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Curriculum Navigation"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
      className={cn(
        "flex flex-col h-full overflow-hidden rounded-lg border border-border/80 bg-surface shadow-card p-3 select-none transition-colors",
        className
      )}
    >
      {/* --- HEADER: Clean, Editorial Branding --- */}
      <div className="flex flex-col pb-2.5 border-b border-border/60 shrink-0 gap-2 mb-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Icon & Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/25 shadow-xs">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground block truncate">
                Curriculum
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                12 Parts &bull; 62 Chapters
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Collapse Sidebar Button */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-raised transition-colors cursor-pointer border border-border/40 hover:border-border"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-3.5 h-3.5 text-primary" />
              </button>
            )}
            {/* Focus / Jump to Active Chapter */}
            <button
              type="button"
              onClick={scrollToActive}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-raised transition-colors cursor-pointer border border-transparent hover:border-border/60"
              title="Jump to active chapter"
              aria-label="Jump to active chapter"
            >
              <Crosshair className="w-3.5 h-3.5 text-primary/80" />
            </button>

            {/* Expand / Collapse All */}
            <button
              type="button"
              onClick={toggleExpandAll}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-raised transition-colors cursor-pointer text-[10px] font-medium border border-border/50"
              title={areAllExpanded ? "Collapse all parts" : "Expand all parts"}
              aria-label={areAllExpanded ? "Collapse all parts" : "Expand all parts"}
            >
              <ChevronsUpDown className="w-3 h-3 text-primary" />
              <span className="hidden sm:inline font-mono">
                {areAllExpanded ? "Collapse" : "Expand"}
              </span>
            </button>

            {/* Completion Counter */}
            <div
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-surface-inset text-muted-foreground border border-border/50 font-medium shrink-0"
              title={`${completedCount} of ${totalChaptersCount} chapters finished`}
            >
              {completedCount > 0 ? (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {completedCount}
                  </span>
                  <span className="opacity-60">/{totalChaptersCount}</span>
                </>
              ) : (
                <span>{totalChaptersCount} Ch</span>
              )}
            </div>
          </div>
        </div>

        {/* Minimal Progress Bar (when user has progress) */}
        {completedCount > 0 && (
          <div className="w-full bg-surface-inset rounded-full h-1 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* --- SEARCH / FILTER BAR --- */}
      <div className="relative mb-2 shrink-0">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="curriculum-search"
          name="curriculum-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleClearSearch();
          }}
          placeholder="Filter chapters & topics..."
          aria-label="Filter chapters and topics"
          className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-border/70 bg-surface-inset/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-sans"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear filter"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground/40 pointer-events-none">
            /
          </span>
        )}
      </div>

      {/* Search results banner */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground px-1 mb-2 shrink-0">
          <span>
            Found {matchingChaptersCount} {matchingChaptersCount === 1 ? "chapter" : "chapters"}
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

      {/* ─── MAIN CURRICULUM TREE: Unified Single-Scroll Architecture ─── */}
      <ol
        ref={scrollContainerRef}
        role="list"
        aria-label="Curriculum Modules"
        className="flex flex-col gap-1.5 flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar"
      >
        {filteredModules.length === 0 ? (
          <li
            role="listitem"
            className="text-center py-10 px-4 text-xs text-muted-foreground shrink-0"
          >
            <p className="font-semibold text-foreground mb-1">No matching chapters</p>
            <p className="text-[11px] mb-3">
              Try searching for keywords like &ldquo;array&rdquo;, &ldquo;tree&rdquo;, or
              &ldquo;dp&rdquo;
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-border bg-surface-raised text-xs text-primary font-medium hover:bg-surface transition-colors cursor-pointer"
            >
              Clear filter
            </button>
          </li>
        ) : (
          filteredModules.map((mod) => {
            const isCurrentModule = mod.slug === currentModuleSlug;
            const isOpen = searchQuery.trim() ? true : (openModules[mod.slug] ?? isCurrentModule);

            const modCompletedCount = mod.chapters.filter((ch) =>
              completedChapters.has(`${mod.slug}/${ch.slug}`)
            ).length;
            const isModComplete =
              mod.chapters.length > 0 && modCompletedCount === mod.chapters.length;

            return (
              <li
                key={mod.id}
                ref={isCurrentModule ? activeModuleRef : null}
                role="listitem"
                className={cn(
                  "rounded-xl transition-all duration-150 overflow-hidden border shrink-0",
                  isCurrentModule
                    ? "bg-primary/3 border-primary/30 shadow-2xs"
                    : "bg-surface-raised/40 hover:bg-surface-raised border-border/40 hover:border-border/70"
                )}
              >
                {/* ── MODULE HEADER TRIGGER ── */}
                <button
                  type="button"
                  id={`mod-header-${mod.slug}`}
                  aria-expanded={isOpen}
                  aria-controls={`mod-chapters-${mod.slug}`}
                  onClick={() => toggleModule(mod.slug)}
                  title={`Part ${mod.partNumber.toString().padStart(2, "0")}: ${mod.title}`}
                  className="w-full flex items-start justify-between gap-2 p-2.5 text-left transition-colors cursor-pointer select-none group"
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    {/* Part Badge: P00, P01, etc. */}
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-tight shrink-0 mt-0.5 transition-colors border",
                        isCurrentModule
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "bg-surface-inset text-muted-foreground/80 border-border/50 group-hover:text-foreground group-hover:border-border"
                      )}
                    >
                      P{mod.partNumber.toString().padStart(2, "0")}
                    </span>

                    {/* Module Title: Multi-line wrapped, zero truncation */}
                    <span
                      className={cn(
                        "text-xs font-semibold leading-snug wrap-break-word line-clamp-2 flex-1 text-left transition-colors",
                        isCurrentModule
                          ? "text-primary font-bold"
                          : "text-foreground/90 group-hover:text-foreground"
                      )}
                    >
                      {mod.title}
                    </span>
                  </div>

                  {/* Module Meta Pill & Chevron */}
                  <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground mt-0.5">
                    {isModComplete ? (
                      <span
                        title={`All ${mod.chapters.length} chapters completed`}
                        className="flex items-center gap-0.5 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {mod.chapters.length}
                      </span>
                    ) : modCompletedCount > 0 ? (
                      <span
                        title={`${modCompletedCount} of ${mod.chapters.length} completed`}
                        className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md"
                      >
                        {modCompletedCount}/{mod.chapters.length}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground/60">
                        {mod.chapters.length} ch
                      </span>
                    )}

                    <ChevronRight
                      className={cn(
                        "w-3.5 h-3.5 text-muted-foreground/70 transition-transform duration-200 shrink-0",
                        isOpen ? "rotate-90 text-primary" : "rotate-0"
                      )}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {/* ── EXPANDED MODULE CHAPTERS LIST (Hierarchical Tree) ── */}
                {isOpen && (
                  <ol
                    id={`mod-chapters-${mod.slug}`}
                    role="list"
                    aria-labelledby={`mod-header-${mod.slug}`}
                    className="relative ml-4 pl-3 my-1 border-l-2 border-border/60 space-y-1 pb-1.5"
                  >
                    {mod.chapters.map((ch) => {
                      const isCurrentChapter = isCurrentModule && ch.slug === currentChapterSlug;
                      const isDone = completedChapters.has(`${mod.slug}/${ch.slug}`);
                      const hasVisualizer = ch.visualizerLinks && ch.visualizerLinks.length > 0;
                      const isTopicsExpanded = !!expandedChapterSubtopics[ch.slug];

                      return (
                        <li key={ch.slug} role="listitem">
                          <div
                            ref={isCurrentChapter ? activeChapterRef : null}
                            className="flex flex-col relative"
                          >
                            {/* Chapter Item Row */}
                            <div
                              className={cn(
                                "group relative flex items-start justify-between gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-colors",
                                isCurrentChapter
                                  ? "bg-primary/10 text-primary font-bold shadow-2xs"
                                  : "text-muted-foreground hover:text-foreground hover:bg-surface-raised/70"
                              )}
                            >
                              {/* Tree guide rail active indicator pip */}
                              {isCurrentChapter && (
                                <span
                                  className="absolute -left-3.5 top-2.5 w-1.5 h-3.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                  aria-hidden="true"
                                />
                              )}

                              {/* Chapter Link */}
                              <Link
                                href={`/learnings/${mod.slug}/${ch.slug}`}
                                onClick={onNavigate}
                                itemProp="url"
                                aria-current={isCurrentChapter ? "page" : undefined}
                                title={ch.title}
                                className="flex items-start gap-1.5 flex-1 min-w-0 cursor-pointer select-none"
                              >
                                {/* Chapter Number or Completion Check */}
                                {isDone ? (
                                  <CheckCircle2
                                    className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"
                                    aria-label="Completed"
                                  />
                                ) : (
                                  <span
                                    className={cn(
                                      "font-mono text-[10px] font-semibold shrink-0 mt-0.5 w-4",
                                      isCurrentChapter
                                        ? "text-primary font-bold"
                                        : "text-muted-foreground/60 group-hover:text-muted-foreground"
                                    )}
                                  >
                                    {ch.order.toString().padStart(2, "0")}.
                                  </span>
                                )}

                                {/* Chapter Title: Clean multi-line wrap, completely readable */}
                                <span
                                  itemProp="name"
                                  className={cn(
                                    "text-xs leading-snug wrap-break-word flex-1 text-left",
                                    isCurrentChapter
                                      ? "text-primary font-bold"
                                      : "text-foreground/80 group-hover:text-foreground font-medium"
                                  )}
                                >
                                  {ch.title}
                                </span>
                              </Link>

                              {/* Right Badges: Visualizer & Subtopic preview toggle */}
                              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                                {hasVisualizer && (
                                  <span
                                    title="Interactive Visualizer available"
                                    className="inline-flex items-center text-primary/70 group-hover:text-primary transition-colors"
                                  >
                                    <Compass className="w-3 h-3" />
                                  </span>
                                )}

                                {ch.topicsCovered &&
                                  ch.topicsCovered.length > 0 &&
                                  !isCurrentChapter && (
                                    <button
                                      type="button"
                                      onClick={() => toggleChapterTopics(ch.slug)}
                                      className="p-0.5 rounded text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                                      title={`${isTopicsExpanded ? "Hide" : "Show"} subtopics`}
                                      aria-label={`${isTopicsExpanded ? "Hide" : "Show"} subtopics for ${ch.title}`}
                                    >
                                      <ChevronRight
                                        className={cn(
                                          "w-3 h-3 transition-transform duration-150",
                                          isTopicsExpanded ? "rotate-90 text-primary" : "rotate-0"
                                        )}
                                      />
                                    </button>
                                  )}
                              </div>
                            </div>

                            {/* ── ACTIVE CHAPTER SUBTOPICS (Direct On-Page Jump Anchors) ── */}
                            {isCurrentChapter && (
                              <div className="ml-3 pl-3 my-1 border-l-2 border-primary/30 space-y-0.5">
                                <div className="flex items-center justify-between text-[10px] font-mono text-primary/80 px-1 py-0.5">
                                  <span className="font-semibold flex items-center gap-1">
                                    <ListTree className="w-2.5 h-2.5" />
                                    Subtopics (
                                    {activeChapterSubtopics.length || ch.topicsCovered.length})
                                  </span>
                                  <span className="text-[9px] text-muted-foreground/70">
                                    Jump to
                                  </span>
                                </div>

                                <ol className="space-y-0.5">
                                  {activeChapterSubtopics.length > 0
                                    ? activeChapterSubtopics.map((sub) => {
                                        const isSubActive = activeSubtopicId === sub.id;
                                        return (
                                          <li key={sub.id}>
                                            <a
                                              href={`#${sub.id}`}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSubtopic(sub.id);
                                              }}
                                              title={sub.title}
                                              className={cn(
                                                "group/sub flex items-start gap-1.5 py-1 px-1.5 rounded-md text-[11px] leading-snug transition-colors cursor-pointer",
                                                isSubActive
                                                  ? "text-primary font-bold bg-primary/8"
                                                  : "text-muted-foreground hover:text-foreground hover:bg-surface-raised/60"
                                              )}
                                            >
                                              <span
                                                className={cn(
                                                  "w-1 h-1 rounded-full shrink-0 mt-1.5 transition-all",
                                                  isSubActive
                                                    ? "bg-primary scale-125 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                                                    : "bg-muted-foreground/40 group-hover/sub:bg-primary"
                                                )}
                                                aria-hidden="true"
                                              />
                                              <span className="wrap-break-word line-clamp-2 flex-1 text-left">
                                                {formatSubtopicTitle(sub.title)}
                                              </span>
                                            </a>
                                          </li>
                                        );
                                      })
                                    : ch.topicsCovered.map((topic, i) => (
                                        <li key={i}>
                                          <div className="flex items-start gap-1.5 py-0.5 px-1 text-[11px] text-muted-foreground leading-snug">
                                            <span
                                              className="w-1 h-1 rounded-full bg-primary/60 shrink-0 mt-1.5"
                                              aria-hidden="true"
                                            />
                                            <span className="wrap-break-word line-clamp-2 flex-1 text-left">
                                              {formatSubtopicTitle(topic)}
                                            </span>
                                          </div>
                                        </li>
                                      ))}
                                </ol>
                              </div>
                            )}

                            {/* ── NON-ACTIVE CHAPTER EXPANDED TOPICS PREVIEW ── */}
                            {!isCurrentChapter && isTopicsExpanded && ch.topicsCovered && (
                              <div className="ml-3 pl-3 my-1 border-l-2 border-border/50 space-y-0.5">
                                <div className="text-[10px] font-mono text-muted-foreground/80 px-1 py-0.5 font-semibold flex items-center gap-1">
                                  <ListTree className="w-2.5 h-2.5" />
                                  Topics Covered ({ch.topicsCovered.length})
                                </div>
                                <ul className="space-y-0.5">
                                  {ch.topicsCovered.map((topic, i) => (
                                    <li key={i}>
                                      <Link
                                        href={`/learnings/${mod.slug}/${ch.slug}`}
                                        onClick={onNavigate}
                                        className="flex items-start gap-1.5 py-0.5 px-1 rounded text-[11px] leading-snug text-muted-foreground hover:text-foreground hover:bg-surface-raised/60 transition-colors"
                                        title={topic}
                                      >
                                        <span
                                          className="w-1 h-1 rounded-full bg-border shrink-0 mt-1.5"
                                          aria-hidden="true"
                                        />
                                        <span className="wrap-break-word line-clamp-2 flex-1 text-left">
                                          {formatSubtopicTitle(topic)}
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
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

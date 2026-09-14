"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { LearningModule } from "@/lib/learnings/types";
import { ChevronDown, ChevronRight, Search, BookOpen, X, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

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
  // Open current module by default
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => ({
    [currentModuleSlug]: true,
  }));

  const toggleModule = (slug: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // Filter modules and chapters based on query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;

    const q = searchQuery.toLowerCase();
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

  return (
    <nav
      aria-label="Curriculum Navigation"
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-surface/90 shadow-[var(--shadow-raised)] p-3.5 h-full overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Curriculum
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">62 Chapters</span>
      </div>

      {/* Instant Filter Search */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter chapters & topics..."
          className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-border bg-surface-inset text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Modules Tree */}
      <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar">
        {filteredModules.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No matching chapters found.
          </div>
        ) : (
          filteredModules.map((mod) => {
            const isCurrentModule = mod.slug === currentModuleSlug;
            const isOpen = searchQuery.trim() ? true : !!openModules[mod.slug];

            return (
              <div
                key={mod.id}
                className="rounded-xl border border-border/40 overflow-hidden bg-surface/50"
              >
                {/* Module Accordion Header */}
                <button
                  onClick={() => toggleModule(mod.slug)}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 text-left text-xs font-semibold transition-colors cursor-pointer",
                    isCurrentModule
                      ? "bg-primary/5 text-primary"
                      : "text-foreground hover:bg-surface-raised"
                  )}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-inset text-muted-foreground shrink-0 border border-border/50">
                      P{mod.partNumber.toString().padStart(2, "0")}
                    </span>
                    <span className="truncate">{mod.title}</span>
                  </div>

                  <div className="shrink-0 text-muted-foreground">
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Module Chapters List */}
                {isOpen && (
                  <div className="flex flex-col border-t border-border/30 bg-background/30 p-1">
                    {mod.chapters.map((ch) => {
                      const isCurrentChapter = isCurrentModule && ch.slug === currentChapterSlug;

                      return (
                        <Link
                          key={ch.slug}
                          href={`/learnings/${mod.slug}/${ch.slug}`}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-xs transition-all group",
                            isCurrentChapter
                              ? "bg-primary/15 text-primary font-bold shadow-2xs border-l-2 border-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-surface-raised/70"
                          )}
                        >
                          <span
                            className={cn(
                              "font-mono text-[10px] shrink-0",
                              isCurrentChapter ? "text-primary" : "text-muted-foreground/60"
                            )}
                          >
                            {ch.order.toString().padStart(2, "0")}.
                          </span>
                          <span className="truncate flex-1">{ch.title}</span>
                          {ch.visualizerLinks && ch.visualizerLinks.length > 0 && (
                            <Compass className="w-3 h-3 text-primary/70 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </nav>
  );
}

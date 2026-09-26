"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { LearningModule } from "@/lib/learnings/types";
import {
  Search,
  BookOpen,
  ArrowRight,
  Layers,
  X,
  CheckCircle2,
  Compass,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompletedChapters } from "@/lib/learnings/progress";

interface LearningsHubExplorerProps {
  modules: LearningModule[];
}

type DifficultyTier = "all" | "foundational" | "core" | "intermediate" | "advanced";

export function LearningsHubExplorer({ modules }: LearningsHubExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier>("all");
  const { completedSet: completedKeys } = useCompletedChapters();

  const totalChapters = useMemo(
    () => modules.reduce((acc, m) => acc + m.chapters.length, 0),
    [modules]
  );

  const completedPercentage = Math.round(
    totalChapters > 0 ? (completedKeys.size / totalChapters) * 100 : 0
  );

  const filteredModules = useMemo(() => {
    let result = modules;

    if (selectedDifficulty !== "all") {
      result = result.filter((m) => {
        if (selectedDifficulty === "foundational") return m.partNumber <= 1;
        if (selectedDifficulty === "core") return m.partNumber >= 2 && m.partNumber <= 5;
        if (selectedDifficulty === "intermediate") return m.partNumber >= 6 && m.partNumber <= 8;
        if (selectedDifficulty === "advanced") return m.partNumber >= 9;
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => {
        const matchesModule =
          m.title.toLowerCase().includes(q) ||
          m.shortDescription.toLowerCase().includes(q) ||
          m.slug.toLowerCase().includes(q);

        const matchesChapter = m.chapters.some(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.topicsCovered.some((t) => t.toLowerCase().includes(q))
        );

        return matchesModule || matchesChapter;
      });
    }

    return result;
  }, [modules, searchQuery, selectedDifficulty]);

  const tierCounts = useMemo(() => {
    return {
      all: modules.length,
      foundational: modules.filter((m) => m.partNumber <= 1).length,
      core: modules.filter((m) => m.partNumber >= 2 && m.partNumber <= 5).length,
      intermediate: modules.filter((m) => m.partNumber >= 6 && m.partNumber <= 8).length,
      advanced: modules.filter((m) => m.partNumber >= 9).length,
    };
  }, [modules]);

  const tiers = useMemo(
    () => [
      { id: "all" as const, label: `All (${tierCounts.all})` },
      { id: "foundational" as const, label: `Foundational (${tierCounts.foundational})` },
      { id: "core" as const, label: `Core DSA (${tierCounts.core})` },
      { id: "intermediate" as const, label: `Intermediate (${tierCounts.intermediate})` },
      { id: "advanced" as const, label: `Advanced (${tierCounts.advanced})` },
    ],
    [tierCounts]
  );

  return (
    <div id="curriculum-explorer" className="flex flex-col gap-8 scroll-mt-24">
      {/* Progress Card (Only shown if user has progress) */}
      {completedKeys.size > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-surface border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-foreground">
                Your Curriculum Progress: {completedKeys.size} of {totalChapters} Chapters Completed
                ({completedPercentage}%)
              </div>
              <div className="text-xs text-muted-foreground">
                Progress is stored locally. Keep studying to master all 62 chapters!
              </div>
            </div>
          </div>

          <div className="w-full sm:w-48 flex items-center gap-3 shrink-0">
            <div className="flex-1 h-2 rounded-full bg-surface-secondary border border-border overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completedPercentage}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              {completedPercentage}%
            </span>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-lg p-4 lg:flex-row lg:items-center lg:justify-between border border-border bg-surface shadow-card">
        {/* Search Input with Clear Button */}
        <div className="relative w-full lg:max-w-md">
          <label htmlFor="curriculum-search" className="sr-only">
            Search chapters, algorithms, data structures, or topics
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            id="curriculum-search"
            type="text"
            role="searchbox"
            placeholder="Search all 62 chapters, algorithms, data structures, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchQuery("");
            }}
            className="h-11 w-full rounded-sm border border-border bg-surface-secondary py-2.5 pl-11 pr-10 text-sm text-text-primary shadow-xs placeholder:text-text-secondary/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-sm text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted shadow-xs"
              aria-hidden="true"
            >
              ESC
            </span>
          )}
        </div>

        {/* Difficulty Tier Filters */}
        <div
          className="flex w-full lg:w-auto items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none"
          role="tablist"
          aria-label="Filter by curriculum tier"
        >
          {tiers.map((tier) => {
            const selected = selectedDifficulty === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setSelectedDifficulty(tier.id)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-4 text-xs font-bold transition-all duration-200 cursor-pointer select-none",
                  selected
                    ? "border border-primary bg-primary text-white shadow-xs"
                    : "border border-border bg-surface text-text-secondary shadow-xs hover:text-text-primary hover:border-border-hover hover:bg-surface-hover"
                )}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modules Grid */}
      {filteredModules.length === 0 ? (
        <div className="text-center py-16 rounded-lg border border-dashed border-border bg-surface p-8 shadow-card">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No modules match your criteria
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            Try searching for terms like &ldquo;Trees&rdquo;, &ldquo;Recursion&rdquo;, &ldquo;Binary
            Search&rdquo;, or reset the difficulty filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDifficulty("all");
            }}
            className="min-h-11 px-5 rounded-sm text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-card transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => {
            const modCompletedCount = mod.chapters.filter((ch) =>
              completedKeys.has(`${mod.slug}/${ch.slug}`)
            ).length;

            const simCount = mod.chapters.reduce(
              (acc, ch) => acc + (ch.visualizerLinks?.length || 0),
              0
            );

            return (
              <article
                key={mod.id}
                itemScope
                itemType="https://schema.org/Course"
                className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-6 shadow-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200"
              >
                <meta itemProp="provider" content="AlgoFlow" />
                <meta
                  itemProp="courseCode"
                  content={`Part-${mod.partNumber.toString().padStart(2, "0")}`}
                />

                <div>
                  {/* Module badge, chapter count & completion status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-mono font-bold text-xs">
                        Part {mod.partNumber.toString().padStart(2, "0")}
                      </span>
                      {modCompletedCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>
                            {modCompletedCount}/{mod.chapters.length} Done
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      {simCount > 0 && (
                        <span
                          title={`${simCount} Interactive Simulators`}
                          className="inline-flex items-center gap-1 text-[11px] text-primary/80 font-mono"
                        >
                          <Compass className="w-3 h-3 text-primary" />
                          <span>{simCount}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary/80" aria-hidden="true" />
                        <span>{mod.chapters.length} Ch</span>
                      </span>
                    </div>
                  </div>

                  {/* Module title */}
                  <h3
                    itemProp="name"
                    className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug tracking-tight mb-2"
                  >
                    <Link
                      itemProp="url"
                      href={`/learnings/${mod.slug}`}
                      className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {mod.title}
                    </Link>
                  </h3>

                  {/* Short description */}
                  <p
                    itemProp="description"
                    className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4"
                  >
                    {mod.shortDescription}
                  </p>

                  {/* Syllabus Highlights */}
                  <div className="space-y-1 mb-5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-1 pb-1 mb-1 flex items-center justify-between">
                      <span>Syllabus Highlights</span>
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        {mod.chapters.length} total
                      </span>
                    </div>

                    {mod.chapters.slice(0, 3).map((ch) => {
                      const isDone = completedKeys.has(`${mod.slug}/${ch.slug}`);
                      return (
                        <Link
                          key={ch.slug}
                          href={`/learnings/${mod.slug}/${ch.slug}`}
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 px-1.5 rounded-lg hover:bg-surface-hover truncate group/ch"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          ) : (
                            <span className="text-[10px] font-mono text-muted-foreground/60 group-hover/ch:text-primary/70 shrink-0">
                              {ch.order.toString().padStart(2, "0")}.
                            </span>
                          )}
                          <span className={cn("truncate", isDone && "text-foreground/70")}>
                            {ch.title}
                          </span>
                          {ch.visualizerLinks && ch.visualizerLinks.length > 0 && (
                            <Compass className="w-3 h-3 text-primary/70 shrink-0 opacity-60" />
                          )}
                        </Link>
                      );
                    })}

                    {mod.chapters.length > 3 && (
                      <div className="text-[11px] text-muted-foreground/80 pl-2 pt-1 italic">
                        + {mod.chapters.length - 3} more chapters
                      </div>
                    )}
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                  <Link
                    href={`/learnings/${mod.slug}`}
                    aria-label={`View syllabus for Part ${mod.partNumber}: ${mod.title}`}
                    className="text-xs font-semibold text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors group/btn py-1"
                  >
                    <span>View Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>

                  <Link
                    href={`/learnings/${mod.slug}/${mod.chapters[0].slug}`}
                    aria-label={`Start Part ${mod.partNumber}: ${mod.title}`}
                    className="px-3.5 py-1.5 rounded-sm font-semibold text-xs bg-primary text-white hover:bg-primary-hover shadow-card transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Start Part</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

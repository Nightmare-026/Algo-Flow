"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { LearningModule } from "@/lib/learnings/types";
import { Search, BookOpen, ArrowRight, Layers, Sparkles, CheckCircle2, X } from "lucide-react";

interface LearningsHubExplorerProps {
  modules: LearningModule[];
}

export function LearningsHubExplorer({ modules }: LearningsHubExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState<number | "all">("all");

  const filteredModules = useMemo(() => {
    let result = modules;

    if (selectedPart !== "all") {
      result = result.filter((m) => m.partNumber === selectedPart);
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
  }, [modules, searchQuery, selectedPart]);

  return (
    <div id="curriculum-explorer" className="flex flex-col gap-8 scroll-mt-24">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search input */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 62 chapters, algorithms, data structures, or topics..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground neu-inset focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter: All vs Specific Parts */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
          <button
            onClick={() => setSelectedPart("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedPart === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-raised neu-raised"
            }`}
          >
            All Parts ({modules.length})
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      {filteredModules.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-dashed border-border bg-surface/40 p-8 neu-inset">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No modules match &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            Try searching for terms like &ldquo;Trees&rdquo;, &ldquo;Recursion&rdquo;, &ldquo;Binary
            Search&rdquo;, or &ldquo;Dynamic Programming&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedPart("all");
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => (
            <article
              key={mod.id}
              itemScope
              itemType="https://schema.org/Course"
              className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/90 p-6 neu-raised hover:border-primary/40 hover:shadow-[var(--shadow-raised)] transition-all duration-300"
            >
              <meta itemProp="provider" content="Algo Flow" />
              <meta
                itemProp="courseCode"
                content={`Part-${mod.partNumber.toString().padStart(2, "0")}`}
              />

              <div>
                {/* Module badge & chapter count */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-primary font-mono font-bold text-xs">
                    Part {mod.partNumber.toString().padStart(2, "0")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <BookOpen className="w-3.5 h-3.5 text-primary/80" aria-hidden="true" />
                    <span>{mod.chapters.length} Chapters</span>
                  </span>
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

                {/* Clean Chapters Preview Box (No border, no inner divider) */}
                <div className="space-y-1 mb-5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-1 pb-1 mb-1 flex items-center justify-between">
                    <span>Syllabus Highlights</span>
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      {mod.chapters.length} total
                    </span>
                  </div>

                  {mod.chapters.slice(0, 3).map((ch) => (
                    <Link
                      key={ch.slug}
                      href={`/learnings/${mod.slug}/${ch.slug}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 px-1.5 rounded-lg hover:bg-surface-hover truncate group/ch"
                    >
                      <span className="text-[10px] font-mono text-muted-foreground/60 group-hover/ch:text-primary/70 shrink-0">
                        {ch.order.toString().padStart(2, "0")}.
                      </span>
                      <span className="truncate">{ch.title}</span>
                    </Link>
                  ))}

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
                  className="px-3.5 py-1.5 rounded-xl font-semibold text-xs bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Start Part</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

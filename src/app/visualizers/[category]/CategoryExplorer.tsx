"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock3, HardDrive, Play, Search, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { DataStructure, Algorithm, Operation } from "@/types";
import { Badge } from "@/components/ui/badge";

const difficultyVariant = (difficulty: string) => {
  if (difficulty === "easy") return "success" as const;
  if (difficulty === "medium") return "warning" as const;
  return "danger" as const;
};

interface CategoryExplorerProps {
  structure: DataStructure;
  structureAlgorithms: Algorithm[];
  structureOperations: Operation[];
  operationCounts: Map<string, number>;
}

export function CategoryExplorer({
  structure,
  structureAlgorithms,
  structureOperations,
  operationCounts,
}: CategoryExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [activeOperation, setActiveOperation] = useState("all");
  const reduceMotion = useReducedMotion();

  const selectedOperation =
    activeOperation === "all" ||
    structureOperations.some((operation) => operation.id === activeOperation)
      ? activeOperation
      : "all";

  const filteredAlgorithms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return structureAlgorithms.filter((algorithm) => {
      const matchesSearch =
        !query ||
        algorithm.name.toLowerCase().includes(query) ||
        algorithm.shortDescription.toLowerCase().includes(query);
      const matchesDifficulty =
        activeDifficulty === "all" || algorithm.difficulty === activeDifficulty;
      const matchesOperation =
        selectedOperation === "all" || algorithm.operationId === selectedOperation;
      return matchesSearch && matchesDifficulty && matchesOperation;
    });
  }, [activeDifficulty, searchQuery, selectedOperation, structureAlgorithms]);

  return (
    <div className="mt-10">
      {/* Search & Filter Toolbar */}
      <div className="neu-raised grid gap-4 rounded-2xl p-4 lg:grid-cols-[1fr_auto_auto] border border-border">
        {/* Search */}
        <div className="relative">
          <label htmlFor="algorithm-search" className="sr-only">
            Search {structure.name} algorithms
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            id="algorithm-search"
            type="search"
            placeholder={`Search ${structure.name.toLowerCase()} algorithms (e.g. traversal, search)...`}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-bg-surface-inset py-2.5 pl-11 pr-4 text-sm text-text-primary shadow-[var(--shadow-inset)] placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>

        {/* Operation Filter */}
        <div>
          <label htmlFor="operation-filter" className="sr-only">
            Filter by operation
          </label>
          <select
            id="operation-filter"
            className="form-select h-11 min-w-44 text-xs font-semibold text-text-primary cursor-pointer"
            value={selectedOperation}
            onChange={(event) => setActiveOperation(event.target.value)}
          >
            <option value="all">All Operations</option>
            {structureOperations.map((operation) => (
              <option key={operation.id} value={operation.id}>
                {operation.name} ({operationCounts.get(operation.id) ?? 0})
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label htmlFor="difficulty-filter" className="sr-only">
            Filter by difficulty
          </label>
          <select
            id="difficulty-filter"
            className="form-select h-11 min-w-40 text-xs font-semibold text-text-primary cursor-pointer"
            value={activeDifficulty}
            onChange={(event) => setActiveDifficulty(event.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Counter */}
      <div className="mt-8 flex items-center justify-between">
        <p
          className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted"
          aria-live="polite"
        >
          Showing {filteredAlgorithms.length} of {structureAlgorithms.length} algorithms
        </p>
      </div>

      {/* Algorithm Cards Grid */}
      {filteredAlgorithms.length > 0 ? (
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
          className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredAlgorithms.map((algorithm) => {
            const operation = structureOperations.find((item) => item.id === algorithm.operationId);
            return (
              <motion.article
                key={algorithm.id}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <div className="neu-raised group flex h-full flex-col justify-between rounded-2xl border border-border p-6 shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:-translate-y-1 hover:shadow-[var(--shadow-raised)] transition-all duration-200">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={difficultyVariant(algorithm.difficulty)}>
                          {algorithm.difficulty}
                        </Badge>
                        {operation ? <Badge variant="secondary">{operation.name}</Badge> : null}
                      </div>
                      <Link
                        href={`/quizzes/${algorithm.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-text-muted hover:text-primary transition-colors"
                        title="Take quiz on this algorithm"
                      >
                        <Trophy className="h-3.5 w-3.5" />
                        Quiz
                      </Link>
                    </div>

                    <Link
                      href={`/visualizer/${algorithm.slug}`}
                      className="block focus:outline-none"
                    >
                      <h2 className="mt-4 text-lg font-bold font-display text-text-primary group-hover:text-primary transition-colors">
                        {algorithm.name}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2">
                      {algorithm.shortDescription}
                    </p>

                    {/* Complexity Metric Well */}
                    <dl className="neu-inset mt-5 grid grid-cols-2 gap-3 rounded-xl p-3 border border-border">
                      <div className="min-w-0">
                        <dt className="flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase tracking-wider text-text-muted">
                          <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                          Time (Avg)
                        </dt>
                        <dd className="mt-1 truncate font-mono text-xs font-bold text-text-primary">
                          {algorithm.timeComplexityAverage}
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase tracking-wider text-text-muted">
                          <HardDrive className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                          Space
                        </dt>
                        <dd className="mt-1 truncate font-mono text-xs font-bold text-text-primary">
                          {algorithm.spaceComplexity}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Launch Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <Link
                      href={`/visualizer/${algorithm.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      Open Workstation
                    </Link>
                    <Link
                      href={`/visualizer/${algorithm.slug}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted group-hover:border-primary/30 group-hover:text-primary transition-colors"
                      aria-label={`Open ${algorithm.name} visualizer`}
                    >
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      ) : (
        <div className="neu-inset mt-6 rounded-2xl p-12 text-center border border-border">
          <Search className="mx-auto h-10 w-10 text-text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-bold font-display text-text-primary">
            No matching algorithms
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Change your search query or reset the operation and difficulty filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveDifficulty("all");
              setActiveOperation("all");
            }}
            className="mt-6 min-h-10 rounded-xl bg-primary px-5 text-xs font-bold text-white hover:bg-primary-hover shadow-[var(--shadow-raised-sm)]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

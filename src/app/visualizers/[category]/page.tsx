"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ChevronRight, Clock3, HardDrive, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { dataStructures } from "@/data/seed/data-structures";
import { algorithms } from "@/data/seed/algorithms";
import { operations } from "@/data/seed/operations";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const difficultyVariant = (difficulty: string) => {
  if (difficulty === "easy") return "success" as const;
  if (difficulty === "medium") return "warning" as const;
  return "danger" as const;
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const structure = dataStructures.find((item) => item.slug === category && item.isPublished);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [activeOperation, setActiveOperation] = useState("all");
  const reduceMotion = useReducedMotion();

  const structureAlgorithms = useMemo(() => {
    if (!structure) return [];
    return algorithms
      .filter((algorithm) => algorithm.isPublished && algorithm.dataStructureId === structure.id)
      .sort((left, right) =>
        left.priority === right.priority
          ? left.name.localeCompare(right.name)
          : left.priority.localeCompare(right.priority)
      );
  }, [structure]);

  const operationCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const algorithm of structureAlgorithms) {
      counts.set(algorithm.operationId, (counts.get(algorithm.operationId) ?? 0) + 1);
    }
    return counts;
  }, [structureAlgorithms]);

  const structureOperations = useMemo(() => {
    if (!structure) return [];
    return operations
      .filter(
        (operation) =>
          operation.dataStructureId === structure.id &&
          operation.isPublished &&
          (operationCounts.get(operation.id) ?? 0) > 0
      )
      .sort((left, right) => left.displayOrder - right.displayOrder);
  }, [operationCounts, structure]);

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

  if (!structure) {
    return (
      <div className="page-shell flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pb-20 pt-32">
          <div className="neu-raised max-w-lg rounded-3xl p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-error" aria-hidden="true" />
            <h1 className="mt-5 text-3xl font-extrabold">Category not found</h1>
            <p className="mt-3 text-text-secondary">
              The requested data structure is not in the published library.
            </p>
            <Link href="/visualizers" className={buttonVariants({ className: "mt-7" })}>
              Return to the library
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/visualizers"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary-active"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Visualizer library
          </Link>

          <div className="mt-5 max-w-3xl">
            <p className="section-kicker">{structure.category.replace("-", " ")} structure</p>
            <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
              {structure.name} <span className="text-gradient-primary">algorithms</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-text-secondary">
              {structure.description} Choose a trace, set its input, and step through the state
              changes.
            </p>
          </div>

          <div className="neu-raised mt-10 grid gap-4 rounded-2xl p-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <label htmlFor="algorithm-search" className="sr-only">
                Search {structure.name} algorithms
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="algorithm-search"
                type="search"
                placeholder={`Search ${structure.name.toLowerCase()} algorithms`}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground shadow-[var(--shadow-inset)] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="operation-filter" className="sr-only">
                Filter by operation
              </label>
              <select
                id="operation-filter"
                className="form-select h-12 min-w-48"
                value={selectedOperation}
                onChange={(event) => setActiveOperation(event.target.value)}
              >
                <option value="all">All operations</option>
                {structureOperations.map((operation) => (
                  <option key={operation.id} value={operation.id}>
                    {operation.name} ({operationCounts.get(operation.id)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="difficulty-filter" className="sr-only">
                Filter by difficulty
              </label>
              <select
                id="difficulty-filter"
                className="form-select h-12 min-w-44"
                value={activeDifficulty}
                onChange={(event) => setActiveDifficulty(event.target.value)}
              >
                <option value="all">All difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <p className="mt-8 text-sm font-semibold text-text-secondary" aria-live="polite">
            Showing {filteredAlgorithms.length} of {structureAlgorithms.length} algorithms
          </p>

          {filteredAlgorithms.length > 0 ? (
            <motion.div
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.035 } } }}
              className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredAlgorithms.map((algorithm) => {
                const operation = structureOperations.find(
                  (item) => item.id === algorithm.operationId
                );
                return (
                  <motion.article
                    key={algorithm.id}
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.34 }}
                    className="h-full"
                  >
                    <Link
                      href={`/visualizer/${algorithm.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-white/75 bg-surface/90 p-6 shadow-[var(--shadow-raised-sm)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:ring-1 hover:ring-primary/20"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={difficultyVariant(algorithm.difficulty)}>
                          {algorithm.difficulty}
                        </Badge>
                        {operation ? <Badge variant="outline">{operation.name}</Badge> : null}
                      </div>
                      <h2 className="mt-5 text-xl font-extrabold transition-colors group-hover:text-primary-active">
                        {algorithm.name}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">
                        {algorithm.shortDescription}
                      </p>
                      <dl className="neu-inset mt-5 grid grid-cols-2 gap-3 rounded-xl p-3">
                        <div className="min-w-0">
                          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                            Time
                          </dt>
                          <dd className="mt-1 truncate font-mono text-xs font-bold text-foreground">
                            {algorithm.timeComplexityAverage}
                          </dd>
                        </div>
                        <div className="min-w-0">
                          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
                            Space
                          </dt>
                          <dd className="mt-1 truncate font-mono text-xs font-bold text-foreground">
                            {algorithm.spaceComplexity}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-sm font-bold text-primary-active">
                          Open visualizer
                        </span>
                        <ChevronRight
                          className="h-4 w-4 text-primary-active transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            <div className="neu-inset mt-6 rounded-2xl px-5 py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-extrabold">No matching algorithms</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Change the search term or reset the operation and difficulty filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveDifficulty("all");
                  setActiveOperation("all");
                }}
                className="mt-6 min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

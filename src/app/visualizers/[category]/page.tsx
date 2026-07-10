"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, BarChart3, ChevronRight, Clock, HardDrive, Search } from "lucide-react";
import { motion } from "framer-motion";
import { dataStructures } from "@/data/seed/data-structures";
import { algorithms } from "@/data/seed/algorithms";
import { operations } from "@/data/seed/operations";
import { fadeInUp, staggerContainer } from "@/lib/animation/spring-config";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const priorityClass = (priority: string) => {
  if (priority === "P0") return "bg-primary-muted text-primary border-primary/25";
  if (priority === "P1") return "bg-secondary-muted text-secondary border-secondary/25";
  if (priority === "P2") return "bg-warning-muted text-warning border-warning/25";
  return "bg-bg-surface-light text-text-muted border-border";
};

const difficultyClass = (difficulty: string) => {
  if (difficulty === "easy") return "bg-success-muted text-success border-success/20";
  if (difficulty === "medium") return "bg-warning-muted text-warning border-warning/20";
  return "bg-error-muted text-error border-error/20";
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const ds = dataStructures.find((item) => item.slug === category);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [activeOperation, setActiveOperation] = useState("all");

  const dsAlgorithms = useMemo(() => {
    if (!ds) return [];
    return algorithms
      .filter((algorithm) => algorithm.dataStructureId === ds.id)
      .sort((a, b) => (a.priority === b.priority ? a.name.localeCompare(b.name) : a.priority.localeCompare(b.priority)));
  }, [ds]);

  const operationCounts = useMemo(() => {
    const counts = new Map<string, number>();
    dsAlgorithms.forEach((algorithm) => counts.set(algorithm.operationId, (counts.get(algorithm.operationId) ?? 0) + 1));
    return counts;
  }, [dsAlgorithms]);

  const dsOperations = useMemo(() => {
    if (!ds) return [];
    return operations
      .filter((operation) => operation.dataStructureId === ds.id && (operationCounts.get(operation.id) ?? 0) > 0)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [ds, operationCounts]);


  const selectedOperation = activeOperation === "all" || dsOperations.some((operation) => operation.id === activeOperation)
    ? activeOperation
    : "all";

  const filteredAlgorithms = useMemo(() => {
    return dsAlgorithms.filter((algorithm) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = algorithm.name.toLowerCase().includes(query) || algorithm.shortDescription.toLowerCase().includes(query);
      const matchesDifficulty = activeDifficulty === "all" || algorithm.difficulty === activeDifficulty;
      const matchesOperation = selectedOperation === "all" || algorithm.operationId === selectedOperation;
      return matchesSearch && matchesDifficulty && matchesOperation;
    });
  }, [activeDifficulty, dsAlgorithms, searchQuery, selectedOperation]);

  if (!ds) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-deep text-text-primary">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-text-secondary mb-8">The data structure &quot;{category}&quot; does not exist.</p>
            <Link href="/visualizers" className="px-6 py-3 bg-primary text-bg-deep font-medium rounded-lg">
              Return to Library
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-deep text-text-primary">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-12">
            <Link href="/visualizers" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {ds.name} <span className="text-primary">Algorithms</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mb-8">
              {ds.description} Choose an algorithm below to start visualizing its step-by-step execution.
            </p>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-bg-surface p-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search algorithms..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-surface-light py-2.5 pl-10 pr-4 text-text-primary transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex w-full flex-wrap gap-4 md:w-auto">
                <select
                  className="w-full rounded-lg border border-border bg-bg-surface-light px-4 py-2.5 text-text-primary focus:border-primary focus:outline-none md:w-auto"
                  value={selectedOperation}
                  onChange={(event) => setActiveOperation(event.target.value)}
                >
                  <option value="all">All Operations</option>
                  {dsOperations.map((operation) => (
                    <option key={operation.id} value={operation.id}>{operation.name}</option>
                  ))}
                </select>

                <select
                  className="w-full rounded-lg border border-border bg-bg-surface-light px-4 py-2.5 text-text-primary focus:border-primary focus:outline-none md:w-auto"
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
          </div>

          {filteredAlgorithms.length > 0 ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAlgorithms.map((algorithm) => {
                const operation = dsOperations.find((item) => item.id === algorithm.operationId);
                return (
                  <motion.div key={algorithm.id} variants={fadeInUp}>
                    <Link href={`/visualizer/${algorithm.slug}`} className="block h-full">
                      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-surface p-6 transition-all duration-300 hover:border-primary hover:shadow-glow-primary">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider", difficultyClass(algorithm.difficulty))}>
                              {algorithm.difficulty}
                            </span>
                            <span className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider", priorityClass(algorithm.priority))}>
                              {algorithm.priority}
                            </span>
                          </div>
                          {operation && (
                            <span className="rounded-md border border-border bg-bg-surface-light px-2.5 py-1 text-xs font-medium text-text-muted">
                              {operation.name}
                            </span>
                          )}
                        </div>

                        <h3 className="mb-2 line-clamp-1 text-xl font-bold text-text-primary transition-colors group-hover:text-primary">
                          {algorithm.name}
                        </h3>
                        <p className="mb-4 flex-1 text-sm leading-6 text-text-secondary">{algorithm.shortDescription}</p>

                        <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-border bg-bg-surface-light p-3">
                          <div className="flex items-center text-xs">
                            <Clock className="mr-1.5 h-3.5 w-3.5 text-secondary" />
                            <span className="truncate text-text-secondary" title={algorithm.timeComplexityAverage}>{algorithm.timeComplexityAverage}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <HardDrive className="mr-1.5 h-3.5 w-3.5 text-primary" />
                            <span className="truncate text-text-secondary" title={algorithm.spaceComplexity}>{algorithm.spaceComplexity}</span>
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1.5">
                            <BarChart3 className="h-4 w-4 text-text-muted" />
                            <span className="text-xs font-medium text-text-muted">Interactive</span>
                          </div>
                          <div className="flex items-center text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                            Visualize <ChevronRight className="ml-1 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-border bg-bg-surface py-20 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-text-muted" />
              <h3 className="mb-2 text-xl font-bold text-text-primary">No algorithms found</h3>
              <p className="text-text-secondary">Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveDifficulty("all"); setActiveOperation("all"); }}
                className="mt-6 rounded-lg bg-primary-muted px-6 py-2 font-medium text-primary transition-colors hover:bg-primary hover:text-bg-deep"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

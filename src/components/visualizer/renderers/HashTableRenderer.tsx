"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { HashTableVisualState, HashEntry } from "@/visualizers/hash-table/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getVisualElementClassName } from "../visual-state";
import { EmptyVisualizerState } from "@/components/visualizer/EmptyVisualizerState";
import { Calculator, ArrowRight, CornerDownRight, Database, Layers } from "lucide-react";

export function HashTableRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return <EmptyVisualizerState />;
  }

  const dataState = currentStep.dataState as HashTableVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  const getElementColor = (id: string, isDeleted: boolean = false) =>
    isDeleted
      ? "border-vis-error/60 border-dashed bg-error-muted text-vis-error opacity-70"
      : getVisualElementClassName(highlights, id);

  const getBucketColor = (bucketId: string) => {
    if (highlights.error?.includes(bucketId))
      return "border-error text-error bg-error/10 shadow-[0_0_15px_rgba(239,68,68,0.25)]";
    if (highlights.active?.includes(bucketId))
      return "border-primary text-primary bg-primary/10 shadow-[0_0_15px_rgba(34,197,94,0.25)]";
    if (highlights.found?.includes(bucketId) || highlights.inserted?.includes(bucketId))
      return "border-success text-success bg-success/10 shadow-[0_0_15px_rgba(34,197,94,0.25)]";
    if (highlights.visited?.includes(bucketId))
      return "border-border text-text-muted bg-surface/40 opacity-60";

    return "border-border text-text-muted bg-surface/50";
  };

  const isRehashing = Boolean(dataState.rehash);
  const isOpenAddressing = dataState.collisionResolution !== "chaining";

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-start p-2 sm:p-4 overflow-hidden select-none"
      role="region"
      aria-label={`${currentStep.title}. Hash table state: ${dataState.elementCount} elements, load factor ${dataState.loadFactor.toFixed(2)}`}
    >
      {/* Top Section: Metrics & Active Formula Callout */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-2 sm:gap-3 mb-2 sm:mb-4 shrink-0">
        {/* Metrics Banner */}
        <div className="flex flex-wrap items-center justify-around sm:justify-center gap-2.5 sm:gap-6 rounded-xl border border-border bg-surface/80 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 shadow-xs max-w-full">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Database className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-text-muted">
                Capacity (m)
              </span>
              <span className="font-mono text-xs sm:text-base font-bold text-text-primary">
                {dataState.tableSize}
              </span>
            </div>
          </div>

          <div className="h-5 sm:h-6 w-px bg-border/80" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Layers className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-text-muted">
                Elements (n)
              </span>
              <span className="font-mono text-xs sm:text-base font-bold text-text-primary">
                {dataState.elementCount}
              </span>
            </div>
          </div>

          <div className="h-5 sm:h-6 w-px bg-border/80" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-text-muted">
                Load Factor (α)
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span
                  className={cn(
                    "font-mono text-xs sm:text-base font-bold",
                    dataState.loadFactor >= 0.75
                      ? "text-error"
                      : dataState.loadFactor >= 0.5
                        ? "text-warning"
                        : "text-success"
                  )}
                >
                  {dataState.loadFactor.toFixed(2)}
                </span>
                {dataState.loadFactor >= 0.75 && (
                  <span className="rounded bg-error/15 px-1 py-0.5 text-[8px] font-bold text-error uppercase">
                    High
                  </span>
                )}
              </div>
            </div>
          </div>

          {dataState.probingStrategy && (
            <>
              <div className="h-5 sm:h-6 w-px bg-border/80" />
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-text-muted">
                  Strategy
                </span>
                <span className="rounded-md bg-primary/10 px-1.5 sm:px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-primary uppercase">
                  {dataState.probingStrategy}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Active Mathematical Formula Banner */}
        {dataState.activeFormula && (
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-text-primary shadow-xs animate-in fade-in slide-in-from-top-1">
            <Calculator className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <span className="text-text-muted font-sans text-[11px]">Evaluation:</span>
            <span className="font-mono font-bold text-primary tracking-wide">
              {dataState.activeFormula}
            </span>
          </div>
        )}
      </div>

      {/* Main Canvas Region */}
      <div
        className="flex w-full flex-1 min-h-0 items-start justify-center overflow-y-auto overflow-x-auto px-2 pb-4"
        role="region"
        aria-label="Hash table visual canvas"
        tabIndex={0}
      >
        {isRehashing && dataState.rehash ? (
          /* ================= DUAL TABLE SYNCHRONIZED REHASH VIEW ================= */
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4 lg:gap-8 w-full max-w-5xl">
            {/* Old Table Column */}
            <div className="flex-1 flex flex-col items-center rounded-lg border border-border/80 bg-surface/50 p-3 sm:p-4 shadow-card min-w-65">
              <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-text-muted" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Old Table (m = {dataState.rehash.oldTableSize})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  Load: {(dataState.rehash.oldLoadFactor ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-2 w-full max-h-120 overflow-y-auto pr-1">
                {dataState.rehash.oldBuckets.map((entry, index) => {
                  const isOldActive =
                    dataState.rehash?.activeOldIndex === index ||
                    highlights.active?.includes(`old-bucket-${index}`);
                  const isVisited = highlights.visited?.includes(`old-bucket-${index}`);

                  return (
                    <div
                      key={`old-${index}`}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-1.5 transition-all duration-200",
                        isOldActive
                          ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(34,197,94,0.25)]"
                          : isVisited
                            ? "border-border/60 bg-surface/20 opacity-50"
                            : "border-border bg-surface/80"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-10 sm:h-9 sm:w-12 items-center justify-center rounded-lg font-mono text-xs font-bold shrink-0 border",
                          isOldActive
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-surface-secondary text-text-muted"
                        )}
                      >
                        {index}
                      </div>

                      <div className="flex-1 flex items-center justify-center h-8 sm:h-9 rounded-lg border border-dashed border-border/60 bg-background/30 font-mono text-sm font-bold text-text-primary">
                        {entry ? entry.key : <span className="text-text-muted/40">—</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Migration Center Indicator (Desktop Arrow) */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-2 text-text-muted shrink-0 self-center">
              <div className="rounded-full border border-primary/40 bg-primary/10 p-2 text-primary shadow-xs">
                <ArrowRight className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-center max-w-22.5">
                Re-hash k mod {dataState.tableSize}
              </span>
            </div>

            {/* New Table Column */}
            <div className="flex-1 flex flex-col items-center rounded-lg border border-border/80 bg-surface/50 p-3 sm:p-4 shadow-card min-w-65">
              <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    New Expanded Table (m = {dataState.tableSize})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-success font-semibold">
                  Load: {dataState.loadFactor.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-2 w-full max-h-120 overflow-y-auto pr-1">
                {(dataState.buckets as (HashEntry | null)[]).map((entry, index) => {
                  const bucketId = `bucket-${index}`;
                  const isNewActive =
                    dataState.rehash?.activeNewIndex === index ||
                    highlights.active?.includes(bucketId);

                  return (
                    <div
                      key={`new-${index}`}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-1.5 transition-all duration-200",
                        isNewActive
                          ? "border-success bg-success/10 shadow-[0_0_12px_rgba(34,197,94,0.2)]"
                          : "border-border bg-surface/80"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-10 sm:h-9 sm:w-12 items-center justify-center rounded-lg font-mono text-xs font-bold shrink-0 border",
                          isNewActive
                            ? "border-success bg-success text-white"
                            : "border-border bg-surface-secondary text-text-muted"
                        )}
                      >
                        {index}
                      </div>

                      <div className="flex-1 flex items-center justify-center h-8 sm:h-9 rounded-lg border border-dashed border-border/60 bg-background/30 relative">
                        <AnimatePresence mode="popLayout">
                          {entry ? (
                            <motion.div
                              key={entry.id}
                              layoutId={entry.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className={cn(
                                "flex h-full w-full items-center justify-center rounded-lg border text-sm font-bold font-mono transition-colors duration-300",
                                getElementColor(entry.id, entry.isDeleted)
                              )}
                            >
                              {entry.isDeleted ? "DEL" : entry.key}
                            </motion.div>
                          ) : (
                            <span className="text-text-muted/30 font-mono text-xs">empty</span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : isOpenAddressing ? (
          /* ================= OPEN ADDRESSING (LINEAR / QUADRATIC / DOUBLE) ================= */
          <div className="flex flex-col items-center gap-2 sm:gap-2.5 w-full max-w-md">
            {(dataState.buckets as (HashEntry | null)[]).map((entry, index) => {
              const bucketId = `bucket-${index}`;
              const isBucketHighlighted =
                highlights.active?.includes(bucketId) ||
                highlights.error?.includes(bucketId) ||
                highlights.found?.includes(bucketId);

              return (
                <div
                  key={bucketId}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-2 transition-all duration-200",
                    isBucketHighlighted
                      ? "bg-surface/90 shadow-card border-primary/40"
                      : "bg-surface/40 border-border"
                  )}
                >
                  {/* Bucket Index Box */}
                  <div
                    className={cn(
                      "flex h-11 w-14 sm:h-12 sm:w-16 items-center justify-center rounded-xl border-2 font-mono text-xs sm:text-sm font-bold shrink-0 transition-all duration-300",
                      getBucketColor(bucketId)
                    )}
                  >
                    <span className="text-[10px] text-text-muted mr-1">#</span>
                    {index}
                  </div>

                  {/* Bucket Entry Slot */}
                  <div className="flex-1 flex h-11 sm:h-12 items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-background/30 relative overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      {entry ? (
                        <motion.div
                          key={entry.id}
                          layoutId={entry.id}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className={cn(
                            "flex h-full w-full items-center justify-center rounded-lg border text-base sm:text-lg font-mono font-bold transition-all duration-300",
                            getElementColor(entry.id, entry.isDeleted)
                          )}
                        >
                          {entry.isDeleted ? (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-error">
                              <span className="font-mono">DEL</span>
                              <span className="text-[9px] uppercase tracking-wider opacity-75 hidden sm:inline">
                                (Tombstone)
                              </span>
                            </div>
                          ) : (
                            entry.key
                          )}
                        </motion.div>
                      ) : (
                        <span className="font-mono text-xs text-text-muted/35">null</span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= SEPARATE CHAINING (LINKED LISTS) ================= */
          <div className="flex flex-col items-center gap-3 w-full max-w-3xl">
            {(dataState.buckets as HashEntry[][]).map((chain, index) => {
              const bucketId = `bucket-${index}`;

              return (
                <div
                  key={bucketId}
                  className="flex w-full items-center gap-3 rounded-lg border border-border bg-surface/50 p-2.5 shadow-card"
                >
                  {/* Bucket Index Indicator */}
                  <div
                    className={cn(
                      "flex h-12 w-14 sm:h-14 sm:w-16 items-center justify-center rounded-xl border-2 font-mono text-xs sm:text-sm font-bold shrink-0 transition-all duration-300",
                      getBucketColor(bucketId)
                    )}
                  >
                    <span className="text-[10px] text-text-muted mr-1">#</span>
                    {index}
                  </div>

                  {/* Head Connector */}
                  <div className="flex items-center text-text-muted shrink-0 text-xs font-mono font-semibold">
                    <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-text-muted mr-1">
                      head
                    </span>
                    <CornerDownRight className="h-4 w-4 text-primary" />
                  </div>

                  {/* Linked List Chain Nodes */}
                  <div className="flex flex-1 items-center gap-2 overflow-x-auto momentum-scroll py-1 px-1 min-h-12">
                    {chain.length === 0 ? (
                      <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-border/60 px-3 py-1.5 text-xs font-mono text-text-muted/50">
                        <span>∅</span>
                        <span className="text-[10px]">NULL</span>
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {chain.map((entry, i) => (
                          <div key={entry.id} className="flex items-center gap-2 shrink-0">
                            {/* Linked List Node */}
                            <motion.div
                              layoutId={entry.id}
                              initial={{ opacity: 0, x: -16 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className={cn(
                                "flex items-stretch rounded-xl border-2 shadow-xs transition-colors duration-300 overflow-hidden",
                                getElementColor(entry.id)
                              )}
                            >
                              <div className="flex h-10 min-w-10 sm:h-12 sm:min-w-12 items-center justify-center px-2 text-sm sm:text-base font-bold font-mono">
                                {entry.key}
                              </div>
                              <div className="flex items-center justify-center border-l border-inherit bg-background/20 px-1.5 text-[9px] font-mono text-text-muted">
                                next
                              </div>
                            </motion.div>

                            {/* Arrow Pointer */}
                            {i < chain.length - 1 ? (
                              <ArrowRight className="h-4 w-4 text-text-muted shrink-0" />
                            ) : (
                              <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted/60 shrink-0">
                                <ArrowRight className="h-3.5 w-3.5" />
                                <span>NULL</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

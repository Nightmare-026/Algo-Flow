"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { HashTableVisualState, HashEntry } from "@/visualizers/hash-table/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getVisualElementClassName } from "../visual-state";

export function HashTableRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return (
      <div className="flex h-full w-full items-center justify-center text-text-muted">
        Preparing the hash-table state...
      </div>
    );
  }

  const dataState = currentStep.dataState as HashTableVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  const getElementColor = (id: string, isDeleted: boolean = false) =>
    isDeleted
      ? "border-vis-error/55 border-dashed bg-error-muted text-vis-error opacity-55"
      : getVisualElementClassName(highlights, id);

  const getBucketColor = (bucketId: string) => {
    if (highlights.error?.includes(bucketId))
      return "border-error text-error shadow-[0_0_15px_rgba(239,68,68,0.2)]";
    if (highlights.active?.includes(bucketId))
      return "border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]";
    if (highlights.found?.includes(bucketId))
      return "border-success text-success shadow-[0_0_15px_rgba(34,197,94,0.2)]";

    return "border-border text-text-muted";
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-start p-2 sm:p-4 overflow-hidden">
      {/* Metrics Banner */}
      <div className="mb-4 sm:mb-8 flex gap-4 sm:gap-8 rounded-lg border border-border bg-bg-surface/50 p-2 sm:p-4 shrink-0 scale-90 sm:scale-100">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-text-muted">Table Size</span>
          <span className="font-mono text-xl font-bold text-text-primary">
            {dataState.tableSize}
          </span>
        </div>
        <div className="h-full w-px bg-border" />
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-text-muted">Elements</span>
          <span className="font-mono text-xl font-bold text-text-primary">
            {dataState.elementCount}
          </span>
        </div>
        <div className="h-full w-px bg-border" />
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-text-muted">Load Factor</span>
          <span
            className={cn(
              "font-mono text-xl font-bold",
              dataState.loadFactor > 0.75 ? "text-error" : "text-success"
            )}
          >
            {dataState.loadFactor.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-1 min-h-0 items-start justify-center overflow-y-auto overflow-x-hidden px-2 sm:px-4 pb-4">
        <div className="flex flex-col gap-2 sm:gap-3">
          {dataState.collisionResolution === "linear-probing"
            ? /* Linear Probing Layout */
              (dataState.buckets as (HashEntry | null)[]).map((entry, index) => {
                const bucketId = `bucket-${index}`;
                return (
                  <div key={bucketId} className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-12 sm:h-12 sm:w-16 items-center justify-center rounded border-2 font-mono text-xs sm:text-sm font-bold transition-[transform,box-shadow,border-color,background-color,color,opacity] duration-300 shrink-0",
                        getBucketColor(bucketId)
                      )}
                    >
                      {index}
                    </div>

                    <div className="flex h-12 w-32 sm:h-14 sm:w-48 items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-bg-base/30 relative">
                      <AnimatePresence mode="popLayout">
                        {entry && (
                          <motion.div
                            key={entry.id}
                            layoutId={entry.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className={cn(
                              "visual-element absolute flex h-full w-full items-center justify-center rounded-lg border-2 text-lg font-bold transition-colors duration-300",
                              getElementColor(entry.id, entry.isDeleted)
                            )}
                          >
                            {entry.isDeleted ? "DEL" : entry.key}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })
            : /* Separate Chaining Layout */
              (dataState.buckets as HashEntry[][]).map((chain, index) => {
                const bucketId = `bucket-${index}`;
                return (
                  <div key={bucketId} className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-12 sm:h-12 sm:w-16 items-center justify-center rounded border-2 font-mono text-xs sm:text-sm font-bold transition-[transform,box-shadow,border-color,background-color,color,opacity] duration-300 shrink-0",
                        getBucketColor(bucketId)
                      )}
                    >
                      {index}
                    </div>

                    <div className="flex min-h-12 sm:min-h-14 items-center gap-3 overflow-x-auto pb-2">
                      {chain.length === 0 && (
                        <div className="flex h-14 w-14 items-center justify-center text-text-muted/30">
                          ∅
                        </div>
                      )}

                      <AnimatePresence mode="popLayout">
                        {chain.map((entry, i) => (
                          <div key={entry.id} className="flex items-center gap-3">
                            <motion.div
                              layoutId={entry.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0 }}
                              className={cn(
                                "visual-element flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg border-2 text-base sm:text-lg font-bold font-mono transition-colors duration-300",
                                getElementColor(entry.id)
                              )}
                            >
                              {entry.key}
                            </motion.div>

                            {i < chain.length - 1 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-border"
                              >
                                {"\u2192"}
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

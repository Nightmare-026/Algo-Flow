"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { HashSetVisualState, HashSetEntry } from "@/visualizers/hash-set/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getVisualElementClassName } from "../visual-state";

export function HashSetRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return null;
  }

  const dataState = currentStep.dataState as HashSetVisualState;
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
    <div className="absolute inset-0 flex flex-col items-center justify-start p-4 sm:p-8 overflow-hidden">
      {/* Metrics Banner */}
      <div className="mb-8 flex gap-4 sm:gap-8 rounded-lg border border-border bg-bg-surface/50 p-4 shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-text-muted">Set Size</span>
          <span className="font-mono text-xl font-bold text-text-primary">{dataState.setSize}</span>
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

      <div
        className="flex w-full h-full max-h-full items-start justify-center overflow-y-auto overflow-x-hidden px-4 pb-4"
        role="region"
        aria-label="Hash set canvas"
        tabIndex={0}
      >
        <div className="flex flex-col gap-3">
          {dataState.collisionResolution === "linear-probing"
            ? /* Linear Probing Layout */
              (dataState.buckets as (HashSetEntry | null)[]).map((entry, index) => {
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
              (dataState.buckets as HashSetEntry[][]).map((chain, index) => {
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

                    <div className="flex min-h-12 sm:min-h-14 items-center gap-2 rounded-lg border-2 border-dashed border-border/50 bg-bg-base/30 p-2">
                      {chain.length === 0 ? (
                        <span className="px-4 text-sm text-text-muted/50">Empty</span>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {chain.map((entry) => (
                            <motion.div
                              key={entry.id}
                              layoutId={entry.id}
                              initial={{ opacity: 0, x: -20, scale: 0.8 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className={cn(
                                "visual-element flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg border-2 text-base sm:text-lg font-bold font-mono transition-colors duration-300",
                                getElementColor(entry.id)
                              )}
                            >
                              {entry.key}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

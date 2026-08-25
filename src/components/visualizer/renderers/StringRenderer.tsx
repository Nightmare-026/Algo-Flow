"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { StringVisualState } from "@/visualizers/string/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getVisualElementClassName } from "../visual-state";

export function StringRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return null;
  }

  const dataState = currentStep.dataState as StringVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full p-8 relative gap-12 overflow-auto"
      role="img"
      aria-label={`${currentStep.title}. String visualizer state with text length ${dataState.elements?.length ?? 0}`}
    >
      {dataState.lps && (
        <section className="w-full max-w-3xl" aria-label="KMP LPS table">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              LPS Table
            </h2>
            <span className="rounded-full border border-border bg-surface px-2 py-1 text-xs text-text-muted">
              Phase: {dataState.phase ?? "preprocessing"}
            </span>
          </div>
          <div className="flex max-w-full justify-center gap-1 overflow-x-auto pb-2">
            {dataState.patternElements?.map((element, index) => (
              <div
                key={`lps-${element.id}`}
                className={cn(
                  "min-w-11 rounded-lg border-2 bg-surface p-1 text-center font-mono",
                  highlights.active?.includes(`lps-${index}`)
                    ? "border-primary shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
                    : "border-border"
                )}
              >
                <span className="block text-[10px] text-text-muted">{index}</span>
                <span className="block text-sm font-semibold text-text-secondary">
                  {element.char === " " ? "?" : element.char}
                </span>
                <span className="block text-lg font-bold text-primary">
                  {dataState.lps![index]}
                </span>
              </div>
            ))}
          </div>
          {dataState.matches && dataState.matches.length > 0 && (
            <p className="mt-1 text-center text-xs font-medium text-success">
              Match indexes: {dataState.matches.join(", ")}
            </p>
          )}
        </section>
      )}
      {/* Main String */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Text
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-full">
          <AnimatePresence mode="popLayout">
            {dataState.elements.map((element, index) => {
              const idStr = index.toString();
              return (
                <motion.div
                  layout
                  key={element.id}
                  initial={{ scale: 0.8, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 25 },
                    opacity: { duration: 0.2 },
                  }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="text-[10px] text-text-muted font-mono opacity-60">{index}</div>

                  <div
                    className={cn(
                      "visual-element relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 font-bold text-lg sm:text-xl transition-colors duration-200 shadow-sm font-mono",
                      getVisualElementClassName(highlights, idStr)
                    )}
                  >
                    {element.char === " " ? "\u2423" : element.char}

                    {/* Pointer Overlay */}
                    {highlights.pointer?.includes(idStr) && (
                      <motion.div
                        layoutId="string-pointer"
                        className="absolute -bottom-6 text-primary"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 19V5" />
                          <path d="M5 12l7-7 7 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Pattern String (if any) */}
      {dataState.patternElements && dataState.patternElements.length > 0 && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Pattern
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-1 max-w-full">
            <AnimatePresence mode="popLayout">
              {dataState.patternElements.map((element, index) => {
                const pStr = `p-${index}`;
                return (
                  <motion.div
                    layout
                    key={element.id}
                    initial={{ scale: 0.8, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    transition={{
                      layout: { type: "spring", stiffness: 300, damping: 25 },
                      opacity: { duration: 0.2 },
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="text-[10px] text-text-muted font-mono opacity-60">{index}</div>

                    <div
                      className={cn(
                        "visual-element relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 font-bold text-lg sm:text-xl transition-colors duration-200 shadow-sm font-mono",
                        getVisualElementClassName(highlights, pStr)
                      )}
                    >
                      {element.char === " " ? "\u2423" : element.char}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

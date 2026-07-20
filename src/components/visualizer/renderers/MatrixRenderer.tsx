"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { MatrixVisualState } from "@/visualizers/matrix/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getVisualElementClassName } from "../visual-state";

export function MatrixRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return null;
  }

  const dataState = currentStep.dataState as MatrixVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${dataState.cols}, minmax(0, 1fr))`,
    gap: "0.5rem",
  };

  return (
    <div className="flex items-center justify-center w-full h-full p-4 relative overflow-auto">
      <div className="flex flex-col gap-2 relative p-4 max-h-full max-w-full">
        {/* Row and Col Headers */}
        <div className="flex w-full mb-2 ml-8">
          <div style={gridStyle} className="w-full">
            {Array.from({ length: dataState.cols }).map((_, c) => (
              <div
                key={`col-header-${c}`}
                className="flex justify-center text-xs text-text-muted font-mono opacity-60 w-14 sm:w-16"
              >
                c{c}
              </div>
            ))}
          </div>
        </div>

        <div className="flex">
          {/* Row Labels */}
          <div className="flex flex-col gap-2 mr-2 pt-2">
            {Array.from({ length: dataState.rows }).map((_, r) => (
              <div
                key={`row-header-${r}`}
                className="flex items-center justify-end text-xs text-text-muted font-mono opacity-60 h-14 sm:h-16 pr-2"
              >
                r{r}
              </div>
            ))}
          </div>

          <div style={gridStyle}>
            <AnimatePresence mode="popLayout">
              {dataState.elements.map((element) => {
                const flatIndex = element.originalRow * dataState.cols + element.originalCol;
                const idStr = flatIndex.toString();
                return (
                  <motion.div
                    layout
                    key={element.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{
                      layout: { type: "spring", stiffness: 300, damping: 25 },
                      opacity: { duration: 0.2 },
                    }}
                    className={cn(
                      "visual-element relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 font-bold text-lg sm:text-xl transition-colors duration-200 shadow-sm",
                      getVisualElementClassName(highlights, idStr)
                    )}
                  >
                    {element.value}

                    {/* Pointer Overlay */}
                    {highlights.pointer?.includes(idStr) && (
                      <motion.div
                        layoutId="matrix-pointer"
                        className="absolute inset-0 border-4 border-primary rounded-xl pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

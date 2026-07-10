"use client";

import { usePlaybackStore } from "../../playback-store";
import { ArrayVisualState } from "../../../algorithms/array/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ArrayRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return (
      <div className="flex items-center justify-center w-full h-full text-text-muted">
        Array data not available.
      </div>
    );
  }

  const dataState = currentStep.dataState as ArrayVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  const getElementColor = (index: number) => {
    const idxStr = index.toString();
    if (highlights.error?.includes(idxStr)) return "bg-error border-error-muted text-error-foreground";
    if (highlights.found?.includes(idxStr)) return "bg-success border-success-muted text-success-foreground shadow-[0_0_15px_rgba(34,197,94,0.5)]";
    if (highlights.swapped?.includes(idxStr)) return "bg-warning border-warning-muted text-warning-foreground";
    if (highlights.compared?.includes(idxStr)) return "bg-secondary border-secondary-muted text-secondary-foreground";
    if (highlights.current?.includes(idxStr) || highlights.active?.includes(idxStr)) return "bg-primary border-primary-muted text-primary-foreground";
    if (highlights.sorted?.includes(idxStr)) return "bg-success/20 border-success/40 text-success glow-success";
    if (highlights.visited?.includes(idxStr)) return "bg-bg-surface-elevated border-primary/40 text-primary-muted";
    if (highlights.inserted?.includes(idxStr)) return "bg-info border-info-muted text-info-foreground";
    if (highlights.deleted?.includes(idxStr)) return "bg-error/20 border-error/40 text-error-muted opacity-50";
    
    // Default style
    return "bg-bg-surface border-border text-text-primary";
  };

  return (
    <div className="flex items-center justify-center w-full h-full p-8 relative">
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
        <AnimatePresence mode="popLayout">
          {dataState.elements.map((element, index) => (
            <motion.div
              layout
              key={element.id}
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                layout: { type: "spring", stiffness: 300, damping: 25 },
                opacity: { duration: 0.2 }
              }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-xs text-text-muted font-mono opacity-60">
                {index}
              </div>
              
              <div
                className={cn(
                  "relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 font-bold text-lg sm:text-xl transition-colors duration-200 shadow-sm",
                  getElementColor(index)
                )}
              >
                {element.value}

                {/* Pointer Overlay */}
                {highlights.pointer?.includes(index.toString()) && (
                  <motion.div 
                    layoutId="pointer"
                    className="absolute -bottom-8 text-primary"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5" />
                      <path d="M5 12l7-7 7 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}


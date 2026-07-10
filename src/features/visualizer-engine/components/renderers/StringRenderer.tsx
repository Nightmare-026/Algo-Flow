"use client";

import { usePlaybackStore } from "../../playback-store";
import { StringVisualState } from "../../../algorithms/string/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function StringRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return (
      <div className="flex items-center justify-center w-full h-full text-text-muted">
        String data not available.
      </div>
    );
  }

  const dataState = currentStep.dataState as StringVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  const getElementColor = (indexStr: string) => {
    if (highlights.error?.includes(indexStr)) return "bg-error border-error-muted text-error-foreground";
    if (highlights.found?.includes(indexStr)) return "bg-success border-success-muted text-success-foreground shadow-[0_0_15px_rgba(34,197,94,0.5)]";
    if (highlights.swapped?.includes(indexStr)) return "bg-warning border-warning-muted text-warning-foreground";
    if (highlights.compared?.includes(indexStr)) return "bg-secondary border-secondary-muted text-secondary-foreground";
    if (highlights.current?.includes(indexStr) || highlights.active?.includes(indexStr)) return "bg-primary border-primary-muted text-primary-foreground";
    if (highlights.sorted?.includes(indexStr)) return "bg-success/20 border-success/40 text-success glow-success";
    if (highlights.visited?.includes(indexStr)) return "bg-bg-surface-elevated border-primary/40 text-primary-muted";
    if (highlights.inserted?.includes(indexStr)) return "bg-info border-info-muted text-info-foreground";
    if (highlights.deleted?.includes(indexStr)) return "bg-error/20 border-error/40 text-error-muted opacity-50";
    
    // Default style
    return "bg-bg-surface border-border text-text-primary";
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 relative gap-12 overflow-auto">
      
      {/* Main String */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Text</h3>
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
                    opacity: { duration: 0.2 }
                  }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="text-[10px] text-text-muted font-mono opacity-60">
                    {index}
                  </div>
                  
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 font-bold text-lg sm:text-xl transition-colors duration-200 shadow-sm font-mono",
                      getElementColor(idStr)
                    )}
                  >
                    {element.char === ' ' ? '␣' : element.char}

                    {/* Pointer Overlay */}
                    {highlights.pointer?.includes(idStr) && (
                      <motion.div 
                        layoutId="string-pointer"
                        className="absolute -bottom-6 text-primary"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Pattern</h3>
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
                      opacity: { duration: 0.2 }
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="text-[10px] text-text-muted font-mono opacity-60">
                      {index}
                    </div>
                    
                    <div
                      className={cn(
                        "relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 font-bold text-lg sm:text-xl transition-colors duration-200 shadow-sm font-mono",
                        getElementColor(pStr)
                      )}
                    >
                      {element.char === ' ' ? '␣' : element.char}
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

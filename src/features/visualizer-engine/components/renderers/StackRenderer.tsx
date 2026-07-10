"use client";

import { usePlaybackStore } from "../../playback-store";
import { StackVisualState } from "../../../algorithms/stack/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function StackRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return (
      <div className="flex items-center justify-center w-full h-full text-text-muted">
        Stack data not available.
      </div>
    );
  }

  const dataState = currentStep.dataState as StackVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};
  const maxCapacity = dataState.maxCapacity || 8;

  const getElementColor = (id: string) => {
    if (highlights.error?.includes(id)) return "bg-error border-error-muted text-error-foreground";
    if (highlights.active?.includes(id)) return "bg-primary border-primary-muted text-primary-foreground";
    if (highlights.inserted?.includes(id)) return "bg-info border-info-muted text-info-foreground";
    if (highlights.deleted?.includes(id)) return "bg-error/20 border-error/40 text-error-muted opacity-50";
    if (highlights.sorted?.includes(id)) return "bg-success/20 border-success/40 text-success glow-success";
    
    // Default style
    return "bg-bg-surface border-border text-text-primary";
  };

  return (
    <div className="flex items-center justify-center w-full h-full p-8 relative">
      <div className="flex items-end justify-center h-full max-h-[500px]">
        {/* Container for Stack */}
        <div className="relative flex flex-col-reverse justify-start w-32 h-full border-b-4 border-x-4 border-border rounded-b-xl p-2 pb-0 gap-2 overflow-visible bg-bg-surface-light/30">
          
          <AnimatePresence mode="popLayout">
            {dataState.elements.map((element, index) => {
              const isTop = index === dataState.elements.length - 1;
              return (
                <motion.div
                  layout
                  key={element.id}
                  initial={{ scale: 0.8, opacity: 0, y: -40 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -40 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 25 },
                    opacity: { duration: 0.2 },
                    y: { type: "spring", stiffness: 300, damping: 25 }
                  }}
                  className="relative flex flex-col items-center"
                >
                  {/* Top Pointer */}
                  {isTop && (
                    <motion.div 
                      layoutId="top-pointer"
                      className="absolute -left-20 top-1/2 -translate-y-1/2 flex items-center text-primary font-bold"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <span>TOP</span>
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </motion.div>
                  )}
                  
                  <div
                    className={cn(
                      "flex items-center justify-center w-full h-12 sm:h-16 rounded-lg sm:rounded-xl border-2 font-bold text-lg sm:text-xl transition-all duration-300 shadow-sm font-mono",
                      getElementColor(element.id)
                    )}
                  >
                    {element.value}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Empty slots for capacity visualization */}
          {Array.from({ length: Math.max(0, maxCapacity - dataState.elements.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="w-full h-12 border-2 border-dashed border-border/50 rounded-lg opacity-30 flex-shrink-0" />
          ))}

        </div>
      </div>
    </div>
  );
}

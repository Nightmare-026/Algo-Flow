"use client";

import { usePlaybackStore } from "../../playback-store";
import { QueueVisualState } from "../../../algorithms/queue/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

export function QueueRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return (
      <div className="flex items-center justify-center w-full h-full text-text-muted">
        Queue data not available.
      </div>
    );
  }

  const dataState = currentStep.dataState as QueueVisualState;
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
    <div className="flex items-center justify-center w-full h-full p-8 relative overflow-hidden">
      <div className="flex flex-row items-center justify-start w-full max-w-3xl h-40 border-y-4 border-border px-4 py-4 gap-4 overflow-visible bg-bg-surface-light/30">
        
        <AnimatePresence mode="popLayout">
          {dataState.elements.map((element, index) => {
            const isFront = index === 0;
            const isRear = index === dataState.elements.length - 1;
            
            return (
              <motion.div
                layout
                key={element.id}
                initial={{ scale: 0.8, opacity: 0, x: 40 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.8, opacity: 0, x: -40 }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 25 },
                  opacity: { duration: 0.2 },
                  x: { type: "spring", stiffness: 300, damping: 25 }
                }}
                className="relative flex flex-col items-center flex-shrink-0"
              >
                {/* Front Pointer */}
                {isFront && (
                  <motion.div 
                    layoutId="front-pointer"
                    className="absolute -top-12 flex flex-col items-center text-primary font-bold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <span className="text-xs mb-1">FRONT</span>
                    <ArrowDown className="w-4 h-4" />
                  </motion.div>
                )}
                
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl border-2 font-bold text-lg sm:text-xl transition-all duration-300 shadow-sm font-mono",
                    getElementColor(element.id)
                  )}
                >
                  {element.value}
                </div>

                {/* Rear Pointer */}
                {isRear && (
                  <motion.div 
                    layoutId="rear-pointer"
                    className="absolute -bottom-12 flex flex-col items-center text-info font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <ArrowUp className="w-4 h-4 mb-1" />
                    <span className="text-xs">REAR</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, maxCapacity - dataState.elements.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="w-16 h-16 border-2 border-dashed border-border/50 rounded-xl opacity-30 flex-shrink-0" />
        ))}

      </div>
    </div>
  );
}

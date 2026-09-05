"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { usePlaybackStore } from "@/stores/playback-store";
import type { VisualStepHighlights } from "@/types";
import type { StackVisualState } from "@/visualizers/stack/types";
import {
  getVisualElementClassName,
  getVisualElementMotion,
  getVisualElementState,
} from "@/components/visualizer/visual-state";
import { cn } from "@/lib/utils";

export function StackRenderer() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep?.dataState) {
    return null;
  }

  const dataState = currentStep.dataState as StackVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights ?? {};
  const maxCapacity = dataState.maxCapacity || 8;
  const isEmpty = dataState.elements.length === 0;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center p-5 sm:p-8"
      role="img"
      aria-label={`${currentStep.title}. Stack contains ${dataState.elements.map((element) => element.value).join(", ") || "no values"}.`}
    >
      <div className="flex flex-col items-center justify-end h-full max-h-[520px]">
        {/* Open Top Indicator */}
        <div className="flex items-center gap-1 mb-1.5 text-[10px] font-mono font-medium tracking-wider uppercase text-text-muted/60">
          <span>↓ Push / Pop Entry (LIFO) ↑</span>
        </div>

        <div className="relative flex h-full w-32 sm:w-36 flex-col-reverse justify-start gap-2 overflow-visible rounded-b-xl border-b-4 border-x-4 border-border bg-bg-surface-light/35 p-2 pb-0">
          {/* Empty Stack TOP [-1] Indicator */}
          {isEmpty && (
            <>
              <div className="absolute -left-24 sm:-left-28 bottom-2 flex items-center font-mono text-[11px] font-bold text-vis-pointer">
                <span>TOP [-1]</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
              <div className="absolute inset-x-0 bottom-4 text-center font-mono text-[11px] font-medium text-text-muted/50 pointer-events-none">
                Empty Stack
                <span className="block text-[9px] text-text-muted/40 font-normal">top = -1</span>
              </div>
            </>
          )}

          <AnimatePresence mode="popLayout" initial={!reducedMotion}>
            {dataState.elements.map((element, index) => {
              const state = getVisualElementState(highlights, element.id);
              const visualMotion = getVisualElementMotion(state, reducedMotion);
              const isTop = index === dataState.elements.length - 1;
              return (
                <motion.div
                  layout={!reducedMotion}
                  key={element.id}
                  initial={visualMotion.initial}
                  animate={visualMotion.animate}
                  exit={visualMotion.exit}
                  transition={{
                    layout: reducedMotion
                      ? { duration: 0.01 }
                      : { type: "spring", stiffness: 320, damping: 27 },
                    ...visualMotion.transition,
                  }}
                  className="relative flex flex-col items-center"
                >
                  {/* Active Top Pointer */}
                  {isTop ? (
                    <motion.div
                      layoutId="top-pointer"
                      className="absolute -left-24 sm:-left-28 top-1/2 flex -translate-y-1/2 items-center font-mono text-[11px] font-bold text-vis-pointer whitespace-nowrap"
                      initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={
                        reducedMotion
                          ? { duration: 0.01 }
                          : { type: "spring", stiffness: 500, damping: 30 }
                      }
                    >
                      <span>TOP [{index}]</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </motion.div>
                  ) : null}

                  {/* Index label on right */}
                  <span
                    className="absolute -right-6 top-1/2 -translate-y-1/2 font-mono text-[9px] font-semibold text-text-muted/70 select-none"
                    title={`Index ${index}`}
                  >
                    [{index}]
                  </span>

                  <div
                    data-visual-state={state}
                    className={cn(
                      "visual-element flex h-12 w-full items-center justify-center rounded-lg border-2 font-mono text-base font-bold sm:h-14 sm:rounded-xl sm:text-lg",
                      getVisualElementClassName(highlights, element.id)
                    )}
                  >
                    {element.value}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty capacity slots */}
          {Array.from({ length: Math.max(0, maxCapacity - dataState.elements.length) }).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="h-12 sm:h-14 w-full shrink-0 rounded-lg border-2 border-dashed border-border/40 opacity-40"
              />
            )
          )}
        </div>

        {/* Chamber Pedestal Base */}
        <div className="h-2.5 w-36 sm:w-40 rounded-full border-t-2 border-border/70 bg-surface shadow-[var(--shadow-raised-sm)] -mt-0.5" />
        <div className="h-1.5 w-44 sm:w-48 rounded-full bg-border/30 -mt-0.5" />
      </div>
    </div>
  );
}

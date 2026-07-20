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

  return (
    <div
      className="relative flex h-full w-full items-center justify-center p-5 sm:p-8"
      role="img"
      aria-label={`${currentStep.title}. Stack contains ${dataState.elements.map((element) => element.value).join(", ") || "no values"}.`}
    >
      <div className="flex h-full max-h-[500px] items-end justify-center">
        <div className="relative flex h-full w-32 flex-col-reverse justify-start gap-2 overflow-visible rounded-b-xl border-b-4 border-x-4 border-border bg-bg-surface-light/35 p-2 pb-0">
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
                  {isTop ? (
                    <motion.div
                      layoutId="top-pointer"
                      className="absolute -left-20 top-1/2 flex -translate-y-1/2 items-center font-bold text-vis-pointer"
                      initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={
                        reducedMotion
                          ? { duration: 0.01 }
                          : { type: "spring", stiffness: 500, damping: 30 }
                      }
                    >
                      <span>TOP</span>
                      <ArrowRight className="ml-1 h-5 w-5" />
                    </motion.div>
                  ) : null}
                  <div
                    data-visual-state={state}
                    className={cn(
                      "visual-element flex h-12 w-full items-center justify-center rounded-lg border-2 font-mono text-lg font-bold sm:h-16 sm:rounded-xl sm:text-xl",
                      getVisualElementClassName(highlights, element.id)
                    )}
                  >
                    {element.value}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {Array.from({ length: Math.max(0, maxCapacity - dataState.elements.length) }).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="h-12 w-full shrink-0 rounded-lg border-2 border-dashed border-border/55 opacity-45"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

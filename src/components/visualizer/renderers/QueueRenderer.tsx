"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { usePlaybackStore } from "@/stores/playback-store";
import type { VisualStepHighlights } from "@/types";
import type { QueueVisualState } from "@/visualizers/queue/types";
import {
  getVisualElementClassName,
  getVisualElementMotion,
  getVisualElementState,
} from "@/components/visualizer/visual-state";
import { cn } from "@/lib/utils";

export function QueueRenderer() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep?.dataState) {
    return null;
  }

  const dataState = currentStep.dataState as QueueVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights ?? {};
  const maxCapacity = dataState.maxCapacity || 8;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-5 sm:p-8"
      role="img"
      aria-label={`${currentStep.title}. Queue contains ${dataState.elements.map((element) => element.value).join(", ") || "no values"}.`}
    >
      <div className="flex h-40 w-full max-w-3xl flex-row items-center justify-start gap-4 overflow-visible border-y-4 border-border bg-bg-surface-light/35 px-4 py-4">
        <AnimatePresence mode="popLayout" initial={!reducedMotion}>
          {dataState.elements.map((element, index) => {
            const state = getVisualElementState(highlights, element.id);
            const visualMotion = getVisualElementMotion(state, reducedMotion);
            const isFront = index === 0;
            const isRear = index === dataState.elements.length - 1;
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
                className="relative flex shrink-0 flex-col items-center"
              >
                {isFront ? (
                  <motion.div
                    layoutId="front-pointer"
                    className="absolute -top-12 flex flex-col items-center font-bold text-vis-pointer"
                    initial={reducedMotion ? false : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reducedMotion ? 0.01 : 0.25 }}
                  >
                    <span className="mb-1 text-xs">FRONT</span>
                    <ArrowDown className="h-4 w-4" />
                  </motion.div>
                ) : null}
                <div
                  data-visual-state={state}
                  className={cn(
                    "visual-element flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-lg font-bold sm:h-16 sm:w-16 sm:rounded-xl sm:text-xl",
                    getVisualElementClassName(highlights, element.id)
                  )}
                >
                  {element.value}
                </div>
                {isRear ? (
                  <motion.div
                    layoutId="rear-pointer"
                    className="absolute -bottom-12 flex flex-col items-center font-bold text-secondary"
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reducedMotion ? 0.01 : 0.25 }}
                  >
                    <ArrowUp className="mb-1 h-4 w-4" />
                    <span className="text-xs">REAR</span>
                  </motion.div>
                ) : null}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {Array.from({ length: Math.max(0, maxCapacity - dataState.elements.length) }).map(
          (_, index) => (
            <div
              key={`empty-${index}`}
              className="h-16 w-16 shrink-0 rounded-xl border-2 border-dashed border-border/55 opacity-45"
            />
          )
        )}
      </div>
    </div>
  );
}

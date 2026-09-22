"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePlaybackStore } from "@/stores/playback-store";
import type { VisualStepHighlights } from "@/types";
import type { ArrayVisualState } from "@/visualizers/array/types";
import {
  getVisualElementClassName,
  getVisualElementMotion,
  getVisualElementState,
} from "@/components/visualizer/visual-state";
import { cn } from "@/lib/utils";
import { EmptyVisualizerState } from "@/components/visualizer/EmptyVisualizerState";

export function ArrayRenderer() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep?.dataState) {
    return <EmptyVisualizerState />;
  }

  const dataState = currentStep.dataState as ArrayVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights ?? {};

  return (
    <div
      className="relative flex h-full w-full items-center justify-center p-5 sm:p-8"
      role="img"
      aria-label={`${currentStep.title}. Array values: ${dataState.elements.map((element) => element.value).join(", ")}`}
    >
      <div className="flex max-w-full flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        <AnimatePresence mode="popLayout" initial={!reducedMotion}>
          {dataState.elements.map((element, index) => {
            const id = element.id ?? index.toString();
            const state = getVisualElementState(highlights, id);
            const visualMotion = getVisualElementMotion(state, reducedMotion);
            return (
              <motion.div
                layout={!reducedMotion}
                key={id}
                initial={visualMotion.initial}
                animate={visualMotion.animate}
                exit={visualMotion.exit}
                transition={{
                  layout: reducedMotion
                    ? { duration: 0.01 }
                    : { type: "spring", stiffness: 320, damping: 27 },
                  ...visualMotion.transition,
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="font-mono text-xs tabular-nums text-text-muted">{index}</div>
                <div
                  data-visual-state={state}
                  className={cn(
                    "visual-element relative flex h-14 w-14 items-center justify-center rounded-xl border-2 font-mono text-lg font-bold sm:h-16 sm:w-16 sm:text-xl",
                    getVisualElementClassName(highlights, id)
                  )}
                >
                  {element.value}
                  {highlights.pointer?.includes(id) ? (
                    <motion.div
                      layoutId="array-pointer"
                      className="absolute -bottom-9 text-vis-pointer"
                      initial={reducedMotion ? false : { y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={
                        reducedMotion
                          ? { duration: 0.01 }
                          : { type: "spring", stiffness: 500, damping: 30 }
                      }
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                      </svg>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

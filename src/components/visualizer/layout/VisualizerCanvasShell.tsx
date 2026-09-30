"use client";

import { ReactNode, useState, RefObject } from "react";
import { Maximize2, SlidersHorizontal, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StepLegend, type StepLegendItem } from "../StepLegend";

export interface VisualizerCanvasShellProps {
  canvasRegionRef: RefObject<HTMLDivElement | null>;
  controls?: ReactNode;
  legend?: ReadonlyArray<StepLegendItem>;
  children: ReactNode;
  currentStepIndex: number;
  totalSteps: number;
  handleFullscreen: () => void;
  // Practice prompt state
  showPracticePrompt: boolean;
  practiceOptions: string[];
  practiceAnswer: string;
  practiceSelected: string | null;
  setPracticeSelected: (opt: string) => void;
  practiceFeedback: "correct" | "incorrect" | null;
  handlePracticeSubmit: () => void;
  handlePracticeSkip: () => void;
}

export function VisualizerCanvasShell({
  canvasRegionRef,
  controls,
  legend,
  children,
  currentStepIndex,
  totalSteps,
  handleFullscreen,
  showPracticePrompt,
  practiceOptions,
  practiceAnswer,
  practiceSelected,
  setPracticeSelected,
  practiceFeedback,
  handlePracticeSubmit,
  handlePracticeSkip,
}: VisualizerCanvasShellProps) {
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background min-h-0">
      {/* Desktop Controls: Always Visible */}
      {controls && (
        <div className="hidden lg:block w-full shrink-0 border-b border-border bg-surface/50 p-2 sm:p-2.5 shadow-card">
          {controls}
        </div>
      )}

      {/* Mobile / Tablet Collapsible Controls Tray */}
      {controls && (
        <div className="lg:hidden shrink-0 border-b border-border bg-surface/90 shadow-card">
          <div className="flex items-center justify-between px-3 py-1.5">
            <button
              type="button"
              onClick={() => setMobileControlsOpen(!mobileControlsOpen)}
              className="flex items-center gap-1.5 text-xs font-bold text-text-primary hover:text-primary transition-colors cursor-pointer touch-manipulation"
              aria-expanded={mobileControlsOpen}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
              <span>Data &amp; Operations</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-text-muted transition-transform duration-200",
                  mobileControlsOpen && "rotate-180"
                )}
              />
            </button>
            <span className="text-[10px] font-mono font-medium text-text-muted">
              {mobileControlsOpen ? "Tap to collapse" : "Custom inputs & size"}
            </span>
          </div>
          {mobileControlsOpen && (
            <div className="border-t border-border/60 p-2 bg-surface-secondary/40 animate-in fade-in duration-150 overflow-x-auto momentum-scroll">
              {controls}
            </div>
          )}
        </div>
      )}

      {legend && legend.length > 0 ? <StepLegend items={legend} /> : null}

      <div
        ref={canvasRegionRef}
        className="relative flex-1 overflow-hidden min-h-0 flex flex-col justify-center visualizer-canvas-container"
      >
        {children}

        {/* Practice Prompt Modal */}
        <AnimatePresence>
          {showPracticePrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-elevated"
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                  Interactive Challenge
                </span>
                <h3 className="mt-1 text-xl font-bold font-display text-text-primary">
                  Predict Next Step
                </h3>
                <p className="mt-2 text-xs text-text-secondary">
                  What operation will the algorithm perform in the next transition?
                </p>

                <div className="space-y-2.5 mt-5 mb-6">
                  {practiceOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setPracticeSelected(opt)}
                      className={cn(
                        "w-full rounded-sm border p-3.5 text-left text-xs font-bold transition-all cursor-pointer select-none",
                        practiceSelected === opt
                          ? "border-primary bg-primary-muted text-primary shadow-xs"
                          : "border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text-primary",
                        practiceFeedback === "correct" &&
                          opt === practiceAnswer &&
                          "border-success bg-success-muted text-success font-bold",
                        practiceFeedback === "incorrect" &&
                          practiceSelected === opt &&
                          "border-error bg-error-muted text-error font-bold"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <button
                    onClick={handlePracticeSkip}
                    className="text-xs font-bold text-text-muted hover:text-text-primary cursor-pointer"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handlePracticeSubmit}
                    disabled={!practiceSelected || practiceFeedback === "correct"}
                    className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-card hover:bg-primary-hover disabled:opacity-40 cursor-pointer"
                  >
                    Submit Answer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Step Badge */}
        <div className="absolute right-4 top-4 rounded-sm px-3 py-1.5 text-xs font-mono font-bold text-text-primary border border-border bg-surface/90 shadow-card backdrop-blur-md">
          {totalSteps > 0 ? (
            `Step ${currentStepIndex + 1} / ${totalSteps}`
          ) : (
            <span className="inline-block h-4 w-16 animate-pulse rounded bg-muted" />
          )}
        </div>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={handleFullscreen}
          className="absolute left-3 top-3 z-30 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-sm border border-border bg-surface/90 text-text-muted shadow-card transition-all hover:border-primary/40 hover:text-primary active:scale-95 cursor-pointer backdrop-blur-md touch-manipulation"
          title="Toggle Fullscreen Canvas"
          aria-label="Fullscreen Canvas"
        >
          <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}

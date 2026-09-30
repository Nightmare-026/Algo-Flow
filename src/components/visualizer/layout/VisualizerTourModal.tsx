"use client";

import { RefObject } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TourStepItem {
  target?: string;
  title: string;
  description: string;
}

export interface VisualizerTourModalProps {
  showTour: boolean;
  closeTour: () => void;
  tourModalRef: RefObject<HTMLDivElement | null>;
  algorithmName: string;
  tourSteps: TourStepItem[];
  tourStep: number;
  prevTourStep: () => void;
  nextTourStep: () => void;
  goToTourStep: (step: number) => void;
}

export function VisualizerTourModal({
  showTour,
  closeTour,
  tourModalRef,
  algorithmName,
  tourSteps,
  tourStep,
  prevTourStep,
  nextTourStep,
  goToTourStep,
}: VisualizerTourModalProps) {
  return (
    <AnimatePresence>
      {showTour && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
        >
          <motion.div
            ref={tourModalRef}
            tabIndex={-1}
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-elevated focus:outline-none"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="tour-title" className="text-xl font-bold font-display text-text-primary">
                Welcome to {algorithmName}
              </h2>
              <button
                onClick={closeTour}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                aria-label="Close tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {(() => {
              const step = tourSteps[tourStep];
              if (!step) return null;
              return (
                <>
                  <div className="mb-6">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                      Step {tourStep + 1} of {tourSteps.length}
                    </div>
                    <h3 className="text-lg font-bold font-display text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    {tourStep > 0 && (
                      <button
                        onClick={prevTourStep}
                        className="text-xs font-bold text-text-muted hover:text-text-primary cursor-pointer"
                      >
                        Previous
                      </button>
                    )}
                    <div className="flex items-center gap-2">
                      {tourSteps.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goToTourStep(i)}
                          className={cn(
                            "h-1.5 w-8 rounded-full transition-colors",
                            i === tourStep ? "bg-primary" : "bg-border"
                          )}
                          aria-label={`Go to step ${i + 1}`}
                        />
                      ))}
                    </div>
                    {tourStep < tourSteps.length - 1 ? (
                      <button
                        onClick={nextTourStep}
                        className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-card hover:bg-primary-hover cursor-pointer"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={closeTour}
                        className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-card hover:bg-primary-hover cursor-pointer"
                      >
                        Get Started
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

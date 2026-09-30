"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Algorithm, CodeExample } from "@/types";
import type { CodeLineMapping } from "@/visualizers/registry/types";
import { InspectorPanel } from "../InspectorPanel";

export interface VisualizerMobileDrawerProps {
  showInspector: boolean;
  setShowInspector: (show: boolean) => void;
  algorithm: Algorithm;
  codeExamples: CodeExample[];
  codeLineMapping?: ReadonlyArray<CodeLineMapping>;
  activeRightTab: "pseudocode" | "code";
  setActiveRightTab: (tab: "pseudocode" | "code") => void;
  activeLowerTab: "explanation" | "log";
  setActiveLowerTab: (tab: "explanation" | "log") => void;
  setActiveLanguage: (lang: string) => void;
  currentStepIndex: number;
  totalSteps: number;
}

export function VisualizerMobileDrawer({
  showInspector,
  setShowInspector,
  algorithm,
  codeExamples,
  codeLineMapping,
  activeRightTab,
  setActiveRightTab,
  activeLowerTab,
  setActiveLowerTab,
  setActiveLanguage,
  currentStepIndex,
  totalSteps,
}: VisualizerMobileDrawerProps) {
  return (
    <AnimatePresence>
      {showInspector && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Inspector panels"
        >
          {/* Full-screen Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setShowInspector(false)}
            aria-hidden="true"
          />

          {/* Bottom Sheet Drawer */}
          <motion.aside
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-x-0 bottom-0 z-10 flex h-[82vh] max-h-[88vh] w-full flex-col rounded-t-2xl border-t border-border bg-surface shadow-elevated pb-safe overflow-hidden"
          >
            {/* Header with Drag Handle, Title and Close Button */}
            <div className="flex shrink-0 flex-col border-b border-border bg-surface/95 backdrop-blur-md px-4 pt-2.5 pb-2">
              <div className="drag-handle mb-2" aria-hidden="true" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold font-display text-text-primary truncate">
                    {algorithm.name} Inspector
                  </span>
                  <span className="rounded-md border border-border bg-surface-hover px-1.5 py-0.5 text-[10px] font-mono text-text-muted shrink-0">
                    Step {currentStepIndex + 1}/{totalSteps}
                  </span>
                </div>
                <button
                  onClick={() => setShowInspector(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-all active:scale-95 cursor-pointer touch-manipulation"
                  aria-label="Close inspector"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto momentum-scroll">
              <InspectorPanel
                activeRightTab={activeRightTab}
                setActiveRightTab={setActiveRightTab}
                activeLowerTab={activeLowerTab}
                setActiveLowerTab={setActiveLowerTab}
                setActiveLanguage={setActiveLanguage}
                algorithm={algorithm}
                codeExamples={codeExamples}
                codeLineMapping={codeLineMapping}
              />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

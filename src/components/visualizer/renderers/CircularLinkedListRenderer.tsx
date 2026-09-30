"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { CircularLinkedListVisualState, LinkedListNode } from "@/visualizers/linked-list/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight, RotateCw } from "lucide-react";
import { getVisualElementClassName } from "../visual-state";
import { EmptyVisualizerState } from "@/components/visualizer/EmptyVisualizerState";

export function CircularLinkedListRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return <EmptyVisualizerState />;
  }

  const dataState = currentStep.dataState as CircularLinkedListVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  // Build ordered list starting from head
  const orderedNodes: LinkedListNode[] = [];
  let currentId = dataState.headId;
  const visited = new Set<string>();

  while (currentId) {
    const node = dataState.nodes.find((n) => n.id === currentId);
    if (!node || visited.has(currentId)) break;
    orderedNodes.push(node);
    visited.add(currentId);
    currentId = node.nextId;
  }

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full p-8 relative overflow-hidden"
      role="region"
      aria-label={`${currentStep.title}. Circular linked list values: ${orderedNodes.map((n) => n.value).join(" -> ")} (tail links to head)`}
    >
      {/* Visual Indicator of Circular Nature */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-muted text-primary-active text-xs font-semibold border border-primary/20">
        <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} />
        <span>Circular Structure (Tail points to Head)</span>
      </div>

      <div className="relative flex flex-col items-center max-w-full">
        <div className="flex flex-wrap items-center justify-center gap-y-16 gap-x-2 max-w-full">
          <AnimatePresence mode="popLayout">
            {orderedNodes.map((node, index) => {
              const isHead = node.id === dataState.headId;
              const isTail = node.id === dataState.tailId || index === orderedNodes.length - 1;
              const hasNextLinear = index < orderedNodes.length - 1;

              return (
                <div key={node.id} className="flex items-center gap-2">
                  <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    transition={{ layout: { type: "spring", stiffness: 300, damping: 25 } }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Head Pointer */}
                    {isHead && (
                      <motion.div
                        layoutId="head-pointer-cll"
                        className="absolute -top-12 flex flex-col items-center text-primary font-bold"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <span className="text-xs mb-1">HEAD</span>
                        <ArrowDown className="w-4 h-4" />
                      </motion.div>
                    )}

                    {/* Tail Pointer */}
                    {isTail && !isHead && (
                      <motion.div
                        layoutId="tail-pointer-cll"
                        className="absolute -top-12 flex flex-col items-center text-secondary font-bold"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <span className="text-xs mb-1">TAIL</span>
                        <ArrowDown className="w-4 h-4" />
                      </motion.div>
                    )}

                    {/* Node Box */}
                    <div className="flex flex-row items-center h-12 sm:h-16 rounded-lg sm:rounded-xl border-2 overflow-hidden shadow-sm">
                      <div
                        className={cn(
                          "visual-element flex items-center justify-center w-12 sm:w-16 h-full font-bold text-lg sm:text-xl font-mono transition-colors duration-200",
                          getVisualElementClassName(highlights, node.id)
                        )}
                      >
                        {node.value}
                      </div>
                      <div className="flex items-center justify-center w-6 sm:w-8 h-full bg-surface-secondary border-l-2 border-border">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-text-muted" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Linear arrow to next */}
                  {hasNextLinear && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="flex items-center text-primary"
                    >
                      <ArrowRight className="w-6 h-6" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              );
            })}

            {/* Empty List state */}
            {orderedNodes.length === 0 && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-14 px-4 border-2 border-dashed border-border rounded-xl font-mono text-text-muted"
              >
                HEAD = null (Empty Circular List)
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Circular Return Arc (Tail -> Head) */}
        {orderedNodes.length > 1 && (
          <div className="w-full mt-6 pt-2 border-b-2 border-l-2 border-r-2 border-primary/40 rounded-b-3xl h-8 flex items-center justify-center relative">
            <span className="text-[11px] font-mono font-bold text-primary px-3 bg-surface rounded-full -bottom-2.5 absolute border border-primary/30">
              loopback → HEAD
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

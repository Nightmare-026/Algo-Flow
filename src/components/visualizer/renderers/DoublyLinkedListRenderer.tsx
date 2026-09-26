"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { DoublyLinkedListVisualState, DoublyLinkedListNode } from "@/visualizers/linked-list/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { getVisualElementClassName } from "../visual-state";
import { EmptyVisualizerState } from "@/components/visualizer/EmptyVisualizerState";

export function DoublyLinkedListRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return <EmptyVisualizerState />;
  }

  const dataState = currentStep.dataState as DoublyLinkedListVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  // Build ordered list from head
  const orderedNodes: DoublyLinkedListNode[] = [];
  let currentId = dataState.headId;
  const visited = new Set<string>();

  while (currentId) {
    const node = dataState.nodes.find((n) => n.id === currentId);
    if (!node || visited.has(currentId)) break;
    orderedNodes.push(node);
    visited.add(currentId);
    currentId = node.nextId;
  }

  // Any unlinked nodes
  const unlinkedNodes = dataState.nodes.filter((node) => !visited.has(node.id));

  return (
    <div
      className="flex items-center justify-center w-full h-full p-8 relative overflow-hidden"
      role="img"
      aria-label={`${currentStep.title}. Doubly linked list values: ${orderedNodes.map((n) => n.value).join(" <-> ")}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-y-16 gap-x-2 max-w-full">
        <AnimatePresence mode="popLayout">
          {/* Leading null indicator for head.prev */}
          {orderedNodes.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-14 px-2 font-mono text-text-muted font-bold text-xs"
            >
              null ←
            </motion.div>
          )}

          {/* Main Chain */}
          {orderedNodes.map((node, index) => {
            const isHead = node.id === dataState.headId;
            const isTail = node.id === dataState.tailId;
            const hasNext = index < orderedNodes.length - 1;

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
                      layoutId="head-pointer-dll"
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
                      layoutId="tail-pointer-dll"
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
                    {/* Prev Pointer Area */}
                    <div
                      className="flex items-center justify-center w-5 sm:w-6 h-full bg-surface-secondary border-r-2 border-border"
                      title="Prev pointer"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-text-muted" />
                    </div>
                    {/* Value Area */}
                    <div
                      className={cn(
                        "visual-element flex items-center justify-center w-12 sm:w-16 h-full font-bold text-lg sm:text-xl font-mono transition-colors duration-200",
                        getVisualElementClassName(highlights, node.id)
                      )}
                    >
                      {node.value}
                    </div>
                    {/* Next Pointer Area */}
                    <div
                      className="flex items-center justify-center w-5 sm:w-6 h-full bg-surface-secondary border-l-2 border-border"
                      title="Next pointer"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-text-muted" />
                    </div>
                  </div>
                </motion.div>

                {/* Bidirectional Arrow */}
                {hasNext && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="flex flex-col items-center justify-center text-text-muted px-1"
                  >
                    <div className="flex items-center text-primary -mb-1">
                      <span className="text-[10px] font-mono mr-0.5">next</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div className="flex items-center text-secondary -mt-1">
                      <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                      <span className="text-[10px] font-mono ml-0.5">prev</span>
                    </div>
                  </motion.div>
                )}

                {/* Trailing Null indicator if tail */}
                {!hasNext && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-14 px-2 font-mono text-text-muted font-bold text-xs"
                  >
                    → null
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
              HEAD = null | TAIL = null
            </motion.div>
          )}

          {/* Unlinked Nodes */}
          {unlinkedNodes.length > 0 && (
            <div className="flex items-center gap-6 ml-8 pl-8 border-l-2 border-dashed border-border/50">
              {unlinkedNodes.map((node) => (
                <div key={node.id} className="flex items-center gap-2 opacity-85">
                  <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="flex flex-row items-center h-12 sm:h-16 rounded-lg sm:rounded-xl border-2 border-dashed overflow-hidden shadow-sm"
                  >
                    <div className="flex items-center justify-center w-5 sm:w-6 h-full bg-surface-secondary border-r-2 border-border border-dashed">
                      <div className="w-1.5 h-1.5 rounded-full bg-text-muted/50" />
                    </div>
                    <div
                      className={cn(
                        "visual-element flex items-center justify-center w-12 sm:w-16 h-full font-bold text-lg sm:text-xl font-mono",
                        getVisualElementClassName(highlights, node.id)
                      )}
                    >
                      {node.value}
                    </div>
                    <div className="flex items-center justify-center w-5 sm:w-6 h-full bg-surface-secondary border-l-2 border-border border-dashed">
                      <div className="w-1.5 h-1.5 rounded-full bg-text-muted/50" />
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

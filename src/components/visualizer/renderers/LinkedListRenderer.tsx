"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { LinkedListVisualState, LinkedListNode } from "@/visualizers/linked-list/types";
import { VisualStepHighlights } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowDown } from "lucide-react";
import { getVisualElementClassName } from "../visual-state";

export function LinkedListRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return null;
  }

  const dataState = currentStep.dataState as LinkedListVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  const getPointerColor = (sourceId: string) => {
    if (highlights.pointer?.includes(sourceId)) return "text-primary";
    return "text-text-muted";
  };

  // We should render nodes in the order they are linked starting from head
  // If a node is not linked but exists (like a newly created node), we render it at the end or floating
  const orderedNodes: LinkedListNode[] = [];
  const unlinkedNodes: LinkedListNode[] = [];

  let currentId = dataState.headId;
  const visited = new Set<string>();

  while (currentId) {
    const node = dataState.nodes.find((n) => n.id === currentId);
    if (!node || visited.has(currentId)) break;
    orderedNodes.push(node);
    visited.add(currentId);
    currentId = node.nextId;
  }

  // Find nodes that aren't in the main chain
  dataState.nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      unlinkedNodes.push(node);
    }
  });

  return (
    <div className="flex items-center justify-center w-full h-full p-8 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-center gap-y-16 gap-x-2 max-w-full">
        <AnimatePresence mode="popLayout">
          {/* Main Chain */}
          {orderedNodes.map((node) => {
            const isHead = node.id === dataState.headId;
            const hasNext = node.nextId !== null;

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
                      layoutId="head-pointer"
                      className="absolute -top-12 flex flex-col items-center text-primary font-bold"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-xs mb-1">HEAD</span>
                      <ArrowDown className="w-4 h-4" />
                    </motion.div>
                  )}

                  {/* Node Box */}
                  <div className="flex flex-row items-center h-12 sm:h-16 rounded-lg sm:rounded-xl border-2 overflow-hidden shadow-sm">
                    {/* Value Area */}
                    <div
                      className={cn(
                        "visual-element flex items-center justify-center w-12 sm:w-16 h-full font-bold text-lg sm:text-xl font-mono transition-colors duration-200",
                        getVisualElementClassName(highlights, node.id)
                      )}
                    >
                      {node.value}
                    </div>
                    {/* Pointer Area */}
                    <div className="flex items-center justify-center w-6 sm:w-8 h-full bg-bg-surface-elevated border-l-2 border-border">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-text-muted" />
                    </div>
                  </div>
                </motion.div>

                {/* Arrow to next */}
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className={cn(
                    "flex items-center transition-colors duration-300",
                    getPointerColor(node.id)
                  )}
                >
                  <ArrowRight className="w-6 h-6" strokeWidth={3} />
                </motion.div>

                {/* Null indicator if tail */}
                {!hasNext && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-14 px-2 font-mono text-text-muted font-bold"
                  >
                    null
                  </motion.div>
                )}
              </div>
            );
          })}

          {/* Empty List state */}
          {orderedNodes.length === 0 && !dataState.headId && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-14 px-4 border-2 border-dashed border-border rounded-xl font-mono text-text-muted"
            >
              HEAD -{">"} null
            </motion.div>
          )}

          {/* Unlinked Nodes (e.g. newly created before linking) */}
          {unlinkedNodes.length > 0 && (
            <div className="flex items-center gap-8 ml-8 pl-8 border-l-2 border-dashed border-border/50">
              {unlinkedNodes.map((node) => (
                <div key={node.id} className="flex items-center gap-2 opacity-80">
                  <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: -20 }}
                    className="flex flex-row items-center h-12 sm:h-16 rounded-lg sm:rounded-xl border-2 border-dashed overflow-hidden shadow-sm"
                  >
                    <div
                      className={cn(
                        "visual-element flex items-center justify-center w-12 sm:w-16 h-full font-bold text-lg sm:text-xl font-mono transition-colors duration-200",
                        getVisualElementClassName(highlights, node.id)
                      )}
                    >
                      {node.value}
                    </div>
                    <div className="flex items-center justify-center w-6 sm:w-8 h-full bg-bg-surface-elevated border-l-2 border-border border-dashed">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-text-muted/50" />
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

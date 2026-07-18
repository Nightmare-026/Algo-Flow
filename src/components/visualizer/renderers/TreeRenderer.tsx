"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { TreeVisualState, TreeNodeData } from "@/visualizers/tree/types";
import { VisualStepHighlights } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo, useRef, useEffect, useState } from "react";
import { getVisualElementClassName } from "../visual-state";

interface NodeLayout {
  id: string;
  value: number;
  x: number;
  y: number;
  leftId?: string;
  rightId?: string;
  parentId?: string;
}

export function TreeRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const dataState = (currentStep?.dataState as TreeVisualState) || {};
  const highlights: VisualStepHighlights = currentStep?.highlights || {};

  const layout = useMemo(() => {
    const nodes: NodeLayout[] = [];
    if (!dataState.root) return nodes;

    const traverse = (
      node: TreeNodeData,
      level: number,
      leftBound: number,
      rightBound: number,
      parentId?: string
    ) => {
      const x = (leftBound + rightBound) / 2;
      const y = level * 80 + 40; // 80px vertical spacing, 40px top padding

      const layoutNode: NodeLayout = {
        id: node.id,
        value: node.value,
        x,
        y,
        parentId,
        leftId: node.left?.id,
        rightId: node.right?.id,
      };

      nodes.push(layoutNode);

      if (node.left) {
        traverse(node.left, level + 1, leftBound, x, node.id);
      }
      if (node.right) {
        traverse(node.right, level + 1, x, rightBound, node.id);
      }
    };

    traverse(dataState.root, 0, 0, containerWidth);
    return nodes;
  }, [dataState.root, containerWidth]);

  if (!currentStep || !currentStep.dataState) {
    return (
      <div className="flex items-center justify-center w-full h-full text-text-muted">
        Preparing the tree state…
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex items-start justify-center w-full h-full relative overflow-visible bg-bg-surface-light/30 rounded-xl"
    >
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full overflow-visible">
          {layout.map((node) => {
            if (node.parentId) {
              const parent = layout.find((n) => n.id === node.parentId);
              if (parent) {
                return (
                  <motion.line
                    key={`line-${node.id}-${parent.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={node.x}
                    y2={node.y}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                );
              }
            }
            return null;
          })}
        </svg>
      </div>

      {layout.map((node) => (
        <motion.div
          key={node.id}
          layoutId={node.id}
          className={cn(
            "visual-element absolute left-0 top-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 font-bold shadow-sm z-10 transition-colors duration-200 text-lg sm:text-xl font-mono",
            getVisualElementClassName(highlights, node.id)
          )}
          initial={{ opacity: 0, scale: 0.5, x: node.x - 24, y: node.y - 24 }}
          animate={{ opacity: 1, scale: 1, x: node.x - 24, y: node.y - 24 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {node.value}
        </motion.div>
      ))}
    </div>
  );
}

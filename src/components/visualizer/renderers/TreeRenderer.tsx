"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { usePlaybackStore } from "@/stores/playback-store";
import { useTheme } from "@/components/providers/ThemeProvider";
import { TreeVisualState, TreeNodeData } from "@/visualizers/tree/types";
import { VisualStepHighlights } from "@/types";
import { ReactFlow, Node, Edge, Background, BackgroundVariant } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getVisualElementState } from "../visual-state";
import { EmptyVisualizerState } from "@/components/visualizer/EmptyVisualizerState";

function getNodeColor(id: string, highlights: VisualStepHighlights) {
  const state = getVisualElementState(highlights, id);
  const palette = {
    default: {
      bg: "var(--bg-surface)",
      text: "var(--text-primary)",
      border: "var(--border)",
      glow: "none",
    },
    current: {
      bg: "var(--primary-muted)",
      text: "var(--vis-current-text, var(--primary))",
      border: "var(--vis-current)",
      glow: "var(--shadow-glow-primary, 0 0 0 4px rgba(22, 163, 74, 0.25))",
    },
    compared: {
      bg: "var(--warning-muted)",
      text: "var(--vis-compared-text, var(--warning))",
      border: "var(--vis-compared)",
      glow: "0 0 0 4px rgba(234, 179, 8, 0.25)",
    },
    swapped: {
      bg: "var(--secondary-muted)",
      text: "var(--vis-swapped-text, var(--secondary))",
      border: "var(--vis-swapped)",
      glow: "0 0 0 4px rgba(15, 118, 110, 0.25)",
    },
    inserted: {
      bg: "var(--primary-muted)",
      text: "var(--vis-current-text, var(--primary))",
      border: "var(--vis-current)",
      glow: "var(--shadow-glow-primary, 0 0 0 4px rgba(22, 163, 74, 0.25))",
    },
    deleted: {
      bg: "var(--error-muted)",
      text: "var(--vis-error-text, var(--error))",
      border: "var(--vis-error)",
      glow: "0 0 0 4px rgba(239, 68, 68, 0.25)",
    },
    found: {
      bg: "var(--success-muted)",
      text: "var(--vis-found-text, var(--success))",
      border: "var(--vis-found)",
      glow: "0 0 0 4px rgba(34, 197, 94, 0.25)",
    },
    error: {
      bg: "var(--error-muted)",
      text: "var(--vis-error-text, var(--error))",
      border: "var(--vis-error)",
      glow: "0 0 0 4px rgba(239, 68, 68, 0.25)",
    },
    sorted: {
      bg: "var(--success-muted)",
      text: "var(--vis-sorted-text, var(--success))",
      border: "var(--vis-sorted)",
      glow: "0 0 0 4px rgba(34, 197, 94, 0.25)",
    },
    visited: {
      bg: "var(--primary-muted)",
      text: "var(--vis-visited-text, var(--text-secondary))",
      border: "var(--vis-visited)",
      glow: "none",
    },
  };
  return palette[state];
}

function describeTree(root: TreeNodeData | null): string {
  if (!root) return "Tree is empty.";

  const relationships: string[] = [`root ${root.value}`];
  const queue: TreeNodeData[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.left) {
      relationships.push(`left child ${node.left.value} of ${node.value}`);
      queue.push(node.left);
    }
    if (node.right) {
      relationships.push(`right child ${node.right.value} of ${node.value}`);
      queue.push(node.right);
    }
  }
  return `Tree: ${relationships.join("; ")}.`;
}

export function TreeRenderer() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const currentStep = steps[currentStepIndex];

  const dataState = (currentStep?.dataState as TreeVisualState) || {};
  const traversalOutput = dataState.traversalOutput ?? [];
  const callStack = dataState.callStack ?? [];
  const accessibleLabel = `${describeTree(dataState.root)} Current traversal output: ${
    traversalOutput.join(", ") || "empty"
  }.`;

  const { reactFlowNodes, reactFlowEdges } = useMemo(() => {
    const highlights: VisualStepHighlights = currentStep?.highlights ?? {};
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    if (!dataState.root) return { reactFlowNodes: nodes, reactFlowEdges: edges };

    function getDepth(node: TreeNodeData | null): number {
      if (!node) return 0;
      return 1 + Math.max(getDepth(node.left), getDepth(node.right));
    }

    const depth = getDepth(dataState.root);
    const totalWidth = Math.max(700, Math.pow(2, depth - 1) * 90);

    const traverse = (node: TreeNodeData, level: number, leftBound: number, rightBound: number) => {
      const x = (leftBound + rightBound) / 2;
      const y = level * 85 + 40;
      const colors = getNodeColor(node.id, highlights);

      nodes.push({
        id: node.id,
        position: { x: x - 26, y: y - 26 },
        data: { label: String(node.value) },
        className: "visual-element",
        style: {
          background: colors.bg,
          color: colors.text,
          border: `3px solid ${colors.border}`,
          boxShadow: colors.glow,
          borderRadius: "50%",
          width: 52,
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 16,
          fontFamily: "var(--font-mono, monospace)",
          transition: reducedMotion
            ? "none"
            : "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
        },
        draggable: false,
        selectable: false,
      });

      if (node.left) {
        const isEdgeActive =
          (highlights.active?.includes(node.id) || highlights.visited?.includes(node.id)) &&
          (highlights.active?.includes(node.left.id) || highlights.visited?.includes(node.left.id));

        edges.push({
          id: `e-${node.id}-${node.left.id}`,
          source: node.id,
          target: node.left.id,
          type: "straight",
          style: {
            stroke: isEdgeActive ? "var(--primary)" : "var(--border)",
            strokeWidth: isEdgeActive ? 3.5 : 2,
            transition: reducedMotion ? "none" : "stroke 0.3s ease, stroke-width 0.3s ease",
          },
          animated: !reducedMotion && isEdgeActive,
          selectable: false,
        });

        traverse(node.left, level + 1, leftBound, x);
      }

      if (node.right) {
        const isEdgeActive =
          (highlights.active?.includes(node.id) || highlights.visited?.includes(node.id)) &&
          (highlights.active?.includes(node.right.id) ||
            highlights.visited?.includes(node.right.id));

        edges.push({
          id: `e-${node.id}-${node.right.id}`,
          source: node.id,
          target: node.right.id,
          type: "straight",
          style: {
            stroke: isEdgeActive ? "var(--primary)" : "var(--border)",
            strokeWidth: isEdgeActive ? 3.5 : 2,
            transition: reducedMotion ? "none" : "stroke 0.3s ease, stroke-width 0.3s ease",
          },
          animated: !reducedMotion && isEdgeActive,
          selectable: false,
        });

        traverse(node.right, level + 1, x, rightBound);
      }
    };

    traverse(dataState.root, 0, 0, totalWidth);
    return { reactFlowNodes: nodes, reactFlowEdges: edges };
  }, [dataState.root, currentStep?.highlights, reducedMotion]);

  if (!currentStep || !currentStep.dataState) {
    return <EmptyVisualizerState />;
  }

  return (
    <div
      className="flex items-center justify-center w-full h-full relative overflow-hidden rounded-lg border border-border/60 bg-surface shadow-card"
      role="region"
      aria-label={accessibleLabel}
    >
      <ReactFlow
        key={pathname}
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        colorMode={resolvedTheme === "dark" ? "dark" : "light"}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1.2}
          color="var(--border)"
          className="opacity-40"
        />
      </ReactFlow>

      {!dataState.root && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-text-muted pointer-events-none">
          Tree is empty
        </div>
      )}

      {(dataState.traversalOutput !== undefined || dataState.traversalMode !== undefined) && (
        <div
          className="absolute bottom-4 left-4 right-4 z-30 flex flex-wrap gap-3 text-xs pointer-events-none"
          aria-hidden="true"
        >
          <div className="rounded-lg border border-border bg-surface/95 px-3 py-2 shadow-sm pointer-events-auto backdrop-blur-xs">
            <span className="font-semibold text-text-secondary">Output: </span>
            <span className="font-mono text-primary font-bold">
              {traversalOutput.length > 0 ? traversalOutput.join(" → ") : "Waiting for visits"}
            </span>
          </div>
          {dataState.traversalMode === "recursive" && (
            <div className="rounded-lg border border-border bg-surface/95 px-3 py-2 shadow-sm pointer-events-auto backdrop-blur-xs">
              <span className="font-semibold text-text-secondary">Call stack: </span>
              <span className="font-mono text-secondary font-bold">
                {callStack.length > 0 ? callStack.join(" → ") : "empty"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

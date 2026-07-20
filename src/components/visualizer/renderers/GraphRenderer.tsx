"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { GraphVisualState } from "@/visualizers/graph/types";
import { VisualStepHighlights } from "@/types";
import { ReactFlow, Node, Edge, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getVisualElementState } from "../visual-state";

// Helper functions extracted outside component - stable references, no memoisation needed
function getNodeColor(id: string, highlights: VisualStepHighlights) {
  const state = getVisualElementState(highlights, id);
  const palette = {
    default: { bg: "var(--bg-surface)", text: "var(--text-primary)", border: "var(--border)" },
    current: {
      bg: "var(--primary-muted)",
      text: "var(--primary-active)",
      border: "var(--vis-current)",
    },
    compared: { bg: "var(--warning-muted)", text: "var(--warning)", border: "var(--vis-compared)" },
    swapped: {
      bg: "var(--secondary-muted)",
      text: "var(--secondary)",
      border: "var(--vis-swapped)",
    },
    inserted: {
      bg: "var(--primary-muted)",
      text: "var(--primary-active)",
      border: "var(--vis-current)",
    },
    deleted: { bg: "var(--error-muted)", text: "var(--error)", border: "var(--vis-error)" },
    found: { bg: "var(--success-muted)", text: "var(--success)", border: "var(--vis-found)" },
    error: { bg: "var(--error-muted)", text: "var(--error)", border: "var(--vis-error)" },
    sorted: { bg: "var(--success-muted)", text: "var(--success)", border: "var(--vis-sorted)" },
    visited: {
      bg: "var(--primary-muted)",
      text: "var(--text-secondary)",
      border: "var(--vis-visited)",
    },
  };
  return palette[state];
}

function getEdgeColor(source: string, target: string, highlights: VisualStepHighlights): string {
  const isSourceActive =
    highlights.active?.includes(source) || highlights.visited?.includes(source);
  const isTargetActive =
    highlights.active?.includes(target) || highlights.visited?.includes(target);
  if (isSourceActive && isTargetActive) return "var(--color-primary)";
  return "var(--color-border)";
}

export function GraphRenderer() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return null;
  }

  const dataState = currentStep.dataState as GraphVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  // Build nodes - React Compiler will auto-memoize; no manual useMemo needed
  const reactFlowNodes: Node[] = (dataState.nodes ?? []).map((n) => {
    const colors = getNodeColor(n.id, highlights);
    return {
      id: n.id,
      position: { x: n.x, y: n.y },
      data: { label: n.value },
      className: "visual-element",
      style: {
        background: colors.bg,
        color: colors.text,
        border: `3px solid ${colors.border}`,
        borderRadius: "50%",
        width: 50,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        transition: reducedMotion
          ? "none"
          : "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, opacity 0.3s ease, transform 0.3s ease",
      },
      draggable: false,
      selectable: false,
    };
  });

  const reactFlowEdges: Edge[] = (dataState.edges ?? []).map((e, i) => {
    const color = getEdgeColor(e.source, e.target, highlights);
    return {
      id: `e-${e.source}-${e.target}-${i}`,
      source: e.source,
      target: e.target,
      label: e.weight !== undefined ? String(e.weight) : undefined,
      markerEnd: e.isDirected ? { type: MarkerType.ArrowClosed, color } : undefined,
      style: {
        stroke: color,
        strokeWidth: 3,
        transition: reducedMotion ? "none" : "stroke 0.3s ease, opacity 0.3s ease",
      },
      labelStyle: { fill: "var(--color-text-primary)", fontWeight: 700 },
      labelBgStyle: { fill: "var(--color-bg-surface-light)" },
      animated:
        !reducedMotion &&
        (highlights.active?.includes(e.source) || highlights.active?.includes(e.target)),
      selectable: false,
    };
  });

  return (
    <div className="flex items-center justify-center w-full h-full relative overflow-hidden bg-bg-surface-light/30 rounded-xl">
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        fitView
        colorMode="dark"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
      />
    </div>
  );
}

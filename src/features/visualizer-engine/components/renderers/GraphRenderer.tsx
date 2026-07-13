"use client";

import { usePlaybackStore } from "../../playback-store";
import { GraphVisualState } from "../../../algorithms/graph/types";
import { VisualStepHighlights } from "@/types";
import { ReactFlow, Node, Edge, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Helper functions extracted outside component — stable references, no memoisation needed
function getNodeColor(id: string, highlights: VisualStepHighlights) {
  if (highlights.error?.includes(id)) return { bg: "var(--color-error)", text: "var(--color-error-foreground)", border: "var(--color-error-muted)" };
  if (highlights.active?.includes(id)) return { bg: "var(--color-primary)", text: "var(--color-primary-foreground)", border: "var(--color-primary-muted)" };
  if (highlights.inserted?.includes(id)) return { bg: "var(--color-info)", text: "var(--color-info-foreground)", border: "var(--color-info-muted)" };
  if (highlights.deleted?.includes(id)) return { bg: "rgba(var(--color-error-rgb), 0.2)", text: "var(--color-error-muted)", border: "rgba(var(--color-error-rgb), 0.4)" };
  if (highlights.sorted?.includes(id)) return { bg: "rgba(var(--color-success-rgb), 0.2)", text: "var(--color-success)", border: "rgba(var(--color-success-rgb), 0.4)" };
  if (highlights.visited?.includes(id)) return { bg: "var(--color-success)", text: "var(--color-success-foreground)", border: "var(--color-success-muted)" };
  return { bg: "var(--color-bg-surface)", text: "var(--color-text-primary)", border: "var(--color-border)" };
}

function getEdgeColor(source: string, target: string, highlights: VisualStepHighlights): string {
  const isSourceActive = highlights.active?.includes(source) || highlights.visited?.includes(source);
  const isTargetActive = highlights.active?.includes(target) || highlights.visited?.includes(target);
  if (isSourceActive && isTargetActive) return "var(--color-primary)";
  return "var(--color-border)";
}

export function GraphRenderer() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return (
      <div className="flex items-center justify-center w-full h-full text-text-muted">
        Graph data not available.
      </div>
    );
  }

  const dataState = currentStep.dataState as GraphVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  // Build nodes — React Compiler will auto-memoize; no manual useMemo needed
  const reactFlowNodes: Node[] = (dataState.nodes ?? []).map(n => {
    const colors = getNodeColor(n.id, highlights);
    return {
      id: n.id,
      position: { x: n.x, y: n.y },
      data: { label: n.value },
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
        transition: reducedMotion ? "none" : "all 0.3s ease",
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
        transition: reducedMotion ? "none" : "all 0.3s ease",
      },
      labelStyle: { fill: "var(--color-text-primary)", fontWeight: 700 },
      labelBgStyle: { fill: "var(--color-bg-surface-light)" },
      animated: highlights.active?.includes(e.source) || highlights.active?.includes(e.target),
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

"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { useTheme } from "@/components/providers/ThemeProvider";
import { GraphVisualState } from "@/visualizers/graph/types";
import { VisualStepHighlights } from "@/types";
import { ReactFlow, Node, Edge, MarkerType, Background, BackgroundVariant } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getVisualElementState } from "../visual-state";
import { EmptyVisualizerState } from "@/components/visualizer/EmptyVisualizerState";

// Helper functions extracted outside component - stable references, no memoisation needed
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

function getEdgeColor(source: string, target: string, highlights: VisualStepHighlights): string {
  const isSourceActive =
    highlights.active?.includes(source) || highlights.visited?.includes(source);
  const isTargetActive =
    highlights.active?.includes(target) || highlights.visited?.includes(target);
  if (isSourceActive && isTargetActive) return "var(--primary)";
  return "var(--border)";
}

export function GraphRenderer() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const { resolvedTheme } = useTheme();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.dataState) {
    return <EmptyVisualizerState />;
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
    };
  });

  const reactFlowEdges: Edge[] = (dataState.edges ?? []).map((e, i) => {
    const color = getEdgeColor(e.source, e.target, highlights);
    const isSourceActive =
      highlights.active?.includes(e.source) || highlights.visited?.includes(e.source);
    const isTargetActive =
      highlights.active?.includes(e.target) || highlights.visited?.includes(e.target);
    const isEdgeActive = isSourceActive && isTargetActive;

    return {
      id: `e-${e.source}-${e.target}-${i}`,
      source: e.source,
      target: e.target,
      label: e.weight !== undefined ? String(e.weight) : undefined,
      markerEnd: e.isDirected
        ? {
            type: MarkerType.ArrowClosed,
            color,
            width: 18,
            height: 18,
          }
        : undefined,
      style: {
        stroke: color,
        strokeWidth: isEdgeActive ? 3.5 : 2.5,
        transition: reducedMotion
          ? "none"
          : "stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.3s ease",
      },
      labelStyle: {
        fill: isEdgeActive ? "var(--primary)" : "var(--text-primary)",
        fontWeight: 800,
        fontSize: 12,
        fontFamily: "var(--font-mono, monospace)",
      },
      labelBgStyle: {
        fill: "var(--bg-surface)",
        fillOpacity: 0.95,
        stroke: isEdgeActive ? "var(--primary)" : "var(--border)",
        strokeWidth: isEdgeActive ? 2 : 1,
      },
      labelBgPadding: [6, 4] as [number, number],
      labelBgBorderRadius: 6,
      animated:
        !reducedMotion &&
        (highlights.active?.includes(e.source) || highlights.active?.includes(e.target)),
      selectable: false,
    };
  });

  return (
    <div
      className="flex items-center justify-center w-full h-full relative overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-xs"
      role="img"
      aria-label={`${currentStep.title}. Graph simulation with ${dataState.nodes.length} nodes and ${dataState.edges.length} edges`}
    >
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        fitView
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
    </div>
  );
}

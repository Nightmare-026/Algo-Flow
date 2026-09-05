"use client";

import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import type { GraphVisualState } from "@/visualizers/graph/types";
import { GraphEditorModal } from "./GraphEditorModal";
import { useRef, useState } from "react";
import { Edit3, Compass } from "lucide-react";

interface GraphInputControlsProps {
  slug?: string;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

const ALGORITHMS_WITH_START_NODE = new Set(["bfs", "dfs", "dijkstra", "bellman-ford", "prim"]);

function getAlgorithmBadgeLabel(slug: string, node: string): string {
  switch (slug) {
    case "bfs":
      return `BFS Traversal from ${node}`;
    case "dfs":
      return `DFS Traversal from ${node}`;
    case "dijkstra":
      return `Shortest Paths from ${node}`;
    case "bellman-ford":
      return `Bellman-Ford from ${node}`;
    case "prim":
      return `Prim's MST from ${node}`;
    case "kruskal":
      return "Kruskal's MST (Global Edge Sorting)";
    case "topological-sort":
      return "Topological Ordering (Kahn's In-Degree)";
    case "detect-cycle-graph":
      return "3-Color Cycle Detection (Global)";
    case "connected-components":
      return "Connected Components Discovery (Global)";
    default:
      return `Simulation from ${node}`;
  }
}

export function GraphInputControls({
  slug = "bfs",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: GraphInputControlsProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const editGraphButtonRef = useRef<HTMLButtonElement>(null);

  // Extract all node IDs from current graph state for the start node dropdown
  const graphNodes = options.graphState?.nodes.map((n) => n.id) || ["A", "B", "C", "D", "E", "F"];
  const selectedNode = graphNodes.includes(options.text) ? options.text : graphNodes[0] || "A";
  const hasStartNode = ALGORITHMS_WITH_START_NODE.has(slug);
  const badgeLabel = getAlgorithmBadgeLabel(slug, selectedNode);

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {hasStartNode && (
            <div className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]">
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                Start Node:
              </span>
              <select
                value={selectedNode}
                onChange={(event) => onOptionsChange?.({ ...options, text: event.target.value })}
                className="h-6 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none cursor-pointer"
                aria-label="Start Node"
              >
                {graphNodes.map((node) => (
                  <option key={node} value={node}>
                    Node {node}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            ref={editGraphButtonRef}
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary-muted px-2.5 text-[11px] font-bold font-mono text-primary shadow-[var(--shadow-raised-sm)] transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95 cursor-pointer shrink-0"
            title="Open Graph Canvas Editor"
          >
            <Edit3 className="h-3.5 w-3.5 shrink-0" />
            <span>Edit Graph Canvas</span>
          </button>

          <div className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-[10px] font-mono font-semibold text-text-secondary shadow-[var(--shadow-raised-sm)]">
            <Compass className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{badgeLabel}</span>
          </div>
        </div>
      </div>

      <GraphEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialState={options.graphState}
        isDirected={options.isDirected}
        isWeighted={options.isWeighted}
        returnFocusRef={editGraphButtonRef}
        onSave={(
          newGraphState: GraphVisualState,
          newIsDirected: boolean,
          newIsWeighted: boolean
        ) => {
          let nextText = selectedNode;
          const newIds = newGraphState.nodes.map((n) => n.id);
          if (!newIds.includes(nextText)) {
            nextText = newIds[0] || "";
          }

          onOptionsChange?.({
            ...options,
            graphState: newGraphState,
            isDirected: newIsDirected,
            isWeighted: newIsWeighted,
            text: nextText,
          });
        }}
      />
    </div>
  );
}

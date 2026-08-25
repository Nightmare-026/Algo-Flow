"use client";

import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { GraphEditorModal } from "./GraphEditorModal";
import { useRef, useState } from "react";
import { Edit3 } from "lucide-react";

interface GraphInputControlsProps {
  slug?: string;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
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

  const traversalLabel = slug === "dfs" ? "DFS" : slug === "dijkstra" ? "Dijkstra" : "BFS";

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <label className="flex min-w-28 flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          Start Node
        </span>
        <select
          value={selectedNode}
          onChange={(event) => onOptionsChange?.({ ...options, text: event.target.value })}
          className="rounded-md border border-border bg-bg-surface-light px-2 py-1 text-text-primary text-xs focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          {graphNodes.map((node) => (
            <option key={node} value={node}>
              {node}
            </option>
          ))}
        </select>
      </label>

      <button
        ref={editGraphButtonRef}
        type="button"
        onClick={() => setIsEditorOpen(true)}
        className="flex h-7 items-center justify-center gap-1.5 rounded-md bg-primary/10 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
      >
        <Edit3 className="h-3.5 w-3.5" /> Edit Graph
      </button>

      <div className="rounded-md border border-border bg-bg-surface-light px-2 py-1 text-text-secondary text-xs h-7 flex items-center">
        {traversalLabel} from {selectedNode}
      </div>

      <GraphEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialState={options.graphState}
        isDirected={options.isDirected}
        isWeighted={options.isWeighted}
        returnFocusRef={editGraphButtonRef}
        onSave={(newGraphState, newIsDirected, newIsWeighted) => {
          // If the selected node no longer exists, reset to the first available node
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

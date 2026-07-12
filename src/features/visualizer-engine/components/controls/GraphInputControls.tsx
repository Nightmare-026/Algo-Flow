"use client";

import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { GraphEditorModal } from "./GraphEditorModal";
import { useState } from "react";
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
  
  // Extract all node IDs from current graph state for the start node dropdown
  const graphNodes = options.graphState?.nodes.map(n => n.id) || ["A", "B", "C", "D", "E", "F"];
  const selectedNode = graphNodes.includes(options.text) ? options.text : (graphNodes[0] || "A");
  
  const traversalLabel = slug === "dfs" ? "DFS" : slug === "dijkstra" ? "Dijkstra" : "BFS";

  return (
    <div className="flex flex-wrap items-end gap-3 text-sm">
      <label className="flex min-w-36 flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Start Node</span>
        <select
          value={selectedNode}
          onChange={(event) => onOptionsChange?.({ ...options, text: event.target.value })}
          className="rounded-lg border border-border bg-bg-surface-light px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
        >
          {graphNodes.map((node) => (
            <option key={node} value={node}>{node}</option>
          ))}
        </select>
      </label>
      
      <button 
        onClick={() => setIsEditorOpen(true)}
        className="flex h-[38px] items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
      >
        <Edit3 className="h-4 w-4" /> Edit Custom Graph
      </button>

      <div className="rounded-lg border border-border bg-bg-surface-light px-3 py-2 text-text-secondary h-[38px] flex items-center">
        {traversalLabel} starts from node {selectedNode}
      </div>

      <GraphEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialState={options.graphState}
        isDirected={options.isDirected}
        isWeighted={options.isWeighted}
        onSave={(newGraphState, newIsDirected, newIsWeighted) => {
          // If the selected node no longer exists, reset to the first available node
          let nextText = selectedNode;
          const newIds = newGraphState.nodes.map(n => n.id);
          if (!newIds.includes(nextText)) {
            nextText = newIds[0] || "";
          }
          
          onOptionsChange?.({ 
            ...options, 
            graphState: newGraphState, 
            isDirected: newIsDirected, 
            isWeighted: newIsWeighted,
            text: nextText
          });
        }}
      />
    </div>
  );
}
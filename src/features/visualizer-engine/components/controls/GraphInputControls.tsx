"use client";

import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface GraphInputControlsProps {
  slug?: string;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

const graphNodes = ["A", "B", "C", "D", "E", "F"];

export function GraphInputControls({
  slug = "bfs",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: GraphInputControlsProps) {
  const selectedNode = graphNodes.includes(options.text) ? options.text : "A";
  const traversalLabel = slug === "dfs" ? "DFS" : "BFS";

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
      <div className="rounded-lg border border-border bg-bg-surface-light px-3 py-2 text-text-secondary">
        {traversalLabel} starts from node {selectedNode}
      </div>
    </div>
  );
}
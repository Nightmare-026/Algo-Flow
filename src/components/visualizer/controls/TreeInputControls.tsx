"use client";

import { useState, useMemo } from "react";
import { AlertCircle, Target, HardDriveDownload, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { TreeEditorModal } from "./TreeEditorModal";
import { TreeVisualState, createBSTFromArr, createDefaultTree } from "@/visualizers/tree/types";
import { cn } from "@/lib/utils";

interface TreeInputControlsProps {
  slug?: string;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

export function TreeInputControls({
  slug = "inorder-traversal",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: TreeInputControlsProps) {
  const [valInput, setValInput] = useState(options.value.toString());
  const [targetInput, setTargetInput] = useState(options.target.toString());
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const isAVL = slug === "avl-rotations";

  const currentTreeState = useMemo<TreeVisualState | null>(() => {
    if (isAVL) {
      if (options.treeState) {
        return options.treeState;
      }
      const type = (options.pattern || "LL").toUpperCase();
      if (type === "RR") {
        const n30 = { id: "n30", value: 30, left: null, right: null };
        const n20 = { id: "n20", value: 20, left: null, right: n30 };
        return { root: { id: "n10", value: 10, left: null, right: n20 } };
      }
      if (type === "LR") {
        const n20 = { id: "n20", value: 20, left: null, right: null };
        const n10 = { id: "n10", value: 10, left: null, right: n20 };
        return { root: { id: "n30", value: 30, left: n10, right: null } };
      }
      if (type === "RL") {
        const n20 = { id: "n20", value: 20, left: null, right: null };
        const n30 = { id: "n30", value: 30, left: n20, right: null };
        return { root: { id: "n10", value: 10, left: null, right: n30 } };
      }
      const n10 = { id: "n10", value: 10, left: null, right: null };
      const n20 = { id: "n20", value: 20, left: n10, right: null };
      return { root: { id: "n30", value: 30, left: n20, right: null } };
    }
    if (options.treeState) return options.treeState;
    if (slug.includes("bst")) {
      return { root: createBSTFromArr([50, 30, 70, 20, 40, 60, 80]) };
    }
    return createDefaultTree();
  }, [isAVL, options.pattern, options.treeState, slug]);

  const updateOption = (key: keyof VisualizerInputOptions, value: unknown) => {
    onOptionsChange?.({ ...options, [key]: value } as VisualizerInputOptions);
  };

  const handleTreeSave = (newTreeState: TreeVisualState) => {
    onOptionsChange?.({
      ...options,
      treeState: newTreeState,
    });
    setIsEditorOpen(false);
  };

  const handleValueSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const val = parseInt(valInput);
    if (isNaN(val)) {
      setError("Value must be a valid number.");
      return;
    }
    setError(null);
    updateOption("value", val);
  };

  const handleTargetSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const target = parseInt(targetInput);
    if (isNaN(target)) {
      setError("Target must be a valid number.");
      return;
    }
    setError(null);
    updateOption("target", target);
  };

  const showTarget = slug.includes("search");
  const showValue = slug.includes("insert");

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary-muted px-2.5 text-[11px] font-bold text-primary shadow-[var(--shadow-raised-sm)] transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95 cursor-pointer shrink-0"
            title="Open Tree Structure Editor"
          >
            <Network className="h-3.5 w-3.5 shrink-0" />
            <span>Edit Tree</span>
          </button>

          {isAVL && (
            <div className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-1.5 shadow-[var(--shadow-raised-sm)]">
              <span className="font-mono text-[10px] font-semibold text-text-muted mr-0.5">
                AVL:
              </span>
              {[
                { type: "LL", label: "Right (LL)" },
                { type: "RR", label: "Left (RR)" },
                { type: "LR", label: "Left-Right (LR)" },
                { type: "RL", label: "Right-Left (RL)" },
              ].map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onOptionsChange?.({
                      ...options,
                      pattern: type,
                    });
                  }}
                  className={cn(
                    "h-6 min-h-0 rounded px-1.5 text-[10px] font-mono font-bold transition-all cursor-pointer",
                    options.pattern === type || (!options.pattern && type === "LL")
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
                  )}
                  title={`Simulate ${label} AVL Rotation`}
                >
                  {type}
                </button>
              ))}
              {options.treeState && (
                <button
                  type="button"
                  onClick={() => {
                    onOptionsChange?.({
                      ...options,
                      treeState: undefined,
                    });
                  }}
                  className="ml-1 h-6 min-h-0 rounded px-1.5 text-[10px] font-medium text-text-muted hover:text-danger hover:bg-danger-muted/30 transition-all cursor-pointer border border-transparent hover:border-danger/30"
                  title="Reset custom edits and restore preset tree"
                >
                  Reset Tree
                </button>
              )}
            </div>
          )}

          {showTarget && (
            <form
              onSubmit={handleTargetSubmit}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]"
            >
              <Target className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                Target:
              </span>
              <input
                type="number"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                aria-label="Target"
              />
              <Button
                type="submit"
                size="sm"
                className="h-6 min-h-0 rounded-md bg-primary px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0 cursor-pointer"
              >
                Set
              </Button>
            </form>
          )}

          {showValue && (
            <form
              onSubmit={handleValueSubmit}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]"
            >
              <HardDriveDownload className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">Val:</span>
              <input
                type="number"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                value={valInput}
                onChange={(e) => setValInput(e.target.value)}
                aria-label="Value"
              />
              <Button
                type="submit"
                size="sm"
                className="h-6 min-h-0 rounded-md bg-primary px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0 cursor-pointer"
              >
                Set
              </Button>
            </form>
          )}
        </div>
      </div>

      {error && (
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-muted px-2.5 py-1 text-[10px] font-semibold text-error animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <TreeEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialState={currentTreeState}
        onSave={handleTreeSave}
      />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { AlertCircle, Target, HardDriveDownload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { TreeEditorModal } from "./TreeEditorModal";
import { Network } from "lucide-react";
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
      if (options.pattern === "custom" && options.treeState) {
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
      ...(isAVL ? { pattern: "custom" } : {}),
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
    <div className="flex flex-col gap-2.5 text-sm lg:flex-row lg:items-center lg:gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => setIsEditorOpen(true)}
          variant="outline"
          size="sm"
          className="h-7 px-3 text-xs border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary cursor-pointer active:scale-95"
        >
          <Network className="h-3.5 w-3.5 mr-1.5" /> Edit Tree
        </Button>

        {isAVL && (
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface/80 px-2 py-0.5 shadow-sm">
            <span className="text-[11px] font-semibold text-text-muted">Presets:</span>
            <div className="flex items-center gap-1">
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
                      treeState: undefined,
                    });
                  }}
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-mono font-bold transition-all cursor-pointer",
                    (options.pattern === type || (!options.pattern && type === "LL")) && options.pattern !== "custom"
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
                  )}
                  title={`Simulate ${label} AVL Rotation`}
                >
                  {type}
                </button>
              ))}
              {options.pattern === "custom" && (
                <span
                  className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-primary text-white shadow-sm"
                  title="Custom Tree Active"
                >
                  Custom
                </span>
              )}
            </div>
          </div>
        )}

        {showTarget && (
          <form onSubmit={handleTargetSubmit} className="flex items-center gap-1.5">
            <label className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 bg-bg-surface/50">
              <span className="text-text-muted font-medium text-xs">Target:</span>
              <Input
                type="number"
                className="w-14 h-7 border-border bg-bg-base px-2 py-0 text-xs"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
              />
            </label>
            <Button type="submit" variant="secondary" size="sm" className="h-7 px-3 text-xs">
              <Target className="h-3.5 w-3.5 mr-1" /> Set
            </Button>
          </form>
        )}

        {showValue && (
          <form onSubmit={handleValueSubmit} className="flex items-center gap-1.5">
            <label className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 bg-bg-surface/50">
              <span className="text-text-muted font-medium text-xs">Value:</span>
              <Input
                type="number"
                className="w-14 h-7 border-border bg-bg-base px-2 py-0 text-xs"
                value={valInput}
                onChange={(e) => setValInput(e.target.value)}
              />
            </label>

            <Button type="submit" variant="secondary" size="sm" className="h-7 px-3 text-xs">
              <HardDriveDownload className="h-3.5 w-3.5 mr-1" /> Set
            </Button>
          </form>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-error text-xs font-medium animate-in fade-in slide-in-from-top-1 lg:ml-auto">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
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

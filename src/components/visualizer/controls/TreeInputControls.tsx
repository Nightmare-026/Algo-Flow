"use client";

import { useState } from "react";
import { AlertCircle, Target, HardDriveDownload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { TreeEditorModal } from "./TreeEditorModal";
import { Network } from "lucide-react";
import { TreeVisualState } from "@/visualizers/tree/types";

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

  const updateOption = (key: keyof VisualizerInputOptions, value: unknown) => {
    onOptionsChange?.({ ...options, [key]: value } as VisualizerInputOptions);
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
    <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => setIsEditorOpen(true)}
          variant="outline"
          size="sm"
          className="border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary"
        >
          <Network className="h-4 w-4 mr-2" /> Edit Custom Tree
        </Button>

        {showTarget && (
          <form onSubmit={handleTargetSubmit} className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1 bg-bg-surface/50">
              <span className="text-text-muted font-medium">Target:</span>
              <Input
                type="number"
                className="w-16 h-7 border-border bg-bg-base px-2 py-0"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              <Target className="h-4 w-4 mr-1" /> Set Target
            </Button>
          </form>
        )}

        {showValue && (
          <form onSubmit={handleValueSubmit} className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1 bg-bg-surface/50">
              <span className="text-text-muted font-medium">Value:</span>
              <Input
                type="number"
                className="w-16 h-7 border-border bg-bg-base px-2 py-0"
                value={valInput}
                onChange={(e) => setValInput(e.target.value)}
              />
            </div>

            <Button type="submit" variant="secondary" size="sm">
              <HardDriveDownload className="h-4 w-4 mr-1" /> Set Value
            </Button>
          </form>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-error text-sm font-medium animate-in fade-in slide-in-from-top-1 ml-auto">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <TreeEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialState={options.treeState || null}
        onSave={(state: TreeVisualState) => {
          updateOption("treeState", state);
        }}
      />
    </div>
  );
}

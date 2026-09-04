"use client";

import { useState } from "react";
import { AlertCircle, Target, HardDriveDownload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface DoublyLinkedListInputControlsProps {
  slug?: string;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
  dataLength?: number;
}

export function DoublyLinkedListInputControls({
  slug = "dll-traversal",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: DoublyLinkedListInputControlsProps) {
  const [valInput, setValInput] = useState(options.value.toString());
  const [targetInput, setTargetInput] = useState(options.target.toString());
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value } as VisualizerInputOptions);
  };

  const handleValueSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const val = Number(valInput.trim());
    if (!Number.isInteger(val)) {
      setError("Value must be a whole number.");
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

  const showTarget = slug.includes("search") || slug.includes("delete-value");
  const showValue = slug.includes("insert");
  const errorId = "dll-control-error";

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {showTarget && (
            <form onSubmit={handleTargetSubmit} className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]">
              <Target className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">Target:</span>
              <input
                id="dll-target"
                name="target"
                type="number"
                inputMode="numeric"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                value={targetInput}
                onChange={(event) => setTargetInput(event.target.value)}
                aria-label="Target value"
              />
              <Button
                type="submit"
                size="sm"
                className="h-6 min-h-0 rounded-md bg-primary px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0"
              >
                Set
              </Button>
            </form>
          )}

          {showValue && (
            <form onSubmit={handleValueSubmit} className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]">
              <HardDriveDownload className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">Val:</span>
              <input
                id="dll-value"
                name="value"
                type="number"
                step={1}
                inputMode="numeric"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                value={valInput}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) => setValInput(event.target.value)}
                aria-label="Value"
              />
              <Button
                type="submit"
                size="sm"
                className="h-6 min-h-0 rounded-md bg-primary px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0"
              >
                Set
              </Button>
            </form>
          )}
        </div>
      </div>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-muted px-2.5 py-1 text-[10px] font-semibold text-error animate-in fade-in slide-in-from-top-1"
        >
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

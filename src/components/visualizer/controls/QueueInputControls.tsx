"use client";

import { useState } from "react";
import { AlertCircle, HardDriveDownload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface QueueInputControlsProps {
  slug?: string;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

export function QueueInputControls({
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: QueueInputControlsProps) {
  const [valInput, setValInput] = useState(options.value.toString());
  const [capInput, setCapInput] = useState(options.capacity.toString());
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value } as VisualizerInputOptions);
  };

  const handleEnqueueSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const val = parseInt(valInput);
    if (isNaN(val)) {
      setError("Value must be a valid number.");
      return;
    }
    setError(null);
    updateOption("value", val);
  };

  const handleCapacitySubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const cap = parseInt(capInput);
    if (isNaN(cap) || cap < 1 || cap > 15) {
      setError("Capacity must be between 1 and 15.");
      return;
    }
    setError(null);
    updateOption("capacity", cap);
  };

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Capacity Pod */}
          <form
            onSubmit={handleCapacitySubmit}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]"
          >
            <span className="font-mono text-[10px] font-semibold text-text-secondary">
              Capacity:
            </span>
            <input
              type="number"
              className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
              value={capInput}
              min={1}
              max={15}
              onChange={(e) => setCapInput(e.target.value)}
              aria-label="Queue capacity"
            />
            <Button
              type="submit"
              size="sm"
              className="h-6 min-h-0 rounded-md bg-surface-hover px-2 text-[10px] font-semibold text-text-secondary hover:text-primary active:scale-95"
            >
              Set
            </Button>
          </form>

          {/* Value / Enqueue Pod */}
          <form
            onSubmit={handleEnqueueSubmit}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]"
          >
            <HardDriveDownload className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold text-text-secondary">Value:</span>
            <input
              type="number"
              className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
              aria-label="Value to enqueue"
            />
            <Button
              type="submit"
              size="sm"
              className="h-6 min-h-0 rounded-md bg-primary px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0"
              onClick={() => updateOption("value", parseInt(valInput))}
            >
              Enqueue
            </Button>
          </form>
        </div>
      </div>

      {error && (
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-muted px-2.5 py-1 text-[10px] font-semibold text-error animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

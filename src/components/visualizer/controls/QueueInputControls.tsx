"use client";

import { useState } from "react";
import { AlertCircle, HardDriveDownload } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    <div className="flex flex-col gap-2.5 text-sm lg:flex-row lg:items-center lg:gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Capacity Input */}
        <form onSubmit={handleCapacitySubmit} className="flex items-center gap-1.5">
          <label className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 bg-bg-surface/50">
            <span className="text-text-muted font-medium text-xs">Capacity:</span>
            <Input
              type="number"
              className="w-14 h-7 border-border bg-bg-base px-2 py-0 text-xs"
              value={capInput}
              min={1}
              max={15}
              onChange={(e) => setCapInput(e.target.value)}
            />
          </label>
          <Button type="submit" variant="secondary" size="sm" className="h-7 px-3 text-xs">
            Set
          </Button>
        </form>

        {/* Value Input */}
        <form onSubmit={handleEnqueueSubmit} className="flex items-center gap-1.5">
          <label className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 bg-bg-surface/50">
            <span className="text-text-muted font-medium text-xs">Value:</span>
            <Input
              type="number"
              className="w-14 h-7 border-border bg-bg-base px-2 py-0 text-xs"
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
            />
          </label>

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => updateOption("value", parseInt(valInput))}
          >
            <HardDriveDownload className="h-3.5 w-3.5 mr-1" /> Enqueue
          </Button>
        </form>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-error text-xs font-medium animate-in fade-in slide-in-from-top-1 lg:ml-auto">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}

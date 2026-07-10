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
    <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start">
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Capacity Input */}
        <form onSubmit={handleCapacitySubmit} className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1 bg-bg-surface/50">
            <span className="text-text-muted font-medium">Capacity:</span>
            <Input
              type="number"
              className="w-16 h-7 border-border bg-bg-base px-2 py-0"
              value={capInput}
              min={1}
              max={15}
              onChange={(e) => setCapInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">Set Capacity</Button>
        </form>

        {/* Value Input */}
        <form onSubmit={handleEnqueueSubmit} className="flex flex-wrap items-center gap-2 ml-4">
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1 bg-bg-surface/50">
            <span className="text-text-muted font-medium">Value:</span>
            <Input
              type="number"
              className="w-16 h-7 border-border bg-bg-base px-2 py-0"
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-1">
            <Button type="submit" variant="secondary" size="sm" onClick={() => updateOption("value", parseInt(valInput))}>
              <HardDriveDownload className="h-4 w-4 mr-1" /> Set Enqueue Value
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-error text-sm font-medium animate-in fade-in slide-in-from-top-1 ml-auto">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}

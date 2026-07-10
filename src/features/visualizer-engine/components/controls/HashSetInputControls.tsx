"use client";

import { useState } from "react";
import { AlertCircle, FileEdit, Search, Shuffle, Target, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseNumberList,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface HashSetInputControlsProps {
  onGenerate: (arr: number[]) => void;
  defaultSize?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

const needsValue = (slug: string) => slug.includes("insert");
const needsTarget = (slug: string) => slug.includes("search") || slug.includes("delete");

export function HashSetInputControls({
  onGenerate,
  defaultSize = 7,
  slug = "hash-set",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: HashSetInputControlsProps) {
  const [size, setSize] = useState(defaultSize);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value });
  };

  const generateRandom = () => {
    setError(null);
    onGenerate(Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1));
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = parseNumberList(customInput);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    onGenerate(result.values);
  };

  return (
    <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-muted">Elements:</span>
          <input
            type="range"
            min="1"
            max="15"
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="w-24 accent-primary"
            aria-label="Generated elements count"
          />
          <span className="w-5 text-text-primary">{size}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={generateRandom}><Shuffle className="h-4 w-4 text-primary" />Random</Button>
        </div>

        <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-center gap-2">
          <FileEdit className="h-4 w-4 text-text-muted" />
          <Input
            value={customInput}
            onChange={(event) => setCustomInput(event.target.value)}
            placeholder="e.g. 5, 2, 9, 1"
            className="h-8 w-44"
            aria-label="Custom numeric input"
          />
          <Button type="submit" size="sm">Build</Button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
        <label className="flex items-center gap-2 text-text-muted border-r border-border pr-3 mr-1">
          <Database className="h-4 w-4" />
          Set Capacity
          <Input 
            type="number" 
            value={options.capacity} 
            onChange={(event) => updateOption("capacity", Number(event.target.value))} 
            className="h-8 w-20" 
            min={1}
            max={20}
          />
        </label>

        {needsValue(slug) && (
          <label className="flex items-center gap-2 text-text-muted">
            <Target className="h-4 w-4" />
            Insert Value
            <Input 
              type="number" 
              value={options.value} 
              onChange={(event) => updateOption("value", Number(event.target.value))} 
              className="h-8 w-20" 
            />
          </label>
        )}
        
        {needsTarget(slug) && (
          <label className="flex items-center gap-2 text-text-muted">
            <Search className="h-4 w-4" />
            Target Value
            <Input 
              type="number" 
              value={options.target} 
              onChange={(event) => updateOption("target", Number(event.target.value))} 
              className="h-8 w-20" 
            />
          </label>
        )}
      </div>

      {error && (
        <div className="flex w-full items-center gap-2 rounded-md bg-error/10 p-2 text-error lg:w-auto">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

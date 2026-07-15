import React from "react";
import { VisualStep, CodeExample } from "@/types";
import { VisualizerInputOptions } from "@/lib/validation/visualizer-input";

/**
 * Authoritative algorithm implementation contract used by the runtime.
 * Display metadata and pseudocode live in the algorithm catalog; renderers
 * and controls live in the data-structure registry. Validation resolves those
 * references instead of duplicating them in every algorithm entry.
 */
export interface AlgorithmVisualizerDefinition {
  slug: string;
  generateSteps: (data: number[], options: VisualizerInputOptions) => VisualStep[];
  getCodeExamples: (slug: string, algorithmId: string) => CodeExample[];
  codeLineMapping?: ReadonlyArray<CodeLineMapping>;
  pseudocode?: string;
}

/** Languages required by the published product contract. */
export const REQUIRED_CODE_LANGUAGES = [
  "javascript",
  "python",
  "cpp",
  "java",
] as const satisfies ReadonlyArray<CodeExample["language"]>;

/** Data-structure families with a renderer and input-controls registration. */
export const DATA_STRUCTURE_IDS = [
  "ds_array",
  "ds_stack",
  "ds_queue",
  "ds_linked_list",
  "ds_tree",
  "ds_graph",
  "ds_hash_table",
  "ds_hash_set",
  "ds_matrix",
  "ds_string",
] as const;

export type DataStructureId = (typeof DATA_STRUCTURE_IDS)[number];
export type RequiredCodeLanguage = (typeof REQUIRED_CODE_LANGUAGES)[number];

export interface CodeLineMapping {
  logicalLine: number;
  lines: Record<RequiredCodeLanguage, number>;
}

export interface InputControlsProps {
  slug: string;
  options: VisualizerInputOptions;
  onOptionsChange: (options: VisualizerInputOptions) => void;
  onGenerate: (data: number[]) => void;
  dataLength?: number;
  defaultSize?: number;
  defaultRows?: number;
  defaultCols?: number;
}

export interface DataStructureVisualizerDefinition {
  dataStructureId: DataStructureId;
  Renderer: React.ComponentType;
  InputControls: React.ComponentType<InputControlsProps>;
}

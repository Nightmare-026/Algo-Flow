/**
 * Future publication-readiness audit shape.
 *
 * This is intentionally separate from the authoritative composed runtime
 * contract in types.ts. Do not cast the live registry to this shape; migrate
 * entries only when the required artifacts are genuinely authored.
 */
/**
 * Phase 3 — Visualizer Engine Contract
 *
 * EVERY field is required. This file deliberately keeps "?" out of the type
 * definition so that any missing field becomes a TypeScript compile-time error,
 * and the build-time validator's runtime checks reject any entry that survives
 * type-check but with sub-spec content (e.g. empty pseudocode, missing language).
 */

import type { ComponentType } from "react";
import type {
  CodeExample,
  DifficultyLevel,
  PriorityLevel,
  VisualStep,
} from "@/types";
import type { VisualizerInputOptions } from "@/lib/validation/visualizer-input";
import type { InputControlsProps } from "./types";

// ─────────────────────────────────────────────────────────────────────
// Per-data-structure input types — replace the legacy `data: any` on
// generateSteps. Compiler now knows each family's shape.
// ─────────────────────────────────────────────────────────────────────

export type ArrayInput = number[];
export type LinkedListInput = {
  nodes: ReadonlyArray<{ id: string; value: number; prevId: string | null; nextId: string | null }>;
  headId: string;
  tailId?: string;
};
export type TreeInput = {
  nodes: ReadonlyArray<{
    id: string;
    value: number;
    parentId: string | null;
    leftId: string | null;
    rightId: string | null;
  }>;
  rootId: string | null;
};
export type GraphInput = {
  nodes: ReadonlyArray<{ id: string; value: number }>;
  edges: ReadonlyArray<{ fromId: string; toId: string; weight?: number }>;
  directed?: boolean;
};
export type HashTableInput = {
  buckets: ReadonlyArray<{
    bucketIndex: number;
    entries: ReadonlyArray<{ id: string; key: string; value: number; hashedKey: number }>;
  }>;
  size: number;
};
export type HashSetInput = {
  buckets: ReadonlyArray<{
    bucketIndex: number;
    keys: ReadonlyArray<{ id: string; key: string; hashedKey: number }>;
  }>;
  size: number;
};
export type MatrixInput = {
  rows: number;
  cols: number;
  data: ReadonlyArray<ReadonlyArray<number>>;
};
export type StringInput = { text: string };

// Stack/Queue today don't have element-id-based renderers (they use
// index-of-element); the same ArrayInput pattern works because they store
// linear structures.
export type StackInput = ArrayInput;
export type QueueInput = ArrayInput;

// ─────────────────────────────────────────────────────────────────────
// Domain enums
// ─────────────────────────────────────────────────────────────────────

export type DataStructureId =
  | "ds_array"
  | "ds_stack"
  | "ds_queue"
  | "ds_linked_list"
  | "ds_tree"
  | "ds_graph"
  | "ds_hash_table"
  | "ds_hash_set"
  | "ds_matrix"
  | "ds_string";

// The four product languages each published entry must cover.
export const REQUIRED_LANGUAGES = ["javascript", "python", "cpp", "java"] as const;

// ─────────────────────────────────────────────────────────────────────
// Contract
// ─────────────────────────────────────────────────────────────────────

export interface VisualizerDefinition<TInput> {
  /** Stable catalog identifier. */
  id: string;
  /** Stable URL-safe slug; must match its catalog entry. */
  slug: string;
  /** Display title ("Bubble Sort"). */
  title: string;
  /** One-line description. */
  description: string;
  /** Which data-structure family this belongs to. */
  dataStructureId: DataStructureId;
  /** User-facing operation/category from the catalog. */
  operation: string;
  /** Difficulty marker. */
  difficulty: DifficultyLevel;
  /** Publication importance. */
  priority: PriorityLevel;
  /** All four complexity dimensions required. */
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  /** Discoverability tags. */
  tags: ReadonlyArray<string>;

  /** Machine-checkable input contract and representative defaults. */
  inputSchema: (input: unknown, options: VisualizerInputOptions) => input is TInput;
  defaultInput: TInput;
  defaultOptions: VisualizerInputOptions;
  inputGenerators: ReadonlyArray<{
    id: string;
    label: string;
    generate: () => TInput;
  }>;
  InputControls: ComponentType<InputControlsProps>;
  validateInput: (
    input: TInput,
    options: VisualizerInputOptions,
  ) => ReadonlyArray<string>;

  /** Step generator — typed per family. */
  generateSteps: (data: TInput, options: VisualizerInputOptions) => VisualStep[];
  /** Renderer registered for this visual state family. */
  Renderer: ComponentType;

  /**
   * Code samples for ALL FOUR required languages. The readiness validator
   * refuses any registry where any of these is empty or missing.
   */
  codeExamples: {
    javascript: CodeExample;
    python: CodeExample;
    cpp: CodeExample;
    java: CodeExample;
  };

  /**
   * Pseudocode as line-numbered records. Order matters: lines must be
   * strictly increasing starting at 1. The build-time validator checks
   * both order and exclusivity.
   */
  pseudocode: ReadonlyArray<{ line: number; text: string }>;

  /**
   * Executable semantic cases. The verifier returns human-readable failures
   * instead of binding expectations to generated entity or step identifiers.
   */
  testCases: ReadonlyArray<{
    name: string;
    input: TInput;
    options: VisualizerInputOptions;
    verify: (steps: ReadonlyArray<VisualStep>) => ReadonlyArray<string>;
  }>;

  /**
   * Maps the stable logical key emitted as `VisualStep.codeLine` to each
   * language example's physical line. Runtime-generated step and entity IDs
   * are deliberately excluded from this authored contract.
   */
  codeLineMapping: ReadonlyArray<{
    logicalLine: number;
    lines: Record<(typeof REQUIRED_LANGUAGES)[number], number>;
  }>;

  /**
   * Legend describing each highlight bucket. Drives the UI badge strip and
   * the accessibility aria-label for high-contrast mode.
   */
  legend: ReadonlyArray<{
    bucketKey: keyof import("@/types").VisualStepHighlights;
    label: string;
    description: string;
    tone: "info" | "warning" | "success" | "error" | "muted" | "primary";
  }>;
}

// ─────────────────────────────────────────────────────────────────────
// Family-typed convenience aliases — used by per-DS registry files so they
// don't have to re-spell the discriminated input type in every entry.
// ─────────────────────────────────────────────────────────────────────

export type ArrayVisualizerDefinition = VisualizerDefinition<ArrayInput>;
export type StackVisualizerDefinition = VisualizerDefinition<StackInput>;
export type QueueVisualizerDefinition = VisualizerDefinition<QueueInput>;
export type LinkedListVisualizerDefinition = VisualizerDefinition<LinkedListInput>;
export type TreeVisualizerDefinition = VisualizerDefinition<TreeInput>;
export type GraphVisualizerDefinition = VisualizerDefinition<GraphInput>;
export type HashTableVisualizerDefinition = VisualizerDefinition<HashTableInput>;
export type HashSetVisualizerDefinition = VisualizerDefinition<HashSetInput>;
export type MatrixVisualizerDefinition = VisualizerDefinition<MatrixInput>;
export type StringVisualizerDefinition = VisualizerDefinition<StringInput>;

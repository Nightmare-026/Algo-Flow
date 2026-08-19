# Algo Flow — Semantic Trace Event Contract Specification

Version: **1.0.0**
Date: **2026-08-19**

## 1. Trace Event Contract Specification

Every visualizer in Algo Flow emits a deterministic sequence of `VisualStep` objects during playback. The canonical trace event structure is defined as follows:

```ts
export interface VisualStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  operation: string;
  actionType: ActionType;
  dataState: unknown;
  beforeState?: unknown;
  afterState?: unknown;
  predicate?: StepPredicate;
  output?: unknown;
  highlights: VisualStepHighlights;
  variables?: Record<string, string | number | boolean | null>;
  pseudocodeLine?: number;
  codeLine?: number;
  pseudocodeLineIds?: string[];
  codeLineIds?: Partial<Record<CodeLanguage, string[]>>;
  complexityNote?: string;
}
```

## 2. Global Execution & Synchronization Convention

> **Convention:** **Highlight-Then-Apply**
> Every step in Algo Flow highlights the current semantic line and active elements BEFORE the visual state mutation takes effect. Step `N` displays the comparison or intent; Step `N+1` displays the committed data state mutation.

## 3. Supported Action Types & Highlight Buckets

| Action Type | Description | Primary Highlight Buckets |
|---|---|---|
| `initialize` | Visualizer state initialization | `active`, `pointer` |
| `read` / `access` | Read element value | `active`, `current`, `pointer` |
| `compare` | Compare two elements / values | `compared`, `active`, `error`, `success` |
| `swap` | Swap position of two elements | `swapped`, `active` |
| `visit` | Node / cell traversal | `visited`, `current`, `path` |
| `insert` | Insert element into structure | `inserted`, `active`, `success` |
| `delete` | Remove element from structure | `deleted`, `error` |
| `move-pointer` | Shift index / pointer position | `pointer`, `active`, `current` |
| `push` | Push to stack | `inserted`, `active` |
| `pop` | Pop from stack | `deleted`, `active` |
| `enqueue` | Add to queue rear | `inserted`, `active` |
| `dequeue` | Remove from queue front | `deleted`, `active` |
| `hash` | Hash index calculation | `active`, `target` |
| `probe` | Collision probe step | `active`, `compared`, `error` |
| `complete` / `success` | Algorithm execution finished | `success`, `sorted`, `found` |

## 4. Multi-Language Line Mapping Architecture

Instead of binding steps directly to hard-coded line numbers in 4 separate source code files, steps emit a logical code line `step.codeLine`. The `CodeLineMapping` map translates `logicalLine` into physical 1-indexed line numbers for all 4 required code languages (JavaScript, Python, C++, Java):

```ts
export interface CodeLineMapping {
  logicalLine: number;
  lines: Record<'javascript' | 'python' | 'cpp' | 'java', number>;
}
```

When the user switches languages during playback:
1. `currentStepIndex` remains identical.
2. The canvas visual state does not reset.
3. The newly selected language highlights the physical line corresponding to `step.codeLine` via `CodeLineMapping`.

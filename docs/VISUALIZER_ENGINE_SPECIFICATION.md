# Visualizer Engine Specification

> Status: Phase 0 current-state contract. Target-state validation remains Phase 3 work.

## Current execution flow

1. `/visualizer/[slug]` resolves catalog metadata and a per-family registry entry.
2. The entry generates an ordered immutable step list from input and options.
3. `playback-store.ts` owns current index, play/pause, previous/next, restart, reset, completion, speed, and reduced motion.
4. `VisualizerLayout` renders structure controls, one of 10 renderers, timeline, explanation, log, pseudocode, and code.
5. Renderers consume `VisualStep.dataState` and canonical highlight buckets.

## Registry inventory

| Family | Declared slugs |
|---|---:|
| Array | 32 |
| Graph | 2 |
| Hash set | 5 |
| Hash table | 13 |
| Linked list | 10 |
| Matrix | 12 |
| Queue | 6 |
| Stack | 7 |
| String | 11 |
| Tree | 9 |
| **Total** | **107** |

## Required target contract

Every public entry must provide identity, structure/operation metadata, priority/difficulty, complexity, typed input/default/generators, applicable controls, validation, deterministic step generation, renderer, pseudocode, JavaScript/Python/C++/Java implementations, code-line mapping, legend, explanation support, and executable test cases.

## Baseline failures

- `npm run validate:registry` crashes at `entry.legend.map(...)` for an incomplete entry instead of returning a complete error report.
- The registry contract Jest suite fails five assertions: required fields, languages, pseudocode, test cases, and code-line mappings.
- Typecheck fails because array deletion/insertion import missing `deleted` and `inserted` highlight helpers.
- The deployed bubble-sort route renders `Step 1 / 23` at desktop and mobile, but algorithm correctness and reverse/replay determinism were not verified in Phase 0.

## Determinism invariants

- Same normalized input and options must produce the same step sequence.
- Every step must be replayable by index without mutation leakage.
- Highlight identifiers must resolve to rendered entities.
- Explanation, variables, pseudocode line, language code line, log entry, and visual state must describe the same transition.


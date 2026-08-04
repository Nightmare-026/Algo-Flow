# Phase 3 - Visualizer Correctness

- **Status:** Active
- **Tier / risk:** T2 / High
- **Requirements:** FR-REG-001, FR-VIS-001, FR-VIS-002, FR-CODE-001, FR-CAT-001, NFR-TEST-001, NFR-SEC-001
- **Risks:** RISK-001, RISK-002, RISK-003, RISK-006
- **Last reconciled:** 2026-07-15

## Objective

Make every published visualizer deterministic, truthful, fully described by the typed contract, backed by applicable controls and tests, synchronized with pseudocode/code/explanations, and complete in all four product languages. Remove incomplete entries from public discovery until they satisfy the contract.

## Explicit exclusions

- No persistent database or Supabase write.
- No auth/schema/authorization change.
- No design-system redesign, analytics integration, observability rollout, or production deployment.
- No major catalog/category expansion without owner approval.

## Prerequisites and current evidence

Phases 0-2 are complete. Runtime registry parity is 105 catalog entries / 105 implementations. The production build and 16 recovery/responsive browser tests pass. After P3-T01/P3-T02, the all-route audit and all-generator invariant harness pass. The composed strict-readiness audit started P3-T04 with 630 genuine authored-artifact gaps (six per entry), replacing the misleading 1,365 sparse-cast count. The first 18 array access/traversal/search/sort entries now pass their authored artifact gates, leaving 522 genuine gaps. Decision 6 authorizes pruning incomplete public entries.

## Tasks

| Task | Work and verification-first check | Status |
|---|---|---|
| P3-T01 | Reproduce and fix insertion-sort's boundary read; add sorting/multiset/identifier regression tests; rerun its route and all-route audit. | Complete |
| P3-T02 | Build shared deterministic step fixtures and invariants for initial/final state, comparisons, mutations, identifier integrity, replay/backward behavior, and structure semantics. | Complete |
| P3-T03 | Reconcile composed runtime definitions into the strict publication contract with no unsafe cast or placeholder artifact. | Complete |
| P3-T04 | Author and verify pseudocode, complexity, explanations, legend, test cases, mappings, and JavaScript/Python/C++/Java implementations for retained entries. | In progress |
| P3-T05 | Produce the global/structure-specific control coverage matrix; implement applicable controls and document non-applicability. | Pending |
| P3-T06 | Run strict readiness, catalog/sitemap parity, every public route, language syntax/compile/execute checks, and complete-or-prune review. | Pending |

## Expected change surface

- `src/features/algorithms/**`
- `src/features/visualizer-engine/**`
- `src/data/seed/**`
- `scripts/validate-registry*.ts`
- `tests/**`, `e2e/**`
- Phase 3 coverage/evidence documentation

No schema, migration, environment, or remote-state change is expected.

## Security and privacy impact

This phase processes public algorithm input only, but input remains untrusted. Validation must bound shape, values, sizes, and expensive generation. Rendered explanations/code must remain safe text. No learner-private data or administrative credential may enter fixtures, screenshots, logs, or generated examples.

## Acceptance and exit criteria

1. No public visualizer route returns an unexpected error.
2. `npm run validate:registry` and `npm run validate:registry:readiness` pass for the retained public catalog.
3. Every retained entry satisfies the full typed publication contract without a generic placeholder or unsafe compatibility cast.
4. Determinism, identifier integrity, semantic invariants, playback/restart/backward behavior, and code-line synchronization have executable evidence.
5. All four language implementations are parsed/compiled/executed where the local toolchain permits; unexecuted code is not labeled verified.
6. The control matrix covers applicable and explicitly non-applicable controls without duplicated or fake UI.
7. Typecheck, lint, focused/unit tests, relevant browser tests, and production build pass.
8. Documentation matches the retained catalog and no unresolved Phase 3 P0/P1 blocker remains.

## Failure criteria

The phase remains blocked if any public entry crashes, advertises a missing artifact, produces incorrect state/output, references invalid identifiers or code lines, has non-equivalent language behavior, exposes meaningless controls, or lacks required acceptance evidence.

## Evidence

- **P3-T01, 2026-07-15:** `generateInsertionSortSteps` now captures compared values before swapping and never reads `elements[j + 1]` after the mutation. `tests/insertion-sort.test.ts` passes 6/6 cases covering the original two-element boundary, descending input, duplicates, negatives, singleton/empty input, sorted output, multiset length, sequential steps, descriptions, and highlight references.
- `npm run typecheck`: pass after the fix.
- Focused Playwright reproduction: insertion-sort route passes.
- Full Playwright route audit: 106/106 pass (one 105-entry inventory assertion plus all routes). Connection-reset messages occurred only during local web-server teardown after the exit-zero test result.
- **P3-T02, 2026-07-15:** `tests/visualizer-step-invariants.test.ts` exercises every published generator twice and validates deterministic output, caller immutability, unique/sequential steps, non-empty explanations, canonical/deduplicated highlight buckets, renderer-addressable tokens, unique entity IDs, and family state structure/references. The harness exposed and closed invalid insertion/deletion tokens, duplicate cycle highlights, duplicate-ID rotation/merge transitions, and deletion states that removed entities before they could render.
- Full unit suite: 9 suites / 147 tests pass. Typecheck passes. Lint passes with 0 errors and the same 6 warnings. Production build and runtime registry validation pass. Post-change public route audit passes 106/106.
- **P3-T03, 2026-07-15:** `publication-registry.ts` composes catalog metadata/operation taxonomy, runtime generators/four-language code, pseudocode, defaults, and CSS-free renderer/control capabilities without casting the sparse runtime registry to `VisualizerDefinition`. The strict contract now includes the master-required input, control, validation, renderer, priority, and identity fields. A composition test passes and four invalid operation references were normalized. Readiness now reports 630 genuine gaps: input schema, input generators, input validation, semantic test cases, per-language code-line mapping, and legend for each of 105 entries.
- **P3-T04 array-access batch, 2026-07-15:** `access`, `access-by-index`, and `random-access` now have bounded input schemas, valid generated fixtures, input validation, executable valid/invalid semantic cases, complete highlight legends, and logical-to-physical mappings for JavaScript/Python/C++/Java. The readiness validator executes these artifacts, checks mapped line bounds, and verifies legend coverage. Runtime `CodePanel` now resolves the selected language's physical line and scopes Shiki DOM updates to its own panel.
- **P3-T04 array-traversal batch, 2026-07-15:** `forward-traversal`, `reverse-traversal`, and `range-traversal` pass the same gate, including visit-order semantics, range validation/error behavior, renderer-safe invalid highlights, and language-specific mappings. Readiness now has 594 remaining genuine gaps with no errors for the six migrated entries.
- **P3-T04 language/runtime gate, 2026-07-15:** `npm run verify:code-examples -- --require-all` executes the exact composed snippets inside deterministic wrappers. Across the six migrated entries, JavaScript/Python/C++/Java pass all 24/24 execute-or-compile/run cases with expected output. The verifier discovered Python 3.14.3 through `py -3`. The full unit suite passes 11 suites/155 tests; typecheck and production build pass; lint has 0 errors/2 warnings; targeted runtime code-line UI checks pass 2/2.
- **P3-T04 array-search batch, 2026-07-15:** `linear-search`, `binary-search`, `jump-search`, and `interpolation-search` pass executable found/missing semantics, bounded validation, legends, and physical line mappings. Verification exposed and fixed jump search's non-advancing block/infinite-loop and beyond-end access, plus interpolation search's unsorted input, equal-range divide-by-zero, and Java integer-division error. Four focused regressions cover these paths. Readiness is 570 remaining gaps; all ten migrated entries pass 40/40 four-language execute-or-compile/run cases. Full gate: 12 suites/159 tests, typecheck, production build, and registry pass; lint has 0 errors/1 warning.
- **P3-T04 array-sort batch, 2026-07-15:** all eight published sorts pass bounded schemas/generators/validation, ascending-multiset semantics, complete legends, and language mappings. Heap and radix examples now include their formerly missing helpers. Counting/radix reject negative input before unsafe indexing. The strict language gate passes 72/72 across all 18 migrated entries. Full gate: 13 suites/161 tests, lint clean, typecheck, registry, and production build pass. Readiness is 522 remaining gaps.

## Recovery

Changes are local and reversible. Revert only the bounded Phase 3 task that regresses behavior, preserve the failing fixture and evidence, then rerun the original reproduction and direct-dependent checks. Catalog pruning is recovered by restoring an entry only together with its complete definition and green readiness evidence.

## Next-phase gate

Phase 4 may become active only after this exit gate passes and its current live schema, Supabase documentation, backup/recovery asset, migration preview, and exact T3 confirmation are revalidated.

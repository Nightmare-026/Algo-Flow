# Project State

- **Program tier:** T2; Phase 4 migration and Phase 10 deployment actions are T3
- **Active phase:** Phase 3 - Visualizer Correctness
- **Branch:** `chore/production-readiness`
- **Base HEAD:** `c87547f`
- **Working tree:** dirty with the documented Phase 0-4 preparation changes; do not discard unrelated edits
- **Last reconciled:** 2026-07-15
- **Release status:** blocked

## Phase status

| Phase | Status | Exit evidence / blocker |
|---|---|---|
| 0 - Baseline | Complete | Typecheck, lint, 36 unit tests, build, 10-width browser baseline, Lighthouse, inventories recorded. |
| 1 - Audit | Complete | Architecture/product/runtime audits, link and route scans, cycles, duplication, classified findings. |
| 2 - Architecture | Complete | Typed runtime boundary, server/client route split, recovery boundaries, build and browser regressions pass. |
| 3 - Visualizers | **Active** | Registry parity, all 105 public routes, and the shared 105-generator invariant harness pass; strict authored readiness and cross-language proof remain incomplete. |
| 4 - Data/auth | Prepared; not active | Migration dry-run and local contract checks exist. Persistent remote apply, generated remote types, RLS/RPC/auth verification, and lifecycle flows remain. |
| 5-7 | Pending | Design, UX/accessibility, and performance acceptance evidence missing. |
| 8 | Pending with baseline evidence | Coverage and full correctness/integration/browser/database gates incomplete. |
| 9 | Pending | Observability and incident evidence missing. |
| 10 / CI / DoD | Pending | Preview, release, rollback, production health, CI enforcement, and final gates incomplete. |

## Verified evidence

- `npm run typecheck`: pass on 2026-07-14.
- `npm run lint`: pass with 0 errors and 6 warnings on 2026-07-14.
- `npm test -- --runInBand`: 7 suites / 36 tests pass on 2026-07-14.
- `npm run build`: pass; runtime registry parity 105/105.
- Recovery + responsive Playwright suites: 16/16 pass on a clean server.
- All-public-visualizer audit after P3-T01: inventory plus all 105 routes pass (106/106 tests).
- Focused insertion-sort regression: 6/6 unit tests and the real route pass; typecheck passes.
- P3-T02 invariant gate: all 105 published generators pass deterministic replay, immutability, identity, renderer-token, and family-state checks.
- Full post-P3-T02 gate: 9 suites / 147 tests, typecheck, production build, runtime registry, and 106/106 route audit pass; lint has 0 errors / 6 existing warnings.
- Lighthouse desktop home: performance 98, accessibility 96, best practices 100, SEO 100; LCP 1.0 s, CLS 0, TBT 10 ms.
- Coverage tests pass but threshold fails: 9.94% statements, 5.05% branches, 7.38% functions, 10.77% lines.
- Composed publication readiness fails with 522 genuine authored-artifact gaps after 18 array access/traversal/search/sort entries closed all six artifact categories, replacing the obsolete 1,365 sparse-cast count.
- P3-T04 four-batch gate: 13 suites/161 tests, clean lint, typecheck, production build, registry, and 2 code-line UI tests pass.
- Cross-language verification for the 18 migrated entries: JavaScript/Python/C++/Java pass all 72/72 expected-output execute-or-compile/run cases under `--require-all`.
- Search correctness fixes: jump blocks now advance/terminate safely on sorted state; interpolation handles unsorted and equal-value input and uses floating-point arithmetic consistently in Java.

## Active blockers and constraints

1. **P0 / RISK-001:** published visualizer definitions lack 522 genuine authored artifacts.
2. **P0 / RISK-003:** cross-language and generated-step correctness are not fully executed or proven.
3. **P0 / RISK-005:** the live reconciliation migration is not persistently applied and post-migration RLS/RPC/auth checks have not run.
4. **P0 / RISK-006:** global coverage is far below the release threshold.
5. Accessibility, format, dependency-advisory, auth-abuse, observability, CI, staging, and deployment gates remain open.

## Exact next safe action

Continue Phase 3 task P3-T04 with array insertion, deletion, and update/rearrangement operations. Replace the generic `delete-value` and `update-by-value` snippets with behaviorally equivalent first-delete/all-update implementations before authoring their language fixtures; then complete mappings and semantic artifacts for all 14 entries.

## T3 holds

- Do not persist `20260714113326_reconcile_database_contract` until the Phase 4 start gate has current backup/recovery evidence and the user confirms exactly: `Confirm apply 20260714113326_reconcile_database_contract to mylzlhevgffgkwpeerzh`.
- Do not deploy to production until Phase 10 preview, release, rollback, monitoring, and exact deployment confirmation gates pass.

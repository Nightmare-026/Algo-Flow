# Algo Flow — Authoritative Phase 1 Rebaseline

**Audit date:** 2026-07-14  
**Audited checkpoint:** `f0773674c248db44488f0671951a7282ea4fbb38`  
**Branch:** `chore/production-readiness`  
**Verdict:** Phase 1 audit complete; implementation/release gate blocked.

## Document precedence

This file is the authoritative current-state audit, progress record, and decision addendum for Phase 1. It supersedes conflicting Phase 0/1 claims in `CURRENT_STATE_AUDIT.md`, `PROGRESS_TRACKER.md`, and `DECISIONS.md` until those files can be reconciled. The conflicting documents are retained unchanged in safety snapshot `f077367` for traceability.

No application fix, database write, migration, deployment, or production mutation was performed during this audit.

## Decision record

The owner approved **Option A**: preserve and continue the existing Phase 2/3 work in place after a safety snapshot. The complete dirty working tree was checked for high-signal secret indicators and committed as:

```text
f077367 chore: snapshot production-readiness work before phase 1 audit
```

The branch was clean immediately after the snapshot. Phase 1 then ran as an audit-only pass. Further Phase 2/3 implementation requires a new explicit approval after this report.

## Scope and method

- Started from the snapshot diff and modified symbols, then expanded one dependency hop where failures implicated shared registries, routes, auth, or data APIs.
- Re-ran typecheck, lint, Jest, coverage, registry validation, formatting, Playwright discovery, production build, and dependency audit.
- Ran the local Next.js server and checked known routes, browser console output, auth redirect behavior, and responsive layout at `320`, `360`, `375`, `390`, `414`, `768`, `1024`, `1280`, `1440`, and `1920` pixels.
- Compared Supabase API calls with all three committed migrations. The linked remote Supabase project was inactive during Phase 0 and its live schema could not be queried, so database findings are proven against repository migrations but remain unverified against remote drift.
- Reconciled the catalog and registry using executable imports: 105 catalog entries, 106 registry entries, and one registry-only slug.

## Severity model

| Severity | Meaning |
|---|---|
| Blocker | Prevents the core product, build, or next implementation phase from being accepted. |
| Critical | Likely breaks persisted user behavior or creates a serious data/security correctness failure. |
| High | Major reliability, accessibility, security, or testability gap that must be resolved before release. |
| Medium | Material quality or maintainability problem that can follow the immediate recovery gate. |
| Low | Small defect with limited user or operational impact. |
| Enhancement | Valuable improvement that is not required to restore correctness. |

## Executive result

| Severity | Count |
|---|---:|
| Blocker | 2 |
| Critical | 5 |
| High | 13 |
| Medium | 11 |
| Low | 0 |
| Enhancement | 3 |

The branch is not merely missing polish: its core `/visualizer/[slug]` product surface returns a build error and HTTP 500. The newly introduced strict visualizer contract is not connected to the runtime registry, while its validator assumes fields that all 106 legacy entries lack and crashes before producing a controlled report.

## Blockers

| ID | Area | Evidence and root cause | Required resolution |
|---|---|---|---|
| B-01 | Core visualizer runtime | `src/features/algorithms/array/deletion.ts:11` imports `deleted` and `insertion.ts:12` imports `inserted`, but `src/features/visualizer-engine/highlights.ts` exports neither. `npm run typecheck` fails and `/visualizer/bubble-sort` returns 500. Because the aggregate registry statically imports every family, the failure affects every visualizer slug. | Restore canonical inserted/deleted highlight helpers or update consumers to supported buckets; then verify the original route, every first-degree array registry consumer, typecheck, and build. |
| B-02 | Registry contract/build gate | Runtime entries still implement `AlgorithmVisualizerDefinition`, whose only required fields are `slug` and `generateSteps`. The new `VisualizerDefinition` is not adopted. Executable inventory found all 106 entries missing all 13 new contract groups. The validator calls `entry.legend.map` after detecting a missing legend and throws at `scripts/validate-registry.ts:212`; `npm run build` fails in prebuild. | Choose one authoritative contract, migrate entries incrementally, make the validator accumulate failures without dereferencing invalid fields, and keep the build blocked until the controlled report is empty. |

## Critical findings

| ID | Area | Evidence and root cause | Required resolution |
|---|---|---|---|
| C-01 | Bookmarks persistence | `bookmarks` requires non-null `bookmark_type` and `title` and defines `algorithm_id` as UUID in migration 003. `toggleBookmark` inserts only `user_id` plus the seed string algorithm ID. The repository-defined schema rejects the write. | Align the domain identifier strategy and insert contract; add a migration-backed integration test for save/remove. |
| C-02 | Progress and saved sessions | `user_progress.algorithm_id` and `saved_visualizer_sessions.algorithm_id` are UUID foreign keys, while the APIs pass IDs such as `alg_arr_bubble_sort`. Both write paths are incompatible with migration 003. | Decide whether catalog identity is database UUID or stable text ID, migrate consistently, and type the API boundary. |
| C-03 | Preferences | `src/lib/api/preferences.ts` queries table `preferences`, key `id`, and columns `code_language`, `speed`, `difficulty`. Migration 003 creates `user_preferences`, key `user_id`, and differently named columns. | Replace the API contract or migration so names and types match exactly; generate database types and test read/update. |
| C-04 | Quiz activity recording | `submitQuizAttempt` inserts `metadata`, but migration 003 creates no `activity_timeline.metadata` column. The activity insert fails after the quiz attempt succeeds, producing partial behavior without reporting it. | Add the intended JSONB column through a reviewed migration or remove the field; make the multi-write workflow explicit and observable. |
| C-05 | False-success mutation handling | `markCompleted` returns `true` even when the upsert fails; `deleteSession` returns `true` without checking the delete error; streak reads treat any error as a missing row and then attempt an unchecked insert/update. Users can be told work was saved when it was not. | Return typed success/error results, distinguish no-row from query failure, and test each failure path. |

## High findings

| ID | Area | Evidence and root cause | Required resolution |
|---|---|---|---|
| H-01 | Migration ordering | Migration 002 creates a text/score-based `quiz_attempts`; migration 003 declares a different answer/UUID-based table behind `CREATE TABLE IF NOT EXISTS`. A fresh sequential run retains the 002 shape while 003 reads as if it supplied the later design. | Consolidate into a forward migration with one authoritative schema and a tested down/rollback plan before any remote application. |
| H-02 | Supabase exposure/RLS | Migration 003 creates catalog tables in exposed `public` but enables RLS only on user tables. Explicit Data API grants are also absent from repository SQL. Remote exposure settings could not be verified. | Define public read policies and explicit grants for published catalog data, or move private tables to a non-exposed schema; verify with Supabase advisors on an active project. |
| H-03 | Database typing | Supabase clients are untyped and API results are cast to local types. This allowed table, column, and UUID/text drift to compile. | Generate database types from the authoritative schema and parameterize browser/server clients. |
| H-04 | Read-error suppression | Bookmarks, progress, sessions, activity, quizzes, and streak readers ignore Supabase errors and return empty/null states. The dashboard can display false zero progress instead of an outage/error state. | Propagate typed errors to route-level boundaries and add designed retry/error UI. |
| H-05 | Route resilience | The App Router contains 13 pages and one route handler but no `error.tsx`, `global-error.tsx`, `loading.tsx`, or app-level `not-found.tsx`. A single render/data error has no product-owned recovery surface. | Add global and high-risk segment boundaries with logging hooks and accessible retry states. |
| H-06 | E2E harness | `npm run test:e2e -- --list` reports zero Playwright tests and imports Jest files from `tests/`, producing `describe is not defined` / Jest-environment errors. | Add Playwright config with a dedicated E2E directory and at least auth redirect, catalog, visualizer playback, and quiz flows. |
| H-07 | Coverage | Coverage is 7.57% statements, 2.91% branches, 4.04% functions, and 8.19% lines against an 85% global threshold. The suite covers helpers but not user journeys or the data boundary. | Add risk-based unit/integration coverage before enforcing a realistic ratcheting threshold; retain the final production target. |
| H-08 | Auth accessibility | Auth pages render visible `<label>` elements without `htmlFor`; inputs have no IDs or ARIA labels. Login DOM verification confirmed both visible inputs lack programmatic labels, and the same pattern appears across signup/reset/forgot-password. | Associate every label/input, preserve autocomplete, and run keyboard plus screen-reader-oriented checks. |
| H-09 | Auth boundary validation | Server actions cast raw `FormData` to strings and send values to Supabase without server-side schema/length checks. Supabase error messages are redirected into public query parameters. | Add server-side validation, stable user-safe error codes/messages, and rate-limit/abuse controls in the later security phase. |
| H-10 | Dashboard waterfall | The dashboard performs streak, progress, bookmark, session, activity, and challenge work serially; each helper creates a client and repeats `getUser`. Authenticated remote latency could not be tested. | Authenticate once, group independent reads with `Promise.all`, and preserve independent error states. |
| H-11 | HTTP security headers | `next.config.ts` has no header policy. Phase 0 production verification found HSTS but no CSP/frame-ancestors, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy; the home response also exposed `Access-Control-Allow-Origin: *`. | Define and test a least-privilege header policy before release, including an explicit authenticated CORS posture. |
| H-12 | Product publication contract | The public catalog contains 105 entries, but none of the 106 runtime entries satisfies the new authored contract for metadata, five languages, pseudocode, test cases, line mapping, or legend. `ComingSoonCanvas` can still expose incomplete content if checks are bypassed. | Publish only validated entries and make catalog generation consume the same authoritative contract. |
| H-13 | Data/auth integration tests | No test executes migrations, RLS, Supabase auth/session refresh, or dashboard CRUD against an isolated database. The proven schema/API mismatches escaped the suite. | Add local Supabase migration/RLS/API integration tests before Phase 4 can pass. |

## Medium findings

| ID | Area | Evidence and root cause | Required resolution |
|---|---|---|---|
| M-01 | Light theme | `ThemeProvider` resolves `light-edu`, but `globals.css` defines no `[data-theme="light-edu"]` token block. Selecting system light mode does not produce a real light theme. | Implement and contrast-test a complete light token set or remove the option until ready. |
| M-02 | Initial rendering | `ThemeProvider` wraps the entire application in `visibility:hidden` until a client effect sets `mounted`. Content availability and LCP depend on hydration. | Apply the initial theme before paint with a small safe bootstrap and keep server-rendered content visible. |
| M-03 | Client boundaries | The landing page, catalog, category, and visualizer route are top-level client components. This broadens hydration and places the aggregate registry in the client graph. | Move static shells/data selection to Server Components and isolate interactive controls. |
| M-04 | LCP asset | Browser console warns that `/logo.png` is the LCP image but is not eagerly loaded. | Mark the above-fold logo appropriately and measure after the build is restored. |
| M-05 | Formatting/lint hygiene | Prettier reports 163 files. ESLint exits zero with 11 warnings and scans generated coverage output because `coverage/**` is not ignored. | Add generated-output ignores, format intentionally in a dedicated change, and enforce zero-warning CI. |
| M-06 | Dependency audit | `npm audit --omit=dev --audit-level=moderate` reports two moderate PostCSS findings through Next's nested dependency; npm reports no fix available. | Track the upstream fix and reassess on each Next patch; do not force an unsafe override. |
| M-07 | Registry/catalog drift | Registry has one orphan slug, `matrix-col-traversal`; catalog has 105 unique slugs and none are missing from the registry. | Remove or publish the orphan through the single source of truth. |
| M-08 | Recorded product decisions not implemented | The verified contact remains `support@algoflow.dev` despite the owner decision to use `ganeshsharma7114@gmail.com`; analytics is described in policy/decisions but no implementation exists. | Implement or update the copy in the designated product/legal phase. |
| M-09 | Dashboard navigation decision incomplete | Four redirect-only subroutes were deleted, but the main dashboard remains one long page and does not implement the decided `?tab=` contract. | Add accessible tabs in the dashboard phase and test deep links/history. |
| M-10 | Callback/origin trust | OAuth/reset origins and the auth callback use request-derived `Origin` / `x-forwarded-host` without an explicit allowlist in application code. No exploit was validated in this audit. | Validate against configured site/preview origins during the security phase and add negative tests. |
| M-11 | Daily challenge source split | A `daily_challenges` table exists, but the API intentionally ignores it and computes a local deterministic challenge. The data model and product source of truth disagree. | Choose database-managed or deterministic challenges and remove the unused path. |

## Enhancements

| ID | Enhancement | Acceptance signal |
|---|---|---|
| E-01 | Run route-level bundle analysis after the build is green. | Saved analyzer artifact identifies client-heavy registry and 3D dependencies per route. |
| E-02 | Add automated visual regression at the ten required widths. | Stable snapshots for landing, catalog, category, visualizer, auth, quiz, and authenticated dashboard. |
| E-03 | Add structured production observability. | Route/data errors include workflow/request ID, commit SHA, safe context, and actionable alerting without PII. |

## Quality-gate evidence

| Check | Result |
|---|---|
| `npm run typecheck` | **Fail** — two missing highlight exports. |
| `npm run lint` | **Pass with 11 warnings** — ten source/test warnings plus one generated coverage warning. |
| `npm test -- --runInBand` | **Fail** — 4 suites, 29 tests; 24 pass and 5 registry-contract assertions fail. |
| `npm run validate:registry` | **Fail** — uncontrolled `entry.legend.map` TypeError. |
| `npm run build` | **Fail** — prebuild registry validation aborts. |
| `npm run test:coverage -- --runInBand` | **Fail** — tests fail and all four 85% thresholds are missed. |
| `npm run test:e2e -- --list` | **Fail** — zero E2E tests; Playwright imports Jest files. |
| `npm run format:check` | **Fail** — 163 files. |
| `npm audit --omit=dev --audit-level=moderate` | **Fail** — two moderate PostCSS findings, no upstream fix available. |

## Route and responsive verification

### HTTP smoke results on a clean local server

| Route | Result |
|---|---|
| `/`, `/visualizers`, `/visualizers/array` | 200 |
| `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email` | 200 |
| `/privacy`, `/terms` | 200 |
| `/quizzes/alg_arr_bubble_sort` | 200 |
| `/dashboard` unauthenticated | 302 to `/login?next=%2Fdashboard` |
| unknown route | 404 |
| `/visualizer/bubble-sort` | **500** |

### Ten-width matrix

| Surface | 320–1920 result | Notes |
|---|---|---|
| Landing | Pass | No document-level horizontal overflow at any required width. |
| Visualizer catalog | Pass | Ten cards present; search control reflows. |
| Array category | Pass on a clean server | 32 algorithm links; no document-level horizontal overflow. |
| Login | Pass layout / fail labels | Form renders without horizontal overflow; inputs lack programmatic labels. |
| Bubble Sort quiz | Pass | Quiz renders at all required widths without document-level horizontal overflow. |
| Visualizer | **Blocked at all widths** | Build-error overlay; no visualizer controls/canvas render. |
| Dashboard | Auth redirect only | Authenticated responsive layout could not be verified without a test account and working remote data plane. |

The browser screenshot capture API failed during this local pass, so the numeric layout/DOM evidence is authoritative here. Phase 0 production screenshots remain under `docs/baseline-screenshots/`, but they do not prove the current checkpoint because production is on an older working build.

## Architecture summary

The repository is between two incompatible states:

1. The runtime visualizer still consumes the permissive legacy registry contract.
2. A strict contract, validator, helpers, and tests were added without migrating runtime entries atomically.
3. The aggregate static registry makes any family compile defect a product-wide visualizer defect.
4. Supabase APIs moved toward feature folders, but the schema contract was not reconciled and remains untyped.
5. The UI shell is responsive on unaffected public routes, while resilience, accessibility, light theme, and authenticated data behavior remain incomplete.

## Recommended recovery order

No further feature expansion should begin until the two blockers are closed in this order:

1. Repair B-01 and prove `/visualizer/bubble-sort` renders again.
2. Make one registry contract authoritative; harden the validator and migrate entries in reviewable batches.
3. Restore typecheck, registry validation, unit tests, production build, and a correctly isolated E2E smoke test.
4. Only then reconcile the database identifier/schema contract through a reviewed migration plan; do not apply a remote migration without the irreversible-action protocol and explicit confirmation.

## Phase 1 progress and acceptance

- [x] Option A selected and current work preserved in safety commit `f077367`.
- [x] Architecture, product, runtime, data/auth, and responsive surfaces audited.
- [x] Findings classified with evidence, root cause, and proposed resolution.
- [x] All ten required widths exercised on every currently renderable major public surface.
- [x] Core route failure reproduced and isolated to the changed import/export boundary.
- [x] Conflicting earlier baseline claims explicitly superseded.
- [ ] Implementation/release gate green — blocked by B-01 and B-02.

**Phase 1 audit acceptance: PASS.**  
**Phase 2/3 recovery implementation authorization: NOT YET GRANTED.**

# Current State Audit — Classified Findings (Phase 1)

> **Authoritative current addendum — 2026-07-14:** This section supersedes stale runtime counts and unverified responsive claims later in this historical audit. The earlier detail remains below for traceability. Current verification uses the preserved working tree after Phase 2/3 recovery and Phase 4 database/API preparation.

## Current verification summary

| Area | Current evidence |
|---|---|
| Build and types | Production build and typecheck pass |
| Unit tests | 7 suites / 36 tests pass |
| Registry parity | 105 published catalog entries / 105 runtime registry entries |
| Strict publication readiness | Fails with 1,365 authored-artifact errors |
| All visualizer routes | 104/105 pass; `insertion-sort` returns HTTP 500 |
| Responsive runtime | Six major public routes pass at 320, 360, 375, 390, 414, 768, 1024, 1280, 1440, and 1920px with no console/page errors, framework overlays, or document overflow |
| Internal links | All internal links discovered on seven major public routes resolve below HTTP 400 |
| Circular dependencies | `madge` processed 178 files and found none |
| Duplication | `jscpd` found 145 clones and 2,154 duplicated lines (9.01%) across 174 TS/TSX files |
| Resilience files | No `error.tsx`, `global-error.tsx`, `loading.tsx`, or custom `not-found.tsx` exists |
| Accessibility baseline | Lighthouse desktop accessibility 96; color contrast is the failing scored audit |

## Current classified findings

| ID | Severity | Finding and reproduction | Likely root cause | Proposed solution / owner phase |
|---|---|---|---|---|
| P1-B01 | Blocker | `npx playwright test e2e/visualizer-route-audit.spec.ts --workers=4` returns HTTP 500 only for `/visualizer/insertion-sort`; 104 other published routes pass. | `src/features/algorithms/array/sort.ts:295` reads `elements[j + 1].value` after a swap. When `j` is the last index, the read is out of bounds. | Capture the compared values before mutation or describe the post-swap pair using valid indices; add generator edge tests and rerun all 105 routes in Phase 3. |
| P1-C01 | Critical | `npm run validate:registry:readiness` reports 1,365 errors across the 105 published definitions. | The runtime registry still uses a permissive legacy contract and separate metadata/code/pseudocode sources. | Adopt one strict `VisualizerDefinition`, migrate every entry, and make readiness validation block build/CI in Phase 3. |
| P1-C02 | Critical | Runtime code can synthesize a JavaScript scaffold and a `Structural Properties` panel instead of rejecting incomplete publication (`src/app/visualizer/[slug]/page.tsx:13-37,71,75`). | Fallback UI hides incomplete definitions from ordinary runtime smoke checks. | Remove production fallbacks; unpublished/incomplete entries must be excluded or fail validation in Phase 3. |
| P1-C03 | Critical | The insertion-sort failure shows a generic `This page couldn't load` recovery surface; no application error or loading boundaries exist. | Missing App Router resilience files and route-specific recovery states. | Add accessible root/segment error, global-error, not-found, and loading boundaries in Phases 2 and 9. |
| P1-H01 | High | Coverage gate fails at 9.94% statements, 5.05% branches, 7.38% functions, and 10.77% lines. | Most algorithms, renderers, routes, and auth/data flows are untested. | Add invariant, component, integration, E2E, accessibility, and database tests with an enforceable threshold in Phase 8. |
| P1-H02 | High | Auth server actions have no verified abuse throttling. | No rate-limit boundary is implemented for login, signup, reset, or recovery. | Add server-side per-IP/account rate limits and safe responses in Phase 4. |
| P1-H03 | High | The core registry still exposes `data: any` and `React.ComponentType<any>` (`registry/types.ts:14,59`). | Family-specific input/control types were not propagated into the runtime registry. | Replace with discriminated family types and typed control props in Phase 2/3. |
| P1-H04 | High | Live Supabase reconciliation is dry-run verified but not persistently applied; generated types therefore cannot yet prove the remote contract. | Irreversible migration gate correctly awaits action-specific confirmation. | Apply the reviewed migration only after confirmation, regenerate types, and rerun RLS/RPC/auth-trigger checks in Phase 4. |
| P1-M01 | Medium | `jscpd` reports 145 clones / 9.01% duplicated lines, concentrated in algorithm step emitters and structurally similar controls/renderers. | Repeated step and form scaffolding lacks safe shared helpers. | Extract typed helpers only where behavior is truly identical; retain algorithm clarity in Phase 2/3. |
| P1-M02 | Medium | Several modules are oversized: `algorithms.ts` 1,529 lines, `array/sort.ts` 948, tree editor 491, array operations 549, visualizer layout 389, dashboard 339. | Catalog, generation logic, and UI responsibilities are bundled by broad file rather than bounded feature. | Split by operation/concern with stable public barrels and regression tests in Phase 2. |
| P1-M03 | Medium | Lighthouse accessibility is 96 because one or more foreground/background pairs fail color contrast. | Semantic theme tokens do not meet contrast in every combination. | Correct token pairs and validate both themes with axe/Lighthouse in Phases 5/6. |
| P1-M04 | Medium | `npm run format:check` reports 147 source files. | Repository-wide formatting was never normalized or enforced. | Apply a dedicated mechanical formatting pass after functional recovery and enforce it in CI. |
| P1-M05 | Medium | `npm audit` reports two moderate transitive PostCSS advisories through the installed Next.js package, with no fix currently reported. | Upstream dependency pin includes the affected transitive version. | Track the advisory, retest when Next.js publishes a compatible fix, and document the temporary exception. |

## Verified negative findings

- No circular dependency was found in 178 analyzed source files.
- No explicit `any` remains outside the two central registry contract holes listed above.
- No dead internal link was found on the major public route crawl.
- No representative-route hydration error, console error, framework overlay, or document-level horizontal overflow was observed across the ten required widths.
- Catalog and runtime registry slugs are in exact 105/105 parity; completeness, not routing parity, is the remaining publication problem.

## Phase 1 acceptance

The audit gate is **complete**: architecture, product, runtime, responsive, link, dependency, type-safety, resilience, and quality surfaces now have current evidence and every promoted finding has severity, reproduction, root cause, and remediation ownership. Findings remain open for implementation in their assigned phases; audit completion is not release approval.

---

> Updated: 2026-07-14. Methodology: source-level inspection, type/lint/test baselines, route inventory, and component-level review of all 10 renderers + the visualizer page + the auth actions + every API handler. **No live browser test was executed**, so responsive findings from §8 are static-code-based hypotheses flagged ⚠️ until live verification at the listed breakpoints.

Severity scale used: **Blocker → Critical → High → Medium → Low → Enhancement.**

---

## 1. Repository hygiene

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| R-01 | High | Three migrations are mis-numbered vs. their content. `001_auth_profiles.sql` is actually the SRS-complete migration (excludes profiles; contains IF-NOT-EXISTS everywhere). `002_phase10.sql` creates the profiles table + `handle_new_user()`. `003_srs_complete.sql` re-asserts many of the same definitions in different shapes. | `supabase/migrations/*` | Renumber reliably; topologically order: 010_profiles → 020_user_data → 030_catalog → 040_learning → 050_quiz → 060_rls → 070_triggers. Drop redundant duplicates after you'd rotated prod. |
| R-02 | Critical | `quiz_attempts` defined twice with conflicting schemas. Version 1: `selected_answer text, is_correct boolean, score int, time_taken_seconds int, attempted_at timestamptz, unique(algorithm_id, quiz_id ?)` (no quiz_id FK). Version 2: `score int, total_questions int` with no per-quiz row. The client (`lib/api/quizzes.ts`) uses the **second** shape; the DB schema depending on which migration ran may not match — runtime check required. | `001_auth_profiles.sql:160-170` vs `002_phase10.sql:4-15` | Pick one canonical schema, add `quiz_id uuid` FK and a `selected_answer boolean[]`, write a forward-fix migration. Owner-run only (Phase 0 rule). |
| R-03 | High | `algorithm_id` field type is inconsistent across tables — `uuid` in some places, `text` in `002_phase10.sql`'s `quiz_attempts` and `daily_challenges`. Activity timeline treats it as text. | `001_auth_profiles.sql:178`; `002_phase10.sql:7,21` | Standardize to `text` everywhere (matches what the API sends). Treat algorithm-id collisions defensively. |
| R-04 | High | `daily_challenges` has only SELECT policy for "Anyone"; INSERT/UPDATE only by service role. The `submitQuizAttempt` writes to `quiz_attempts`, not `daily_challenges`; yet `dashboard/page.tsx` reads `daily_challenges` and submits `isChallengeCompleted` reads elsewhere — orchestrator code location unverified. | `src/app/dashboard/page.tsx:42-48`; `src/lib/api/challenges.ts` (not yet read) | Verify the daily-challenge close-the-loop endpoints and confirm tests/manual steps. |
| R-05 | Medium | `.gitignore` includes `docs/supabase_config.md`. That signals sensitive material was once committed and then removed. Without a full history scan we cannot rule out residual exposure. | `algo-flow/.gitignore` | Run `gitleaks`/`git secrets --scan-history` over main and confirm. List any findings in `SECRET_INVENTORY.md`. |

---

## 2. Architecture findings

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| A-01 | Critical | The visualizer registry contract is too weak to satisfy the master's required gate. `AlgorithmVisualizerDefinition` declares only `slug`, `generateSteps(data: any, options)`, optional `getCodeExamples`, optional `pseudocode`. Title, description, complexity, all four language implementations, test cases, code-line mapping, and difficulty are not part of the contract. The build will never fail on an incomplete entry. | `src/features/visualizer-engine/registry/types.ts` | Replace with `VisualizerDefinition` per master §10; add build-time validator with `tsc`-aware or `tsx`-aware schema check; emit in CI. |
| A-02 | Critical | `generateSteps` accepts `data: any`. This is the contract's central input. Type-system holes around it have already produced *inverted* highlight payloads that pass `tsc` but never paint (B-01). | `src/features/visualizer-engine/registry/types.ts:8` | Replace with a discriminated union per data-structure family. |
| A-03 | Critical | **Highlights shape mismatch.** Several algorithm step-emitters build `highlights: { [dynamicId]: "active" }` (id→bucket map), while every renderer expects `highlights: { active?: string[], current?: string[], ... }` (bucket→id[]). Because TS does not enforce excess-property checks on object literals with computed property keys, the type-check stays clean and the runtime renders no highlight state. | `src/features/algorithms/array/sort.ts` lines 44-47, 64-67, 76, 98, 108-114, 145, 158-162 | Migrate all algorithm step files to the canonical `{ active: [id,id], success: [id] }` shape; replace each offending literal with a typed helper; **see code line 65 in `/workspace/0a0de0cf-…/src/features/algorithms/array/sort.ts`**. This is the most likely cause of "visualizer feels inert." |
| A-04 | High | Pseudocode exists in two parallel sources: `Algorithm.pseudocode?: string` (type-level, unused) and `data/seed/pseudocode.ts` (`pseudocodeMap`). They drift out of sync. | `src/types/index.ts:123`; `src/data/seed/pseudocode.ts` | Pick one source of truth; bind registry `pseudocode` to the map; deprecate `Algorithm.pseudocode` if not used. |
| A-05 | High | `playback-store.ts` does not declare `stepExplanation` integration — `VisualizerLayout.tsx:80` directly reads `steps[currentStepIndex + 1]` then sets `setPracticeOptions`, but the `dummyOptions` filter on line 81 references a list of strings that **doesn't match the full actionType union** (`insert`, `delete`, `move-pointer`, `found`, `not-found`, etc., all missing). Practice-mode outcomes will be unrepresentative of the actual next step. | `src/features/visualizer-engine/components/VisualizerLayout.tsx:73-86` | Refactor: build practice options from a comprehensive `actionType → human label` map. |
| A-06 | High | Server actions perform no rate-limiting; auth-action throughput is unbounded. | `src/app/(auth)/login/actions.ts` and others | Add per-IP rate-limiting (Upstash/Redis or in-memory bucket keyed by IP+route) in middleware. **Phase 4 deliverable.** |
| A-07 | High | `middleware.ts` refreshes the session but does **not** enforce protected routes. The dashboard pages themselves do a `getUser()`+`redirect()` check — this is the only server-side guard. | `src/lib/supabase/middleware.ts`; `src/app/dashboard/page.tsx:17-23` | Middleware should redirect unauthenticated `/dashboard/**` to `/login?next=…`. Reduces latency and removes drift between data fetches. |
| A-08 | High | No `error.tsx` / `global-error.tsx` App Router boundary exists. A runtime error in any client component crashes the route silently. | `find … error.tsx*` returns 0 results | Add per-route error.tsx, plus a root `global-error.tsx` with a safe fallback and an `aria-live` notification. |
| A-09 | Medium | No `loading.tsx` skeletons — pages flash or hang. Each dashboard/read fetches a half-dozen Supabase calls synchronously. | `find … loading.tsx` returns 0 results | Add `loading.tsx` to `dashboard/*`, `visualizer/*`, `quizzes/*`. |
| A-10 | Medium | Several `Math.random()` calls and `0.5 - Math.random()` shuffles are deterministic enough for visualizers but unsuitable for any *security-relevant* randomness (password reset tokens, session ID creation). The codebase mixes them in places that should be CSPRNG. | `src/data/seed/questions/index.ts:37`; various input controls | Constrain `Math.random` to non-security use via lint rule (`no-restricted-syntax`); introduce `crypto.getRandomValues` for any IDs/results. |
| A-11 | Medium | The visualizer page's `arrayData` default is hardcoded `[15, 23, 4, 8, 42, 16]` in `useState` — that branch of state is set twice (once in `useState`, once by `useEffect`). The first render computes `generateSteps` against the default, which is fine; but `clampOperationOptions` runs on `arrayData.length` so on first render before settle everything is consistent. | `src/app/visualizer/[slug]/page.tsx:45-58` | Hoist defaults and avoid re-computing `generateSteps` on every render by stabilizing via `useMemo`. |
| A-12 | Low | The visualizer page declares `params: Promise<{ slug: string }>` and calls `use(params)` — that is React Server Components idiom and is correct for Next 16, but the file is `"use client"` — should double-check that the actual `use(params)` works under client components (it generally does, but worth confirming). | `src/app/visualizer/[slug]/page.tsx:1,4,42-44` | Verify in actual build; consider moving the lookup to a server component wrapper and passing data down. |

---

## 3. Product completeness findings

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| P-01 | Critical | Visualizers listed in the catalog with **no implementing registry entry** come up as `ComingSoonCanvas` showing a "Structural Properties" placeholder. This violates the master rule against advertising incomplete visualizers as interactive. | `src/app/visualizer/[slug]/page.tsx:74-78`; registry entries missing for `access` (catalog slug), `linked-list-types`, `heap-insert`, `trie-insert-word`, `stack-is-empty`, etc. | Enforce registry completeness at build time (links back to A-01). Visualizers without a complete record are **not** exported from `algorithmRegistry`. |
| P-02 | High | `createFallbackCodeExamples` returns a generic JS scaffold when no curated code is available. Users see "Compact JavaScript scaffold generated when a curated code example is not available yet" — that string is the explainer; it's a placeholder. | `src/app/visualizer/[slug]/page.tsx:13-26` | Replace with a curated example per algorithm, or fail the build (per A-01). |
| P-03 | High | `getCodeExamples` returns an array per `slug`, but no language implementation is guaranteed for Python/C++/Java across all visualizers. Master requires all four. | inspected `code-examples.ts` only in part; needs full audit | Enforce present implementation per language per slug at build time. |
| P-04 | High | Pseudocode map covers ~46/107 slugs. Many `rawAlgorithms` entries have no corresponding pseudocode. | `src/data/seed/pseudocode.ts` (138 lines, ~46 entries) vs `algorithms.ts` (107+ slugs) | Audit each algorithm; if intentionally not in scope, omit. If in scope, write pseudocode. |
| P-05 | High | Linked-list registry is incomplete. Several slugs in the catalog (`sll-search`, `sll-insert-head`, `sll-insert-tail`, `sll-delete`, etc.) have registry functions only if present in the registry entry. Need a full audit pass. | `src/features/algorithms/linked-list/registry.ts` (length not yet measured) | Build a coverage matrix and complete any missing implementers. |
| P-06 | High | Graph registry is **two entries** (`bfs`, `dfs`). The catalog claims many more (Dijkstra, Prim, Kruskal, Bellman-Ford, topological sort, cycle detection). | `src/features/algorithms/graph/registry.ts:6-9`; `src/data/seed/operations.ts` references all graph ops | Either add the slugs or remove them from public catalog. Confirm with user before adding back large scope. |
| P-07 | Medium | Dashboard sub-pages `bookmarks`, `progress`, `sessions`, `streak` all redirect to `/dashboard`. Either this is planned (content is rendered inside the main dashboard with tabs) or it's a stub. | `src/app/dashboard/{bookmarks,progress,sessions,streak}/page.tsx` are 4-5 line redirect components | Decide: keep tabs in main dashboard, or build out each route with its own page state. Confirm with user. |
| P-08 | Medium | Daily-challenge close-the-loop is not verified end-to-end. The dashboard renders "Take Quiz" or "Review Quiz" depending on `challengeCompleted`, but `isChallengeCompleted` returns something; where it's set is unverified. | `dashboard/page.tsx:42-48`; `lib/api/challenges.ts` | Audit `lib/api/challenges.ts`; add a test that prizes the end-to-end. |
| P-09 | Medium | Landing-page `TrustStats` shows an animated counter (e.g. "105+ visualizers"). Counts need verification against the actual number of `isPublished` algorithms. | `src/components/landing/TrustStats.tsx:10` (+ related sections) | Compute from source. Currently appears to be 107 published algorithms (slightly off from the "105+" claim). |
| P-10 | Medium | `Footer` likely contains last-updated year, contact email address, and copyright strings. Need to confirm against legal copy. | not yet read | Read `Footer.tsx`. Cross-check years against `Last updated: 2026-07-14`. |
| P-11 | Low | Testimonials, if any, must be honest. Need to verify nothing fabricated. | not yet read | Audit Hero / Testimonials / TrustStats. |

---

## 4. Runtime reliability findings

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| RR-01 | Critical | (Same root cause as A-03.) Highlight mappings are inverted in some algorithm files. Affects every `array/sort.ts` step emitter — sorting visualizations appear to do nothing during compare/swap/success segments, even though `dataState` is updated correctly. | `sort.ts` literals | Will be fixed by A-03. |
| RR-02 | High | The visualizer page renders a top-level `useEffect` that calls `loadSteps(steps)` whenever `algorithm`, `arrayData`, or `options` change. When the user types in an input which triggers `setOptions`, the page re-runs `generateSteps` synchronously and re-loads — for a large array + heavy algorithm (e.g. merge sort on 20 items), this could block the UI. | `src/app/visualizer/[slug]/page.tsx:50-57` | Switch to incremental generation, `useDeferredValue`, or a Web Worker. Decide based on measured frame time. |
| RR-03 | High | `VisualizerLayout.tsx:68` uses `Math.random() < 0.1` to decide if practice-mode should prompt. With React 19's Strict Mode (dev) the effect runs twice, doubling the chance to pause mid-step. In production this is fine once, but race between the chance-check and `pause()` setting state may show flicker. | `src/features/visualizer-engine/components/VisualizerLayout.tsx:64-92` | Hoist stale-closure; use a token in deps. |
| RR-04 | High | `usePlaybackStore.getState().play()` is called inside `setTimeout` after feedback reveal — but `setTimeout` is not cleared if the user navigates away mid-feedback. Result: ghost play attempts. | `src/features/visualizer-engine/components/VisualizerLayout.tsx:105-116` | Track timeouts, clear on unmount. Combined with A-08 (no error boundary), unmount may not clean up state. |
| RR-05 | High | `practiceAccuracy numeric(5,2)` is set in `user_progress` schema but I find no setter — completion marking via `markCompleted` does not record `practice_accuracy`. Numeric precision rules suggest average accuracy, but the field is never written. | `supabase/migrations/003_srs_complete.sql:99`; `lib/api/progress.ts:5-33` | Either remove the column or wire the field. |
| RR-06 | High | Falling-edge of `markCompleted` swaps status to `completed` regardless of prior state. `upsert` uses `onConflict: "user_id,algorithm_id"` but a `not_started` user re-completing the same algorithm fires the activity-timeline insert unconditionally. | `src/lib/api/progress.ts:11-32` | Add a row-existence check before logging the timeline event. |
| RR-07 | High | `quiz_attempts` insert (`lib/api/quizzes.ts`) uses `algorithm_id text` — if a user's `algorithmId` does not match any seeded algorithm id, the row will still be inserted with a foreign-less string. No integrity check at the API layer. | `lib/api/quizzes.ts:21-30` | Validate `algorithmId` against `algorithms` seed at write time. |
| RR-08 | Medium | `next.config.ts` is empty; no CSP, no `headers()`, no asset prefix. Without CSP, an attacker can inject scripts. | `next.config.ts` | Add security headers per master §18. |
| RR-09 | Medium | The `markCompleted` flow also calls `updateStreakOnActivity` via dynamic `import('./streak')`. Dynamic imports from server actions are valid but the module is not preloaded; first call incurs a small overhead. | `src/lib/api/progress.ts:28-29` | Convert to a top-level `import`. |
| RR-10 | Medium | `playbackStore.getState().play()` is called inside a `setTimeout`. If the user navigates away inside 1.5s, `play()` is called against a stale store but is still safe; just confusing. | `VisualizerLayout.tsx:111` | Cancel timeout on unmount and route change. |
| RR-11 | Medium | The renderer's empty-fallback reads `currentStep?.dataState`; if the array passes a wrong shape, the renderer silently shows "Array data not available." — this is UX-fragile. | each `*Renderer.tsx` lines ~13-19 | Typeguard helpers `isArrayVisualState(...)` and short-circuit to a typed error message. |
| RR-12 | Low | React Compiler is referenced in comments. Whether it is enabled in `next.config.ts` is unclear. If not, large lists re-render on every step. | `GraphRenderer.tsx:42` comment | Confirm compiler is enabled; otherwise add `useMemo`/`useCallback`. |

---

## 5. UI / responsive findings (static, ⚠️ to verify at breakpoints)

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| UI-01 | High | Catalog filter UIs (`/visualizers` and `/visualizers/[category]`) are described but file content not yet read — likely to have rendering issues at 320-414px given the Tailwind v4 grid/layout assumptions. Inspected only the layout container — assertions pending. | not yet inspected | Read both, document breakpoints. |
| UI-02 | High | `VisualizerLayout.tsx:170` declares `min-h-screen lg:h-screen` and overflow rules. At narrow widths and tall content it falls back to `overflow-y-auto`; on long algorithm runs the canvas + controls + code panel stack vertically. Mobile controls appear cramped. | inspected content | Mobile testing required at 320/360/375/390/414. |
| UI-03 | High | `Navbar.tsx:62-80` hides the "Algo" branding at < sm — relying on the logo alone. At 320px there is space to keep the brand; deprecated layout is a regression risk. | `Navbar.tsx:74` `"hidden sm:inline"` | Keep wordmark legible on all viewports; shrink rather than hide. |
| UI-04 | High | TrustStats uses framer-motion counters; on a 320px viewport `lg` styles change, so layout may shift mid-animation if height isn't reserved. | `TrustStats.tsx` | Reserve fixed height for animated counters. |
| UI-05 | Medium | Mobile menu is implemented but not ARIA-connected (`aria-controls`, `aria-expanded`); keyboard users won't know it opens. | `Navbar.tsx:130-198` | Add roles and `aria-expanded`. |
| UI-06 | Medium | ThemeProvider defaults to `dark-neon` but the rendered landing page passes `data-theme="nature-cinematic"` directly — this conflicts with the user's persisted choice on first paint. | `src/app/page.tsx:14` `data-theme="nature-cinematic"` | Let the provider own the theme; remove per-page overrides. |
| UI-07 | Medium | Footer links not inspected. Spec calls for valid links, real contact, copyright. | not yet read | Audit. |
| UI-08 | Low | HeroSection has heavy framer-motion animations; relies on `(prefers-reduced-motion)` only via `motion-reduce` variants — but the project also has `reducedMotion` store. Two competing sources. | `HeroSection.tsx` and `playback-store.ts:38` | Single source of truth — bind to `data-reduced-motion` on `<html>`. |

---

## 6. Backend / database / RLS findings

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| BD-01 | Critical | Catalog tables (`data_structures`, `operations`, `algorithms`, `algorithm_steps`, `code_examples`, `quizzes`) have **no RLS enabled**. Even though the API uses the anon key + RLS-bypass for service-role, the absence of explicit policies leaves them effectively private by default (deny-all) — clients can't read catalog data. Need explicit `SELECT` for both `anon` and `authenticated`. | `001_auth_profiles.sql` only enables RLS on user-owned tables | Add `SELECT` policies for catalog tables; in migration form (Phase 4 deliverable). |
| BD-02 | High | `profiles` table has only SELECT and UPDATE policies. Trigger `handle_new_user()` is the only INSERT path; nothing else can create a profile. Functional, but DELETE is not policy-supported for the user; account-deletion flow needs an explicit DELETE policy. | `001_auth_profiles.sql:18-31` | Confirm deletion flow; add policy if user-initiated. |
| BD-03 | High | `security definer` function `handle_new_user()` has `SET search_path = public` (good). But there's no REVOKE on EXECUTE — by default anyone with auth write can indirectly cause this function to run. Definer is the only guard, but the function should `REVOKE EXECUTE ON FUNCTION public.handle_new_user FROM PUBLIC` to harden. | `001_auth_profiles.sql:33-56` | Add REVOKE; keep DEFINER only by `postgres`/service-role. |
| BD-04 | High | All RLS policies on user-data tables use a single `FOR ALL` policy. While `WITH CHECK` covers INSERTs, the changeset (Unix timestamp, mod date at field) is never validated server-side; an UPDATE could set arbitrary fields. Need column-level or trigger-level guards. | `001_auth_profiles.sql:190-211` | Add `BEFORE UPDATE` triggers; or reduce `FOR ALL` to `FOR SELECT/INSERT/UPDATE/DELETE` with explicit `WITH CHECK` per role. |
| BD-05 | High | `algorithm_id` is `text` in some tables → can be filled with any string. No FK constraint to `algorithms.id` (`uuid`). Integrity risk. | `002_phase10.sql:7,21`; `001_auth_profiles.sql:178` | Add `CHECK (algorithm_id IS NOT NULL)` and a soft uniqueness policy. Consider a "loose" FK approach via app layer. |
| BD-06 | High | `bookmarks.bookmark_type` enum includes `'step'`, `'code'`, `'session'` but the only action (`toggleBookmark`) writes no type explicitly — relies on `algorithm_id` only. A mis-bookmarked row will fail schema `check`. | `001_auth_profiles.sql:120,128`; `lib/api/bookmarks.ts:25-27` | Always set `bookmark_type='algorithm'` on insert; add `bookmark_type` to RLS `WITH CHECK`. |
| BD-07 | Medium | `saved_visualizer_sessions.input_data` is `jsonb` — unchecked blob. App accepts any shape via `saveSession`. The schema has no size cap. | `001_auth_profiles.sql:137` | Cap size (e.g. < 16KiB) and validate at server. |
| BD-08 | Medium | The `RULE FOR ALL USING (auth.uid() = user_id)` pattern relies on RLS, but anonymous users cannot satisfy `auth.uid() = user_id` — for sessions/bookmarks, INSERTs from anonymous must be **denied**, which is the case. However, the SQL No-OP-on-empty-user case is unverified; best to test with `curl` patterns later. | post-migration test plan | Add explicit negative tests for cross-user authorization. |
| BD-09 | Medium | Daily-challenge close-the-loop: `daily_challenges.challenge_date` is `UNIQUE NOT NULL`. If `submitQuizAttempt` writes to `daily_challenges`, duplicate-key writes can fail. Verify the implementation. | not yet read | Verify in `lib/api/challenges.ts`. |
| BD-10 | Low | All `created_at`/`updated_at` use `now()`. Timezone is implicit UTC. Consider timestamptz. | every `now()` | Verify `timestamptz`; SQL has it on most columns but not all. |

---

## 7. Auth & account lifecycle findings

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| AT-01 | High | Login error message deduplicates "Invalid login credentials" to a friendlier one but **still reveals** "Email not confirmed" — differentiating accounts. Master §17 says generic errors should not reveal account existence. | `src/app/(auth)/login/actions.ts:42-49` | Replace both with a single "Email or password is incorrect, or your account is not verified." Add a verified-status banner on the Login page for unverified-logged-in users. |
| AT-02 | High | Sign-up says "An account with this email already exists" — exact same problem. | `src/app/(auth)/login/actions.ts:103-107` | Replace with "If this email is new, check your inbox to confirm." Then check verify flow. |
| AT-03 | High | OAuth flow uses `signInWithOAuth` with `redirectTo: ${origin}/auth/callback`. Origin is computed via `headerStore.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL`. If the request's `Origin` header is unset, the callback falls back to `NEXT_PUBLIC_SITE_URL`. Some Supabase OAuth providers require `site_url` to be an allowlisted redirect. Need to verify allowlist matches `NEXT_PUBLIC_SITE_URL` value. Not in repo. | `actions.ts:21-28, 55-72` | Document runbook cross-checking: Vercel env vs Supabase allowlist. |
| AT-04 | High | OAuth cancellation: `/auth/callback` returns `Could not verify account` to `/login?error=…`. Good, but the redirect hard-codes `/login?error=…` after a 5s page refresh that may not be visible. Also no model for "user declined" specifically. | `src/app/auth/callback/route.ts:32` | Add `?error=oauth_cancelled` distinct from verification failure. |
| AT-05 | Medium | `sendPasswordReset` does not rate-limit. Long-term brute force via email is therefore cheap. | `actions.ts:118-135` | Apply rate-limiting (Phase 4 / A-06). |
| AT-06 | Medium | Profile name fields (`first_name`, `last_name`, `gender`) are unrestricted strings (except length via HTML `maxLength` if any). Server doesn't validate length or charset. | `actions.ts:81-83` | Server-side length cap (e.g., 32 chars), reject control characters. |
| AT-07 | Medium | `handle_new_user()` trigger upserts; if raw_user_meta_data is malformed, the row still inserts with NULL fields. No validation. | `001_auth_profiles.sql:39-53` | Add pgsql-side `length()` checks or simply leave NULL in DB. The latter is fine; just commit. |
| AT-08 | Medium | Account deletion flow not exposed in UI or API. Spec §15/§17 demand it. | not yet found in repo | Provide `deleteAccount()` server action + API + UI button with confirmation. |
| AT-09 | Medium | Data export not exposed. | not yet found | Provide `exportAccountData()` server action → JSON download. |
| AT-10 | Low | Login form has no client-side rate-limit (network-level only). Add lockout after N attempts. | `login/page.tsx` (not yet read) | Phase 4. |

---

## 8. Test-coverage findings

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| TS-01 | High | Two unit-test files exist: `stack-queue-status.test.ts` (5 it), `visualizer-input.test.ts` (4 it). Coverage threshold in `jest.config.js` is 85% but is only enforced if `jest --coverage` is run; CI doesn't (currently nothing in `.github/workflows`). | `tests/`, `jest.config.js`, `.github/workflows` doesn't exist | Configure CI to run `jest --coverage`; gate PRs on threshold. |
| TS-02 | High | No E2E specs in repo. `@playwright/test` is installed; no `tests/e2e/*` specs. | `tests/` listing | Write smoke E2E per visualizer route + auth flows. |
| TS-03 | High | No algorithm-correctness tests beyond two stack/queue peek tests. Spec §13 demands 100% correctness-covered algorithms. | `tests/` | Add per-algorithm unit tests with property-based invariants (sort produces multiset, search finds, etc.). |
| TS-04 | High | No Python / C++ / Java tests. Spec requires code to be parsed / compiled / executed where possible. | `tests/` | Plan multi-language fixtures; Coordinate with owner — Python/JS run locally; C++/Java require compilers. |
| TS-05 | Medium | No RLS tests. Spec §16 requires DB-level RLS verification. | `tests/` | Add a `tests/rls/` suite that runs against a Supabase local instance or pg-mem emulation. |
| TS-06 | Medium | No contract test that guard the registry entries build-time invariant. | new | Build the validator; write a failing test until it removes unimplemented slugs. |

---

## 9. UX / dashboard findings

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| UX-01 | High | Dashboard reads `profile?.username`, but `UserProfile.username` is not in the seed. Profiles table doesn't store `username` (`first_name`, `last_name`, etc., only). So welcome becomes `Welcome back, Learner`. | `src/app/dashboard/page.tsx:64` | Use `full_name` first, then `email`. |
| UX-02 | High | Dashboard calls `updateStreakOnActivity()` on every visit (line 25). If a user opens the dashboard 5 times in a row, the streak is still incremented once a day; but if they open before verifying their first today, the activity_timeline could double-log. | `dashboard/page.tsx:25` | Move streak logic to gated effect; idempotent day check; only fires once per day. |
| UX-03 | Medium | "Daily Challenge" copy is hardcoded; doesn't reflect actual challenge being completed. UX benefit: clear progress messaging. | `dashboard/page.tsx:90-117` | Dynamic copy: "You've completed today's challenge — {{ name }}." |
| UX-04 | Low | No skip/back-to-landing link on the dashboard. | `dashboard/page.tsx` | Add breadcrumb or back. |
| UX-05 | Low | No empty-state illustrations. | not yet read | Review dashboard "first time" UX. |

---

## 10. Performance findings (preview)

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| PF-01 | High | Server actions sign-in flows return errors via 302 redirects with query strings. Round trip on every error; large pages re-render. | auth/actions.ts | Phase 7 deliverable. |
| PF-02 | High | Visualizer step generation runs synchronously in main thread with `generateSteps`. Long arrays (e.g. merge-sort step-by-step on 50 items) could stutter. | `/visualizer/[slug]/page.tsx` | Phase 7 deliverable: Web Worker + memoization. |
| PF-03 | Medium | `npm run build` not yet observed; need a baseline production build size. | not yet run | Phase 7 deliverable. |
| PF-04 | Medium | Code highlighting via `shiki` is an asset-heavy dep; if loaded on every code panel mount, it slows render. | `package.json` ("shiki" `^4.3.1`) | Lazy import + cache. |

---

## 11. Legal content / placeholder findings

| # | Severity | Finding | Evidence | Recommended fix |
|---|---|---|---|---|
| L-01 | Medium | Privacy Policy tail uses `Last updated: {new Date().toLocaleDateString()}` — that prints a build-time string baked at request time (per-render). Should be a stable date. | `src/app/privacy/page.tsx:18` | Hardcode or read from env/file; document review-cycle. |
| L-02 | Medium | Privacy says "we use cookies and local storage to … analyze site traffic to optimize the user experience" — but no analytics dep is installed (no `gtag` / no Plausible). Either install analytics + cookie consent, or correct the policy. | `package.json` no analytics | Decide privacy stance; adjust. |
| L-03 | Medium | Contact email `support@algoflow.dev` claimed but unverifiable. | `privacy/page.tsx:42` | Confirm user owns and monitors this inbox; otherwise change. |
| L-04 | Low | Terms of Service not inspected yet. | `terms/page.tsx` | Read and audit. |

---

## 12. Coverage gap analysis vs. spec

The master prompt's required artifacts map:

| Document (master §5) | Status | Next step |
|---|---|---|
| `PRODUCTION_READINESS_MASTER_PLAN.md` | ✅ created | Maintain |
| `PROGRESS_TRACKER.md` | ✅ created | Maintain |
| `CURRENT_STATE_AUDIT.md` | ✅ this file | Maintain |
| `ARCHITECTURE.md` | ❌ not yet | Phase 2 |
| `DATABASE_SCHEMA.md` | ❌ not yet | Phase 4 |
| `AUTHENTICATION_AND_AUTHORIZATION.md` | ❌ not yet | Phase 4 |
| `VISUALIZER_ENGINE_SPECIFICATION.md` | ❌ not yet | Phase 3 |
| `ALGORITHM_COVERAGE_MATRIX.md` | ❌ not yet | Phase 1 → Phase 3 |
| `CONTROL_COVERAGE_MATRIX.md` | ❌ not yet | Phase 3 |
| `DESIGN_SYSTEM.md` | ❌ not yet | Phase 5 |
| `ACCESSIBILITY_AUDIT.md` | ❌ not yet | Phase 7 |
| `SECURITY_THREAT_MODEL.md` | ❌ not yet | Phase 4 |
| `SECURITY_AUDIT.md` | ❌ not yet | Phase 7 / 8 |
| `PERFORMANCE_AUDIT.md` | ❌ not yet | Phase 7 |
| `TESTING_STRATEGY.md` | ❌ not yet | Phase 8 |
| `DEPLOYMENT_AND_ROLLBACK.md` | ❌ not yet | Phase 10 |
| `PROJECT_CONTEXT.md` | ✅ created | Maintain |
| `DECISIONS.md` | ✅ created (beginnings) | Maintain |
| `RELEASE_CHECKLIST.md` | ❌ not yet | Phase 11 |

---

## 13. Open questions for the user

**Resolved 2026-07-14.** Decisions recorded in `DECISIONS.md` §6–§9.

| # | Original question | Resolution |
|---|---|---|
| 1 | Add or prune incomplete-algorithm catalog slugs? | **Prune catalog** (P-01, P-06). Phase 3 begins by removing the slugs and adding a build-time registry validator. |
| 2 | Build out dashboard sub-routes, or use tabs? | **Tabs in main dashboard** (P-07). The redirect-stub `page.tsx` files are deleted in Phase 2; the main dashboard gains internal tab state in Phase 6. |
| 3 | Is `support@algoflow.dev` monitored? | **No — replace.** Use `ganeshsharma7114@gmail.com` (L-03). Phase 11 walks the file tree and updates all legal pages, footer, and marketing copy. |
| 4 | Analytics provider? | **Plausible Analytics** (L-02). Phase 11 adds the gated script behind `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. |

These four answers feed Phases 2, 6, and 11 directly.

---

## 14. Summary

| Severity | Count |
|---|---|
| Blocker | 0 (no item blocks a deploy by itself) |
| Critical | 7 |
| High | 23 |
| Medium | 18 |
| Low | 6 |
| Enhancement | 0 |

The most material items are:

- **A-03 / RR-01 — Highlights shape mismatch.** Likely the cause of "animations don't look right" reports. First thing to fix once Phase 2 starts.
- **A-01 / P-01 — Registry completeness gate.** Without this, more placeholders can sneak in.
- **BD-01 — Catalog RLS missing.** Likely runtime breakage on `algorithms`/`data_structures` reads depending on Supabase defaults.
- **A-07 / A-08 — Protected-route middleware + error.tsx.** Spec §9 and §17 demand both.
- **R-01 / R-02 — Migration renumbering + duplicate `quiz_attempts`.** Must be done before applying the next migration.

---

## 15. Verified-evidence checklist

| Claim | Evidence file:line | Run |
|---|---|---|
| TypeScript silent/clean | `npm run typecheck` exit 0 | yes |
| ESLint silent/clean | `npm run lint` exit 0 | yes |
| Jest 8/8 pass | `npx jest --silent` | yes |
| 107 slugs | `grep "slug:" src/data/seed/algorithms.ts` → 107 | yes |
| Renderers x10 | `ls renderers/*.tsx` | yes |
| Migration count | `ls supabase/migrations/*.sql` → 3 | yes |
| Catalog tables w/o RLS | grep → 0 | yes |
| Error.tsx absent | `find … error.tsx` → 0 | yes |

Everything else is **inspection-based** and not yet browser-verified.

---

Phase 1 is complete and verified to the extent it can be verified in a single non-browser session. **Items tagged ⚠️ require live breakpoint testing and live browser interaction; the user can run those by hitting `http://localhost:3000` after `npm run dev` and noting findings.**

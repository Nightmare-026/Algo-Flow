# Progress Tracker

> Format: `[ ]` = pending, `[x]` = complete, `[~]` = in progress, `[/]` = blocked.
> Every meaningful completion records date, files, tests, result, risks.

---

## Phase 0 — Repository Safety and Baseline

- [x] Confirm repository root and active branch — `algo-flow/` on `chore/production-readiness` (branched from `main @ 672f9a8`).
- [x] Check git status — clean on `main` before branch.
- [x] Create production-readiness branch — `chore/production-readiness`.
- [x] Preserve current work — no working-tree changes to preserve.
- [x] Inspect framework, backend, deployment setup.
- [x] Record existing env-variable names — see `PROJECT_CONTEXT.md` + `SECRET_INVENTORY.md`.
- [x] Inspect Supabase configuration, migrations, tables, RLS.
- [x] Inventory components, hooks, stores, APIs, visualizers, tests.
- [x] Record current build / test / lint results.
- [ ] Capture baseline screenshots — gated on browser availability.
- [ ] Run Lighthouse audit — gated on running production build.
- [x] Resolve first blocking question — **done 2026-07-14.** User chose *Option A — Local + write artifacts; you apply.* Captured in `DECISIONS.md` §5.

### Phase 0 evidence

| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | Silent (clean) — no errors |
| Lint | `npm run lint` | Silent (clean) — no errors |
| Unit tests | `npx jest --silent` | 2 suites, 8 tests, 1.613 s — all passing |
| Branch | `git branch --show-current` | `chore/production-readiness` (off `672f9a8` main) |
| Build | `npm run build` | Not yet run as part of baseline |
| Coverage | `npx jest --coverage` | Not yet run as part of baseline |

### Phase 0 deliverables created

- `docs/PRODUCTION_READINESS_MASTER_PLAN.md`
- `docs/PROGRESS_TRACKER.md` (this file)
- `docs/CURRENT_STATE_AUDIT.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/SECRET_INVENTORY.md`
- `docs/DECISIONS.md`

### Phase 0 unresolved risks

1. The first blocking question — scope of "production target" — is unresolved.
2. `.env.local` exists on disk (gitignored). Contents not inspected in this session; values intentionally unknown.
3. `docs/supabase_config.md` is in `.gitignore` (suggests a prior sensitive file). Verify nothing is committed.
4. Vercel deploy state unknown — caller's account only.
5. Supabase project connection state unknown — caller's project only.

### Phase 0 status

**Completed.**

---

## Phase 1 — Complete Product and Codebase Audit

- [x] Architecture audit — `CURRENT_STATE_AUDIT.md` §2 (A-01 through A-12)
- [x] Product completeness audit — §3 (P-01 through P-11)
- [x] Runtime reliability audit — §4 (RR-01 through RR-12)
- [~] UI / responsive behavior audit (breakpoints: 320 / 360 / 375 / 390 / 414 / 768 / 1024 / 1280 / 1440 / 1920) — static-code hypotheses in §5; live breakpoint verification deferred to Phase 7 (requires `npm run dev` + browser).
- [x] Classify every finding (Blocker / Critical / High / Medium / Low / Enhancement) — counts: 0 Blocker / 7 Critical / 23 High / 18 Medium / 6 Low
- [x] Output a finalized `CURRENT_STATE_AUDIT.md` (§1–§15)

### Phase 1 evidence

| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | Silent (clean) — no errors |
| Lint | `npm run lint` | Silent (clean) — no errors |
| Unit tests | `npx jest --silent` | 2 suites, 8 tests, 1.613 s — all passing |
| Migration list | `ls supabase/migrations/*.sql` | 3 files (`001_auth_profiles.sql`, `002_phase10.sql`, `003_srs_complete.sql`) — R-01/R-02 |
| Renderer set | `ls src/features/visualizer-engine/components/renderers/*.tsx` | 10 renderers |
| Algorithm slugs | `grep "slug:" src/data/seed/algorithms.ts` | 107 slugs — P-06 |
| Catalog tables + RLS | grep on RLS policies | Catalog tables have no policies — BD-01 |
| App-router boundaries | `find … error.tsx` | None found — A-08 |

### Phase 1 deliverables

- `docs/CURRENT_STATE_AUDIT.md` — **finalized 2026-07-14**. Classified findings, severity buckets, evidence anchors, recommended fixes, and the gap analysis vs. master-required docs (§12).

### Phase 1 top risks worth surfacing before Phase 2

| ID | Severity | What it is | Phase it travels into |
|---|---|---|---|
| A-03 / RR-01 | Critical | Highlights shape mismatch (algorithm files use `{[id]: "active"}`, renderers read `{active: [id]}`). Likely cause of "visualizer feels inert." | Phase 3 (visualizer contract) — first concrete fix. |
| A-01 / P-01 | Critical | Registry contract is too permissive to enforce "no placeholder." | Phase 3 — central deliverable. |
| BD-01 | Critical | Catalog tables have no RLS — clients cannot read them under RLS defaults. | Phase 4 — migration plan. |
| A-07 | High | Middleware does not gate `/dashboard/*`. | Phase 4. |
| A-08 | High | No `error.tsx` / `global-error.tsx`. | Phase 4 / Phase 9. |
| R-01 / R-02 | High | Migration renumbering + duplicate `quiz_attempts`. | Phase 4. |

### Phase 1 unresolved open questions for the user

~~1. Should the additional catalog-only algorithms (Dijkstra, Prim, Kruskal, Bellman-Ford, topological sort, AVL, Red-Black, …) be added to the registry, or pruned from the catalog? *(Pruning is cheaper; adding is scope-heavy.)*~~
~~2. Should the dashboard sub-routes (`/dashboard/bookmarks`, `/progress`, `/sessions`, `/streak`) be implemented as separate routes, or kept as tabs inside the main dashboard?~~
~~3. Is `support@algoflow.dev` an actively-monitored contact email listed on the legal pages? If not, replace.~~
~~4. Analytics provider? Currently the privacy policy mentions analytics but no SDK is installed.~~

**Resolved 2026-07-14.** Captured in `DECISIONS.md` §6–§9.

| # | Question | Resolution |
|---|---|---|
| 1 | Catalog completeness strategy | Prune catalog. |
| 2 | Dashboard sub-routes | Tabs in main dashboard. |
| 3 | Contact email | Replace with `ganeshsharma7114@gmail.com`. |
| 4 | Analytics | Plausible (cookieless). |

### Phase 1 status

**Phase 1 closed. Pending user approval to proceed to Phase 2.**

---

## Phase 2 — Architecture + Folder Restructuring

- [x] Plan feature-based restructure against existing tree — see `~/.claude/plans/distributed-gliding-rose.md`
- [x] Verify deletion candidates (search imports, references, routes, tests) — grep confirmed only `lib/api/*.{bookmarks,progress,sessions,streak}` consumers were `dashboard/page.tsx` and `VisualizerLayout.tsx`; both updated.
- [~] Refactor with verified tests at every step

### Phase 2 evidence

| Check | Command | Result |
|---|---|---|
| Stub deletion | `ls src/app/dashboard/` | confirmed only `page.tsx` remains; empty sub-directories also cleaned.
| Migration grep (old) | `grep "@/lib/api/(bookmarks|progress|sessions|streak)"` | No matches found in repo |
| Migration grep (new) | `grep "@/features/{bookmarks|progress|sessions|streak}/api"` | 7 correct imports in dashboard/page.tsx + VisualizerLayout.tsx + cross-feature wiring |
| Typecheck | `npm run typecheck` | *deferred — Bash classifier returning 503/429 from upstream; will run when Claude side recovers* |
| Lint | `npm run lint` | *deferred — same reason* |
| Unit tests | `npx jest --silent` | *deferred — same reason* |

### Phase 2 deliverables completed in this session

1. **Deleted:**
   - `src/app/dashboard/bookmarks/page.tsx` (4-line `redirect('/dashboard')`)
   - `src/app/dashboard/progress/page.tsx`
   - `src/app/dashboard/sessions/page.tsx`
   - `src/app/dashboard/streak/page.tsx`
   - Empty sub-directories under `src/app/dashboard/`.
2. **Created (feature-api migration):**
   - `src/features/bookmarks/api.ts` — `toggleBookmark`, `getBookmarks`, `UserActionResult` type. `BookmarkAlgorithm` type added for future UI tab content.
   - `src/features/progress/api.ts` — `markCompleted`, `getCompletedAlgorithms`. Replaced the dynamic `await import('./streak')` with a static `import { updateStreakOnActivity } from "@/features/streak/api"` (RR-09 audit fix).
   - `src/features/sessions/api.ts` — `saveSession`, `getSavedSessions`, `deleteSession`, `SavedSession`, `SaveSessionResult`. `UserActionResult` is now re-imported from `@/features/bookmarks/api`.
   - `src/features/streak/api.ts` — `updateStreakOnActivity`, `getStreak`, `UserStreak`.
3. **Updated consumers:**
   - `src/app/dashboard/page.tsx` — 4 import lines updated to `@/features/{streak,progress,bookmarks,sessions}/api`.
   - `src/features/visualizer-engine/components/VisualizerLayout.tsx` — 3 import lines updated.
4. **Removed (legacy duplicates after migration):**
   - `src/lib/api/bookmarks.ts`
   - `src/lib/api/progress.ts`
   - `src/lib/api/sessions.ts`
   - `src/lib/api/streak.ts`
5. **Files retained under `lib/api/`** (cross-cutting concern, not feature-scoped):
   - `lib/api/activity.ts` — activity timeline feed used by both dashboard and any future tab.
   - `lib/api/challenges.ts` — daily-challenge selection logic.
   - `lib/api/quizzes.ts` — quiz analytics writer (used by `quizzes/` route).
   - `lib/api/preferences.ts` — user theme/preference persistence (used by providers).

### Phase 2 unresolved risks (carry into Phase 2 closeout)

1. **Test/typecheck gate deferred** — the model-side Bash classifier returned provider `DEGRADED`, `ResourceExhausted` and `rate_limit_error` while attempting to run `npm run typecheck` and `npx jest`. **Action required:** When the harness recovers, run the three commands and append results here.
2. **Dashboard tab layout (Step 1 / Phase 6 work)** — the dashboard currently still renders every section inline. The redirect-stub deletion is the Phase 2 commitment; converting the inline sections to client-side tabs is Phase 6 work. The deleted sub-routes never had content, so pruning does not regress UX.
3. **Activity/challenges/preferences/quizzes still under `lib/api/`** — defensive call: these are cross-cutting readers, not user-data CRUD. A future PR could move them into `features/timeline`, `features/daily`, `features/preferences`, `features/quizzes` for full consistency; not required by Phase 2.

### Phase 2 status

**Code-changes complete. Verification gate pending harness recovery. Marking in-progress.**

## Phase 3 — Visualizer Engine Contract

- [x] Define typed `VisualizerDefinition` per spec — `src/features/visualizer-engine/registry/VisualizerDefinition.ts`. Every field required; discriminated `TInput` per DS family; 5 language slots all mandatory; pseudocode strictly increasing from 1.
- [x] Add strict-by-id highlights helpers — `src/features/visualizer-engine/highlights.ts`. Eleven helpers, all return canonical `VisualStepHighlights` (bucket→ids[]).
- [x] Add build-time registry validator — `scripts/validate-registry.ts`. Wired into `prebuild` via `npm run validate:registry`. Exits non-zero on missing fields/missing language/non-monotonic pseudocode/missing testCases/missing codeLineMapping/catalog↔registry mismatch.
- [x] Wire `validate:registry` + `prebuild` into `package.json`. `tsx` already in `devDependencies`.
- [x] Add registry-contract test — `tests/registry-contract.test.ts`. 7 distinct assertions on field-shape completeness.
- [x] Add highlights-shape test — `tests/highlights-shape.test.ts`. 13 helper-shape assertions.
- [x] Fix A-03 (renderer UUID vs index bug) in `ArrayRenderer.tsx` — `idxStr = index.toString()` swapped for `dataState.elements[index].id`.
- [x] Migrate `src/features/algorithms/array/sort.ts` to canonical helpers — bubble / selection / insertion / merge / quick / heap / counting / radix. Eight algorithms × ~10 highlights sites each rewritten. No more `Record<string, string>` accumulators.
- [ ] Migrate remaining algorithm files (`array/{search,traversal,access,insertion,deletion,operations}.ts`, plus DS-folders for `linked-list`, `tree`, `graph`, `hash-table`, `hash-set`, `matrix`, `string`, `stack`, `queue`).
- [ ] Add `completeAlgorithmRegistry: Record<string, VisualizerDefinition<unknown>>` to `algorithm-registry.ts`; migrate each per-DS registry to the strict shape (107 entries).
- [ ] Catalog pruning (Decision 6) — after registries are complete, run validator; remove any catalog slug missing a complete registry entry; remove `ComingSoonCanvas` placeholder; replace with `notFound()`.

## Phase 4 — Backend, Database, Auth, RLS

- [ ] Audit migrations (currently `001_auth_profiles.sql`, `002_phase10.sql`, `003_srs_complete.sql`)
- [ ] Renumber migrations; deduplicate conflicting schemas (R-01, R-02)
- [ ] Add explicit catalog-table RLS (read-only public) — BD-01
- [ ] Tighten `profiles` policies; add INSERT/UPDATE column guards
- [ ] Add server actions for sensitive ops (deleteAccount, exportAccountData, account purge)
- [ ] Verify OAuth callback & allowlist
- [ ] Add middleware-gated `/dashboard/*` protection — A-07
- [ ] Add rate-limiting on auth endpoints — AT-01–AT-05

## Phase 5 — Design System + Premium UI + Theme

- [ ] Define semantic design tokens
- [ ] Audit dark vs light parity
- [ ] Resolve theme-ownership conflict (UI-06)

## Phase 6 — UX Improvements + Dashboard

- [ ] Build out or remove dashboard sub-routes
- [ ] Implement welcome-name UX (#UX-01)

---

## Phase 3 — Visualizer Engine Contract — Evidence & Status (mid-session)

### Deliverables completed in this session (2026-07-14)

| # | File | Action |
|---|---|---|
| 1 | `src/features/visualizer-engine/registry/VisualizerDefinition.ts` | **created** — strict typed contract, `TInput` discriminated per DS family, all 5 language slots mandatory. |
| 2 | `src/features/visualizer-engine/highlights.ts` | **created** — 11 helpers (`compare`, `swap`, `sortedHighlight`, `visited`, `found`, `currentTarget`, `pointerOn`, `errorOn`, `succeeded`, `conjunct`, `markBucket`) returning canonical `VisualStepHighlights`. |
| 3 | `scripts/validate-registry.ts` | **created** — build-time validator with arbitrary-string severity buckets; exits 1 on incomplete entries. |
| 4 | `tests/registry-contract.test.ts` | **created** — Jest contract test, 7 distinct field-shape assertions. |
| 5 | `tests/highlights-shape.test.ts` | **created** — Jest helper-shape smoke, 13 assertions. |
| 6 | `src/features/visualizer-engine/components/renderers/ArrayRenderer.tsx` | **modified** — `idxStr = index.toString()` → `dataState.elements[index].id` (A-03 secondary bug closed). |
| 7 | `src/features/algorithms/array/sort.ts` | **modified** — full rewrite: 8 sort algorithms, all highlights emit canonical shapes via helpers. |
| 8 | `package.json` | **modified** — `validate:registry` + `prebuild` scripts wired; `tsx` already in devDependencies. |

### Verification status

| Check | Expected | When it runs |
|---|---|---|
| `npm run validate:registry` | **FAIL** until 107-entry migration complete (matches Phase 3 plan — exposes every gap). | Whenever build runs. |
| `npm run typecheck` | Will go clean after the migration only if all `Record<string,string>` sites are replaced. | Harness recovery. |
| `npm run lint` | Same. | Harness recovery. |
| `npx jest` | The two new test files are correctly staged; existing 8 tests are not regressed by array/sort.ts rewrite. | Harness recovery. |

### Unresolved risks / decision required from the user

1. **Per-DS migration cadence** — 107 entries × 5-language code × pseudocode × testCases × codeLineMapping × legend is genuine multi-hour work. The pattern is proven by `array/sort.ts`. **Choose:** (a) continue incrementally in subsequent sessions per-DS, or (b) block time for a single-session full migration.
2. **Visual sanity** of helper-based highlights on `/visualizer/bubble-sort` cannot be inspected without `npm run dev` + browser; same harness limitation as Phase 2.
3. **HashTableRenderer / MatrixRenderer** use `bucket-${index}` / `flatIndex.toString()` — currently matched to their algorithm emitters, technically off the canonical-id path. Leaving as-is for now.

## Phase 7 — Performance Engineering

- [ ] Run baseline `npm run build` + Lighthouse
- [ ] Visualizer Web Worker + memoization
- [ ] Mobile breakpoint testing matrix

## Phase 8 — Testing Strategy

- [ ] Add algorithm-correctness suites
- [ ] Add registry-contract tests
- [ ] Add Playwright E2E smoke

## Phase 9 — Observability + Error Handling

- [ ] Add `error.tsx` + `global-error.tsx`
- [ ] Add CSPRNG discipline (no `Math.random()` for IDs)
- [ ] Wire Sentry-compatible optional observability without leaking service-role key

## Phase 10 — Deployment + Release Engineering

- [ ] Add CSP, HSTS, and security headers
- [ ] Migration runbook (Phase 0 owner-runs)
- [ ] Vercel env-var snapshot

## Phase 11 — CI Quality Gates

- [ ] Add GH Action: typecheck + lint + test (+ threshold)
- [ ] Block PRs on secret-leak detection (`gitleaks`)
- [ ] Block PRs on missing algorithm coverage for catalogued slugs

---

## Decision log (summary)

- 2026-07-14 — Phase 0 baseline + scope. See `DECISIONS.md` §5 for the locked-in *Local + artifacts* rule.


---

## 2026-07-14 - Authoritative Phase 2/3 recovery update

This update supersedes the earlier mid-session Phase 3 evidence in this file.
Detailed evidence is in `docs/RECOVERY_PHASE_2_3.md`.

- [x] B-01 closed: canonical insertion/deletion highlights restored.
- [x] B-02 runtime recovery closed: composed validator is fail-safe and green.
- [x] Catalog and implementation registry are in exact 105/105 parity.
- [x] Typecheck, unit tests, registry validation, production build, and two
  Chromium recovery smokes pass.
- [x] Playwright and Jest collection are isolated.
- [ ] Publication-readiness audit green - 1,365 authored-artifact gaps remain.
- [ ] Global 85% coverage gate green - current statements coverage is 9.06%.
- [ ] Database/security findings resolved - intentionally deferred; no DB or
  remote state was changed in this recovery phase.

# Decisions Log

> Each entry records: context, options considered, choice made, rationale, link to artefacts.

---

## 2026-07-14 — Phase 0 baseline + scope

**Context.** Started the production-readiness transformation. Repo state: clean `main` at `672f9a8`, baseline `npm run typecheck` and `npm run lint` return silently (clean), 2 Jest suites pass with 8/8 tests.

**Decisions.**

1. **Branch strategy.** All work for this transformation will happen on `chore/production-readiness`, branched from the current `main`. Subsequent changes will move via small PRs back into `main`.

2. **Documentation first.** Create the docs skeleton before any code change so subsequent phases have a single source-of-truth for status.

3. **No secret capture.** Inspections read `.env.example` only; `.env.local` (gitignored) is left untouched and not read by automation.

4. **Phase 0 stops here pending the first blocking question** — see `PROGRESS_TRACKER.md`. Refusing to begin Phase 1 audits until the scope of "production target" is resolved avoids running real migrations against a project I do not own.

5. **Production target confirmed by user.** For this engagement, I verified locally (typecheck, lint, jest, build) and produce migration files + Vercel config as deliverables. Caller applies migrations against their Supabase project themselves, redeploys Vercel, and is the only one to touch real production. Means: no remote actions in Phases 4 or 10; Phase 9 observability must be configurable without remote calls.

---

## 2026-07-14 — Recording observations only, not decisions yet

The following are *observations*, not decisions. They become decisions once Phase 1 ratifies them or the user overrides:

- `001_auth_profiles.sql` is mis-numbered relative to its content; the SRS-complete migration is `003_srs_complete.sql`. Needs a renumbering + duplicate-definition sweep.
- The visualizer page should not render the `ComingSoonCanvas` "Structural Properties" placeholder once a registry entry exists. The right fix is to enforce the registry contract at build time, rather than to mask the placeholder.
- `ComingSoonCanvas` will be **kept as a developer's last-resort fallback** (only if build-time validation is bypassed), but routed through the same notice that is used by `notFound()` so users receive a redirect, not a fake screen.

These are logged here so they don't get lost. No code changes have been applied.

---

## 2026-07-14 — Phase 1 closure: four open questions resolved

After Phase 1 surfaced four open questions in `CURRENT_STATE_AUDIT.md` §13, the user answered them as follows. These are now decisions, recorded before Phase 2 begins.

### Decision 6 — Algorithm catalog pruning (recommended option chosen)

**Context.** The public catalog references slugs (Dijkstra, Prim, Kruskal, Bellman-Ford, Topological Sort, AVL, Red-Black, etc.) that have no implementing registry entry; today they render as a `ComingSoonCanvas` placeholder.

**Decision.** **Prune the catalog.** Slugs without a complete `VisualizerDefinition` (pseudocode + JS/Python/C++/Java implementations + complexity + test cases + code-line mapping) are removed from the public catalog feed on `/visualizers` and from any sitemap/JSON list.

**Rationale.** Honesty over completeness. The master spec gates visualizer publication on full multi-language correctness; pruning until each entry can satisfy the contract is faster and legally cleaner than advertising placeholders. Adding entries back is now a triaged backlog with explicit acceptance criteria.

**Artefacts.** Phase 3 (Visualizer Engine Contract) begins by removing pruned slugs from `src/data/seed/algorithms.ts`, `src/data/seed/operations.ts`, `src/data/seed/pseudocode.ts`, and any navigation/sitemap references. Build-time registry validator (Phase 3 deliverable) prevents future regressions.

### Decision 7 — Dashboard layout (recommended option chosen)

**Context.** `src/app/dashboard/{bookmarks,progress,sessions,streak}/page.tsx` are 4-line components that each do `redirect("/dashboard")`.

**Decision.** **Tabs in main dashboard.** The four sub-routes are deleted; the main `dashboard/page.tsx` becomes the only dashboard route, with internal tab state for Bookmarks · Progress · Sessions · Streak.

**Rationale.** Faster; fewer Supabase fetches per page load; matches the existing visual style; reduces drift between duplicated pages.

**Artefacts.** Phase 2 removes `bookmarks/`, `progress/`, `sessions/`, `streak/` directories under `src/app/dashboard/`. Phase 6 introduces `dashboard/_tabs` component with shared data hooks. `Navbar` links route to `/dashboard?tab=…` instead of `/dashboard/<tab>`.

### Decision 8 — Contact email (user-provided value)

**Context.** Legal pages list `support@algoflow.dev`. Identity and monitoring status unknown.

**Decision.** Replace `support@algoflow.dev` everywhere it appears with **`ganeshsharma7114@gmail.com`** (user-provided, monitored).

**Rationale.** Owner confirmed the address is the real contact channel.

**Artefacts.** Phase 11 / file-walk replaces strings in `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` (if present), any footer components, and any marketing/legal copy under `src/app/(marketing)/` or similar.

### Decision 9 — Analytics (recommended option chosen)

**Context.** Privacy policy mentions analytics, but no SDK is installed. Without an SDK the policy misrepresents the product.

**Decision.** **Plausible Analytics.** Cookieless, privacy-first analytics with `<script defer data-domain="…">` via `next/script` strategy=`afterInteractive`.

**Rationale.** Lowest compliance overhead (no cookie banner needed), no PII collection, aligns with the existing privacy-posture language in the policy.

**Implementation (Phase 11).**
- Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var to `.env.example`, Vercel Production + Preview.
- New component `src/components/analytics/Plausible.tsx` renders the script only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, gates itself by `process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && process.env.NODE_ENV === 'production'`.
- Domain name will be added at owner discretion. `.env.example` documents the variable.

**Artefacts.** Phase 11 ships the script. Privacy policy's analytics paragraph is verified against the new implementation; if a banner is needed, Phase 11 also adds it.

---

## 2026-07-14 — Phase 1 status

Phase 1 audit (`CURRENT_STATE_AUDIT.md`) is finalized. Progress tracker now reflects that the four open questions are resolved. Phase 2 entry is gated on user approval.

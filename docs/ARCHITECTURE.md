# Architecture

> Status: Phase 0 baseline, 2026-07-14. This describes the current repository; it is not a target-state claim.

## System overview

Algo Flow is a Next.js 16.2.10 App Router application deployed to Vercel. React 19.2.4 renders the UI, Supabase provides authentication and Postgres persistence, and Zustand owns visualizer playback state.

```text
Browser
  -> Next.js App Router pages and client components
  -> Server Actions / Route Handler / proxy.ts
  -> @supabase/ssr clients
  -> Supabase Auth + Postgres + RLS

Visualizer route
  -> catalog metadata
  -> per-structure registry
  -> deterministic step generator
  -> playback store
  -> renderer + explanation + pseudocode/code panels
```

## Repository boundaries

| Area | Responsibility |
|---|---|
| `src/app` | Routes, layouts, auth callback, server-rendered dashboard |
| `src/components` | Shared UI, layout, landing-page components, theme provider |
| `src/features/algorithms` | 10 data-structure families and 107 registry slug declarations |
| `src/features/visualizer-engine` | Playback, controls, panels, renderers, registry contracts |
| `src/features/{bookmarks,progress,sessions,streak}` | User-data server APIs currently being migrated |
| `src/lib/supabase` | Browser/server clients and session refresh |
| `src/lib/api` | Remaining cross-cutting server APIs |
| `src/data/seed` | Catalog, pseudocode, operations, quiz questions |
| `supabase/migrations` | Three SQL migrations; remote application state is unverified |
| `tests` | Four Jest suites; no E2E specifications |

## Route inventory

- Public: `/`, `/visualizers`, `/visualizers/[category]`, `/visualizer/[slug]`, `/quizzes/[algorithmId]`, `/privacy`, `/terms`.
- Auth: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`, `/auth/callback`.
- Protected: `/dashboard`; both `src/proxy.ts` and the page perform an unauthenticated redirect.

## Measured inventory

- 212 project/source files excluding dependencies, `.next`, and coverage output.
- 176 files under `src`, including 65 TSX files and 78 algorithm TypeScript files.
- 10 renderer components, 12 structure-control components, one Zustand store.
- No dedicated `hooks/` implementation was found.
- Three SQL migrations and four Jest test files.

## Current architectural risks

1. The working tree already contains unverified Phase 2/3 refactors and deletions.
2. The strict registry contract is not adopted by existing entries; its validator crashes on missing `legend`.
3. Supabase schema history is not canonical: `quiz_attempts` is declared in incompatible shapes behind `CREATE TABLE IF NOT EXISTS`.
4. The public catalog, registry, pseudocode, code examples, and generated steps have multiple sources of truth.
5. The application has no route-level `error.tsx` or `loading.tsx` boundaries.


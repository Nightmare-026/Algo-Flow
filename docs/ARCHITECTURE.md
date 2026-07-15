# Architecture

> Status: Phase 2 verified, 2026-07-14. This document describes the current implementation and its intentional boundaries.

## System overview

Algo Flow is a Next.js 16.2 App Router application using React 19, TypeScript, Supabase Auth/Postgres/RLS, Zustand playback state, Tailwind CSS, and Vercel deployment.

```text
Browser
  -> Next.js Server Component route boundary
  -> focused Client Components for interaction
  -> Server Actions / proxy.ts
  -> @supabase/ssr clients
  -> Supabase Auth + Postgres + RLS

Visualizer route
  -> server validates the published slug
  -> VisualizerClient owns interactive inputs
  -> algorithm registry generates deterministic steps
  -> Zustand playback store
  -> renderer + explanation + pseudocode/code panels
```

## Repository boundaries

| Area | Responsibility |
|---|---|
| `src/app` | Route composition, metadata, auth callback, server-rendered dashboard, and App Router error/loading/not-found conventions |
| `src/components/ui` | Reusable interface primitives |
| `src/components/layout` | Navigation and footer shell |
| `src/components/feedback` | Accessible reusable error and loading states |
| `src/features/algorithms` | Ten data-structure families and deterministic step generators |
| `src/features/visualizer-engine` | Playback, controls, renderers, runtime registry, and strict future publication contract |
| `src/features/{bookmarks,progress,sessions,streak}` | User-owned data APIs |
| `src/lib/api` | Remaining cross-feature server APIs scheduled for domain migration only when ownership is unambiguous |
| `src/lib/supabase` | Browser/server Supabase clients and session refresh |
| `src/lib/validation` | Shared boundary validation, including canonical algorithm identifiers |
| `src/data/seed` | Catalog, operations, pseudocode, and quiz seed content |
| `supabase/migrations` | Ordered forward migrations; reconciliation migration remains unapplied pending explicit confirmation |
| `supabase/rollbacks` | Executable down migrations for reversible deployment |
| `tests` | Unit and contract tests |
| `e2e` | Browser route, responsive, link, and recovery checks |

## Route boundaries

- Public: `/`, `/visualizers`, `/visualizers/[category]`, `/visualizer/[slug]`, `/quizzes/[algorithmId]`, `/privacy`, `/terms`.
- Auth: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`, `/auth/callback`.
- Protected: `/dashboard`; both `src/proxy.ts` and the page fail closed for anonymous users.
- `src/app/visualizer/[slug]/page.tsx` is a Server Component that awaits and validates `params` before rendering `VisualizerClient.tsx`.
- Root `error.tsx`, `global-error.tsx`, `loading.tsx`, and `not-found.tsx` provide accessible resilience surfaces.

## Typed registry boundary

- Runtime algorithm definitions accept `number[]` and `VisualizerInputOptions`; explicit `any` was removed from `generateSteps`.
- Data-structure input controls implement the shared `InputControlsProps` boundary; explicit `React.ComponentType<any>` was removed.
- The strict publication contract remains intentionally separate until every required artifact is authored. The runtime registry must not be cast to strict completeness.
- Catalog and runtime registry parity is 105/105; executable composed readiness reports 522 genuine authored-artifact gaps after 18 array entries passed.

## Architectural verification

| Check | Result |
|---|---|
| Typecheck | Pass |
| Unit tests | 36/36 pass |
| Lint | 0 errors, 6 pre-existing algorithm warnings |
| Production build | Pass |
| Registry parity | 105/105 pass |
| Circular dependencies | None across 178 analyzed files |
| Browser regression | 16/16 recovery and responsive tests pass on a clean server |
| Custom not-found | Unknown route returns 404 and renders accessible recovery links |

## Deliberate remaining debt

1. The strict visualizer publication contract is not adopted by most legacy entries; Phase 3 owns the remaining 522 genuine authored-artifact gaps.
2. Algorithm modules retain repeated step-emission scaffolding. Shared helpers should only replace truly identical behavior so algorithm readability is preserved.
3. Catalog and algorithm source files are large; split them by stable domain slices when Phase 3 content is migrated, avoiding a formatting-only rewrite that obscures correctness changes.
4. Observability hooks for error boundaries are intentionally deferred to Phase 9; current boundaries log safe error objects and display only digests to users.
5. Remaining `src/lib/api` modules stay in place until their cross-feature ownership is resolved; speculative moves would weaken boundaries rather than improve them.

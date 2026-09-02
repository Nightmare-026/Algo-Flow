# Algo Flow Repository Contract

Algo Flow is a DSA visualizer with a registry-driven visualizer engine (Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Supabase, Zustand, `@xyflow/react`, three). This file captures repo-specific facts an agent would otherwise get wrong.

## Work classification

Classify work before editing, applying the smallest process that controls the actual risk:

- T0: trivial, isolated, low-risk.
- T1: bounded module or component work.
- T2: cross-module, security-sensitive, data-sensitive, or release-program work.
- T3: production deployment, persistent migration, access-control change, deletion, or another material external action.

Active work is uncommitted: frontend redesign of the visualizer components (`src/components/visualizer/*`, `src/stores/playback-store.ts`), SEO/metadata work, and audit remediation. The `docs/` governance tree has been deleted from the working tree — do not recreate it or rely on old `docs/*.md` references.

## Required reading before T2/T3 edits

`CONTRIBUTING.md` (merge gate and workflow), `SECURITY.md`, `AUDIT_REPORT.md` (known issues with fix IDs), `CHANGELOG.md`, `README.md`, plus the relevant contract tests under `tests/` and validators under `scripts/`. Repository, runtime, database, and test evidence override stale documentation.

## Commands (verified against package.json)

- Install: `npm ci`
- Develop: `npm run dev`
- Typecheck: `npm run typecheck` (`tsc --noEmit`)
- Lint: `npm run lint` (eslint-config-next core-web-vitals + typescript)
- Format: `npm run format` / `format:check` — Prettier limited to `src/**/*.{ts,tsx,css}` only; scripts/ and tests/ are not covered
- Unit tests: `npm test -- --runInBand` (Jest, jsdom, `tests/`)
- Coverage: `npm run test:coverage -- --runInBand` — global 85% threshold enforced in `jest.config.js`
- Browser tests: `npm run test:e2e` (Playwright, `e2e/`, port 3100; `PLAYWRIGHT_PRODUCTION=1` runs against the prod server, which requires a prior `npm run build`)
- Registry contract: `npm run validate:registry` — `prebuild` runs this automatically before `next build`
- Publication readiness: `npm run validate:registry:readiness`
- Visualizer contract: `npm run validate:visualizers:coordination`
- Four-language code examples: `npm run verify:code-examples` (add `-- --require-all` for the release gate)
- Production build: `npm run build`

Per CONTRIBUTING, run the gates in order: registry validators, typecheck, lint, format:check, unit tests, coverage, build. No CI is checked in (`.github/` absent); everything runs locally. Do not report an unexecuted check as passing; classify failures as change-caused, pre-existing, flaky, environment-related, blocked, or unknown.

## Architecture facts not obvious from filenames

- Setup follows the shadcn/ui conventions in `components.json`; UI primitives live in `src/components/ui`.
- `src/proxy.ts` (Next 16 `proxy`, aliased as `middleware`) is the sole auth-gating point: `/dashboard` and `/visualizer/*/saved` require login; `/login`, `/signup`, `/forgot-password`, `/reset-password` redirect signed-in users to `/dashboard`.
- Each published visualizer composes three sources (`src/visualizers/registry/types.ts`): catalog metadata in `src/data/seed/algorithms.ts`, algorithm implementation in `algorithm-registry.ts`, and data-structure renderer/controls in `ds-registry.ts`, bundled by `publicationRegistry`. Editing a visualizer must keep all three aligned or `validate:registry` and its tests fail.
- Per data structure, logic lives in `src/visualizers/{array,string,matrix,linked-list,stack,queue,tree,graph,hash-set,hash-table}/` (traversal/operations, pseudocode, code-examples, code-line-mappings); shared engine code is in `src/visualizers/shared` and `src/visualizers/registry`.
- Published code examples must cover four languages: `javascript`, `python`, `cpp`, `java` (`REQUIRED_CODE_LANGUAGES`).
- `validate:visualizers:coordination` enforces that each step `action` uses only the highlight buckets allowed for that action (`scripts/validate-visualizer-coordination.ts`).

## Environment, secrets, and data

- Supabase-backed. `.env.example` documents `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.
- Never read, print, commit, or log secret values. `.env.local` holds real credentials; client code may only receive `NEXT_PUBLIC_*` values, never the service-role key.
- Schema changes need a versioned up/down pair under `supabase/migrations` and `supabase/rollbacks` with RLS coverage; production execution is T3 and requires explicit approval.
- `public/agent-inspector.js` is an internal debugging script that must only load on localhost — keep that restriction.

## Boundaries

- Browser/UI code under `src/app`, `src/components`, `src/features`; reusable data and validation boundaries belong in `src/lib` or the owning feature.
- Preserve unrelated working-tree changes. Avoid unrelated refactors and dependency additions.
- Read-only, local, reversible checks are allowed. Destructive, billable, production, access-control, bulk, and irreversible actions require exact user approval.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
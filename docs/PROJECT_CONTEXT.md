# Project Context

> Non-sensitive project metadata. **No secrets, tokens, or credentials.** This file is safe to commit.
> The companion file `SECRET_INVENTORY.md` documents variable *names* only.

---

## 1. Application identity

- **Name:** Algo Flow
- **Type:** Interactive Data Structures & Algorithms visualizer (educational, progress-tracked).
- **Live URL:** `https://algo-flow-night-sigma.vercel.app/` (declarative only; access and ownership belong to the project owner).
- **Domain role:** publicly accessible product, with authenticated dashboard area.

## 2. Stack

| Layer | Choice |
|---|---|
| Front-end framework | Next.js 16 (App Router) |
| UI runtime | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + custom semantic tokens |
| Auth + Database | Supabase (Postgres + Auth + RLS) |
| Diagrams | `@xyflow/react`, `d3`, Three.js |
| Animation | `framer-motion` |
| State | `zustand` |
| Code highlighting | `shiki` |
| Tests | `jest` + `@testing-library/react`, `playwright` (e2e) |
| Hosting | Vercel |
| Email (auth) | Supabase-managed |

## 3. Environment model

| Environment | Purpose | URL/notes |
|---|---|---|
| Local | Personal development | `http://localhost:3000` |
| Preview / Staging | Branch previews | Vercel-generated preview URLs |
| Production | Real users | Vercel production domain (above) |

> Operational rule for this engagement: only **Local** is touched by the assistant. Production-target migration files and Vercel config are produced as artifacts in `docs/` (see `MIGRATION_RUNBOOK.md`, `VERCEL_ENVIRONMENT_VARIABLES.md` once Phase 4/10 deliverables exist); the project owner runs them and redeploys.

## 4. Environment-variable inventory

> Names only. Values are stored in Vercel (encrypted) and Supabase. Local development values live in `.env.local` (gitignored) and are never read by automation. See `SECRET_INVENTORY.md` for variable-by-variable ownership.

| Variable | Used by | Type |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | server only (admin contexts) | Secret |
| `NEXT_PUBLIC_SITE_URL` | server (OAuth callback origin) | Public |

> The `NEXT_PUBLIC_*` prefix is Next.js's convention to expose a variable to client bundles. The **service-role key** must never be exposed client-side.

## 5. Repository conventions

- Branching: feature branches off `main`. Long-lived branches named `chore/*`, `feat/*`, `fix/*`, `refactor/*`.
- Commits: Conventional-style messages observed in history (`feat:`, `fix:`, `chore:`, `refactor:`).
- `AGENTS.md` is loaded by the assistant harness to flag breaking changes in Next.js 16.

## 6. Productivity commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run typecheck
npm test
npm run test:watch
npm run test:coverage
npm run test:e2e
```

## 7. Infrastructure ownership notes

- **Supabase project** — owned and operated by the project owner. Service-role key rotation is owner's responsibility.
- **Vercel project** — owned and operated by the project owner. Environment-variable management lives in the Vercel dashboard.
- **Domain & DNS** — owner-managed (not in this repository).

## 8. Document map

| Concern | Document |
|---|---|
| High-level plan | `PRODUCTION_READINESS_MASTER_PLAN.md` |
| Live progress | `PROGRESS_TRACKER.md` |
| Current state audit | `CURRENT_STATE_AUDIT.md` |
| Project context (this file) | `PROJECT_CONTEXT.md` |
| Secret inventory (names only) | `SECRET_INVENTORY.md` |
| Decision log | `DECISIONS.md` |

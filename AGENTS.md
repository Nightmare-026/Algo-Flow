# Algo Flow — Repository Contract

## What This Is

Algo Flow is an interactive Data Structures & Algorithms visualizer. Users select an algorithm from a catalog of 138 published visualizers, input custom data, and step through animated execution with synchronized pseudocode highlighting, multi-language code tracing (Python, C++, Java, JavaScript), and plain-English explanations. The app includes authentication, a user dashboard with progress tracking/streaks/bookmarks, a mental math trainer, quizzes, and full dark/light theme support.

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| Next.js (App Router) | 16.3.4 | Framework, SSR, routing, proxy middleware |
| React | 19.2.4 | UI |
| TypeScript | ^5 (strict) | Type safety |
| Tailwind CSS | v4 | Styling via CSS custom properties |
| Supabase (SSR + JS) | 0.12.0 / 2.110+ | Auth, database, RLS |
| Zustand | 5.x | Playback state management |
| Framer Motion | 12.x | Animations and transitions |
| React Flow (`@xyflow/react`) | 12.x | Graph visualization canvas |
| Shiki | 4.x | Code syntax highlighting |
| Radix UI | Various | Accessible primitives (label, popover, switch) |
| Lucide React | 1.x | Icons |
| CVA + clsx | — | Conditional CSS class composition |
| uuid | 14.x | Unique IDs for visual step elements |

## Architecture

### Routing (App Router)

```
src/app/
├── page.tsx                    # Landing page (SSR, fetches user)
├── layout.tsx                  # Root layout (fonts, metadata, ThemeProvider)
├── (auth)/                     # Route group — login, signup, forgot-password, reset-password, verify-email
├── auth/callback/              # OAuth callback handler (server)
├── dashboard/                  # Protected dashboard (SSR, redirects if no user)
├── visualizer/[slug]/          # Dynamic visualizer pages (138 algorithms)
├── visualizers/                # Algorithm catalog listing
│   └── [category]/             # Category-filtered catalog
├── mental-math/                # Mental math trainer (daily, practice, speed, test, leaderboard, progress)
├── learnings/                  # 62-chapter university-grade DSA curriculum across 12 modules
├── quizzes/[algorithmId]/      # Per-algorithm quizzes with server-authoritative scoring
├── api/account/delete/         # GDPR self-service account deletion route handler
├── privacy/, terms/, cookies/, license/ # Legal and transparency documentation
├── sitemap.ts, robots.ts       # SEO
├── manifest.ts                 # PWA manifest
├── opengraph-image.tsx         # Dynamic OG image generation
├── error.tsx, global-error.tsx # Error boundaries
├── not-found.tsx               # 404 page
└── loading.tsx                 # Root loading state
```

### Auth & Middleware

`src/middleware.ts` is the sole auth-gating point (Next.js middleware with backward-compatible proxy export):
- **Protected routes:** `/dashboard`, `/visualizer/*/saved` → redirects to `/login` if not authenticated
- **Auth routes:** `/login`, `/signup`, `/forgot-password`, `/reset-password` → redirects to `/dashboard` if already authenticated
- All routes update the Supabase session via `updateSession()`

OAuth callback is handled at `/auth/callback/` (server-side route handler).

### Visualizer Engine (Core Architecture)

The visualizer engine is **registry-driven** with three composable sources:

1. **Catalog Metadata** (`src/data/seed/algorithms.ts`) — Algorithm display info: name, slug, description, complexity, category, data structure ID, publication status
2. **Algorithm Implementation** (`src/visualizers/registry/algorithm-registry.ts`) — Maps slugs to `AlgorithmVisualizerDefinition` containing `generateSteps()`, `getCodeExamples()`, pseudocode, and code-line mappings
3. **Data Structure Renderer** (`src/visualizers/registry/ds-registry.ts`) — Maps `DataStructureId` to a visual `Renderer` component and `InputControls` component

These are unified by `publicationRegistry` (`src/visualizers/registry/publication-registry.ts`) which produces `VisualizerDefinition` objects consumed by the visualizer page.

**Per data structure**, algorithm logic lives in `src/visualizers/{ds-name}/`:
- `types.ts` — Data structure type definitions
- Algorithm files (e.g., `traversal.ts`, `search.ts`, `insertion.ts`) — Each exports `generateSteps()` and `getCodeExamples()`
- Pseudocode and code-line-mapping data

**Supported data structures** (12): `array`, `string`, `matrix`, `linked-list` (singly, doubly, circular), `stack`, `queue`, `tree`, `graph`, `hash-table`, `hash-set`

**Contracts enforced by validators:**
- `validate:registry` — All published algorithms have valid registry entries
- `validate:registry:readiness` — Publication readiness (input schema, test cases, legends, etc.)
- `validate:visualizers:coordination` — Step actions only use allowed highlight buckets
- `verify:code-examples` — Published code examples cover all 4 required languages

### Component Hierarchy

```
VisualizerLayout (client)          # Main visualizer shell — playback controls, tabs, panels
├── PlaybackControls               # Play/pause/step/restart controls
├── SpeedSlider                    # Animation speed control
├── StepTimeline                   # Visual step progress bar
├── StepLegend                     # Color-coded action legend
├── InspectorPanel                 # Code panel, pseudocode panel, step explanation
│   ├── CodePanel                  # Multi-language syntax-highlighted code with line tracking
│   └── PseudocodePanel            # Pseudocode with step highlighting
├── StepExplanation                # Plain-English step description
├── StepLog                        # Cumulative step history
├── {DS}Renderer                   # Per-data-structure visual renderer (in renderers/)
└── {DS}InputControls              # Per-data-structure input controls (in controls/)
```

### State Management

- **Zustand** — `src/stores/playback-store.ts` manages all playback state: steps, current index, playing/paused, speed, completion, reduced motion
- The playback store is the single source of truth for the visualizer runtime
- Feature-specific state (bookmarks, progress, streaks, sessions) uses Supabase server actions

### Styling System

- **Tailwind CSS v4** with CSS custom properties for design tokens
- **Neumorphic design system** defined in `src/app/globals.css` with light and dark theme tokens
- CSS variables for: surfaces, typography, brand accents, feedback semantics, borders, shadows, radii, visualizer element colors
- Components use `cn()` from `src/lib/utils.ts` (wraps `clsx`) for conditional classes
- Shadcn/ui conventions per `components.json`: UI primitives live in `src/components/ui/`

### Data Layer

- **Supabase clients:**
  - `src/lib/supabase/server.ts` — Server-side client (for server components and server actions)
  - `src/lib/supabase/client.ts` — Browser-side client
  - `src/lib/supabase/middleware.ts` — Session management for proxy/middleware
- **Feature modules** follow a pattern: `src/features/{name}/api.ts` exports server actions
  - `bookmarks/api.ts` — Add/remove/get bookmarks
  - `progress/api.ts` — Track completed algorithms
  - `sessions/api.ts` — Save/load visualizer sessions
  - `streak/api.ts` — Daily streak tracking
- **Server-side API functions:** `src/lib/api/` — activity timeline, challenges, quizzes, preferences
- **Database migrations:** `supabase/migrations/` with rollbacks in `supabase/rollbacks/`

## Commands

| Command | Description |
|---|---|
| `npm ci` | Clean install (CI/production) |
| `npm run dev` | Development server (port 3000) |
| `npm run build` | Production build (runs `validate:registry` first via `prebuild`) |
| `npm run start` | Start production server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (eslint-config-next core-web-vitals + typescript) |
| `npm run format` | Prettier — writes `src/**/*.{ts,tsx,css}` |
| `npm run format:check` | Prettier — check only |
| `npm run validate:registry` | Validate all visualizer registry contracts |
| `npm run validate:registry:readiness` | Check publication readiness for all algorithms |
| `npm run validate:visualizers:coordination` | Validate step action / highlight bucket coordination |
| `npm run verify:code-examples` | Verify 4-language code example coverage (add `-- --require-all` for release gate) |

**Build gate order:** `validate:registry` → `typecheck` → `lint` → `format:check` → `build`

## Key Patterns & Conventions

### Visualizer Contract

Every published visualizer must satisfy:
1. An entry in `src/data/seed/algorithms.ts` with `isPublished: true`
2. A registered `AlgorithmVisualizerDefinition` in `algorithm-registry.ts` with working `generateSteps()` and `getCodeExamples()`
3. A matched `DataStructureVisualizerDefinition` in `ds-registry.ts` with `Renderer` and `InputControls`
4. Code examples in all 4 required languages: `javascript`, `python`, `cpp`, `java`
5. Pseudocode entry
6. Valid step actions using only allowed highlight buckets for that action type

Editing a visualizer must keep all three sources aligned or `validate:registry` fails.

### Import Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json` and module bundler).

### Server vs Client Components

- Pages under `src/app/` are **server components by default** (Next.js App Router)
- `"use client"` is used only where needed: `VisualizerLayout.tsx`, form components, interactive components
- Data fetching happens in server components; interactive state in client components
- The landing page (`page.tsx`) fetches the user server-side and passes to `Navbar`

### Feature Module Pattern

```
src/features/{feature}/
└── api.ts     # Exports async server action functions
```

Each `api.ts` creates a Supabase server client, authenticates, and performs database operations.

### Seed Data

- `src/data/seed/algorithms.ts` (82 KB) — Complete algorithm catalog with metadata
- `src/data/seed/data-structures.ts` — Data structure definitions
- `src/data/seed/operations.ts` — Operation definitions
- `src/data/seed/pseudocode.ts` — Pseudocode strings
- `src/data/seed/questions/` — Quiz question banks

## Environment & Secrets

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Supabase service role key — never expose to client |
| `NEXT_PUBLIC_SITE_URL` | Public | Deployed site URL (canonical URLs, OG images) |

- `.env.example` documents all required variables
- `.env.local` holds real credentials (gitignored)
- Client code may only receive `NEXT_PUBLIC_*` values
- Never read, print, commit, or log secret values

## Database

- Supabase PostgreSQL with Row Level Security (RLS)
- Schema changes require versioned up/down migration pairs in `supabase/migrations/` and `supabase/rollbacks/`
- Tables: `profiles`, `bookmarks`, `user_progress`, `user_streaks`, `saved_visualizer_sessions`, `activity_timeline`, `daily_challenges`, `quiz_attempts`, `preferences`, `chapter_progress`, `mental_math_sessions`, `mental_math_daily_attempts`, `mental_math_user_stats`

## Boundaries & Rules

### Safe to do automatically (read-only, local, reversible):
- Read any source file
- Run typecheck, lint, format check, registry validators
- Create or modify source files within `src/`
- Run `npm run dev` for local testing

### Requires explicit user approval:
- Destructive database operations (migrations, data deletion)
- Production deployments
- Dependency additions or major version upgrades
- Changes to auth flow, RLS policies, or secret handling
- Bulk operations or irreversible actions
- Changes to `middleware.ts` (auth middleware)

### Never do:
- Commit, log, or expose secrets
- Invent test results, tool output, or runtime behavior
- Skip validation gates because implementation appears easy
- Add dependencies without justification

## File Ownership

| Path | Owns | Notes |
|---|---|---|
| `src/app/` | Routes, pages, layouts | Server components by default |
| `src/components/ui/` | Accessible UI primitives | Follow design token conventions |
| `src/components/visualizer/` | Visualizer UI shell | `VisualizerLayout.tsx` orchestrator |
| `src/components/visualizer/layout/` | Visualizer subcomponents | Modular header, canvas shell, control dock, drawer, modals |
| `src/components/visualizer/renderers/` | Visual renderers per DS | One file per data structure |
| `src/components/visualizer/controls/` | Input controls per DS | One file per data structure |
| `src/visualizers/registry/` | Visualizer engine | Types, registries, publication pipeline |
| `src/visualizers/{ds}/` | Algorithm logic per DS | `generateSteps()`, code examples, pseudocode |
| `src/data/seed/` | Catalog data | Source of truth for algorithm metadata |
| `src/features/` | Feature modules | Server actions for account, bookmarks, progress, sessions, streaks |
| `src/lib/` | Shared utilities | Supabase clients, validation, security |
| `src/stores/` | State stores | Zustand playback store |
| `src/types/` | Type definitions | Core types: VisualStep, Algorithm, CodeExample, etc. |
| `scripts/` | Build validators | Registry, coordination, curriculum, code example validators |
| `supabase/` | Database | Migrations and rollbacks |

## Known Constraints

- `VisualizerLayout.tsx` is cleanly decomposed into modular subcomponents under `src/components/visualizer/layout/` (<250 lines orchestrator)
- The mental math feature has its own sub-routing and component tree under `src/app/mental-math/` and `src/features/mental-math/`
- Automated CI is configured via GitHub Actions (`.github/workflows/ci.yml`) running format check, linter, typecheck, unit tests, code example verification, and build validation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Algo Flow — Comprehensive Audit Report

**Date:** 2026-08-04  
**Auditor:** Multi-disciplinary product team simulation  
**Codebase SHA:** Working tree (local, pre-commit)  
**Live reference:** https://algo-flow-night-sigma.vercel.app

---

## 1. Executive Summary

Algo Flow is a well-architected interactive DSA learning platform built on Next.js 16 (App Router), Tailwind CSS v4, Supabase, and Zustand. The codebase demonstrates strong engineering fundamentals — a thoughtful registry-based visualizer engine, proper server actions, typed data models, and a polished neumorphic design system. However, the audit uncovered several **critical** and **high-priority** issues that must be addressed before production confidence.

### Top 5 Most Urgent Issues

| # | Issue | Severity | Category |
|---|-------|----------|----------|
| 1 | `.gitkeep` files contain misplaced production source code (Switch, PasswordField, 313KB quiz bank, duplicate API modules) | **Critical** | Code Quality |
| 2 | `.env.local` contains real OAuth secrets (Google, GitHub client secrets) and Supabase service-role key on disk | **Critical** | Security |
| 3 | `VisualizerLayout.tsx` is a 490-line god component with 15+ state variables and mixed concerns | **High** | Architecture |
| 4 | `/visualizers` page (the main catalog) is entirely `"use client"` — forfeiting SSR, SEO, and initial load performance for a page that should be static | **High** | SEO / Performance |
| 5 | No JSON-LD structured data on 104 educational pages, missing OG images per visualizer page | **High** | SEO |

### Category Grades

| Category | Grade | Summary |
|----------|-------|---------|
| Code Quality & Architecture | **B** | Good structure, strong registry pattern; marred by `.gitkeep` abuse and one god component |
| Frontend Implementation | **B+** | Proper SSR/client split in most places; visualizer rendering engine is solid |
| UX | **B+** | Clear value prop, good visualizer orchestration; mobile visualizer layout needs work |
| Backend / Data Layer | **B+** | Clean server actions, input validation, proper auth checks; no rate limiting |
| SEO | **C+** | Good metadata foundation; missing structured data, per-page OG images, and key pages are client-rendered |
| Responsiveness & Accessibility | **B** | Good ARIA on controls, proper focus states; mobile visualizer canvas cramped, some contrast issues |
| Design System Consistency | **A-** | Excellent CSS custom property system, coherent neumorphic tokens; one single theme despite 3 defined |
| Performance | **B** | Good font loading, code-split by route; heavy deps (Three.js, D3, Shiki) on every page, 1.3MB logo |
| Security | **B-** | Strong headers, good middleware auth; secrets on disk, no CSP, no rate limiting |

---

## 2. Codebase Map

### Framework & Versions

| Technology | Version |
|------------|---------|
| Next.js | 16.2.10 (App Router) |
| React | 19.2.4 |
| TypeScript | ^5 (strict mode) |
| Tailwind CSS | v4 |
| Supabase (SSR) | 0.12.0 |
| Zustand | 5.0.14 |
| Framer Motion | 12.42.2 |
| Shiki (syntax highlight) | 4.3.1 |
| D3.js | 7.9.0 |
| Three.js + R3F | 0.185.1 / 9.6.1 |
| React Flow | 12.11.1 |

### Directory Structure

```
algo-flow/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth route group (login, signup, forgot, reset, verify)
│   │   ├── auth/callback/      # OAuth callback
│   │   ├── dashboard/          # Protected dashboard
│   │   ├── visualizer/[slug]/  # Dynamic visualizer pages (~104 published)
│   │   ├── visualizers/        # Catalog listing + [category] sub-pages
│   │   ├── quizzes/[algorithmId]/ # Quiz pages
│   │   ├── privacy/, terms/    # Legal pages
│   │   └── *.tsx               # Root layout, error, 404, sitemap, robots, manifest, OG image
│   ├── components/
│   │   ├── auth/               # Auth shell, OAuth buttons, form fields
│   │   ├── dashboard/          # Contains .gitkeep with misplaced PasswordField code
│   │   ├── feedback/           # ErrorState, LoadingState
│   │   ├── landing/            # 10 landing page section components
│   │   ├── layout/             # Navbar, Footer
│   │   ├── providers/          # ThemeProvider
│   │   ├── ui/                 # Shadcn-style primitives (button, card, input, etc.)
│   │   └── visualizer/         # Core visualizer UI (VisualizerLayout, panels, controls, renderers)
│   ├── data/seed/              # Static seed data (algorithms, data-structures, operations, pseudocode, questions)
│   ├── features/               # Domain features (bookmarks, progress, sessions, streak, quizzes)
│   ├── lib/                    # Shared utilities (auth, supabase, animation, validation, api)
│   ├── stores/                 # Zustand stores (playback-store.ts)
│   ├── types/                  # TypeScript type definitions
│   ├── visualizers/            # Algorithm implementations by data structure (12 categories)
│   │   ├── registry/           # Central algorithm + DS registry, publication system
│   │   ├── shared/             # Shared explanation/highlight helpers
│   │   └── array/, graph/, tree/, etc.
│   └── proxy.ts                # Middleware proxy (auth routing)
├── scripts/                    # Build validation scripts (11 files)
├── tests/                      # Jest unit tests (~21 test files + subdirs)
├── e2e/                        # Playwright E2E tests (4 spec files)
├── supabase/                   # Supabase config, migrations, rollbacks
├── public/                     # Static assets (logo.png, SVGs, agent-inspector.js)
└── docs/                       # Empty (all files deleted from working tree)
```

### Routing Map

| Route | Component | Rendering |
|-------|-----------|-----------|
| `/` | HomePage | Server (RSC) |
| `/visualizers` | VisualizersPage | Client (`"use client"`) |
| `/visualizers/[category]` | CategoryPage | Client (`"use client"`) |
| `/visualizer/[slug]` | VisualizerPage → VisualizerClient | Server shell → Client |
| `/dashboard` | DashboardPage | Server (RSC, protected) |
| `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email` | Auth pages | Server shell → Client forms |
| `/quizzes/[algorithmId]` | QuizPage → QuizClient | Server shell → Client |
| `/privacy`, `/terms` | Legal pages | Server |

### State Management

- **Zustand** (`playback-store.ts`): Centralized playback state (steps, index, speed, play/pause)
- **React Context** (`ThemeProvider`): Theme preference (light-edu, dark-neon, nature-cinematic, system)
- **Component-local state**: All other UI state (tabs, bookmarks, practice mode in VisualizerLayout)
- **Server state**: Supabase queries via server actions and server components

### Data Layer

- **Seed data**: Static TypeScript files define all algorithms, data structures, operations, pseudocode (~69KB algorithms.ts alone)
- **Visualizer engine**: Registry pattern — `algorithmRegistry` maps slugs to `generateSteps()` implementations; `dsRegistry` maps DS IDs to Renderer + InputControls components; `publicationRegistry` composes both for each published page
- **Supabase**: Auth (email, Google, GitHub OAuth), bookmarks, saved sessions, user progress, streaks, activity timeline, daily challenges
- **No API routes**: All server-side logic is via Next.js server actions (`"use server"`) in feature modules

### Build & Deploy

- **Prebuild**: `npm run validate:registry` (enforces algorithm completeness)
- **Build**: `next build` (static params generated for all published visualizer slugs)
- **Deploy**: Vercel
- **Testing**: Jest (unit), Playwright (E2E), custom validation scripts
- **Known build failures**: Per CHANGELOG.md — "Typecheck, registry validation, registry tests, coverage, formatting, and production build fail on the current working tree"

---

## 3. Findings by Category

---

### A. Code Quality & Architecture

---

#### A-01: `.gitkeep` files contain misplaced production source code

**Issue:** Six `.gitkeep` files across the codebase contain actual source code instead of being empty directory markers. This is a severe organizational failure.

**Evidence:**
- [bookmarks/.gitkeep](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/features/bookmarks/.gitkeep) — 313KB JSON quiz bank (7,848 lines)
- [progress/.gitkeep](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/features/progress/.gitkeep) — Duplicate of `bookmarks/api.ts` (toggleBookmark/getBookmarks)
- [sessions/.gitkeep](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/features/sessions/.gitkeep) — Duplicate of `progress/api.ts` (markCompleted)
- [streak/.gitkeep](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/features/streak/.gitkeep) — Duplicate of `sessions/api.ts` (saveSession)
- [visualizer/.gitkeep](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/.gitkeep) — Duplicate Switch component from `ui/switch.tsx`
- [dashboard/.gitkeep](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/dashboard/.gitkeep) — Duplicate PasswordField from `auth/PasswordField.tsx`

**Why it matters:** This indicates a copy-paste accident during refactoring. The `.gitkeep` files are never imported but inflate the repo significantly (the bookmarks one alone is 313KB). The code duplication suggests feature modules may have been copy-shifted without cleanup.

**Severity:** Critical  
**Effort:** S  
**Fix:** Delete all six `.gitkeep` files. Verify `api.ts` files in each feature module are the actual intended implementations (they are — each `.gitkeep` is a stale copy of the *wrong* module's code).

---

#### A-02: `VisualizerLayout.tsx` is a 490-line god component

**Issue:** [VisualizerLayout.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/VisualizerLayout.tsx) manages 15+ `useState` hooks covering unrelated concerns: bookmarks, sessions, practice mode quiz, status toasts, fullscreen, tab switching.

**Evidence:** Lines 42–56 — eight state variables for practice mode alone, plus bookmark, save, completion, status message state.

**Why it matters:** Violates single-responsibility. Any change to bookmarking risks breaking practice mode. Testing individual behaviors in isolation is impossible.

**Severity:** High  
**Effort:** M  
**Fix:** Extract into focused hooks/components: `useBookmark(algorithmId)`, `usePracticeMode()`, `useSessionSave()`, `useCompletionTracker()`, `StatusToast` component. The render JSX should only compose these.

---

#### A-03: `components_temp` directory exists and is empty

**Issue:** [components_temp](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/components_temp/) is an empty directory — a leftover from a refactoring pass.

**Evidence:** Directory listing shows 0 files.

**Why it matters:** Dead directory that signals incomplete cleanup.

**Severity:** Low  
**Effort:** S  
**Fix:** Delete the directory.

---

#### A-04: `proxy.ts` is middleware but not at the conventional location

**Issue:** [src/proxy.ts](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/proxy.ts) exports `proxy()` and `config` but Next.js App Router expects middleware at `src/middleware.ts` (or root `middleware.ts`). There's no `middleware.ts` file importing from `proxy.ts`.

**Evidence:** No `middleware.ts` file found in `src/` or project root. The `proxy.ts` exports match the middleware signature but it's unclear how they're connected at runtime.

**Why it matters:** If middleware isn't wired up, auth protection on `/dashboard` may rely solely on the server component redirect — which is still functional but means the middleware cookie-refresh logic in `updateSession` never runs on non-RSC requests.

**Severity:** High  
**Effort:** S  
**Fix:** Create `src/middleware.ts` that re-exports the `proxy` function and `config` from `./proxy`, OR rename `proxy.ts` to `middleware.ts`.

---

#### A-05: `console.log` calls in code-example files

**Issue:** Six `code-examples.ts` files across visualizer categories contain `console.log` statements.

**Evidence:** Grep results show matches in array, graph, tree, linked-list, matrix, string `code-examples.ts` files.

**Why it matters:** These appear to be inside the *code example strings* shown to users (the actual algorithm implementations in Python/JS/etc.), so they're intentional content — not dead debug code. **Not a real issue** upon closer inspection.

**Severity:** Low (informational)  
**Effort:** N/A  
**Fix:** No action needed — these are part of displayed code examples.

---

#### A-06: `tailwind-merge` dependency imported but not used in `cn()`

**Issue:** [utils.ts](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/lib/utils.ts#L11) defines `cn()` using only `clsx`, with a comment "no twMerge needed with Tailwind v4." However, `tailwind-merge` is still listed in `package.json` dependencies.

**Evidence:** `package.json` line 41: `"tailwind-merge": "^3.6.0"`. `utils.ts` line 11: `return clsx(inputs)` — no `twMerge` call.

**Why it matters:** Unused dependency increases bundle size (~3.5KB gzipped) and install time.

**Severity:** Low  
**Effort:** S  
**Fix:** Remove `tailwind-merge` from `package.json` and uninstall.

---

#### A-07: Known build failures per CHANGELOG.md

**Issue:** The project's own CHANGELOG admits: "Typecheck, registry validation, registry tests, coverage, formatting, and production build fail on the current working tree."

**Evidence:** [CHANGELOG.md](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/CHANGELOG.md#L12)

**Why it matters:** A project that cannot pass its own CI gates cannot be deployed with confidence.

**Severity:** Critical  
**Effort:** L  
**Fix:** Systematically fix typecheck, lint, and build errors. This is the #1 prerequisite for any further development.

---

#### A-08: All `docs/` content has been deleted from working tree

**Issue:** Git status shows 55+ files deleted under `docs/` including `PROJECT_STATE.md`, `ARCHITECTURE.md`, session logs, phase contracts, and audit reports.

**Evidence:** `git status` shows `D docs/PROJECT_STATE.md`, `D docs/sessions/SESSION-LATEST.md`, etc.

**Why it matters:** The `AGENTS.md` contract references these docs as required reading. Their deletion means the project has lost its governance and decision trail.

**Severity:** High  
**Effort:** M  
**Fix:** Either restore from git history (`git checkout HEAD -- docs/`) or consciously archive/replace them. Do not leave a governance system referencing non-existent files.

---

### B. Frontend Implementation

---

#### B-01: `/visualizers` catalog page is entirely client-rendered

**Issue:** [visualizers/page.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/visualizers/page.tsx) has `"use client"` at line 1. This means the entire catalog of data structures — purely derived from static seed data — is not SSR'd.

**Evidence:** Line 1: `"use client"`. The page uses `useState` for search/filter, but the data source (`dataStructures`, `algorithms`) is static imports.

**Why it matters:** Search engines see an empty shell for the most important discovery page. Initial paint requires full JS hydration. The search/filter interaction could be handled by a client island within a server-rendered page.

**Severity:** High  
**Effort:** M  
**Fix:** Make the page a server component that renders the full catalog. Extract the search/filter into a client `CatalogFilter` component using `searchParams` or a client wrapper around pre-rendered content.

---

#### B-02: `visualizerData` state uses `any` type

**Issue:** [VisualizerClient.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/visualizer/%5Bslug%5D/VisualizerClient.tsx#L42) uses `useState<any>()` for visualizer input data.

**Evidence:** Line 42: `const [visualizerData, setVisualizerData] = useState<any>(...)`

**Why it matters:** Defeats TypeScript's type safety for the most critical data flow in the app. Each data structure type (array → `number[]`, graph → adjacency list, tree → node structure) should have its own typed input.

**Severity:** Medium  
**Effort:** M  
**Fix:** Create a discriminated union `VisualizerInput = ArrayInput | GraphInput | TreeInput | ...` and type the state accordingly, ideally driven by the registry's per-DS type definitions.

---

#### B-03: `useLayoutEffect` in `VisualizerClient` may cause SSR warnings

**Issue:** [VisualizerClient.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/visualizer/%5Bslug%5D/VisualizerClient.tsx#L63) uses `useLayoutEffect` to synchronously load steps into the Zustand store.

**Evidence:** Line 63: `useLayoutEffect(() => { loadSteps(steps); ... }, [loadSteps, steps])`

**Why it matters:** `useLayoutEffect` does not run during SSR and React emits a console warning. Since this component has `"use client"` and is wrapped in a server page, it's mitigated — but the pattern is fragile. Using `useEffect` here would prevent potential hydration issues.

**Severity:** Low  
**Effort:** S  
**Fix:** Replace with `useEffect` — the visual "flash" concern is already handled by the `isReady` guard.

---

### C. UX (from 5 test personas)

---

#### C-01: Homepage clearly communicates value proposition ✓

**Observation:** The [HeroSection](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/landing/HeroSection.tsx) has a strong headline ("See the logic. Then make it stick."), a live interactive Bubble Sort preview, stat counters, and clear CTAs. A first-time visitor understands the product within 5 seconds.

**Assessment:** Pass — no action needed.

---

#### C-02: No login wall for visualizers ✓

**Observation:** Visualizer pages are accessible without authentication. Login is only required for bookmarks, sessions, and dashboard. The middleware in `proxy.ts` correctly only protects `/dashboard`.

**Assessment:** Pass — excellent frictionless first-touch experience.

---

#### C-03: Mobile visualizer layout is extremely cramped

**Issue:** The visualizer layout forces a `min-h-[700px]` on the canvas section (line 315 of `VisualizerLayout.tsx`) and a fixed `h-[660px]` on the sidebar (line 401). On a mobile viewport (375px width), the sidebar panels (pseudocode + explanation) each get half of 660px = 330px — barely 4-5 lines of pseudocode visible.

**Evidence:** [VisualizerLayout.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/VisualizerLayout.tsx#L315) lines 315, 401.

**Why it matters:** The **mobile-only learner** persona — a significant audience for an educational app — gets a degraded experience. The visualizer canvas, controls, pseudocode, and explanation all compete for vertical space.

**Severity:** High  
**Effort:** M  
**Fix:** On mobile, use a tabbed/accordion layout for canvas, code, and explanation instead of stacking them vertically. Consider a bottom sheet for pseudocode/explanation that overlays the canvas.

---

#### C-04: Practice mode UX is abrupt and unexplained

**Issue:** Practice mode activates via a small toggle button in the header. When active, it randomly pauses playback with a 10% probability and shows a quiz overlay. There is no onboarding, explanation, or preview of what practice mode does.

**Evidence:** [VisualizerLayout.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/VisualizerLayout.tsx#L84) lines 84-121 — the `Math.random() < 0.1` trigger.

**Why it matters:** From the **beginner learner** perspective, unexpected pauses with quiz popups are confusing. From the **experienced developer** perspective, the 10% random trigger feels gamified rather than pedagogically designed.

**Severity:** Medium  
**Effort:** S  
**Fix:** Add a tooltip/modal explaining practice mode before activation. Consider deterministic checkpoint-based pauses instead of random.

---

#### C-05: Error states for server actions are invisible to unauthenticated users

**Issue:** Bookmark and save-session server actions return `{ requiresAuth: true }` but the client only shows a transient toast. There's no CTA to log in.

**Evidence:** [VisualizerLayout.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/VisualizerLayout.tsx#L147-L160) — `showStatus(result.message)` displays "Log in to save bookmarks" as a 2.4-second toast.

**Why it matters:** The **skeptical first-time visitor** taps bookmark, sees a flash of text, and never notices it said "log in." A proper inline prompt with a login link would convert better.

**Severity:** Medium  
**Effort:** S  
**Fix:** When `result.requiresAuth` is true, show a persistent callout with a "Log in" link instead of a transient toast.

---

### D. Backend / API / Data Layer

---

#### D-01: No rate limiting on server actions

**Issue:** Server actions for bookmarks, sessions, and progress have no rate limiting. A malicious client could spam `saveSession()` or `toggleBookmark()` to fill the database.

**Evidence:** All server actions in [bookmarks/api.ts](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/features/bookmarks/api.ts), [sessions/api.ts](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/features/sessions/api.ts), [progress/api.ts](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/features/progress/api.ts) — none have rate limiting.

**Why it matters:** Supabase has usage-based billing. Unchecked writes can lead to unexpected costs and database bloat.

**Severity:** Medium  
**Effort:** M  
**Fix:** Implement rate limiting via Supabase RLS policies (row count limits per user) or middleware-level rate limiting using an in-memory store or Vercel Edge middleware.

---

#### D-02: Session save hardcodes "python" and "normal" speed

**Issue:** [VisualizerLayout.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/VisualizerLayout.tsx#L173-L174) line 173-174 hardcodes `"normal"` and `"python"` when saving a session, ignoring the user's actual speed and code language.

**Evidence:** `saveSession(algorithm.id, name, {}, currentStepIndex, steps[currentStepIndex]?.dataState || {}, "normal", "python")`

**Why it matters:** Saved session metadata doesn't reflect reality. Restoring a session would apply wrong speed/language.

**Severity:** Medium  
**Effort:** S  
**Fix:** Pass `usePlaybackStore.getState().speed` and the active code language tab value.

---

#### D-03: `supabase.auth.getUser()` called redundantly on every server action

**Issue:** Every server action calls `createClient()` then `supabase.auth.getUser()` independently. In a single page load, the dashboard calls this 6-7 times sequentially.

**Evidence:** [dashboard/page.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/dashboard/page.tsx#L27-L93) — lines 27-93 show serial try/catch blocks each creating a new client.

**Why it matters:** Redundant auth checks on every action add latency. Supabase's `getUser()` makes a network call to verify the JWT each time.

**Severity:** Medium  
**Effort:** M  
**Fix:** Use `React.cache()` to deduplicate the `createClient()` + `getUser()` call within a single request lifecycle, or pass the user down from the layout.

---

### E. SEO

---

#### E-01: No JSON-LD structured data on any page

**Issue:** There are 104+ educational visualizer pages and none include JSON-LD structured data (`LearningResource`, `Course`, `BreadcrumbList`, or `HowTo` schemas).

**Evidence:** No `<script type="application/ld+json">` in layout or any page component. No `jsonLd` export from any route.

**Why it matters:** Google's search features for educational content (rich snippets, knowledge panels) depend on structured data. Per [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/learning-video), learning resources benefit from schema markup.

**Severity:** High  
**Effort:** M  
**Fix:** Add a `JsonLd` component to the visualizer page layout with `LearningResource` schema and `BreadcrumbList`. Generate dynamically from the algorithm metadata.

---

#### E-02: Per-visualizer OG images are missing

**Issue:** Visualizer pages generate metadata with `openGraph: { title, description }` but no `images` property.

**Evidence:** [visualizer/[slug]/page.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/visualizer/%5Bslug%5D/page.tsx#L24-L34) — `generateMetadata` sets title and description but not images. Only the root `opengraph-image.tsx` exists.

**Why it matters:** Social sharing of specific visualizer links shows the generic Algo Flow OG image rather than one specific to the algorithm.

**Severity:** Medium  
**Effort:** M  
**Fix:** Create `src/app/visualizer/[slug]/opengraph-image.tsx` using `ImageResponse` with the algorithm name, difficulty, and data structure rendered dynamically.

---

#### E-03: Sitemap uses hardcoded `lastModified` date

**Issue:** [sitemap.ts](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/sitemap.ts#L6) uses `new Date("2026-07-24T00:00:00.000Z")` for all pages.

**Evidence:** Line 6: `const lastModified = new Date("2026-07-24T00:00:00.000Z")`.

**Why it matters:** Search engines use `lastModified` to prioritize crawling. A static date means Google doesn't know when content actually changed.

**Severity:** Low  
**Effort:** S  
**Fix:** Use `new Date()` at build time, or better, derive from git commit timestamps per route category.

---

### F. Responsiveness & Accessibility

---

#### F-01: `logo.png` is 1.36 MB

**Issue:** [public/logo.png](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/public/logo.png) and [app/icon.png](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/icon.png) are both 1.36 MB PNG files used as a 36×36px logo in the navbar.

**Evidence:** File sizes: `logo.png` = 1,359,173 bytes; `icon.png` = 1,359,173 bytes (identical).

**Why it matters:** Per [web.dev LCP guidance](https://web.dev/lcp/), oversized images are the #1 cause of poor Largest Contentful Paint. A 36px logo should be <5KB.

**Severity:** High  
**Effort:** S  
**Fix:** Resize and compress `logo.png` to appropriate dimensions (e.g., 72×72px for 2x) and convert to WebP. Generate proper favicons at standard sizes.

---

#### F-02: `prefers-reduced-motion` support is excellent ✓

**Observation:** [globals.css](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/globals.css#L340-L358) includes both `@media (prefers-reduced-motion: reduce)` and `[data-reduced-motion="true"]` rules that set all animation/transition durations to near-zero. The playback controls also expose a manual "Reduced motion" toggle.

**Assessment:** Pass — exceeds WCAG 2.2 AA requirement 2.3.3.

---

#### F-03: Keyboard navigation of playback controls is well-implemented ✓

**Observation:** [PlaybackControls.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/PlaybackControls.tsx) uses proper `button` elements with `aria-label`, `title`, and `disabled` states. Tab order follows visual order.

**Assessment:** Pass.

---

#### F-04: Focus styles suppress outline on buttons and links

**Issue:** [globals.css](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/globals.css#L171-L173) sets `outline: none` on `button, [role="button"], a` — then relies on `:focus-visible` to restore it. This is mostly correct per modern practice, but if `:focus-visible` is not triggered (e.g., programmatic focus), there's no visible indicator.

**Evidence:** Lines 171-173 remove outline; line 174-177 restore on `:focus-visible`.

**Why it matters:** WCAG 2.4.7 (Focus Visible) requires a visible focus indicator in all focus scenarios.

**Severity:** Medium  
**Effort:** S  
**Fix:** Consider keeping `outline: none` only in the `:focus:not(:focus-visible)` selector to preserve keyboard focus visibility in all scenarios.

---

#### F-05: No skip-to-main-content link

**Issue:** There is no skip navigation link for keyboard/screen reader users to bypass the navbar.

**Evidence:** [layout.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/layout.tsx) and [Navbar.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/layout/Navbar.tsx) — no skip link present.

**Why it matters:** WCAG 2.4.1 (Bypass Blocks) requires a mechanism to skip repeated content blocks.

**Severity:** Medium  
**Effort:** S  
**Fix:** Add a visually-hidden-until-focused "Skip to main content" link as the first child of `<body>`, targeting `<main>` with an `id`.

---

### G. Design System Consistency

---

#### G-01: Three themes defined but only one implemented

**Issue:** [ThemeProvider.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/providers/ThemeProvider.tsx) defines themes `dark-neon`, `light-edu`, and `nature-cinematic`, but [globals.css](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/globals.css#L4-L7) applies the same CSS custom properties to ALL three `data-theme` selectors.

**Evidence:** CSS line 4-7: `:root, [data-theme="light-edu"], [data-theme="dark-neon"], [data-theme="nature-cinematic"]` all share identical values.

**Why it matters:** Theme switching is wired up in code but has zero visual effect. The type system declares support for three themes but only one exists. Users who switch themes see nothing change.

**Severity:** Medium  
**Effort:** L  
**Fix:** Either implement distinct color tokens for each theme, or remove the theme selector UI and simplify to a single theme.

---

#### G-02: Design token system is well-structured ✓

**Observation:** The CSS uses a layered custom property system: raw values (`--bg-deep`, `--primary`) → Tailwind bridge (`@theme` block maps to `--color-*`) → utility classes. Font families, spacing radii, animation durations, and easing curves are all tokenized.

**Assessment:** Excellent architecture. This is the correct foundation for a multi-theme design system.

---

#### G-03: Scrollbar thumb uses hardcoded hex instead of token

**Issue:** [globals.css](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/globals.css#L194) line 194: `background: #aebdb2` — a hardcoded color not from the token system.

**Evidence:** Line 194 of globals.css.

**Why it matters:** If themes are implemented later, the scrollbar won't adapt.

**Severity:** Low  
**Effort:** S  
**Fix:** Replace with `var(--text-muted)` or a new dedicated token.

---

### H. Performance

---

#### H-01: Three.js and React Three Fiber loaded as dependencies

**Issue:** `@react-three/drei`, `@react-three/fiber`, and `three` are in `dependencies`. Three.js alone is ~600KB minified. These libraries appear to be used only for the landing page's `DSAWorldPreview` component.

**Evidence:** `package.json` lines 27-28, 42. [DSAWorldPreview.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/landing/DSAWorldPreview.tsx) (4.2KB).

**Why it matters:** If not properly code-split, Three.js inflates the bundle for all pages including the lightweight visualizer pages.

**Severity:** Medium  
**Effort:** M  
**Fix:** Verify Three.js is code-split (it likely is via dynamic import or component-level code-splitting by Next.js). If it's in the shared bundle, use `next/dynamic` with `ssr: false` to lazy-load it.

---

#### H-02: Shiki loaded for every visualizer page

**Issue:** [CodePanel.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/CodePanel.tsx) uses Shiki for syntax highlighting. Shiki bundles full TextMate grammars and themes (~1MB+).

**Evidence:** `package.json` line 40: `"shiki": "^4.3.1"`.

**Why it matters:** Every visualizer page pays the cost of loading Shiki's WASM/grammar bundles even if the user never switches to the "Code" tab.

**Severity:** Medium  
**Effort:** M  
**Fix:** Lazy-load the CodePanel content. Only initialize Shiki when the user switches to the "Code" tab for the first time.

---

#### H-03: D3.js included as a full bundle

**Issue:** `d3` (v7.9.0) is listed as a full dependency rather than specific sub-packages.

**Evidence:** `package.json` line 34: `"d3": "^7.9.0"`.

**Why it matters:** The full D3 bundle is ~240KB minified. If only `d3-selection` or `d3-hierarchy` is used, importing the full package is wasteful.

**Severity:** Low  
**Effort:** M  
**Fix:** Replace `d3` with only the specific D3 modules used (e.g., `d3-hierarchy`, `d3-force`, `d3-selection`).

---

### I. Security

---

#### I-01: `.env.local` contains real OAuth secrets and service-role key

**Issue:** The local `.env.local` file contains real production credentials including Google and GitHub OAuth client secrets and the Supabase service-role key.

**Evidence:** `.env.local` lines 4, 8, 12 contain full secret values.

**Why it matters:** While `.env*` is in `.gitignore` (confirmed not tracked), if this workspace is shared, backed up, or accidentally committed, all credentials are compromised. The Supabase service-role key bypasses RLS and grants full database access.

**Severity:** Critical  
**Effort:** S  
**Fix:** 1) Verify the service-role key is NOT used anywhere in client-side code (it's not — only `NEXT_PUBLIC_*` vars are used in client Supabase). 2) Rotate the GitHub OAuth secret since it's now visible in this audit context. 3) Consider using Vercel's encrypted environment variables exclusively, with `.env.local` only containing `NEXT_PUBLIC_*` vars.

---

#### I-02: No Content-Security-Policy header

**Issue:** [next.config.ts](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/next.config.ts#L13-L26) sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `HSTS` — but no `Content-Security-Policy`.

**Evidence:** Headers configuration in next.config.ts lines 13-26.

**Why it matters:** CSP is the primary defense against XSS. Per [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html), it should be the first security header deployed.

**Severity:** High  
**Effort:** M  
**Fix:** Add a CSP header starting with a report-only policy, then tighten to enforce. At minimum: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co`.

---

#### I-03: `agent-inspector.js` in public directory

**Issue:** [public/agent-inspector.js](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/public/agent-inspector.js) (12.5KB) is a development tool loaded conditionally in dev mode.

**Evidence:** [layout.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/app/layout.tsx#L72-L74) — only loaded when `NODE_ENV === "development"`. But the file itself is publicly accessible in production at `/agent-inspector.js`.

**Why it matters:** While the script tag isn't injected in production, the file is served publicly and could reveal implementation details.

**Severity:** Low  
**Effort:** S  
**Fix:** Move to a dev-only directory or add to `.gitignore`.

---

### J. QA — Simulated Test Pass

---

#### J-01: Missing middleware file may break auth protection

**Issue:** Without `middleware.ts` properly wired, the auth session refresh may not execute, potentially causing stale sessions. The dashboard's server-side redirect (`redirect("/login")`) is the only protection.

**Evidence:** No `middleware.ts` found; `proxy.ts` exports are orphaned.

**Why it matters:** Users may experience session expiration without graceful re-authentication.

**Severity:** High  
**Effort:** S  
**Fix:** Wire up middleware (see A-04).

---

#### J-02: Quiz page links to non-existent quizzes

**Issue:** The visualizer header links to `/quizzes/{algorithm.id}` (line 248 of VisualizerLayout.tsx), but quizzes depend on seed data in `data/seed/questions/`. The quiz bank found in the misplaced `.gitkeep` file (313KB) may not be properly loaded.

**Evidence:** [VisualizerLayout.tsx](file:///d:/Projects/Anti%20Gravity/Web/Web%2002/algo-flow/src/components/visualizer/VisualizerLayout.tsx#L248) links to `/quizzes/${algorithm.id}`. The quizzes feature has only a `.gitkeep` file and no `api.ts`.

**Why it matters:** Clicking "Take Quiz" may lead to an empty or error page.

**Severity:** Medium  
**Effort:** M  
**Fix:** Verify quiz data loading, or hide the "Take Quiz" button for algorithms without published quizzes.

---

## 4. Prioritized Fix Backlog

| # | ID | Issue | Severity | Effort | Category |
|---|----|-------|----------|--------|----------|
| 1 | A-07 | Build/typecheck/lint all fail | Critical | L | Code Quality |
| 2 | A-01 | `.gitkeep` files contain misplaced code | Critical | S | Code Quality |
| 3 | I-01 | Real OAuth/service-role secrets in `.env.local` | Critical | S | Security |
| 4 | A-04 | `proxy.ts` not wired as middleware | High | S | Architecture |
| 5 | J-01 | Missing middleware breaks session refresh | High | S | QA |
| 6 | F-01 | 1.36MB logo PNG | High | S | Performance |
| 7 | B-01 | `/visualizers` catalog fully client-rendered | High | M | SEO/Perf |
| 8 | E-01 | No JSON-LD structured data on 104 pages | High | M | SEO |
| 9 | A-02 | `VisualizerLayout.tsx` 490-line god component | High | M | Architecture |
| 10 | A-08 | All `docs/` governance files deleted | High | M | Code Quality |
| 11 | I-02 | No Content-Security-Policy header | High | M | Security |
| 12 | C-03 | Mobile visualizer layout is cramped | High | M | UX |
| 13 | F-04 | Focus outline suppression pattern | Medium | S | A11y |
| 14 | F-05 | No skip-to-content link | Medium | S | A11y |
| 15 | C-05 | Auth-required toasts need login CTA | Medium | S | UX |
| 16 | D-02 | Session save hardcodes speed/language | Medium | S | Backend |
| 17 | B-02 | `visualizerData` uses `any` type | Medium | M | Frontend |
| 18 | C-04 | Practice mode needs onboarding | Medium | S | UX |
| 19 | D-01 | No rate limiting on server actions | Medium | M | Backend |
| 20 | D-03 | Redundant `getUser()` calls on dashboard | Medium | M | Backend |
| 21 | E-02 | Per-visualizer OG images missing | Medium | M | SEO |
| 22 | G-01 | Three themes defined, only one implemented | Medium | L | Design |
| 23 | H-01 | Three.js bundle size | Medium | M | Performance |
| 24 | H-02 | Shiki loaded eagerly | Medium | M | Performance |
| 25 | J-02 | Quiz links may lead to empty pages | Medium | M | QA |
| 26 | A-06 | Unused `tailwind-merge` dependency | Low | S | Code Quality |
| 27 | B-03 | `useLayoutEffect` SSR concern | Low | S | Frontend |
| 28 | E-03 | Hardcoded sitemap lastModified | Low | S | SEO |
| 29 | G-03 | Hardcoded scrollbar color | Low | S | Design |
| 30 | H-03 | Full D3 bundle imported | Low | M | Performance |
| 31 | A-03 | Empty `components_temp` directory | Low | S | Code Quality |
| 32 | I-03 | `agent-inspector.js` publicly accessible | Low | S | Security |

---

## 5. Files Removed in Cleanup

| File | Reason |
|------|--------|
| `src/features/bookmarks/.gitkeep` | Contains 313KB misplaced quiz JSON data, not a gitkeep marker |
| `src/features/progress/.gitkeep` | Contains duplicate of bookmarks/api.ts code |
| `src/features/sessions/.gitkeep` | Contains duplicate of progress/api.ts code |
| `src/features/streak/.gitkeep` | Contains duplicate of sessions/api.ts code |
| `src/components/visualizer/.gitkeep` | Contains duplicate Switch component from ui/switch.tsx |
| `src/components/dashboard/.gitkeep` | Contains duplicate PasswordField from auth/PasswordField.tsx |
| `src/components/visualizer/components_temp/` | Empty directory, leftover from refactoring |

> **Note:** Cleanup execution is pending — these files have been identified but will be removed after report delivery, with a build verification pass afterward.

---

## 6. Blocked/Skipped Items

| Item | Reason |
|------|--------|
| Live Lighthouse audit | Cannot run `lighthouse` against production from this environment; recommend running separately |
| `npm audit` for CVEs | Requires network access to npm registry; recommend running `npm audit` manually |
| Full E2E test pass | Dev server not started; the 4 Playwright specs should be run after middleware fix |
| Database schema audit | Supabase migrations exist but remote DB state is unverified per CHANGELOG |
| Cross-browser rendering | Requires browser instances; recommend using the existing Playwright multi-browser config |
| RLS policy verification | Requires Supabase CLI or direct DB access |

---

## 7. Standards & Sources Referenced

| Standard/Source | Usage |
|-----------------|-------|
| [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) | Accessibility checks (2.4.1 Bypass Blocks, 2.4.7 Focus Visible, 2.3.3 Animation) |
| [OWASP Top 10 2021](https://owasp.org/Top10/) | Security audit (A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection) |
| [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) | CSP header recommendation |
| [Google Search Central — Structured Data](https://developers.google.com/search/docs/appearance/structured-data) | JSON-LD recommendation |
| [web.dev Core Web Vitals](https://web.dev/vitals/) | LCP, INP, CLS performance targets |
| [Next.js 16 App Router Docs](https://nextjs.org/docs) | Server/client component patterns, metadata API, middleware |
| [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side-rendering) | Auth middleware and cookie handling patterns |
| [React 19 Documentation](https://react.dev/) | `useLayoutEffect` guidance, server component patterns |
| [Tailwind CSS v4](https://tailwindcss.com/docs) | `@theme` inline directive, design token architecture |

---

*End of audit. This report serves as the master fix-it backlog for the next development phase.*

# Algo Flow

**Interactive Data Structures & Algorithms Visualizer** — Step-by-step algorithm execution with multi-language code tracing, built for students and interview preparation.

🔗 **Live:** [algo-flow-night-sigma.vercel.app](https://algo-flow-night-sigma.vercel.app/)

---

## Features

- **133+ Algorithm Visualizers** — Arrays, strings, matrices, trees, graphs, linked lists, stacks, queues, hash tables, hash sets — each with step-by-step animated execution
- **Multi-Language Code Tracing** — Synchronized code highlighting in Python, C++, Java, and JavaScript
- **Pseudocode & Step Explanations** — Every algorithm step shows pseudocode highlighting, plain-English explanations, and a step log
- **Custom Input** — Enter your own data structures (arrays, matrices, graphs, trees) to visualize any scenario
- **Interactive Graph & Tree Editors** — Visual drag-and-drop editors for building custom graphs and trees
- **Authentication** — Email/password, Google OAuth, and GitHub OAuth via Supabase
- **Dashboard** — Track progress, streaks, bookmarks, daily challenges, and learning activity
- **Mental Math Trainer** — Practice arithmetic with configurable difficulty, speed drills, and leaderboards
- **Quizzes** — Per-algorithm comprehension quizzes
- **Dark/Light Themes** — Polished neumorphic design system with full dark mode support
- **SEO Optimized** — Structured data, OG images, sitemap, robots.txt, and proper metadata on every page

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.10 | App Router, SSR, API routes |
| React | 19.2.4 | UI components |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling with CSS custom properties |
| Supabase | 2.110+ | Auth, database, RLS |
| Zustand | 5.x | Playback state management |
| Framer Motion | 12.x | Animations and transitions |
| React Flow | 12.x | Graph visualization canvas |
| Shiki | 4.x | Syntax highlighting for code panels |
| Radix UI | — | Accessible UI primitives (label, popover, switch) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project (for auth and database)

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd algo-flow

# Install dependencies
npm install

# Copy environment template and fill in your Supabase credentials
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build    # Runs registry validation automatically via prebuild
npm run start
```

---

## Project Structure

```
algo-flow/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── (auth)/                 # Auth route group (login, signup, forgot/reset password)
│   │   ├── auth/callback/          # OAuth callback handler
│   │   ├── dashboard/              # Protected user dashboard
│   │   ├── visualizer/[slug]/      # Dynamic visualizer pages (~133 algorithms)
│   │   ├── visualizers/            # Algorithm catalog with category filtering
│   │   ├── mental-math/            # Mental math trainer
│   │   ├── quizzes/                # Per-algorithm quizzes
│   │   ├── privacy/, terms/        # Legal pages
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── auth/                   # Auth forms (OAuth, fields, shell)
│   │   ├── dashboard/              # Dashboard-specific components
│   │   ├── feedback/               # Error and loading states
│   │   ├── landing/                # Landing page sections
│   │   ├── layout/                 # Navbar, Footer, ThemeToggle
│   │   ├── providers/              # ThemeProvider
│   │   ├── ui/                     # Shadcn-style primitives (button, card, input, etc.)
│   │   └── visualizer/             # Core visualizer UI
│   │       ├── controls/           # Per-data-structure input controls
│   │       └── renderers/          # Per-data-structure visual renderers
│   ├── data/seed/                  # Algorithm catalog, data structures, operations, pseudocode
│   ├── features/                   # Feature modules (bookmarks, progress, sessions, streak)
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Shared utilities
│   │   ├── api/                    # Server-side API functions
│   │   ├── auth/                   # Auth redirect helpers
│   │   ├── animation/              # Spring animation configs
│   │   ├── security/               # Rate limiting, safe JSON
│   │   ├── supabase/               # Supabase client (server, client, middleware)
│   │   └── validation/             # Input validation
│   ├── stores/                     # Zustand state stores
│   ├── types/                      # TypeScript type definitions
│   └── visualizers/                # Algorithm implementations
│       ├── registry/               # Visualizer engine (types, registries, publication)
│       ├── shared/                 # Shared highlights and explanations
│       └── {data-structure}/       # Per-DS algorithm logic
├── scripts/                        # Build validators (registry, coordination, code examples)
├── supabase/                       # Database migrations and rollbacks
└── public/                         # Static assets
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (runs registry validation first) |
| `npm run start` | Start production server |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run format` | Format source files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run validate:registry` | Validate all visualizer registry contracts |
| `npm run validate:registry:readiness` | Check publication readiness |
| `npm run validate:visualizers:coordination` | Validate step/highlight coordination |
| `npm run verify:code-examples` | Verify 4-language code example coverage |

---

## Environment Variables

| Variable | Required | Scope | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server | Supabase service role key (never expose to client) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public | Deployed site URL (used for OG images, canonical URLs) |

---

## Deployment

Algo Flow is deployed on **Vercel**. The production build runs `npm run validate:registry` automatically before `next build` via the `prebuild` script.

Required Vercel environment variables: see the table above.

Database migrations are managed under `supabase/migrations/` with corresponding rollbacks in `supabase/rollbacks/`.

---

## License

Private — all rights reserved.

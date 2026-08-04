# Secret Inventory

> **No secret values are stored in this repository — including in this file.**
> This file lists *variable names*, purpose, where they live, and rotation ownership. To rotate a value, edit the Vercel project dashboard or the Supabase project settings. To develop locally, populate `.env.local` (gitignored).

---

## 1. Local development

| Variable | Owner | Storage | Notes |
|---|---|---|---|
| (developer) | Engineer | `.env.local` (gitignored) | Auto-created from `.env.example`. Never committed. |

## 2. Supabase

| Variable | Purpose | Authoritative storage | Exposed to client? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL used by Supabase SDKs | Vercel environment variables + `.env.local` | Yes (intended) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Per-request anonymous JWT | Vercel environment variables + `.env.local` | Yes (intended; protected by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin key (bypasses RLS) | Vercel environment variables + `.env.local` (owner only) | **No. Never.** |

## 3. Vercel

| Variable | Purpose | Storage |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser/server supabase URL | Vercel env vars (Production + Preview) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser/server anon JWT | Vercel env vars (Production + Preview) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service-role key | Vercel env vars (Production + Preview; sensitive) |
| `NEXT_PUBLIC_SITE_URL` | Public origin used to construct OAuth callbacks | Vercel env vars (Production + Preview) |

## 4. Operational rules

- **Never** log a secret value at info level or higher.
- **Never** commit a real `.env` value to any branch.
- **Never** include a secret in a screenshot, fixture, or test.
- **Never** paste a secret into chat, docs, or comment.
- **Always** rotate any secret that has been exposed.
- If you suspect a secret is in git history, **rotate immediately**, then clean history.

## 5. Rotation audit

| Variable | Last rotation | Performed by | Next scheduled rotation |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Unknown at session start | Owner | Not scheduled — add at owner's discretion |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Unknown at session start | Owner | Tracked at Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | n/a — URL is stable | n/a | n/a |
| `NEXT_PUBLIC_SITE_URL` | n/a — URL is stable | n/a | n/a |

## 6. Pre-flight check before any change

Before every PR the engineer must run a secret scanner over the diff. Recommended tools:

- `gitleaks` (CI)
- `git secrets --scan-history`

Findings must block PR merge.

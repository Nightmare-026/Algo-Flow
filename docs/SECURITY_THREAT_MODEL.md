# Security Threat Model

> Status: Phase 0 source-derived model. It must be reconciled with the real Supabase and Vercel projects before Phase 4 changes.

## Assets

- User identities, sessions, profile attributes, bookmarks, progress, quiz attempts, saved visualizer state, and activity history.
- Supabase service-role and OAuth provider secrets.
- Catalog integrity, algorithm correctness, deployment pipeline, and source/lockfile integrity.

## Actors

- Anonymous visitor, authenticated learner, malicious authenticated user, credential-stuffing attacker, compromised dependency/deployment actor, and project administrator.

## Trust boundaries

1. Browser to Vercel/Next.js.
2. Client Components to Server Actions/Route Handlers.
3. Next.js to Supabase Auth/Data API.
4. PostgREST roles to Postgres RLS.
5. OAuth provider to callback route.
6. Git/CI to Vercel deployment.

## Entry points

Auth forms, OAuth callback/query parameters, dashboard mutations, visualizer custom input, dynamic route slugs, quiz submission, Supabase Data API, cookies, forwarded headers, and dependency/build scripts.

## Highest-risk paths

- Cross-user data access if RLS/grants drift from migrations.
- Service-role or OAuth secret exposure through client bundles, logs, history, or screenshots.
- Credential stuffing/reset-email abuse because rate limiting is absent.
- Open redirect or callback-origin manipulation through untrusted headers.
- XSS or clickjacking impact amplified by missing CSP/frame protection.
- Schema drift caused by incompatible idempotent migrations.
- Incorrect algorithm output presented as educational truth.

## Existing controls

HTTPS/HSTS on production, server-side dashboard authorization, Supabase session validation through `getUser`, same-user RLS predicates in migrations, internal `next` path validation for login, gitignored environment files, strict TypeScript, and a committed lockfile.

## Required mitigations

Schema validation at every boundary, explicit auth rate limits, allowlisted origins/redirects, tested RLS and grants, safe headers/CSP, secret scanning in CI, dependency gates, structured redacted logs, short-lived sessions with revocation behavior, and validated visualizer contracts.


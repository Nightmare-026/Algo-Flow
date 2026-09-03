# Security Policy

## Reporting

Do not open a public issue containing exploit details, credentials, tokens, personal data, or production identifiers. Report privately through the verified project-owner contact channel.

## Secrets

Secrets belong only in ignored local environment files or encrypted Vercel, Supabase, and provider secret stores. If a real credential is exposed, revoke and rotate it immediately, update every runtime, invalidate affected sessions where applicable, and only then clean repository history.

## Current Status

Algo Flow uses Supabase for authentication and data storage with Row Level Security (RLS) policies. Security headers (CSP, HSTS, X-Frame-Options, etc.) are configured in `next.config.ts`. Auth gating is handled by `src/proxy.ts` (Next.js 16 proxy/middleware).

# Security Audit Baseline

> Status: Phase 0 only; not an exhaustive Codex Security scan or ASVS Level 2 attestation.

## Secret management

- `.env.local` is ignored and was not printed.
- Recorded names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, plus locally present Google/GitHub client ID/secret names.
- High-signal, value-redacted `git log -G` scan across all 14 commits found no candidate private keys, GitHub/AWS/OpenAI/Stripe/Supabase secret tokens, or non-empty sensitive assignments.
- `.env.local` and `docs/supabase_config.md` have no Git history.
- `gitleaks` and `git-secrets` are unavailable, so the history result is not equivalent to a dedicated entropy-aware scanner.

## Dependency baseline

`npm audit --omit=dev --audit-level=moderate` reports two moderate vulnerabilities through Next.js's nested PostCSS dependency (GHSA-qx2v-qp2m-jg93), with no fix available in the current dependency graph. Review upstream before release.

## Production headers

Observed on `/`: HSTS is present. The following requested controls were absent: Content-Security-Policy including `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. The home response also sends `Access-Control-Allow-Origin: *`; authenticated/private responses need separate verification.

## Supabase baseline

- No service-role use was found in `src`; the variable is declared only for server-side future use.
- Repository migrations leave catalog RLS/grants undefined and contain incompatible `quiz_attempts` declarations.
- Remote advisors, policies, grants, storage, auth settings, redirects, and logs are unverified because connector transport failed.

## Security gate

Release is blocked until the remote schema is reconciled, auth abuse controls and security headers are implemented, a dedicated history secret scanner passes, and high/critical findings from the later full security workflow are closed.


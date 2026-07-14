# Security Policy

## Reporting

Do not open a public issue containing exploit details, credentials, tokens, personal data, or production identifiers. Report privately through the verified project-owner contact channel.

## Secrets

Secrets belong only in ignored local environment files or encrypted Vercel, Supabase, and provider secret stores. If a real credential is exposed, revoke and rotate it immediately, update every runtime, invalidate affected sessions where applicable, and only then clean repository history.

## Current status

The production-readiness branch is pre-release and does not pass its security gate. See `docs/SECURITY_AUDIT.md`, `docs/SECURITY_THREAT_MODEL.md`, and `docs/RELEASE_CHECKLIST.md`.


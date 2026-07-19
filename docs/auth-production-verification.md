# Production authentication verification

- Date: 2026-07-19
- Target: `https://algo-flow-night-sigma.vercel.app`
- Tier: T3 production authentication
- Verdict: **blocked before deployment**; local fix verified

## User story

Signup/login UI → Next.js server action → Supabase Auth → confirmation/OAuth callback → session cookie → profile/preferences trigger → protected dashboard → logout/recovery.

## Production evidence

- Signup and login pages render with accessible in-field labels and no browser console errors before submission.
- One invalid-password probe returns the intended non-enumerating message and preserves `/dashboard` as the return path.
- Google OAuth submission reaches the application error boundary instead of the provider (`Reference: 831813009`).
- Password-reset submission reaches the same boundary before showing success (`Reference: 2400898578`); no reset email was confirmed sent.
- Supabase public auth settings: signup enabled, email confirmation required, Google enabled, GitHub enabled.
- The supplied account already exists, is email-confirmed, and is associated with Google provider metadata. No completed application sign-in is recorded.
- A profile row exists, but the live `profiles` table lacks the canonical `email` column. The additive reconciliation migration is not applied to the live database.

## Root cause and fix

Absolute auth flows depended only on `NEXT_PUBLIC_SITE_URL`; the production deployment does not expose a usable value to the action/callback path. The shared resolver now uses:

1. Valid HTTPS `NEXT_PUBLIC_SITE_URL`.
2. Vercel production or preview system URL.
3. Local request origin only in development.
4. Fail-closed behavior otherwise.

Signup now sets `emailRedirectTo` explicitly. Invalid signup/reset input is validated before resolving an external callback origin. Unsafe external `next` values and insecure production origins are rejected.

The reconciliation migration now also recreates the `on_auth_user_created` trigger inside its transaction, preventing account creation from silently skipping profile and preference provisioning when the live trigger is missing or stale.

## Verification

- Focused auth/database: 18 tests passed.
- Full Jest suite: 15 suites, 183 tests passed.
- TypeScript: passed.
- ESLint: passed.
- Auth-diff Prettier: passed.
- Next.js production build and 105-entry registry: passed.

Repository-wide Prettier currently reports 220 unrelated/incoming files and was not mass-written during this auth fix.

## External blocker

The connected Vercel account exposes no target project, and the connected Supabase account exposes a different inactive project. Local Vercel CLI authentication and `.vercel/project.json` linkage are also absent. The workspace has runtime credentials for the correct Supabase project but no Management API/CLI authorization capable of applying DDL. Therefore no deployment or live migration was attempted.

## Required production gate

1. Connect the Vercel project that owns `algo-flow-night-sigma.vercel.app`.
2. Connect Supabase project `mylzlhevgffgkwpeerzh` with Management API access.
3. Preview/backup and apply the additive reconciliation migration.
4. Deploy the verified build with `NEXT_PUBLIC_SITE_URL=https://algo-flow-night-sigma.vercel.app` and the correct Supabase public keys.
5. Complete Google sign-in for the supplied account, verify profile/preferences/session/dashboard, then sign out and sign back in.
6. Send one password-reset email, complete the mailbox callback manually, set a user-chosen password, and verify password login.

## Migration preview and recovery gate

Before approval, capture a schema-only dump and a restorable project backup, then run read-only checks for required tables, invalid algorithm IDs/scores, nullable session owners, existing Auth trigger/function ownership, policies, grants, and profile/preference row counts. Apply the migration once in a transaction and independently verify trigger provisioning with a disposable test user before using the supplied account.

The migration is mostly additive, but it also changes one identifier type and replaces grants/policies/functions. Prefer application rollback plus forward database repair. The provided down migration must be refused after any non-UUID session algorithm ID is written; additive profile columns should remain rather than be destructively removed.

# Project state

- Last verified: 2026-07-19
- Active work: AUTH-PROD-01, T3 production authentication readiness
- Status: local implementation verified; production release blocked
- Target: `https://algo-flow-night-sigma.vercel.app`

## Completed locally

- Added fail-closed absolute redirect resolution with Vercel system-URL fallback.
- Added explicit signup confirmation and password-reset callback URLs.
- Hardened internal return-path validation.
- Reconciled profile/preferences provisioning function and Auth trigger in the additive migration.
- Verified 15 Jest suites / 183 tests, TypeScript, targeted ESLint, 105/105 registry entries, and the Next.js production build.

## Production blockers

- Connected Vercel account does not expose the project; no local CLI auth or project linkage exists.
- Connected Supabase account exposes a different inactive project, not `mylzlhevgffgkwpeerzh`.
- Live schema lacks the canonical profile contract; migration has not been previewed, backed up, or applied.
- Google consent/account selection and mailbox reset callback require manual browser/mailbox interaction.

## Next safe action

Connect the owning Vercel project and the correct Supabase project without sharing credentials in chat. Then perform the documented read-only migration preview and deployment diff before requesting exact approval for the live migration and production deployment.

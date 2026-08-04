# Algo Flow Legal and Data-Flow Inventory

Status: implementation evidence inventory; not legal advice and not a publishable policy
Last verified: 2026-07-24
Repository branch: `audit/algoflow-production-readiness-2026-07-24`

## Release decision

Account registration is disabled in both the application contract and local Supabase configuration. Public visualizers remain available without an account. Registration must not be enabled until the operator supplies verified legal identity, postal address, jurisdiction, monitored privacy/legal/security contacts, retention decisions, and approved policy text.

## Verified application data flows

| Flow | Data | Purpose | Source | Destination / storage | Access boundary | Retention / deletion evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Existing-user login | Email, password, session tokens | Authenticate an existing account | Login form | Supabase Auth; browser session cookies through `@supabase/ssr` | Supabase Auth plus server-side session validation | Not verified from the hosted project |
| Future email signup (disabled) | Email, password hash at provider, 18+ assertion, Terms version, Privacy version, acceptance timestamp | Create an eligible account and record policy acceptance | Signup form/server action | Supabase Auth user and metadata | Server-side validation; hosted configuration not verified | Not verified; registration remains disabled |
| Password recovery | Email, reset token/session, replacement password | Account recovery | Recovery forms | Supabase Auth and email delivery provider configured in Supabase | Auth rate limits/configuration; production values not verified | Not verified |
| Profile | Email, username, avatar URL, and legacy nullable name/gender columns | Account display and compatibility with existing schema | Auth metadata/profile table | Supabase Postgres `profiles` | Owner-scoped RLS is present in local migrations | Hosted policy and deletion behavior not verified |
| Preferences | Theme, code language, animation speed, reduced-motion and learning preferences | Personalize the interface | Authenticated settings | Supabase Postgres `preferences` / legacy `user_preferences` | Owner-scoped RLS in local migrations | No retention/deletion workflow found |
| Progress and streaks | Algorithm ID, status, completion time, streak dates/counts | Resume learning and show progress | Authenticated actions/RPCs | Supabase Postgres | Owner-scoped RLS in local migrations | No retention/deletion workflow found |
| Bookmarks | User ID, algorithm ID, bookmark metadata | Save learning references | Authenticated bookmark actions | Supabase Postgres `bookmarks` | Owner-scoped RLS in local migrations | User can remove individual bookmarks; account-wide deletion not found |
| Saved sessions | Algorithm ID, input data, visual state, current step, speed, language | Resume a visualizer | Authenticated session actions | Supabase Postgres `saved_visualizer_sessions` | Owner-scoped RLS in local migrations | Individual deletion exists; account-wide deletion/export not found |
| Quiz and activity | Algorithm ID, score, total, activity type/time, limited metadata | Learning feedback and dashboard history | Authenticated quiz/progress actions | Supabase Postgres `quiz_attempts`, `activity_timeline` | Owner-scoped RLS in local migrations | No retention/deletion workflow found |
| Public visualizer input | Numbers, strings, graph JSON, tree/matrix choices | Generate an in-browser trace | Visualizer controls | React state unless an authenticated user explicitly saves a session | Client-side validation; imported graph JSON is parsed and schema-limited, never executed | Discarded on navigation unless saved |
| Interface preferences | Theme and preferred code language | Restore local UI choices | Browser interaction | `localStorage` keys `algo-flow-theme` and `algo-flow-lang` | Same-origin browser storage | Persists until user/browser clears it; no in-app clear control found |
| Auth session | Supabase session cookies | Keep a user logged in | Supabase Auth | Browser cookies managed by `@supabase/ssr` | Same-origin cookie handling; exact hosted cookie attributes require runtime verification | Provider/session configuration not verified |

## Processors and external services

- Supabase is a verified code dependency for authentication and Postgres access. The user supplied target project reference `mylzlhevgffgkwpeerzh`, but MCP authentication to that project is not currently available; hosted settings, region, backups, logs, subprocessors, retention, and data-transfer facts remain unverified.
- The audited public target is hosted at a Vercel domain. Repository linkage, account ownership, deployment settings, runtime logs, analytics settings, and Vercel contractual/subprocessor facts are not verified in this session.
- Google and GitHub OAuth code exists, but social sign-in is disabled in the application while registration/legal onboarding is closed. Provider-side enablement remains unverified.
- No application analytics SDK, advertising SDK, marketing tracker, Sentry SDK, or PostHog SDK was found in `package.json` or application imports. Platform-level analytics/logging may still exist and must be checked in the hosting dashboards.
- Supabase email delivery/SMTP configuration and its processor are not verified.

## Security and privacy controls found locally

- Server-side authentication and owner-scoped RLS definitions exist for user-owned tables.
- New registration is fail-closed; future signup data is minimized to email plus eligibility/policy evidence.
- Password minimum is 12 characters in UI, server actions, and local Supabase config; password paste and printable characters are not blocked.
- Local Auth request limits were tightened and secure password changes/email confirmation enabled.
- Login and signup errors avoid account-existence disclosures.
- Public visualizers do not require an account.
- Graph imports are limited to 1 MB, 100 nodes, 500 edges, finite bounded coordinates/weights, unique node IDs, and valid edge references.

## Missing owner decisions and evidence (release blockers)

- Legal operator name/type, postal address, governing city/state/country, and authority to operate the service.
- Monitored support, privacy/grievance, legal, copyright, and security-reporting contacts.
- Exact hosted Supabase project ownership and production Auth/RLS/advisor state.
- Hosting account ownership, region, logs, analytics, backups, incident response, and subprocessors.
- Purpose and necessity of legacy name/gender profile fields; no new signup collects them.
- Retention periods for Auth records, profiles, progress, activity, saved sessions, backups, logs, and email-delivery records.
- User workflows and service levels for access, correction, export, objection/withdrawal where applicable, and account/data deletion.
- Backup deletion behavior and disaster-recovery retention.
- Breach notification ownership and procedure.
- Cross-border transfer locations and safeguards.
- Final policy version/effective date and legal review.
- A verified monitored contact for `/.well-known/security.txt`.

## Required verification before enabling registration

1. Authenticate the Supabase MCP/CLI against `mylzlhevgffgkwpeerzh`; inspect Auth settings, RLS, advisors, region, backups, SMTP, CAPTCHA, leaked-password protection, OAuth providers, and rate limits.
2. Confirm the deployment project and all platform-level telemetry/processors.
3. Complete the owner decisions above and obtain qualified legal review.
4. Replace draft policy versions with approved immutable versions and publish matching Privacy/Terms pages.
5. Add a tested account export/deletion workflow and documented retention schedule.
6. Add a monitored security contact and valid `security.txt`.
7. Run signup, verification, login, recovery, deletion/export, and policy-version persistence tests in a non-production environment.
8. Preview the exact database/Auth changes and obtain explicit deployment approval before applying them.

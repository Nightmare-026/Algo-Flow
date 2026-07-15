# Database Schema Baseline

> Verified 2026-07-14 against Supabase project
> `mylzlhevgffgkwpeerzh`. The live physical schema, not the stale repository
> migration set, is the source of truth for the current reconciliation.

## Live public tables

| Area | Tables |
|---|---|
| Identity/preferences | `profiles`, `preferences`, `user_preferences` |
| Learning state | `user_progress`, `user_streaks`, `bookmarks` |
| Sessions/assessment | `saved_visualizer_sessions`, `quiz_attempts` |
| Timeline/challenges | `activity_timeline`, `daily_challenges` |

Application-facing algorithm identifiers are text everywhere except the
pre-migration `saved_visualizer_sessions.algorithm_id`, which is UUID. The
pending reconciler converts only that empty-table column to text.

The canonical preference store for this release is `preferences`; it contains
live data and uses `id` as the user owner key. `user_preferences` remains
unexposed to browser roles.

## Live migration ledger

1. `20260705083532 phase_8_auth_preferences`
2. `20260705085529 phase_9_schema`
3. `20260707024449 srs_complete`

The physical schema has manual drift from that ledger: catalog tables recorded
by the last migration are absent. Repository files `001`–`003` also do not
share the remote versions or accurately recreate the physical target. Do not
run `supabase db push` against production from this migration directory.

## Pending reconciliation

Migration `20260714113326_reconcile_database_contract.sql`:

- converts the saved-session algorithm key to text;
- backfills only missing preference rows;
- fixes and restricts the auth profile trigger;
- creates security-invoker completion, quiz, and streak RPCs;
- replaces broad PUBLIC policies and Data API privileges;
- adds missing indexes and input constraints.

The paired down script is
`supabase/rollbacks/20260714113326_reconcile_database_contract.down.sql`.
It refuses lossy UUID coercion after text registry IDs are written and retains
least-privilege security hardening.

## Verified security behavior

- RLS is enabled on all ten public tables.
- Anonymous profile/preference reads return zero rows.
- An authenticated test context sees its own profile and preference only.
- The pending policies use `TO authenticated`, `(select auth.uid())`, and
  owner checks.
- The auth trigger remains `SECURITY DEFINER` but gets an empty search path
  and auth-admin-only execution.
- Application RPCs are `SECURITY INVOKER`.

The migration passed an exact transaction dry-run on the target and was rolled
back. No persistent remote changes have been made.

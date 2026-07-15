# Recovery Phase 4 — Live Supabase Contract Reconciliation

Date: 2026-07-14

Branch: `chore/production-readiness`

Target: `mylzlhevgffgkwpeerzh`

Persistent remote changes: **none**

## Outcome

The local migration and application contract now match the audited live
Supabase schema. The exact migration was executed on the target inside a
transaction whose final statement was replaced with `rollback`; it completed
without error. A post-check confirmed that the database still has a UUID
session algorithm key, one preferences row, zero application RPCs, and three
migration-ledger entries.

The migration is ready for a migration-specific deployment decision. It has
not been persistently applied.

## Live source of truth

The correct remote contains ten public tables:

- `profiles`, `preferences`, `user_preferences`
- `user_progress`, `user_streaks`, `bookmarks`
- `saved_visualizer_sessions`, `quiz_attempts`
- `activity_timeline`, `daily_challenges`

The migration ledger has three entries:

1. `20260705083532 phase_8_auth_preferences`
2. `20260705085529 phase_9_schema`
3. `20260707024449 srs_complete`

The ledger and physical schema have prior manual drift: catalog tables recorded
by `srs_complete` are absent. Therefore the repository's historical
`001`–`003` files are not authoritative for remote deployment, and
`supabase db push` must not be used for this release.

## Implemented locally

- Kept populated `preferences` as the canonical preference store.
- Aligned profiles to `username`.
- Aligned streaks to `max_streak` and `last_activity_date`.
- Restored the live bookmark insert shape.
- Converted only `saved_visualizer_sessions.algorithm_id` from UUID to text.
- Added three `SECURITY INVOKER` RPCs for streak, completion, and quiz writes.
- Hardened `handle_new_user` with an empty search path, preference creation,
  collision-safe display names, and auth-admin-only execution.
- Revoked direct API-role execution of `rls_auto_enable`.
- Rebuilt owner RLS with `TO authenticated`, cached `auth.uid()`, and
  `WITH CHECK`.
- Replaced broad Data API grants with the operations the application uses.
- Added missing foreign-key/query indexes and database input constraints.
- Replaced handwritten assumptions with generated-style live database types.
- Added bounded server-side algorithm-ID validation.

## Validation

| Gate | Result |
|---|---|
| Live preflight | 0 null session owners; 0 invalid IDs/scores |
| Exact remote transaction dry-run | Passed, rolled back |
| Post-rollback remote verification | UUID unchanged; 1 preference; 0 RPCs; 3 migrations |
| TypeScript | Passed |
| Jest | 7 suites, 36 tests passed |
| ESLint | 0 errors; 6 pre-existing warnings |
| Registry validation | 105/105, 0 errors |
| Production build | Passed |
| Changed-file Prettier | Passed |
| Repository-wide Prettier | Existing baseline failure across about 150 files |

Docker was unavailable, so a local Supabase reset was not possible. The exact
target-database rollback transaction provides stronger compatibility evidence
for this migration than the stale local historical migrations.

## Review verdict

- Risk: high, because this touches auth hooks, RLS, grants, and a production
  column type.
- Blockers found during the original audit: resolved in the local patch.
- Remaining deployment conditions:
  - capture a usable backup/restore asset;
  - receive explicit confirmation for this exact target and migration;
  - apply through the project-scoped Supabase MCP migration operation;
  - regenerate remote types, rerun advisors, and run owner/cross-user smoke
    tests immediately after application.
- Verdict: **pass with deployment conditions**.

## Rollback

Preferred rollback is application-only because the database change is
forward-compatible with direct table writes. Leave the security hardening and
text algorithm key in place.

The paired down script is an emergency compatibility rollback. It refuses to
convert the session algorithm key back to UUID after any non-UUID registry ID
has been stored. It intentionally does not restore broad table grants or broad
function execution.

## Remaining platform action

Supabase Auth leaked-password protection is disabled and cannot be changed by
the current database MCP operation. Enable it in the project dashboard before
the production release.

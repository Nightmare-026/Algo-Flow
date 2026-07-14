# Database Schema Baseline

> Status: repository-only inspection. The connected Supabase transport failed, so no remote table, policy, grant, storage, trigger, extension, or migration state was verified.

## Migration order

| File | Main contents | Baseline concern |
|---|---|---|
| `001_auth_profiles.sql` | `profiles`, profile RLS, `handle_new_user`, auth trigger | Update policy has `USING` but no explicit `WITH CHECK`; function execution grants are not revoked |
| `002_phase10.sql` | `quiz_attempts`, `daily_challenges`, RLS | `quiz_attempts` uses text `algorithm_id`, score totals, and no profile FK |
| `003_srs_complete.sql` | catalog and user-learning tables, RLS policies | Re-declares incompatible `quiz_attempts`; `IF NOT EXISTS` leaves the 002 shape on a fresh sequential run |

## Tables declared

- Identity: `profiles`.
- Preferences and user data: `user_preferences`, `user_progress`, `user_streaks`, `bookmarks`, `saved_visualizer_sessions`, `quiz_attempts`, `activity_timeline`.
- Public catalog: `data_structures`, `operations`, `algorithms`, `algorithm_steps`, `code_examples`, `quizzes`, `daily_challenges`.

## RLS baseline

- Enabled locally in migrations for `profiles`, all listed user-owned tables, `quiz_attempts`, `activity_timeline`, and `daily_challenges`.
- User-owned policies generally compare `(select auth.uid())` or `auth.uid()` with `user_id`; current SQL uses `FOR ALL` for most tables.
- The catalog tables do not enable RLS or define explicit grants/policies in the repository migrations.
- `daily_challenges` has a public read policy.
- Remote Data API exposure settings and explicit `anon`/`authenticated` grants are unknown. This matters because Supabase changed new-project defaults for Data API exposure in 2026.

## Release blockers for Phase 4

1. Reconcile `quiz_attempts` into one forward-only schema and test both migration directions.
2. Establish a canonical migration ledger and compare it with the remote project before editing SQL.
3. Add pgTAP or equivalent tests for anonymous denial, owner CRUD, cross-user denial, and catalog read-only access.
4. Review every `SECURITY DEFINER` function, its owner, `search_path`, and `EXECUTE` grants.
5. Add size/shape constraints for JSONB session state and server-side validation for all writes.


## 2026-07-14 local reconciliation package

Migration `20260714113326_reconcile_database_contract.sql` supersedes the
repository-only concerns above for the local branch:

- stable text algorithm IDs at application persistence boundaries;
- explicit owner RLS and grants for user data;
- read-only published catalog policies;
- activity metadata and atomic completion/quiz/streak functions;
- paired guarded down script under `supabase/rollbacks/`.

Remote state is still unverified, and the local stack image pull timed out

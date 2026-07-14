# Recovery Phase 4 — Database/API Contract Reconciliation

Date: 2026-07-14
Branch: `chore/production-readiness`
Remote changes: **none**

## Outcome

The repository now has one local forward migration and a paired guarded down
script for the validated database/API findings. Application persistence uses
stable text algorithm IDs, Supabase clients are typed, owner data is protected
by explicit RLS and grants, catalog access is read-only, and progress/quiz/streak
writes no longer report success after a failed or partially completed sequence.

This package is **not approved for remote application yet**. The local Supabase
database image did not finish downloading within the bounded ten-minute start
window, so `supabase db reset --local --no-seed` remains a required pre-remote
gate. No linked-project or remote migration command was used.

## Design decision

Problem: the TypeScript registry persists IDs such as `alg_arr_bubble_sort`,
while migration `003` declared UUID foreign keys and migration `002` already
declared quiz IDs as text.

Alternatives considered:

1. Convert the application registry to UUIDs. Rejected because it would churn
   105 stable content identifiers, routes, tests, and persisted references.
2. Add a UUID/text mapping table. Rejected for this phase because every user
   write would gain a lookup dependency while the database catalog is not yet
   authoritative or seeded.
3. Use stable text IDs at algorithm persistence boundaries. Selected because it
   matches the shipped registry and the existing quiz schema while preserving
   existing UUID values through `::text` conversion.

Catalog child tables retain foreign keys to `algorithms`. User-owned records do
not depend on the optional database catalog being seeded before they can store a
valid registry ID.

## Implemented

- Added CLI-generated migration
  `supabase/migrations/20260714113326_reconcile_database_contract.sql`.
- Added paired guarded rollback
  `supabase/rollbacks/20260714113326_reconcile_database_contract.down.sql`.
- Converted algorithm IDs at persistence boundaries to text and preserved
  catalog-child referential integrity.
- Added `activity_timeline.metadata` and a unique algorithm-bookmark index.
- Enabled catalog RLS, explicit public read policies, explicit table grants, and
  optimized owner predicates using `(select auth.uid())`.
- Rebuilt profile and user-owned policies with `TO authenticated`; profile
  update now has both `USING` and `WITH CHECK`.
- Added `SECURITY INVOKER` functions for atomic streak, completion, and quiz
  operations. Browser roles receive only the required `EXECUTE` grants.
- Aligned preferences with `user_preferences` and its actual column names.
- Added checked read errors and removed false-success behavior from completion,
  session deletion, streak, quiz, and dashboard-facing reads.
- Added a generated-compatible `Database` contract to all Supabase clients.
- Initialized local-only Supabase configuration (`supabase/config.toml`).

## Finding status

| Finding | Status | Evidence |
|---|---|---|
| C-01 bookmarks rejected by schema | Closed locally | API supplies type/title; algorithm ID is text; duplicate algorithm bookmarks are constrained. |
| C-02 progress/session UUID mismatch | Closed locally | Migration converts persistence columns to text. |
| C-03 preferences table/column mismatch | Closed locally | API now targets `user_preferences.user_id` and declared columns. |
| C-04 activity metadata missing | Closed locally | JSONB metadata column plus transactional quiz function. |
| C-05 false mutation success | Closed locally | RPC/delete errors are checked and surfaced. |
| H-01 conflicting quiz schemas | Closed locally | The reconciler preserves migration `002`'s text/score-total contract. |
| H-02 catalog RLS/grants absent | Closed locally | RLS, published-read policies, revokes, and select-only grants. |
| H-03 untyped Supabase clients | Closed locally | Shared `Database` generic on browser/server/middleware clients. |
| H-04 read errors suppressed | Closed locally | Database errors no longer collapse into empty successful reads. |
| H-13 no database boundary tests | Partially closed | Static migration/RLS tests and mocked API failure tests pass; live RLS tests still require local reset. |

## Validation evidence

| Gate | Result |
|---|---|
| Supabase CLI | `2.109.1` |
| Focused database tests | 8/8 passed |
| Full unit suite | 34/34 passed (6 suites) |
| TypeScript | Passed |
| ESLint | Passed with 6 pre-existing array warnings, 0 errors |
| Registry validation | 105 catalog / 105 implementations, 0 errors |
| Production build | Passed; initial sandbox run hit `spawn EPERM`, escalated rerun passed |
| `git diff --check` | Passed (line-ending notices only) |
| Local `supabase db reset` | **Not executed**: stack start timed out while pulling the database image; no DB container started |

## Review report

```json
{
  "summary": "Local database and API contracts are reconciled around stable text IDs with explicit RLS/grants and transactional critical writes.",
  "blockers": [
    "Run a clean local Supabase reset and live owner/cross-user RLS tests before any remote migration."
  ],
  "warnings": [
    "The down script intentionally refuses rollback after non-UUID registry IDs or non-empty activity metadata are written.",
    "Remote migration history and current data quality remain unverified."
  ],
  "missing_tests": [
    "Fresh migration replay against PostgreSQL",
    "Anonymous denial, owner CRUD, cross-user denial, and catalog read-only integration tests"
  ],
  "suggested_fixes": [
    "Complete the local image pull, run db reset, generate types from the resulting schema, and compare them with src/types/database.ts."
  ],
  "rollback_risk": "high",
  "verdict": "block"
}
```

## QA report

```json
{
  "checks_run": [
    "typecheck",
    "eslint",
    "full Jest suite",
    "registry validation",
    "production build",
    "static migration/security contract tests"
  ],
  "checks_passed": [
    "typecheck",
    "eslint (0 errors)",
    "34 unit tests",
    "registry validation",
    "production build",
    "8 database boundary tests"
  ],
  "checks_failed": [],
  "flaky_or_uncertain": [
    "Local Supabase stack image pull timed out before migration execution"
  ],
  "security_findings": [
    "No new code-level finding; live RLS enforcement is unverified"
  ],
  "release_recommendation": "block",
  "conditions": [
    "Successful local db reset",
    "Live RLS integration tests",
    "Remote migration ledger comparison and backup",
    "Migration-specific user confirmation"
  ]
}
```

## Pre-remote sequence

1. Start Docker and run:
   `supabase start` then `supabase db reset --local --no-seed`.
2. Run live tests for anonymous denial, owner CRUD, cross-user denial, and
   catalog read-only behavior.
3. Generate local database types and compare them to `src/types/database.ts`.
4. Inspect the remote migration ledger and data for null/orphan identifiers.
5. Capture a database backup and record its restore command.
6. Present the exact forward migration, target project, dry-run evidence, and
   rollback choice for explicit confirmation.

After real text IDs or quiz metadata are written, rollback must use a database
snapshot/restore or a purpose-built compatibility migration; the guarded down
script will refuse lossy coercion by design.

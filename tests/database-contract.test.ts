import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const migration = readFileSync(
  join(root, "supabase/migrations/20260714113326_reconcile_database_contract.sql"),
  "utf8"
).toLowerCase();
const rollback = readFileSync(
  join(root, "supabase/rollbacks/20260714113326_reconcile_database_contract.down.sql"),
  "utf8"
).toLowerCase();

describe("database contract migration", () => {
  test("uses stable text algorithm identifiers at application persistence boundaries", () => {
    for (const table of [
      "algorithms",
      "user_progress",
      "bookmarks",
      "saved_visualizer_sessions",
      "quiz_attempts",
    ]) {
      expect(migration).toContain(
        `alter table public.${table} alter column algorithm_id type text`.replace(
          "algorithms alter column algorithm_id",
          "algorithms alter column id"
        )
      );
    }
  });

  test("adds activity metadata and transactional write functions without privilege bypass", () => {
    expect(migration).toContain("add column if not exists metadata jsonb");
    expect(migration).toContain("function public.mark_algorithm_completed");
    expect(migration).toContain("function public.record_quiz_attempt");
    expect(migration.match(/security invoker/g)).toHaveLength(3);
    expect(migration).not.toContain("security definer");
  });

  test("owner policies and catalog grants are explicit", () => {
    for (const table of [
      "user_preferences",
      "user_progress",
      "user_streaks",
      "bookmarks",
      "saved_visualizer_sessions",
      "quiz_attempts",
      "activity_timeline",
    ]) {
      const policyStart = migration.indexOf(`create policy "users can manage their own ${table}"`);
      expect(policyStart).toBeGreaterThan(-1);
      const policy = migration.slice(policyStart, policyStart + 320);
      expect(policy).toContain("to authenticated");
      expect(policy).toContain("(select auth.uid()) = user_id");
      expect(policy).toContain("with check");
    }

    expect(migration).toContain('create policy "users can view own profile"');
    expect(migration).toContain('create policy "users can update own profile"');
    expect(migration).toContain("using ((select auth.uid()) = id)");
    expect(migration).toContain("with check ((select auth.uid()) = id)");

    expect(migration).toContain("revoke all on table public.data_structures");
    expect(migration).toContain("grant select on table public.data_structures");
    expect(migration).toContain("to anon, authenticated");
  });

  test("rollback refuses lossy identifier or metadata coercion", () => {
    expect(rollback).toContain("rollback refused: non-uuid algorithm identifiers");
    expect(rollback).toContain("rollback refused: activity metadata");
    expect(rollback).toContain("where metadata <> '{}'::jsonb");
  });
});

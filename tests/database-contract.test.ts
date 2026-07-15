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

describe("live-aligned database contract migration", () => {
  test("targets only audited live tables and columns", () => {
    expect(migration).toContain("alter column algorithm_id type text using algorithm_id::text");
    expect(migration).toContain("max_streak");
    expect(migration).toContain("last_activity_date");
    expect(migration).toContain("insert into public.preferences (id)");

    for (const absentTable of [
      "public.algorithms",
      "public.algorithm_steps",
      "public.code_examples",
      "public.quizzes",
      "public.data_structures",
      "public.operations",
    ]) {
      expect(migration).not.toContain(absentTable);
    }

    for (const absentColumn of [
      "longest_streak",
      "last_active_date",
      "completion_percentage",
      "bookmark_type",
    ]) {
      expect(migration).not.toContain(absentColumn);
    }
  });

  test("keeps only the auth hook privileged", () => {
    expect(migration.match(/security invoker/g)).toHaveLength(3);
    expect(migration.match(/security definer/g)).toHaveLength(1);
    expect(migration).toContain("function public.handle_new_user()");
    expect(migration).toContain("set search_path = ''");
    expect(migration).toContain("to supabase_auth_admin");
    expect(migration).toContain("from public, anon, authenticated, service_role");
  });

  test("uses cached owner checks and explicit least-privilege grants", () => {
    expect(migration).toContain("to authenticated");
    expect(migration).toContain("(select auth.uid()) = user_id");
    expect(migration).toContain("(select auth.uid()) = id");
    expect(migration).toContain("with check");
    expect(migration).toContain("grant select, insert, delete on table public.bookmarks");
    expect(migration).toContain(
      "grant select on table public.daily_challenges to anon, authenticated"
    );
    expect(migration).not.toContain("grant all");
  });

  test("adds validation, indexes, transactional RPCs, and a guarded rollback", () => {
    expect(migration).toContain("quiz_attempts_score_valid_v2");
    expect(migration).toContain("char_length(algorithm_id) <= 200");
    expect(migration).toContain("saved_visualizer_sessions_user_id_idx");
    expect(migration).toContain("activity_timeline_user_id_created_at_idx");
    expect(migration).toContain("function public.mark_algorithm_completed");
    expect(migration).toContain("function public.record_quiz_attempt");
    expect(migration.indexOf("function public.touch_user_streak")).toBeLessThan(
      migration.indexOf("function public.mark_algorithm_completed")
    );
    expect(rollback).toContain("rollback refused: non-uuid saved-session algorithm identifiers");
  });
});

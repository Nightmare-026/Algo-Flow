-- Down migration for 004_reconcile_database_contract.sql.
-- Safety contract: refuse rollback once stable text IDs or activity metadata
-- have been written, because coercing or dropping those values would lose data.

begin;

do $$
begin
  if exists (
    select 1
    from (
      select id as value from public.algorithms
      union all select algorithm_id from public.algorithm_steps where algorithm_id is not null
      union all select algorithm_id from public.code_examples where algorithm_id is not null
      union all select algorithm_id from public.user_progress where algorithm_id is not null
      union all select algorithm_id from public.bookmarks where algorithm_id is not null
      union all select algorithm_id from public.saved_visualizer_sessions where algorithm_id is not null
      union all select algorithm_id from public.quizzes where algorithm_id is not null
    ) identifiers
    where value !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  ) then
    raise exception 'rollback refused: non-UUID algorithm identifiers would be lost';
  end if;

  if exists (
    select 1 from public.activity_timeline where metadata <> '{}'::jsonb
  ) then
    raise exception 'rollback refused: activity metadata would be lost';
  end if;
end;
$$;

drop function if exists public.record_quiz_attempt(text, integer, integer);
drop function if exists public.mark_algorithm_completed(text);
drop function if exists public.touch_user_streak();

drop index if exists public.bookmarks_user_algorithm_unique;
drop index if exists public.user_progress_user_id_idx;
drop index if exists public.bookmarks_user_id_idx;
drop index if exists public.saved_visualizer_sessions_user_id_idx;
drop index if exists public.quiz_attempts_user_id_idx;
drop index if exists public.activity_timeline_user_id_created_at_idx;

alter table public.algorithm_steps drop constraint if exists algorithm_steps_algorithm_id_fkey;
alter table public.code_examples drop constraint if exists code_examples_algorithm_id_fkey;
alter table public.quizzes drop constraint if exists quizzes_algorithm_id_fkey;

alter table public.algorithm_steps alter column algorithm_id type uuid using algorithm_id::uuid;
alter table public.code_examples alter column algorithm_id type uuid using algorithm_id::uuid;
alter table public.user_progress alter column algorithm_id type uuid using algorithm_id::uuid;
alter table public.bookmarks alter column algorithm_id type uuid using algorithm_id::uuid;
alter table public.saved_visualizer_sessions alter column algorithm_id type uuid using algorithm_id::uuid;
alter table public.quizzes alter column algorithm_id type uuid using algorithm_id::uuid;
alter table public.algorithms alter column id type uuid using id::uuid;
alter table public.algorithms alter column id set default gen_random_uuid();

alter table public.algorithm_steps
  add constraint algorithm_steps_algorithm_id_fkey
  foreign key (algorithm_id) references public.algorithms(id) on delete cascade;
alter table public.code_examples
  add constraint code_examples_algorithm_id_fkey
  foreign key (algorithm_id) references public.algorithms(id) on delete cascade;
alter table public.user_progress
  add constraint user_progress_algorithm_id_fkey
  foreign key (algorithm_id) references public.algorithms(id) on delete cascade;
alter table public.bookmarks
  add constraint bookmarks_algorithm_id_fkey
  foreign key (algorithm_id) references public.algorithms(id) on delete cascade;
alter table public.saved_visualizer_sessions
  add constraint saved_visualizer_sessions_algorithm_id_fkey
  foreign key (algorithm_id) references public.algorithms(id) on delete cascade;
alter table public.quizzes
  add constraint quizzes_algorithm_id_fkey
  foreign key (algorithm_id) references public.algorithms(id) on delete cascade;

alter table public.bookmarks alter column bookmark_type drop default;
alter table public.activity_timeline drop column metadata;

drop policy if exists "Public can read published data structures" on public.data_structures;
drop policy if exists "Public can read published operations" on public.operations;
drop policy if exists "Public can read published algorithms" on public.algorithms;
drop policy if exists "Public can read published algorithm steps" on public.algorithm_steps;
drop policy if exists "Public can read published code examples" on public.code_examples;
drop policy if exists "Public can read published quizzes" on public.quizzes;
drop policy if exists "Public can read daily challenges" on public.daily_challenges;
create policy "Anyone can read daily challenges"
  on public.daily_challenges for select using (true);

-- Keep explicit least-privilege grants and RLS enabled. Reopening the catalog
-- during rollback is not required for application compatibility and would turn
-- a rollback into a security regression.

commit;

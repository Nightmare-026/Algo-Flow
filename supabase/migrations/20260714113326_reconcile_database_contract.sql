-- Reconcile the application persistence contract around stable text algorithm IDs.
-- This migration is intentionally local-only until reviewed and explicitly approved.

begin;

-- Detach UUID foreign keys before converting algorithm identifiers to text.
alter table public.algorithm_steps drop constraint if exists algorithm_steps_algorithm_id_fkey;
alter table public.code_examples drop constraint if exists code_examples_algorithm_id_fkey;
alter table public.user_progress drop constraint if exists user_progress_algorithm_id_fkey;
alter table public.bookmarks drop constraint if exists bookmarks_algorithm_id_fkey;
alter table public.saved_visualizer_sessions drop constraint if exists saved_visualizer_sessions_algorithm_id_fkey;
alter table public.quizzes drop constraint if exists quizzes_algorithm_id_fkey;
alter table public.quiz_attempts drop constraint if exists quiz_attempts_algorithm_id_fkey;

alter table public.algorithms alter column id drop default;
alter table public.algorithms alter column id type text using id::text;
alter table public.algorithm_steps alter column algorithm_id type text using algorithm_id::text;
alter table public.code_examples alter column algorithm_id type text using algorithm_id::text;
alter table public.user_progress alter column algorithm_id type text using algorithm_id::text;
alter table public.bookmarks alter column algorithm_id type text using algorithm_id::text;
alter table public.saved_visualizer_sessions alter column algorithm_id type text using algorithm_id::text;
alter table public.quizzes alter column algorithm_id type text using algorithm_id::text;
alter table public.quiz_attempts alter column algorithm_id type text using algorithm_id::text;

-- Catalog children retain referential integrity. User records deliberately store
-- registry IDs even before the optional database catalog has been seeded.
alter table public.algorithm_steps
  add constraint algorithm_steps_algorithm_id_fkey
  foreign key (algorithm_id) references public.algorithms(id) on delete cascade;
alter table public.code_examples
  add constraint code_examples_algorithm_id_fkey
  foreign key (algorithm_id) references public.algorithms(id) on delete cascade;
alter table public.quizzes
  add constraint quizzes_algorithm_id_fkey
  foreign key (algorithm_id) references public.algorithms(id) on delete cascade;

alter table public.activity_timeline
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.bookmarks
  alter column bookmark_type set default 'algorithm';

create unique index if not exists bookmarks_user_algorithm_unique
  on public.bookmarks (user_id, algorithm_id)
  where bookmark_type = 'algorithm';
create index if not exists user_progress_user_id_idx on public.user_progress (user_id);
create index if not exists bookmarks_user_id_idx on public.bookmarks (user_id);
create index if not exists saved_visualizer_sessions_user_id_idx on public.saved_visualizer_sessions (user_id);
create index if not exists quiz_attempts_user_id_idx on public.quiz_attempts (user_id);
create index if not exists activity_timeline_user_id_created_at_idx
  on public.activity_timeline (user_id, created_at desc);

-- Every public-schema table exposed through the Data API gets RLS. Catalog
-- tables are read-only for browser roles; user data is owner-scoped.
alter table public.data_structures enable row level security;
alter table public.operations enable row level security;
alter table public.algorithms enable row level security;
alter table public.algorithm_steps enable row level security;
alter table public.code_examples enable row level security;
alter table public.quizzes enable row level security;
alter table public.daily_challenges enable row level security;

drop policy if exists "Public can read published data structures" on public.data_structures;
create policy "Public can read published data structures"
  on public.data_structures for select to anon, authenticated
  using (is_published = true);
drop policy if exists "Public can read published operations" on public.operations;
create policy "Public can read published operations"
  on public.operations for select to anon, authenticated
  using (is_published = true);
drop policy if exists "Public can read published algorithms" on public.algorithms;
create policy "Public can read published algorithms"
  on public.algorithms for select to anon, authenticated
  using (is_published = true);
drop policy if exists "Public can read published algorithm steps" on public.algorithm_steps;
create policy "Public can read published algorithm steps"
  on public.algorithm_steps for select to anon, authenticated
  using (exists (
    select 1 from public.algorithms
    where algorithms.id = algorithm_steps.algorithm_id
      and algorithms.is_published = true
  ));
drop policy if exists "Public can read published code examples" on public.code_examples;
create policy "Public can read published code examples"
  on public.code_examples for select to anon, authenticated
  using (exists (
    select 1 from public.algorithms
    where algorithms.id = code_examples.algorithm_id
      and algorithms.is_published = true
  ));
drop policy if exists "Public can read published quizzes" on public.quizzes;
create policy "Public can read published quizzes"
  on public.quizzes for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Anyone can read daily challenges" on public.daily_challenges;
create policy "Public can read daily challenges"
  on public.daily_challenges for select to anon, authenticated using (true);

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- User-owned tables fail closed: browser roles can only operate on rows whose
-- owner matches the verified JWT subject.

drop policy if exists "Users can manage their own user_preferences" on public.user_preferences;
create policy "Users can manage their own user_preferences"
  on public.user_preferences for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Users can manage their own user_progress" on public.user_progress;
create policy "Users can manage their own user_progress"
  on public.user_progress for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Users can manage their own user_streaks" on public.user_streaks;
create policy "Users can manage their own user_streaks"
  on public.user_streaks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Users can manage their own bookmarks" on public.bookmarks;
create policy "Users can manage their own bookmarks"
  on public.bookmarks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Users can manage their own saved_visualizer_sessions" on public.saved_visualizer_sessions;
create policy "Users can manage their own saved_visualizer_sessions"
  on public.saved_visualizer_sessions for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Users can manage their own quiz attempts" on public.quiz_attempts;
drop policy if exists "Users can manage their own quiz_attempts" on public.quiz_attempts;
create policy "Users can manage their own quiz_attempts"
  on public.quiz_attempts for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Users can manage their own activity_timeline" on public.activity_timeline;
create policy "Users can manage their own activity_timeline"
  on public.activity_timeline for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public.profiles, public.user_preferences, public.user_progress,
  public.user_streaks, public.bookmarks, public.saved_visualizer_sessions,
  public.quiz_attempts, public.activity_timeline from anon, authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_preferences,
  public.user_progress, public.user_streaks, public.bookmarks,
  public.saved_visualizer_sessions, public.quiz_attempts,
  public.activity_timeline to authenticated;

revoke all on table public.data_structures, public.operations, public.algorithms,
  public.algorithm_steps, public.code_examples, public.quizzes,
  public.daily_challenges from anon, authenticated;
grant select on table public.data_structures, public.operations, public.algorithms,
  public.algorithm_steps, public.code_examples, public.quizzes,
  public.daily_challenges to anon, authenticated;

create or replace function public.touch_user_streak()
returns public.user_streaks
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_result public.user_streaks;
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  insert into public.user_streaks as streak (
    user_id, current_streak, longest_streak, last_active_date,
    daily_goal_completed, updated_at
  ) values (
    v_user_id, 1, 1, current_date, false, now()
  )
  on conflict (user_id) do update set
    current_streak = case
      when streak.last_active_date = current_date then streak.current_streak
      when streak.last_active_date = current_date - 1 then streak.current_streak + 1
      else 1
    end,
    longest_streak = greatest(
      streak.longest_streak,
      case
        when streak.last_active_date = current_date then streak.current_streak
        when streak.last_active_date = current_date - 1 then streak.current_streak + 1
        else 1
      end
    ),
    last_active_date = current_date,
    updated_at = now()
  returning * into v_result;

  return v_result;
end;
$$;

create or replace function public.mark_algorithm_completed(p_algorithm_id text)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if nullif(btrim(p_algorithm_id), '') is null then
    raise exception 'algorithm id is required' using errcode = '22023';
  end if;

  insert into public.user_progress (
    user_id, algorithm_id, status, completion_percentage,
    completed_at, last_practiced_at, updated_at
  ) values (
    v_user_id, p_algorithm_id, 'completed', 100, now(), now(), now()
  )
  on conflict (user_id, algorithm_id) do update set
    status = 'completed',
    completion_percentage = 100,
    completed_at = coalesce(public.user_progress.completed_at, now()),
    last_practiced_at = now(),
    updated_at = now();

  insert into public.activity_timeline (user_id, action_type, algorithm_id)
  values (v_user_id, 'completed', p_algorithm_id);

  perform public.touch_user_streak();
end;
$$;

create or replace function public.record_quiz_attempt(
  p_algorithm_id text,
  p_score integer,
  p_total_questions integer
)
returns table (
  id uuid,
  user_id uuid,
  algorithm_id text,
  score integer,
  total_questions integer,
  created_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if nullif(btrim(p_algorithm_id), '') is null then
    raise exception 'algorithm id is required' using errcode = '22023';
  end if;
  if p_total_questions <= 0 or p_score < 0 or p_score > p_total_questions then
    raise exception 'invalid quiz score' using errcode = '22023';
  end if;

  return query
    insert into public.quiz_attempts (
      user_id, algorithm_id, score, total_questions
    ) values (
      v_user_id, p_algorithm_id, p_score, p_total_questions
    )
    returning quiz_attempts.id, quiz_attempts.user_id,
      quiz_attempts.algorithm_id, quiz_attempts.score,
      quiz_attempts.total_questions, quiz_attempts.created_at;

  insert into public.activity_timeline (
    user_id, action_type, algorithm_id, metadata
  ) values (
    v_user_id,
    'quiz_completed',
    p_algorithm_id,
    jsonb_build_object('score', p_score, 'total_questions', p_total_questions)
  );

  if p_score::numeric / p_total_questions >= 0.6 then
    perform public.touch_user_streak();
  end if;
end;
$$;

revoke all on function public.touch_user_streak() from public, anon;
revoke all on function public.mark_algorithm_completed(text) from public, anon;
revoke all on function public.record_quiz_attempt(text, integer, integer) from public, anon;
grant execute on function public.touch_user_streak() to authenticated;
grant execute on function public.mark_algorithm_completed(text) to authenticated;
grant execute on function public.record_quiz_attempt(text, integer, integer) to authenticated;

commit;

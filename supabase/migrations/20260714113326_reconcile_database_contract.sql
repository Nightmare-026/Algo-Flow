-- Reconcile the application contract with the audited production schema.
-- Target project: mylzlhevgffgkwpeerzh
-- Local-only until the migration-specific deployment preview is approved.

begin;

-- Fail before making changes if the live schema has drifted since the audit.
do $$
declare
  required_table text;
begin
  foreach required_table in array array[
    'profiles', 'preferences', 'user_preferences', 'user_progress',
    'user_streaks', 'bookmarks', 'saved_visualizer_sessions',
    'quiz_attempts', 'activity_timeline', 'daily_challenges'
  ]
  loop
    if to_regclass(format('public.%I', required_table)) is null then
      raise exception 'schema drift: required table public.% is missing', required_table;
    end if;
  end loop;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'user_streaks'
      and column_name = 'max_streak'
  ) or not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'user_streaks'
      and column_name = 'last_activity_date'
  ) then
    raise exception 'schema drift: audited user_streaks columns are missing';
  end if;
end;
$$;

-- Keep the profile contract additive and consistent across fresh, audited, and
-- previously deployed environments. Existing values are preserved.
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists created_at timestamptz default now();
alter table public.profiles add column if not exists updated_at timestamptz default now();

-- Registry algorithm IDs are stable text values. This is the only identifier
-- conversion required by the audited live schema.
alter table public.saved_visualizer_sessions
  drop constraint if exists saved_visualizer_sessions_algorithm_id_fkey;
alter table public.saved_visualizer_sessions
  alter column algorithm_id type text using algorithm_id::text;
alter table public.saved_visualizer_sessions alter column user_id set not null;

-- Enforce server-action and RPC input invariants.
alter table public.user_progress
  add constraint user_progress_algorithm_id_not_blank_v2
  check (btrim(algorithm_id) <> '' and char_length(algorithm_id) <= 200) not valid;
alter table public.user_progress
  validate constraint user_progress_algorithm_id_not_blank_v2;
alter table public.bookmarks
  add constraint bookmarks_algorithm_id_not_blank_v2
  check (btrim(algorithm_id) <> '' and char_length(algorithm_id) <= 200) not valid;
alter table public.bookmarks
  validate constraint bookmarks_algorithm_id_not_blank_v2;
alter table public.saved_visualizer_sessions
  add constraint saved_sessions_algorithm_id_not_blank_v2
  check (
    algorithm_id is null
    or (btrim(algorithm_id) <> '' and char_length(algorithm_id) <= 200)
  ) not valid;
alter table public.saved_visualizer_sessions
  validate constraint saved_sessions_algorithm_id_not_blank_v2;
alter table public.quiz_attempts
  add constraint quiz_attempts_score_valid_v2
  check (total_questions > 0 and score between 0 and total_questions) not valid;
alter table public.quiz_attempts validate constraint quiz_attempts_score_valid_v2;
alter table public.quiz_attempts
  add constraint quiz_attempts_algorithm_id_not_blank_v2
  check (btrim(algorithm_id) <> '' and char_length(algorithm_id) <= 200) not valid;
alter table public.quiz_attempts
  validate constraint quiz_attempts_algorithm_id_not_blank_v2;
alter table public.activity_timeline
  add constraint activity_algorithm_id_not_blank_v2
  check (btrim(algorithm_id) <> '' and char_length(algorithm_id) <= 200) not valid;
alter table public.activity_timeline
  validate constraint activity_algorithm_id_not_blank_v2;

-- Index foreign-key and dashboard query paths.
create index if not exists saved_visualizer_sessions_user_id_idx
  on public.saved_visualizer_sessions (user_id);
create index if not exists quiz_attempts_user_id_idx
  on public.quiz_attempts (user_id);
create index if not exists activity_timeline_user_id_created_at_idx
  on public.activity_timeline (user_id, created_at desc);

-- Existing values win; only the missing canonical preference row is backfilled.
insert into public.preferences (id)
select profiles.id from public.profiles
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_first_name text := nullif(btrim(new.raw_user_meta_data->>'first_name'), '');
  profile_last_name text := nullif(btrim(new.raw_user_meta_data->>'last_name'), '');
  profile_full_name text := nullif(btrim(coalesce(
    new.raw_user_meta_data->>'full_name',
    concat_ws(' ', profile_first_name, profile_last_name)
  )), '');
  candidate_username text := nullif(btrim(coalesce(
    profile_full_name,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'user_name',
    profile_first_name,
    split_part(new.email, '@', 1)
  )), '');
begin
  if candidate_username is not null and exists (
    select 1 from public.profiles
    where profiles.username = candidate_username and profiles.id <> new.id
  ) then
    candidate_username := candidate_username || '_' || replace(new.id::text, '-', '');
  end if;

  begin
    insert into public.profiles (
      id, username, avatar_url, email, first_name, last_name, full_name, gender
    )
    values (
      new.id,
      candidate_username,
      new.raw_user_meta_data->>'avatar_url',
      new.email,
      profile_first_name,
      profile_last_name,
      profile_full_name,
      nullif(btrim(new.raw_user_meta_data->>'gender'), '')
    )
    on conflict (id) do update set
      username = excluded.username,
      avatar_url = excluded.avatar_url,
      email = excluded.email,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      full_name = excluded.full_name,
      gender = excluded.gender,
      updated_at = now();
  exception
    when unique_violation then
      candidate_username := coalesce(candidate_username, 'learner')
        || '_' || replace(new.id::text, '-', '');
      insert into public.profiles (
        id, username, avatar_url, email, first_name, last_name, full_name, gender
      )
      values (
        new.id,
        candidate_username,
        new.raw_user_meta_data->>'avatar_url',
        new.email,
        profile_first_name,
        profile_last_name,
        profile_full_name,
        nullif(btrim(new.raw_user_meta_data->>'gender'), '')
      )
      on conflict (id) do update set
        username = excluded.username,
        avatar_url = excluded.avatar_url,
        email = excluded.email,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        full_name = excluded.full_name,
        gender = excluded.gender,
        updated_at = now();
  end;

  insert into public.preferences (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user()
  from public, anon, authenticated, service_role;
grant execute on function public.handle_new_user() to supabase_auth_admin;

-- Reconcile the Auth hook itself as well as its function. A missing or stale
-- trigger would otherwise allow account creation without the required profile
-- and preference rows.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Event-trigger execution is internal; API roles do not call this function.
revoke all on function public.rls_auto_enable()
  from public, anon, authenticated, service_role;

alter table public.profiles enable row level security;
alter table public.preferences enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_streaks enable row level security;
alter table public.bookmarks enable row level security;
alter table public.saved_visualizer_sessions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.activity_timeline enable row level security;
alter table public.daily_challenges enable row level security;

do $$
begin
  execute format('drop policy if exists %I on public.profiles',
    'Users can view their own profile.');
  execute format('drop policy if exists %I on public.profiles',
    'Users can update their own profile.');
end;
$$;
create policy authenticated_users_read_own_profile
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy authenticated_users_update_own_profile
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

do $$
begin
  execute format('drop policy if exists %I on public.preferences',
    'Users can view their own preferences.');
  execute format('drop policy if exists %I on public.preferences',
    'Users can update their own preferences.');
  execute format('drop policy if exists %I on public.user_preferences',
    'Users can manage their own user_preferences');
end;
$$;
create policy authenticated_users_read_own_preferences
  on public.preferences for select to authenticated
  using ((select auth.uid()) = id);
create policy authenticated_users_insert_own_preferences
  on public.preferences for insert to authenticated
  with check ((select auth.uid()) = id);
create policy authenticated_users_update_own_preferences
  on public.preferences for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

do $$
begin
  execute format('drop policy if exists %I on public.user_progress',
    'Users can manage their own user_progress');
  execute format('drop policy if exists %I on public.user_streaks',
    'Users can manage their own user_streaks');
  execute format('drop policy if exists %I on public.bookmarks',
    'Users can manage their own bookmarks');
  execute format('drop policy if exists %I on public.saved_visualizer_sessions',
    'Users can manage their own saved_visualizer_sessions');
  execute format('drop policy if exists %I on public.quiz_attempts',
    'Users can manage their own quiz_attempts');
  execute format('drop policy if exists %I on public.activity_timeline',
    'Users can manage their own activity_timeline');
  execute format('drop policy if exists %I on public.daily_challenges',
    'Anyone can read daily challenges');
end;
$$;

create policy authenticated_users_manage_own_progress
  on public.user_progress for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy authenticated_users_manage_own_streak
  on public.user_streaks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy authenticated_users_manage_own_bookmarks
  on public.bookmarks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy authenticated_users_manage_own_sessions
  on public.saved_visualizer_sessions for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy authenticated_users_manage_own_quiz_attempts
  on public.quiz_attempts for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy authenticated_users_manage_own_activity
  on public.activity_timeline for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy public_can_read_daily_challenges
  on public.daily_challenges for select to anon, authenticated using (true);

-- Data API privileges are separate from RLS.
revoke all on table public.profiles, public.preferences, public.user_preferences,
  public.user_progress, public.user_streaks, public.bookmarks,
  public.saved_visualizer_sessions, public.quiz_attempts,
  public.activity_timeline, public.daily_challenges
  from public, anon, authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update on table public.preferences to authenticated;
grant select, insert, update on table public.user_progress, public.user_streaks
  to authenticated;
grant select, insert, delete on table public.bookmarks to authenticated;
grant select, insert, update, delete on table public.saved_visualizer_sessions
  to authenticated;
grant select, insert on table public.quiz_attempts, public.activity_timeline
  to authenticated;
grant select on table public.daily_challenges to anon, authenticated;

create or replace function public.touch_user_streak()
returns public.user_streaks
language plpgsql
security invoker
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  result public.user_streaks;
begin
  if caller_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  insert into public.user_streaks as streak (
    user_id, current_streak, max_streak, last_activity_date
  )
  values (caller_id, 1, 1, current_date)
  on conflict (user_id) do update set
    current_streak = case
      when streak.last_activity_date = current_date then coalesce(streak.current_streak, 0)
      when streak.last_activity_date = current_date - 1 then coalesce(streak.current_streak, 0) + 1
      else 1
    end,
    max_streak = greatest(
      coalesce(streak.max_streak, 0),
      case
        when streak.last_activity_date = current_date then coalesce(streak.current_streak, 0)
        when streak.last_activity_date = current_date - 1 then coalesce(streak.current_streak, 0) + 1
        else 1
      end
    ),
    last_activity_date = current_date
  returning * into result;
  return result;
end;
$$;

create or replace function public.mark_algorithm_completed(p_algorithm_id text)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
begin
  if caller_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if nullif(btrim(p_algorithm_id), '') is null then
    raise exception 'algorithm id is required' using errcode = '22023';
  end if;

  insert into public.user_progress as progress (
    user_id, algorithm_id, status, completed_at
  )
  values (caller_id, btrim(p_algorithm_id), 'completed', now())
  on conflict (user_id, algorithm_id) do update set
    status = 'completed',
    completed_at = coalesce(progress.completed_at, now());

  insert into public.activity_timeline (user_id, action_type, algorithm_id)
  values (caller_id, 'completed', btrim(p_algorithm_id));
  perform public.touch_user_streak();
end;
$$;

create or replace function public.record_quiz_attempt(
  p_algorithm_id text,
  p_score integer,
  p_total_questions integer
)
returns setof public.quiz_attempts
language plpgsql
security invoker
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
begin
  if caller_id is null then
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
    )
    values (caller_id, btrim(p_algorithm_id), p_score, p_total_questions)
    returning public.quiz_attempts.*;

  insert into public.activity_timeline (
    user_id, action_type, algorithm_id, metadata
  )
  values (
    caller_id, 'quiz_completed', btrim(p_algorithm_id),
    jsonb_build_object('score', p_score, 'total_questions', p_total_questions)
  );

  if p_score::numeric / p_total_questions >= 0.6 then
    perform public.touch_user_streak();
  end if;
end;
$$;

revoke all on function public.touch_user_streak()
  from public, anon, authenticated;
revoke all on function public.mark_algorithm_completed(text)
  from public, anon, authenticated;
revoke all on function public.record_quiz_attempt(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.touch_user_streak() to authenticated;
grant execute on function public.mark_algorithm_completed(text) to authenticated;
grant execute on function public.record_quiz_attempt(text, integer, integer)
  to authenticated;

commit;

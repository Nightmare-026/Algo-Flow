-- Production Remediation Migration
-- Migration: 20260918000000_production_remediation.sql
-- Resolves:
-- 1. [SEC-001] Revoke direct table INSERT/UPDATE on user_streaks and user_progress from authenticated.
-- 2. [SEC-001] Convert touch_user_streak() to SECURITY DEFINER and add mark_user_progress_completed().
-- 3. [FUNC-001] Support timezone-aware streak calculations in touch_user_streak(p_timezone).
-- 4. [PERF-001] Provide get_user_dashboard_summary(p_user_id) for single-roundtrip dashboard loads.
-- 5. [PERF-002] Provide get_user_quiz_score_sum(p_user_id) for constant-time aggregated XP calculations.

begin;

-- ============================================================================
-- 1. SECURITY & AUTHORIZATION: Hardening RLS and Table Privileges (SEC-001)
-- ============================================================================

-- Revoke direct mutation rights on critical progress tracking tables
revoke insert, update, delete on table public.user_streaks from authenticated;
revoke insert, update, delete on table public.user_progress from authenticated;

-- Ensure authenticated role retains SELECT rights for read queries
grant select on table public.user_streaks to authenticated;
grant select on table public.user_progress to authenticated;

-- Update RLS policies to restrict direct operations to SELECT only
drop policy if exists authenticated_users_manage_own_streak on public.user_streaks;
drop policy if exists authenticated_users_manage_own_progress on public.user_progress;
drop policy if exists authenticated_users_read_own_streak on public.user_streaks;
drop policy if exists authenticated_users_read_own_progress on public.user_progress;

create policy authenticated_users_read_own_streak
  on public.user_streaks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy authenticated_users_read_own_progress
  on public.user_progress for select to authenticated
  using ((select auth.uid()) = user_id);

-- ============================================================================
-- 2. BUSINESS LOGIC RPC: Security Definer Streak Mutator (SEC-001, FUNC-001)
-- ============================================================================

create or replace function public.touch_user_streak(
  p_timezone text default 'UTC',
  p_domain text default 'dsa'
)
returns public.user_streaks
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  user_today date;
  safe_domain text := coalesce(nullif(btrim(p_domain), ''), 'dsa');
  result public.user_streaks;
begin
  if caller_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  -- Derive calendar date based on user's timezone if valid, falling back to UTC
  begin
    user_today := (now() at time zone coalesce(nullif(btrim(p_timezone), ''), 'UTC'))::date;
  exception when others then
    user_today := (now() at time zone 'UTC')::date;
  end;

  insert into public.user_streaks as streak (
    user_id, current_streak, max_streak, last_activity_date, last_domain
  )
  values (caller_id, 1, 1, user_today, safe_domain)
  on conflict (user_id) do update set
    current_streak = case
      when streak.last_activity_date = user_today then coalesce(streak.current_streak, 0)
      when streak.last_activity_date = user_today - 1 then coalesce(streak.current_streak, 0) + 1
      else 1
    end,
    max_streak = greatest(
      coalesce(streak.max_streak, 0),
      case
        when streak.last_activity_date = user_today then coalesce(streak.current_streak, 0)
        when streak.last_activity_date = user_today - 1 then coalesce(streak.current_streak, 0) + 1
        else 1
      end
    ),
    last_activity_date = user_today,
    last_domain = safe_domain
  returning * into result;

  return result;
end;
$$;

grant execute on function public.touch_user_streak(text, text) to authenticated;
revoke execute on function public.touch_user_streak(text, text) from public, anon;

-- ============================================================================
-- 3. BUSINESS LOGIC RPC: Security Definer Progress Marker (SEC-001)
-- ============================================================================

create or replace function public.mark_algorithm_completed(p_algorithm_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  norm_algo text := lower(btrim(p_algorithm_id));
begin
  if caller_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if norm_algo = '' or char_length(norm_algo) > 200 then
    raise exception 'algorithm id is required' using errcode = '22023';
  end if;

  insert into public.user_progress as progress (
    user_id, algorithm_id, status, completed_at
  )
  values (caller_id, norm_algo, 'completed', now())
  on conflict (user_id, algorithm_id) do update set
    status = 'completed',
    completed_at = coalesce(progress.completed_at, now());

  -- Append to activity timeline
  insert into public.activity_timeline (user_id, action_type, algorithm_id)
  values (caller_id, 'completed', norm_algo);

  perform public.touch_user_streak();
end;
$$;

grant execute on function public.mark_algorithm_completed(text) to authenticated;
revoke execute on function public.mark_algorithm_completed(text) from public, anon;

-- ============================================================================
-- 4. PERFORMANCE RPC: Consolidated Dashboard Summary (PERF-001)
-- ============================================================================

create or replace function public.get_user_dashboard_summary(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  v_streak record;
  v_profile record;
  v_completed_count integer;
  v_completed_ids jsonb;
  v_bookmarks_count integer;
  v_bookmark_ids jsonb;
  v_recent_activities jsonb;
  v_quiz_score_sum integer;
  v_daily_completed boolean := false;
  v_math_daily_completed boolean := false;
  v_today date := (now() at time zone 'UTC')::date;
begin
  if caller_id is null or caller_id <> p_user_id then
    raise exception 'unauthorized access' using errcode = '42501';
  end if;

  -- 1. Profile
  select id, username, first_name, last_name, full_name, avatar_url, email
  into v_profile
  from public.profiles
  where id = p_user_id;

  -- 2. Streak
  select current_streak, max_streak, last_activity_date
  into v_streak
  from public.user_streaks
  where user_id = p_user_id;

  -- 3. Completed algorithms
  select
    count(*)::integer,
    coalesce(jsonb_agg(algorithm_id), '[]'::jsonb)
  into v_completed_count, v_completed_ids
  from public.user_progress
  where user_id = p_user_id and status = 'completed';

  -- 4. Bookmarks
  select
    count(*)::integer,
    coalesce(jsonb_agg(algorithm_id), '[]'::jsonb)
  into v_bookmarks_count, v_bookmark_ids
  from public.bookmarks
  where user_id = p_user_id;

  -- 5. Recent 5 activities
  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  into v_recent_activities
  from (
    select id, action_type, algorithm_id, metadata, created_at
    from public.activity_timeline
    where user_id = p_user_id
    order by created_at desc
    limit 5
  ) t;

  -- 6. Quiz score sum
  select coalesce(sum(score), 0)::integer
  into v_quiz_score_sum
  from public.quiz_attempts
  where user_id = p_user_id;

  -- 7. Daily algorithm challenge completion
  select exists (
    select 1 from public.activity_timeline
    where user_id = p_user_id
      and action_type = 'daily_challenge'
      and created_at::date = v_today
  ) into v_daily_completed;

  -- 8. Mental math daily completion
  select exists (
    select 1 from public.mental_math_daily_attempts
    where user_id = p_user_id
      and challenge_date = v_today
  ) into v_math_daily_completed;

  return jsonb_build_object(
    'profile', row_to_json(v_profile),
    'streak', jsonb_build_object(
      'current_streak', coalesce(v_streak.current_streak, 0),
      'max_streak', coalesce(v_streak.max_streak, 0),
      'last_activity_date', v_streak.last_activity_date
    ),
    'completedCount', coalesce(v_completed_count, 0),
    'completedAlgorithmIds', coalesce(v_completed_ids, '[]'::jsonb),
    'bookmarksCount', coalesce(v_bookmarks_count, 0),
    'bookmarkAlgorithmIds', coalesce(v_bookmark_ids, '[]'::jsonb),
    'recentActivities', v_recent_activities,
    'quizScoreSum', coalesce(v_quiz_score_sum, 0),
    'dailyChallengeCompleted', v_daily_completed,
    'mentalMathDailyCompleted', v_math_daily_completed
  );
end;
$$;

grant execute on function public.get_user_dashboard_summary(uuid) to authenticated;
revoke execute on function public.get_user_dashboard_summary(uuid) from public, anon;

-- ============================================================================
-- 5. PERFORMANCE RPC: SQL Quiz Score Aggregation (PERF-002)
-- ============================================================================

create or replace function public.get_user_quiz_score_sum(p_user_id uuid)
returns integer
language sql
security definer
set search_path = ''
as $$
  select coalesce(sum(score), 0)::integer
  from public.quiz_attempts
  where user_id = p_user_id;
$$;

grant execute on function public.get_user_quiz_score_sum(uuid) to authenticated;
revoke execute on function public.get_user_quiz_score_sum(uuid) from public, anon;

-- ============================================================================
-- 6. OBSERVABILITY: In-House Application Error Logs Table (OPS-001)
-- ============================================================================

create table if not exists public.application_error_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  error_name text not null,
  error_message text not null,
  error_stack text,
  context jsonb default '{}'::jsonb,
  url text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.application_error_logs enable row level security;

drop policy if exists allow_insert_error_logs on public.application_error_logs;
create policy allow_insert_error_logs
  on public.application_error_logs for insert
  to authenticated, anon
  with check (true);

drop policy if exists allow_service_read_error_logs on public.application_error_logs;
create policy allow_service_read_error_logs
  on public.application_error_logs for select
  to service_role
  using (true);

grant insert on table public.application_error_logs to authenticated, anon;
create index if not exists idx_application_error_logs_created_at on public.application_error_logs(created_at desc);

-- ============================================================================
-- 7. HARDENING & OPTIMIZATION: Database Advisors Remediation
-- ============================================================================

-- Revoke execute on internal trigger functions from public and client roles
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
alter function public.handle_new_user() set search_path = '';

-- Covering indexes for unindexed foreign keys
create index if not exists idx_activity_timeline_user_id on public.activity_timeline(user_id);
create index if not exists idx_quiz_attempts_user_id on public.quiz_attempts(user_id);
create index if not exists idx_saved_visualizer_sessions_user_id on public.saved_visualizer_sessions(user_id);

commit;


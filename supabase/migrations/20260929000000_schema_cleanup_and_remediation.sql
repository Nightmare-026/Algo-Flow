-- Migration: 20260929000000_schema_cleanup_and_remediation.sql
-- Description: Clean up unused legacy catalog tables, remove duplicate user_preferences,
--              unify touch_user_streak overloads, and secure get_user_unified_xp against IDOR.

begin;

-- ============================================================================
-- 1. DROP UNUSED LEGACY CATALOG TABLES (Content is managed via TypeScript static catalog)
-- ============================================================================
-- Drop child step and code example tables first, followed by algorithms, operations, data structures, quizzes
drop table if exists public.algorithm_steps cascade;
drop table if exists public.code_examples cascade;
drop table if exists public.quizzes cascade;
drop table if exists public.algorithms cascade;
drop table if exists public.operations cascade;
drop table if exists public.data_structures cascade;

-- ============================================================================
-- 2. DUAL PREFERENCES CONSOLIDATION
-- ============================================================================
-- Migrate any records from user_preferences to preferences if preferences is empty for that user
do $$
begin
  if to_regclass('public.user_preferences') is not null and to_regclass('public.preferences') is not null then
    insert into public.preferences (id, theme, code_language)
    select 
      up.user_id,
      coalesce(up.theme, 'system'),
      coalesce(up.preferred_language, 'javascript')
    from public.user_preferences up
    where not exists (
      select 1 from public.preferences p where p.id = up.user_id
    )
    on conflict (id) do nothing;
  end if;
end $$;

drop table if exists public.user_preferences cascade;

-- ============================================================================
-- 3. USER STREAKS SCHEMA RECONCILIATION
-- ============================================================================
-- Ensure user_streaks has canonical columns without legacy aliases
do $$
begin
  -- If legacy column longest_streak exists and max_streak is missing, rename or populate
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'user_streaks' and column_name = 'longest_streak'
  ) then
    if not exists (
      select 1 from information_schema.columns 
      where table_schema = 'public' and table_name = 'user_streaks' and column_name = 'max_streak'
    ) then
      alter table public.user_streaks rename column longest_streak to max_streak;
    else
      update public.user_streaks 
      set max_streak = greatest(max_streak, longest_streak)
      where longest_streak is not null;
      alter table public.user_streaks drop column longest_streak;
    end if;
  end if;

  -- If legacy column last_active_date exists and last_activity_date is missing, rename or populate
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'user_streaks' and column_name = 'last_active_date'
  ) then
    if not exists (
      select 1 from information_schema.columns 
      where table_schema = 'public' and table_name = 'user_streaks' and column_name = 'last_activity_date'
    ) then
      alter table public.user_streaks rename column last_active_date to last_activity_date;
    else
      update public.user_streaks 
      set last_activity_date = coalesce(last_activity_date, last_active_date)
      where last_activity_date is null;
      alter table public.user_streaks drop column last_active_date;
    end if;
  end if;
end $$;

-- ============================================================================
-- 4. UNIFY TOUCH_USER_STREAK FUNCTION OVERLOADS
-- ============================================================================
-- Drop all conflicting overloads to eliminate ambiguity
drop function if exists public.touch_user_streak();
drop function if exists public.touch_user_streak(text);
drop function if exists public.touch_user_streak(text, text);

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
  tz text := coalesce(nullif(btrim(p_timezone), ''), 'UTC');
  current_local_date date;
  yesterday_local_date date;
  streak_row public.user_streaks;
  result public.user_streaks;
begin
  if caller_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  -- Validate timezone safely; fallback to UTC if invalid
  begin
    current_local_date := (timezone(tz, now()))::date;
  exception when others then
    tz := 'UTC';
    current_local_date := (timezone('UTC', now()))::date;
  end;

  yesterday_local_date := current_local_date - 1;

  insert into public.user_streaks as streak (
    user_id,
    current_streak,
    max_streak,
    last_activity_date,
    domain,
    updated_at
  )
  values (
    caller_id,
    1,
    1,
    current_local_date,
    coalesce(nullif(btrim(p_domain), ''), 'dsa'),
    now()
  )
  on conflict (user_id) do update
  set
    current_streak = case
      when streak.last_activity_date = current_local_date then streak.current_streak
      when streak.last_activity_date = yesterday_local_date then streak.current_streak + 1
      else 1
    end,
    max_streak = case
      when streak.last_activity_date = current_local_date then streak.max_streak
      when streak.last_activity_date = yesterday_local_date then greatest(streak.max_streak, streak.current_streak + 1)
      else greatest(streak.max_streak, 1)
    end,
    last_activity_date = current_local_date,
    domain = coalesce(nullif(btrim(p_domain), ''), streak.domain, 'dsa'),
    updated_at = now()
  returning streak.* into result;

  return result;
end;
$$;

revoke all on function public.touch_user_streak(text, text) from public, anon;
grant execute on function public.touch_user_streak(text, text) to authenticated;

-- ============================================================================
-- 5. SECURE GET_USER_UNIFIED_XP AGAINST IDOR (SEC-003)
-- ============================================================================
create or replace function public.get_user_unified_xp(p_user_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  target_user_id uuid;
  v_dsa_completed int := 0;
  v_quiz_score_sum int := 0;
  v_math_correct int := 0;
  v_daily_dsa_count int := 0;
  v_daily_math_count int := 0;
  v_dsa_xp int := 0;
  v_quiz_xp int := 0;
  v_math_xp int := 0;
  v_bonus_xp int := 0;
  v_total_xp int := 0;
begin
  if caller_id is null then
    return jsonb_build_object(
      'total_xp', 0,
      'dsa_xp', 0,
      'quiz_xp', 0,
      'math_xp', 0,
      'bonus_xp', 0
    );
  end if;

  -- Strictly prevent IDOR: user can only inspect their own XP ledger
  if p_user_id is not null and p_user_id <> caller_id then
    raise exception 'unauthorized: cannot access another user unified xp ledger' using errcode = '42501';
  end if;

  target_user_id := caller_id;

  -- 1. DSA completed algorithms (+100 XP each)
  select coalesce(count(*), 0) into v_dsa_completed
  from public.user_progress
  where user_id = target_user_id and status = 'completed';

  v_dsa_xp := v_dsa_completed * 100;

  -- 2. Quiz attempts (+10 XP per score point)
  select coalesce(sum(score), 0) into v_quiz_score_sum
  from public.quiz_attempts
  where user_id = target_user_id;

  v_quiz_xp := v_quiz_score_sum * 10;

  -- 3. Mental Math correct answers (+1 XP per correct answer)
  select coalesce(total_correct, 0) into v_math_correct
  from public.mental_math_user_stats
  where user_id = target_user_id;

  v_math_xp := v_math_correct;

  -- 4. Daily challenge bonuses (+30 XP for DSA daily, +40 XP for verified math daily)
  select coalesce(count(*), 0) into v_daily_dsa_count
  from public.activity_timeline
  where user_id = target_user_id
    and action_type = 'daily_completed';

  select coalesce(count(*), 0) into v_daily_math_count
  from public.mental_math_daily_attempts
  where user_id = target_user_id and verified = true;

  v_bonus_xp := (v_daily_dsa_count * 30) + (v_daily_math_count * 40);
  v_total_xp := v_dsa_xp + v_quiz_xp + v_math_xp + v_bonus_xp;

  return jsonb_build_object(
    'total_xp', v_total_xp,
    'dsa_xp', v_dsa_xp,
    'quiz_xp', v_quiz_xp,
    'math_xp', v_math_xp,
    'bonus_xp', v_bonus_xp,
    'dsa_completed', v_dsa_completed,
    'quiz_score_sum', v_quiz_score_sum,
    'math_correct', v_math_correct
  );
end;
$$;

revoke all on function public.get_user_unified_xp(uuid) from public, anon;
grant execute on function public.get_user_unified_xp(uuid) to authenticated;

commit;

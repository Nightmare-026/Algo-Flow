-- Migration: 006_unified_learning_contract.sql
-- Description: Normalizes activity timeline domains, unifies platform streak tracking across DSA and Mental Math,
-- provides authentic user XP ledger calculation, and secures table privileges.

begin;

-- 1. Extend activity_timeline with domain classification
alter table public.activity_timeline
  add column if not exists domain text not null default 'dsa';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'activity_timeline_domain_check'
  ) then
    alter table public.activity_timeline
      add constraint activity_timeline_domain_check
      check (domain in ('dsa', 'mental_math'));
  end if;
end;
$$;

-- Backfill existing mental math entries in activity_timeline
update public.activity_timeline
set domain = 'mental_math'
where algorithm_id like 'mental_math%' or domain is null;

-- Index for domain-filtered timeline queries
create index if not exists idx_activity_timeline_user_domain_created
  on public.activity_timeline (user_id, domain, created_at desc);

-- 2. Ensure user_streaks has domain tracking column
alter table public.user_streaks
  add column if not exists last_domain text default 'dsa';

-- 3. Unified Streak RPC supporting both DSA and Mental Math
create or replace function public.touch_user_streak(p_domain text default 'dsa')
returns public.user_streaks
language plpgsql
security invoker
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  result public.user_streaks;
  safe_domain text := coalesce(nullif(btrim(p_domain), ''), 'dsa');
begin
  if caller_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  insert into public.user_streaks as streak (
    user_id, current_streak, max_streak, last_activity_date, last_domain
  )
  values (caller_id, 1, 1, current_date, safe_domain)
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
    last_activity_date = current_date,
    last_domain = safe_domain
  returning * into result;

  return result;
end;
$$;

-- 4. Unified Authentic XP calculation function
create or replace function public.get_user_unified_xp(p_user_id uuid default null)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_user_id uuid := coalesce(p_user_id, (select auth.uid()));
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
  if target_user_id is null then
    return jsonb_build_object(
      'total_xp', 0,
      'dsa_xp', 0,
      'quiz_xp', 0,
      'math_xp', 0,
      'bonus_xp', 0
    );
  end if;

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

-- 5. Privileges and Access Control
grant execute on function public.touch_user_streak(text) to authenticated;
grant execute on function public.get_user_unified_xp(uuid) to authenticated;
grant select, insert, update on table public.user_preferences to authenticated;
grant select, insert, update on table public.preferences to authenticated;

commit;

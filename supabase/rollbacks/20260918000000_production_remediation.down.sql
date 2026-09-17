-- Rollback Migration for 20260918000000_production_remediation.sql

begin;

drop table if exists public.application_error_logs cascade;
drop function if exists public.get_user_quiz_score_sum(uuid);
drop function if exists public.get_user_dashboard_summary(uuid);
drop function if exists public.mark_algorithm_completed(text);

-- Revert touch_user_streak to security invoker without timezone param
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

drop policy if exists authenticated_users_read_own_streak on public.user_streaks;
drop policy if exists authenticated_users_read_own_progress on public.user_progress;

create policy authenticated_users_manage_own_progress
  on public.user_progress for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy authenticated_users_manage_own_streak
  on public.user_streaks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on table public.user_progress, public.user_streaks to authenticated;

commit;

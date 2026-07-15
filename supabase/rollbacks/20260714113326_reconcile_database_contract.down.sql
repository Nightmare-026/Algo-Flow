-- Compatibility down migration for 20260714113326_reconcile_database_contract.sql.
-- Prefer an application rollback and keep the forward-compatible DB hardening.
-- Run this only before non-UUID session algorithm IDs have been written.

begin;

do $$
begin
  if exists (
    select 1
    from public.saved_visualizer_sessions
    where algorithm_id is not null
      and algorithm_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  ) then
    raise exception 'rollback refused: non-UUID saved-session algorithm identifiers would be lost';
  end if;
end;
$$;

drop function if exists public.record_quiz_attempt(text, integer, integer);
drop function if exists public.mark_algorithm_completed(text);
drop function if exists public.touch_user_streak();

alter table public.user_progress
  drop constraint if exists user_progress_algorithm_id_not_blank_v2;
alter table public.bookmarks
  drop constraint if exists bookmarks_algorithm_id_not_blank_v2;
alter table public.saved_visualizer_sessions
  drop constraint if exists saved_sessions_algorithm_id_not_blank_v2;
alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_score_valid_v2;
alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_algorithm_id_not_blank_v2;
alter table public.activity_timeline
  drop constraint if exists activity_algorithm_id_not_blank_v2;

drop index if exists public.saved_visualizer_sessions_user_id_idx;
drop index if exists public.quiz_attempts_user_id_idx;
drop index if exists public.activity_timeline_user_id_created_at_idx;

alter table public.saved_visualizer_sessions
  alter column algorithm_id type uuid using algorithm_id::uuid;
alter table public.saved_visualizer_sessions alter column user_id drop not null;

-- Restore the audited pre-migration auth hook. Optimized RLS policies and
-- least-privilege grants stay in place; reopening broad access is unsafe.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'first_name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    username = excluded.username,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$;

revoke all on function public.handle_new_user()
  from public, anon, authenticated, service_role;
grant execute on function public.handle_new_user() to supabase_auth_admin;

commit;

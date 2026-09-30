-- Rollback: 20260929000000_schema_cleanup_and_remediation.down.sql
-- Description: Reverts the schema cleanup migration by restoring user_preferences and legacy definitions if necessary.

begin;

-- 1. Restore user_preferences table structure
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text default 'system',
  preferred_language text default 'javascript',
  sound_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_preferences enable row level security;
drop policy if exists "Users can manage their own user_preferences" on public.user_preferences;
create policy "Users can manage their own user_preferences"
  on public.user_preferences
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on table public.user_preferences to authenticated;

-- Populate user_preferences from preferences if available
insert into public.user_preferences (user_id, theme, preferred_language, sound_enabled, created_at, updated_at)
select 
  p.user_id,
  coalesce(p.theme, 'system'),
  coalesce(p.code_language, 'javascript'),
  coalesce(p.sound_enabled, false),
  coalesce(p.created_at, now()),
  coalesce(p.updated_at, now())
from public.preferences p
on conflict (user_id) do nothing;

commit;

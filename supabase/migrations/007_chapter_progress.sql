-- Migration: 007_chapter_progress.sql
-- Description: Creates chapter_progress table for cloud synchronization of curriculum completion across devices.

begin;

create table if not exists public.chapter_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_slug text not null,
  chapter_slug text not null,
  completed boolean not null default true,
  completed_at timestamptz not null default now(),
  constraint uq_user_module_chapter unique (user_id, module_slug, chapter_slug)
);

-- Enable Row Level Security (RLS)
alter table public.chapter_progress enable row level security;

-- RLS Policies
create policy "Users can view own chapter progress"
  on public.chapter_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own chapter progress"
  on public.chapter_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chapter progress"
  on public.chapter_progress
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own chapter progress"
  on public.chapter_progress
  for delete
  using (auth.uid() = user_id);

-- Indexes for performant lookup
create index if not exists idx_chapter_progress_user_lookup
  on public.chapter_progress (user_id, module_slug, chapter_slug);

create index if not exists idx_chapter_progress_completed_at
  on public.chapter_progress (user_id, completed_at desc);

commit;

-- Migration: 004_mental_math.sql
-- Description: Creates tables and RLS policies for Mental Math training, user stats, daily attempts, and mastery
-- Applied to remote Supabase project: mylzlhevgffgkwpeerzh

begin;

create table if not exists public.mental_math_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null,
  operation text not null,
  difficulty text not null,
  total_questions integer not null,
  correct_count integer not null,
  accuracy_percentage numeric(5,2) not null,
  total_time_ms integer not null,
  average_solve_time_ms integer not null,
  final_score integer not null,
  max_combo integer not null default 0,
  hints_used integer not null default 0,
  answers jsonb default '[]'::jsonb,
  score_version text not null default 'v1.0.0',
  generator_version text not null default 'v1.0.0',
  created_at timestamptz default now()
);

create table if not exists public.mental_math_daily_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_date date not null,
  score integer not null,
  accuracy numeric(5,2) not null,
  solve_time_ms integer not null,
  verified boolean default true,
  created_at timestamptz default now(),
  unique (user_id, challenge_date)
);

create table if not exists public.mental_math_user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_sessions_completed integer not null default 0,
  total_questions_solved integer not null default 0,
  total_correct integer not null default 0,
  overall_accuracy numeric(5,2) not null default 0,
  current_streak_days integer not null default 0,
  max_streak_days integer not null default 0,
  highest_score integer not null default 0,
  highest_combo integer not null default 0,
  fastest_speed_qpm numeric(6,2) not null default 0,
  best_daily_score integer not null default 0,
  last_played_date date,
  updated_at timestamptz default now()
);

create table if not exists public.mental_math_mastery (
  user_id uuid not null references auth.users(id) on delete cascade,
  operation text not null,
  level integer not null default 0,
  total_attempts integer not null default 0,
  total_correct integer not null default 0,
  accuracy numeric(5,2) not null default 0,
  average_speed_ms integer not null default 0,
  by_digit_complexity jsonb default '{}'::jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, operation)
);

-- Indexes
create index if not exists mental_math_sessions_user_id_idx
  on public.mental_math_sessions (user_id, created_at desc);

create index if not exists mental_math_daily_date_score_idx
  on public.mental_math_daily_attempts (challenge_date, score desc);

create index if not exists mental_math_mastery_user_op_idx
  on public.mental_math_mastery (user_id, operation);

-- Enable RLS
alter table public.mental_math_sessions enable row level security;
alter table public.mental_math_daily_attempts enable row level security;
alter table public.mental_math_user_stats enable row level security;
alter table public.mental_math_mastery enable row level security;

-- Policies for mental_math_sessions
create policy "Users can read own sessions"
  on public.mental_math_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.mental_math_sessions for insert
  with check (auth.uid() = user_id);

-- Policies for mental_math_daily_attempts
create policy "Anyone can read daily attempts for leaderboard"
  on public.mental_math_daily_attempts for select
  using (true);

create policy "Users can insert own daily attempt"
  on public.mental_math_daily_attempts for insert
  with check (auth.uid() = user_id);

-- Policies for mental_math_user_stats
create policy "Users can read own user stats"
  on public.mental_math_user_stats for select
  using (auth.uid() = user_id);

create policy "Users can insert own user stats"
  on public.mental_math_user_stats for insert
  with check (auth.uid() = user_id);

create policy "Users can update own user stats"
  on public.mental_math_user_stats for update
  using (auth.uid() = user_id);

-- Policies for mental_math_mastery
create policy "Users can manage own mastery"
  on public.mental_math_mastery for all
  using (auth.uid() = user_id);

commit;

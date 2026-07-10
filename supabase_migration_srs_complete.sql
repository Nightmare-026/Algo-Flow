-- Algo Flow SRS Complete Schema Migration
-- Excludes profiles as it is already created
-- Includes IF NOT EXISTS to prevent errors if tables are already present

-- user_preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  preferred_language text default 'English',
  preferred_code_language text default 'Python',
  theme text default 'dark_neon',
  animation_speed text default 'normal',
  reduced_motion boolean default false,
  difficulty_level text default 'beginner',
  default_visualizer_mode text default 'visual_first',
  updated_at timestamptz default now()
);

-- data_structures
CREATE TABLE IF NOT EXISTS public.data_structures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  description text,
  difficulty text,
  display_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- operations
CREATE TABLE IF NOT EXISTS public.operations (
  id uuid primary key default gen_random_uuid(),
  data_structure_id uuid references public.data_structures(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  display_order int default 0,
  is_published boolean default true,
  unique(data_structure_id, slug)
);

-- algorithms
CREATE TABLE IF NOT EXISTS public.algorithms (
  id uuid primary key default gen_random_uuid(),
  operation_id uuid references public.operations(id) on delete cascade,
  name text not null,
  slug text not null unique,
  difficulty text,
  time_complexity_best text,
  time_complexity_average text,
  time_complexity_worst text,
  space_complexity text,
  short_description text,
  long_description text,
  prerequisites text[],
  tags text[],
  visualizer_type text,
  priority text default 'P1',
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- algorithm_steps
CREATE TABLE IF NOT EXISTS public.algorithm_steps (
  id uuid primary key default gen_random_uuid(),
  algorithm_id uuid references public.algorithms(id) on delete cascade,
  step_number int not null,
  title text,
  explanation text not null,
  visual_action jsonb,
  pseudocode_line int,
  code_line int,
  created_at timestamptz default now(),
  unique(algorithm_id, step_number)
);

-- code_examples
CREATE TABLE IF NOT EXISTS public.code_examples (
  id uuid primary key default gen_random_uuid(),
  algorithm_id uuid references public.algorithms(id) on delete cascade,
  language text not null check (language in ('cpp', 'java', 'python', 'javascript', 'typescript')),
  code text not null,
  explanation text,
  is_primary boolean default false,
  created_at timestamptz default now(),
  unique(algorithm_id, language)
);

-- user_progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  algorithm_id uuid references public.algorithms(id) on delete cascade,
  status text default 'not_started' check (status in ('not_started', 'in_progress', 'completed', 'needs_revision')),
  completion_percentage int default 0 check (completion_percentage between 0 and 100),
  time_spent_seconds int default 0,
  practice_accuracy numeric(5,2),
  last_practiced_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, algorithm_id)
);

-- user_streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_streak int default 0,
  longest_streak int default 0,
  last_active_date date,
  daily_goal_completed boolean default false,
  updated_at timestamptz default now()
);

-- bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  bookmark_type text not null check (bookmark_type in ('algorithm', 'step', 'code', 'session')),
  data_structure_id uuid references public.data_structures(id) on delete set null,
  operation_id uuid references public.operations(id) on delete set null,
  algorithm_id uuid references public.algorithms(id) on delete cascade,
  step_number int,
  title text not null,
  description text,
  serialized_state jsonb,
  created_at timestamptz default now()
);

-- saved_visualizer_sessions
CREATE TABLE IF NOT EXISTS public.saved_visualizer_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  algorithm_id uuid references public.algorithms(id) on delete cascade,
  title text,
  input_data jsonb not null,
  current_step int default 0,
  visual_state jsonb,
  speed text default 'normal',
  code_language text default 'python',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
  id uuid primary key default gen_random_uuid(),
  algorithm_id uuid references public.algorithms(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_answer text not null,
  explanation text,
  difficulty text default 'easy',
  is_published boolean default true,
  created_at timestamptz default now()
);

-- quiz_attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  algorithm_id uuid references public.algorithms(id) on delete cascade,
  selected_answer text,
  is_correct boolean,
  score int default 0,
  time_taken_seconds int,
  attempted_at timestamptz default now()
);

-- activity_logs / activity_timeline (API uses activity_timeline)
CREATE TABLE IF NOT EXISTS public.activity_timeline (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  action_type text not null,
  algorithm_id text, -- using text to match UUID or string from API
  created_at timestamptz default now()
);

-- RLS setup
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_visualizer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_timeline ENABLE ROW LEVEL SECURITY;

-- Actually, "FOR ALL USING (auth.uid() = user_id)" covers SELECT, UPDATE, DELETE.
-- For INSERT, we need "WITH CHECK". So let's make sure it's fully covered:
DROP POLICY IF EXISTS "Users can manage their own user_preferences" ON public.user_preferences;
CREATE POLICY "Users can manage their own user_preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own user_progress" ON public.user_progress;
CREATE POLICY "Users can manage their own user_progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own user_streaks" ON public.user_streaks;
CREATE POLICY "Users can manage their own user_streaks" ON public.user_streaks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own saved_visualizer_sessions" ON public.saved_visualizer_sessions;
CREATE POLICY "Users can manage their own saved_visualizer_sessions" ON public.saved_visualizer_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Users can manage their own quiz_attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own activity_timeline" ON public.activity_timeline;
CREATE POLICY "Users can manage their own activity_timeline" ON public.activity_timeline FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

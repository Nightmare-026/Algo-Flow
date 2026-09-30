-- Migration: 20261001000000_core_platform_remediation.sql
-- Description: Core platform remediation fixing streak overloads, session ID type, chapter progress, RLS performance, and preference normalization.

BEGIN;

-- 1. Resolve Ambiguous touch_user_streak Overloads
DROP FUNCTION IF EXISTS public.touch_user_streak(text);
DROP FUNCTION IF EXISTS public.touch_user_streak(text, text);

CREATE OR REPLACE FUNCTION public.touch_user_streak(
  p_timezone text DEFAULT 'UTC',
  p_domain text DEFAULT 'dsa'
)
RETURNS public.user_streaks
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  caller_id uuid := (SELECT auth.uid());
  user_today date;
  safe_domain text := coalesce(nullif(btrim(p_domain), ''), 'dsa');
  result public.user_streaks;
BEGIN
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'authentication required' USING errcode = '42501';
  END IF;

  BEGIN
    user_today := (now() AT TIME ZONE coalesce(nullif(btrim(p_timezone), ''), 'UTC'))::date;
  EXCEPTION WHEN OTHERS THEN
    user_today := (now() AT TIME ZONE 'UTC')::date;
  END;

  INSERT INTO public.user_streaks AS streak (
    user_id, current_streak, max_streak, last_activity_date, last_domain
  )
  VALUES (caller_id, 1, 1, user_today, safe_domain)
  ON CONFLICT (user_id) DO UPDATE SET
    current_streak = CASE
      WHEN streak.last_activity_date = user_today THEN coalesce(streak.current_streak, 0)
      WHEN streak.last_activity_date = user_today - 1 THEN coalesce(streak.current_streak, 0) + 1
      ELSE 1
    END,
    max_streak = greatest(
      coalesce(streak.max_streak, 0),
      CASE
        WHEN streak.last_activity_date = user_today THEN coalesce(streak.current_streak, 0)
        WHEN streak.last_activity_date = user_today - 1 THEN coalesce(streak.current_streak, 0) + 1
        ELSE 1
      END
    ),
    last_activity_date = user_today,
    last_domain = safe_domain
  RETURNING * INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.touch_user_streak(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.touch_user_streak(text, text) TO authenticated;

-- 2. Fix saved_visualizer_sessions.algorithm_id column type
ALTER TABLE public.saved_visualizer_sessions 
  ALTER COLUMN algorithm_id TYPE text USING algorithm_id::text;

-- 3. Create chapter_progress table with RLS and compound indexes
CREATE TABLE IF NOT EXISTS public.chapter_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_slug text NOT NULL,
  chapter_slug text NOT NULL,
  completed boolean NOT NULL DEFAULT true,
  completed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_module_chapter UNIQUE (user_id, module_slug, chapter_slug)
);

ALTER TABLE public.chapter_progress ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chapter_progress' AND policyname = 'Users can view own chapter progress'
  ) THEN
    CREATE POLICY "Users can view own chapter progress"
      ON public.chapter_progress FOR SELECT
      USING ((SELECT auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chapter_progress' AND policyname = 'Users can insert own chapter progress'
  ) THEN
    CREATE POLICY "Users can insert own chapter progress"
      ON public.chapter_progress FOR INSERT
      WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chapter_progress' AND policyname = 'Users can update own chapter progress'
  ) THEN
    CREATE POLICY "Users can update own chapter progress"
      ON public.chapter_progress FOR UPDATE
      USING ((SELECT auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chapter_progress' AND policyname = 'Users can delete own chapter progress'
  ) THEN
    CREATE POLICY "Users can delete own chapter progress"
      ON public.chapter_progress FOR DELETE
      USING ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_chapter_progress_user_lookup
  ON public.chapter_progress (user_id, module_slug, chapter_slug);

CREATE INDEX IF NOT EXISTS idx_chapter_progress_completed_at
  ON public.chapter_progress (user_id, completed_at DESC);

-- 4. Normalize Preferences Table
ALTER TABLE public.preferences 
  ADD COLUMN IF NOT EXISTS reduced_motion boolean NOT NULL DEFAULT false;

DROP TABLE IF EXISTS public.user_preferences CASCADE;

-- 5. Covering Index for Error Logs
CREATE INDEX IF NOT EXISTS idx_application_error_logs_user_id 
  ON public.application_error_logs(user_id);

-- 6. Optimize RLS Policies to use (SELECT auth.uid())
DROP POLICY IF EXISTS "Users can manage their own user_progress" ON public.user_progress;
DROP POLICY IF EXISTS "authenticated_users_read_own_progress" ON public.user_progress;
CREATE POLICY "user_progress_manage" ON public.user_progress
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage their own user_streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "authenticated_users_read_own_streak" ON public.user_streaks;
CREATE POLICY "user_streaks_manage" ON public.user_streaks
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can view their own preferences." ON public.preferences;
CREATE POLICY "Users can view their own preferences." ON public.preferences
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update their own preferences." ON public.preferences;
CREATE POLICY "Users can update their own preferences." ON public.preferences
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can manage their own saved_visualizer_sessions" ON public.saved_visualizer_sessions;
CREATE POLICY "Users can manage their own saved_visualizer_sessions" ON public.saved_visualizer_sessions
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage their own quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Users can manage their own quiz_attempts" ON public.quiz_attempts
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage their own activity_timeline" ON public.activity_timeline;
CREATE POLICY "Users can manage their own activity_timeline" ON public.activity_timeline
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own feedback" ON public.feedback;
CREATE POLICY "Users can read own feedback" ON public.feedback
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own daily attempt" ON public.mental_math_daily_attempts;
CREATE POLICY "Users can insert own daily attempt" ON public.mental_math_daily_attempts
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own user stats" ON public.mental_math_user_stats;
CREATE POLICY "Users can insert own user stats" ON public.mental_math_user_stats
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own user stats" ON public.mental_math_user_stats;
CREATE POLICY "Users can read own user stats" ON public.mental_math_user_stats
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own user stats" ON public.mental_math_user_stats;
CREATE POLICY "Users can update own user stats" ON public.mental_math_user_stats
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own mastery" ON public.mental_math_mastery;
CREATE POLICY "Users can manage own mastery" ON public.mental_math_mastery
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON public.mental_math_sessions;
CREATE POLICY "Users can insert own sessions" ON public.mental_math_sessions
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own sessions" ON public.mental_math_sessions;
CREATE POLICY "Users can read own sessions" ON public.mental_math_sessions
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

COMMIT;

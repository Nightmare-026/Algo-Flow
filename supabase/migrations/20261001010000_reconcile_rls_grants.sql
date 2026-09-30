-- Migration: 20261001010000_reconcile_rls_grants.sql
-- Description: Reconcile RLS policies on user_progress and user_streaks to restrict direct INSERT/UPDATE tampering while preserving SELECT and DELETE (GDPR). Channel state mutations through SECURITY DEFINER RPCs.

BEGIN;

-- 1. Restrict direct mutations on user_progress
DROP POLICY IF EXISTS "user_progress_manage" ON public.user_progress;
DROP POLICY IF EXISTS "Users can manage their own user_progress" ON public.user_progress;
DROP POLICY IF EXISTS "authenticated_users_read_own_progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can select own user_progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete own user_progress" ON public.user_progress;

CREATE POLICY "Users can select own user_progress" ON public.user_progress
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own user_progress" ON public.user_progress
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- 2. Restrict direct mutations on user_streaks
DROP POLICY IF EXISTS "user_streaks_manage" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can manage their own user_streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "authenticated_users_read_own_streak" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can select own user_streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can delete own user_streaks" ON public.user_streaks;

CREATE POLICY "Users can select own user_streaks" ON public.user_streaks
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own user_streaks" ON public.user_streaks
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- 3. Ensure RPC execution privileges are securely scoped
REVOKE ALL ON FUNCTION public.mark_algorithm_completed(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.mark_algorithm_completed(text) TO authenticated;

REVOKE ALL ON FUNCTION public.touch_user_streak(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.touch_user_streak(text, text) TO authenticated;

COMMIT;

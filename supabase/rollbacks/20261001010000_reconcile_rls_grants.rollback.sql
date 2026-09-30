-- Rollback: 20261001010000_reconcile_rls_grants.rollback.sql
-- Description: Revert RLS policy restrictions on user_progress and user_streaks back to user_progress_manage and user_streaks_manage.

BEGIN;

DROP POLICY IF EXISTS "Users can select own user_progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete own user_progress" ON public.user_progress;

CREATE POLICY "user_progress_manage" ON public.user_progress
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can select own user_streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can delete own user_streaks" ON public.user_streaks;

CREATE POLICY "user_streaks_manage" ON public.user_streaks
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

COMMIT;

-- Rollback: 20261001000000_rollback.sql
-- Description: Rollback script for core platform remediation.

BEGIN;

-- Revert saved_visualizer_sessions.algorithm_id to uuid (if safe)
-- Note: Reverting to uuid will fail if records with non-UUID slug exist.

-- Drop chapter_progress
DROP TABLE IF EXISTS public.chapter_progress CASCADE;

-- Drop covering index on application_error_logs
DROP INDEX IF EXISTS public.idx_application_error_logs_user_id;

-- Remove reduced_motion column from preferences
ALTER TABLE public.preferences DROP COLUMN IF EXISTS reduced_motion;

COMMIT;

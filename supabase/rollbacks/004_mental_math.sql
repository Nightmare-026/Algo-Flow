-- Rollback: 004_mental_math.sql
-- Description: Drops tables created for Mental Math

begin;

drop table if exists public.mental_math_mastery;
drop table if exists public.mental_math_daily_attempts;
drop table if exists public.mental_math_sessions;

commit;

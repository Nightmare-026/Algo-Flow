-- Run this in your Supabase SQL Editor to complete Phase 10 Migration

-- Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  algorithm_id text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own quiz attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id);

-- Daily Challenges Table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_date date UNIQUE NOT NULL,
  algorithm_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- We want daily challenges to be readable by anyone (or any authenticated user)
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read daily challenges" ON public.daily_challenges FOR SELECT USING (true);

"use server";

import { createClient } from "@/lib/supabase/server";
import { updateStreakOnActivity } from "./streak";

export type QuizAttempt = {
  id: string;
  user_id: string;
  algorithm_id: string;
  score: number;
  total_questions: number;
  created_at: string;
};

export async function submitQuizAttempt(algorithmId: string, score: number, totalQuestions: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: user.id,
      algorithm_id: algorithmId,
      score,
      total_questions: totalQuestions,
    })
    .select()
    .single();

  if (!error && data) {
    // Record in activity timeline
    await supabase.from("activity_timeline").insert({
      user_id: user.id,
      action_type: "quiz_completed",
      algorithm_id: algorithmId,
      metadata: { score, total_questions: totalQuestions },
    });

    // If score is good enough (e.g., > 60%), update streak
    if (score / totalQuestions >= 0.6) {
      await updateStreakOnActivity();
    }
  }

  return data;
}

export async function getQuizAttempts(): Promise<QuizAttempt[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as QuizAttempt[]) || [];
}

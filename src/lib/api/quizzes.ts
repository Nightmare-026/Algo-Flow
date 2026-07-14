"use server";

import { createClient } from "@/lib/supabase/server";

export type QuizAttempt = {
  id: string;
  user_id: string;
  algorithm_id: string;
  score: number;
  total_questions: number;
  created_at: string;
};

export async function submitQuizAttempt(
  algorithmId: string,
  score: number,
  totalQuestions: number
): Promise<QuizAttempt | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  if (totalQuestions <= 0 || score < 0 || score > totalQuestions) {
    throw new Error("Invalid quiz score.");
  }

  const { data, error } = await supabase.rpc("record_quiz_attempt", {
    p_algorithm_id: algorithmId,
    p_score: score,
    p_total_questions: totalQuestions,
  });

  if (error) throw new Error("Quiz attempt could not be saved.");

  return data?.[0] ?? null;
}

export async function getQuizAttempts(): Promise<QuizAttempt[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Quiz attempts could not be loaded.");

  return data ?? [];
}

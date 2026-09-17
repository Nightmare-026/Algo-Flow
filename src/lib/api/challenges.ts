"use server";

import { createClient } from "@/lib/supabase/server";
import { algorithms } from "@/data/seed/algorithms";

export type DailyChallenge = {
  id: string;
  challenge_date: string;
  algorithm_id: string;
};

// Deterministic pseudo-random generator seeded by a date string (YYYY-MM-DD)
function getAlgorithmIdForDate(dateStr: string): string {
  const publishedAlgos = algorithms.filter((a) => a.isPublished);
  if (publishedAlgos.length === 0) return "";

  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % publishedAlgos.length;
  return publishedAlgos[index].id;
}

/**
 * Fetches the daily algorithm challenge, prioritizing the database table
 * with seamless fallback to deterministic daily calculation.
 */
export async function getDailyChallenge(): Promise<DailyChallenge | null> {
  const todayStr = new Date().toISOString().split("T")[0];
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .from("daily_challenges")
      .select("id, challenge_date, algorithm_id")
      .eq("challenge_date", todayStr)
      .maybeSingle();

    if (data && data.algorithm_id) {
      return {
        id: data.id,
        challenge_date: data.challenge_date,
        algorithm_id: data.algorithm_id,
      };
    }
  } catch {
    // Database query failed or table unseeded, fall through to deterministic PRNG
  }

  const algoId = getAlgorithmIdForDate(todayStr);
  if (!algoId) return null;

  return {
    id: `challenge-${todayStr}`,
    challenge_date: todayStr,
    algorithm_id: algoId,
  };
}

export async function isChallengeCompleted(algorithmId: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const todayStr = new Date().toISOString().split("T")[0];
  const startOfDay = new Date(todayStr).toISOString();

  try {
    const { data, error } = await supabase
      .from("activity_timeline")
      .select("id")
      .eq("user_id", user.id)
      .eq("algorithm_id", algorithmId)
      .gte("created_at", startOfDay)
      .in("action_type", ["completed", "quiz_completed", "daily_completed"])
      .limit(1);

    if (error) return false;
    return (data?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Checks if the user completed today's Mental Math daily sprint.
 */
export async function isMentalMathDailyCompleted(dateStr?: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const targetDate = dateStr || new Date().toISOString().split("T")[0];
  try {
    const { data } = await supabase
      .from("mental_math_daily_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("challenge_date", targetDate)
      .maybeSingle();

    return !!data;
  } catch {
    return false;
  }
}

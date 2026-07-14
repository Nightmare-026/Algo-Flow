"use server";

import { createClient } from "@/lib/supabase/server";
import { algorithms } from "@/data/seed/algorithms";

export type DailyChallenge = {
  id: string;
  challenge_date: string;
  algorithm_id: string;
};

// Simple pseudo-random generator seeded by a date string (YYYY-MM-DD)
// This guarantees the same algorithm is chosen on the same day for all users,
// even if we don't have it explicitly seeded in the DB for some reason.
function getAlgorithmIdForDate(dateStr: string): string {
  const publishedAlgos = algorithms.filter((a) => a.isPublished);
  if (publishedAlgos.length === 0) return "";

  // Hash the date string to a number
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % publishedAlgos.length;
  return publishedAlgos[index].id;
}

export async function getDailyChallenge(): Promise<DailyChallenge | null> {
  const todayStr = new Date().toISOString().split("T")[0];

  // In a robust implementation, we'd fetch from DB first.
  // But deterministic generation based on date is simple and effective for MVP.
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

  // Check if they completed a quiz or visualizer for this algo today
  const { data, error } = await supabase
    .from("activity_timeline")
    .select("id")
    .eq("user_id", user.id)
    .eq("algorithm_id", algorithmId)
    .gte("created_at", startOfDay)
    .in("action_type", ["completed", "quiz_completed"])
    .limit(1);

  if (error) throw new Error("Challenge status could not be loaded.");

  return (data?.length ?? 0) > 0;
}

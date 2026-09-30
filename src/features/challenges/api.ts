"use server";

import { createClient } from "@/lib/supabase/server";
import { publishedAlgorithms } from "@/lib/catalog";
import type { ActionResult } from "@/types";

export type DailyChallenge = {
  id: string;
  challenge_date: string;
  algorithm_id: string;
};

function getLocalDateString(timeZone: string = "UTC"): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

// Deterministic pseudo-random generator seeded by a date string (YYYY-MM-DD)
function getAlgorithmIdForDate(dateStr: string): string {
  if (publishedAlgorithms.length === 0) return "";

  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % publishedAlgorithms.length;
  return publishedAlgorithms[index].id;
}

/**
 * Fetches the daily algorithm challenge, prioritizing the database table
 * with seamless fallback to deterministic daily calculation in user timezone.
 */
export async function getDailyChallenge(clientTimezone?: string): Promise<DailyChallenge | null> {
  const todayStr = getLocalDateString(clientTimezone || "UTC");
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

export async function isChallengeCompleted(
  algorithmId: string,
  clientTimezone?: string
): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const todayStr = getLocalDateString(clientTimezone || "UTC");
  const startOfDay = `${todayStr}T00:00:00.000Z`;

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
export async function isMentalMathDailyCompleted(
  dateStr?: string,
  clientTimezone?: string
): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const targetDate = dateStr || getLocalDateString(clientTimezone || "UTC");
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

export async function getDailyChallengeAction(
  clientTimezone?: string
): Promise<ActionResult<DailyChallenge | null>> {
  try {
    const challenge = await getDailyChallenge(clientTimezone);
    return { ok: true, data: challenge };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to load daily challenge",
    };
  }
}

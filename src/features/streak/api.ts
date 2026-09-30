"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

export type UserStreak = {
  current_streak: number;
  max_streak: number;
  last_activity_date: string | null;
};

/**
 * Returns current date string formatted as YYYY-MM-DD in the target IANA timezone.
 */
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

export async function updateStreakOnActivity(
  domain: "dsa" | "mental_math" = "dsa",
  clientTimezone?: string
): Promise<UserStreak | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const timezone = clientTimezone || "UTC";

  const { data, error } = await supabase.rpc("touch_user_streak", {
    p_timezone: timezone,
    p_domain: domain,
  });

  if (error) {
    throw new Error(`Streak could not be updated: ${error.message}`);
  }

  return data
    ? {
        current_streak: data.current_streak ?? 0,
        max_streak: data.max_streak ?? 0,
        last_activity_date: data.last_activity_date,
      }
    : null;
}

export async function getStreak(clientTimezone?: string): Promise<UserStreak | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_streaks")
    .select("current_streak, max_streak, last_activity_date")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error("Streak could not be loaded.");
  if (!data) return null;

  const streak: UserStreak = {
    current_streak: data.current_streak ?? 0,
    max_streak: data.max_streak ?? 0,
    last_activity_date: data.last_activity_date,
  };

  const today = getLocalDateString(clientTimezone || "UTC");
  const lastActivityDateStr = streak.last_activity_date?.split("T")[0];
  if (lastActivityDateStr && lastActivityDateStr !== today) {
    const lastDate = new Date(lastActivityDateStr);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return { ...streak, current_streak: 0 };
    }
  }

  return streak;
}

export async function getStreakAction(
  clientTimezone?: string
): Promise<ActionResult<UserStreak | null>> {
  try {
    const streak = await getStreak(clientTimezone);
    return { ok: true, data: streak };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to load streak",
    };
  }
}

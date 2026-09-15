"use server";

import { createClient } from "@/lib/supabase/server";

export type UserStreak = {
  current_streak: number;
  max_streak: number;
  last_activity_date: string | null;
};

export async function updateStreakOnActivity(): Promise<UserStreak | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("touch_user_streak");
  if (error) throw new Error("Streak could not be updated.");

  return data
    ? {
        current_streak: data.current_streak ?? 0,
        max_streak: data.max_streak ?? 0,
        last_activity_date: data.last_activity_date,
      }
    : null;
}

export async function getStreak(): Promise<UserStreak | null> {
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

  const today = new Date().toISOString().split("T")[0];
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

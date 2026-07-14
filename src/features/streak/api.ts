"use server";

import { createClient } from "@/lib/supabase/server";

export type UserStreak = {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
};

export async function updateStreakOnActivity() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("touch_user_streak");

  if (error) throw new Error("Streak could not be updated.");

  return data;
}

export async function getStreak(): Promise<UserStreak | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak, last_active_date")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error("Streak could not be loaded.");

  if (data) {
    // Check if streak is broken (diff > 1 day)
    const todayStr = new Date().toISOString().split("T")[0];
    const lastDate = data.last_active_date;

    if (lastDate && lastDate !== todayStr) {
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(todayStr);
      const diffDays = Math.floor(
        (todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > 1) {
        // Return 0 current streak for UI if broken, without mutating DB until next activity
        return {
          ...data,
          current_streak: 0,
        };
      }
    }
  }

  return data;
}

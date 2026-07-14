"use server";

import { createClient } from "@/lib/supabase/server";

export type UserStreak = {
  current_streak: number;
  longest_streak: number;
  last_active_date: string; // ISO date string YYYY-MM-DD
};

export async function updateStreakOnActivity() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  // Fetch current streak
  const { data: streakData } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!streakData) {
    // First time activity
    await supabase.from("user_streaks").insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: todayStr,
    });
    return;
  }

  const lastDate = streakData.last_active_date;

  if (lastDate === todayStr) {
    // Already updated today
    return;
  }

  const lastDateObj = new Date(lastDate);
  const todayObj = new Date(todayStr);
  const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));

  let newCurrent = streakData.current_streak;
  if (diffDays === 1) {
    newCurrent += 1;
  } else {
    // Streak broken
    newCurrent = 1;
  }

  const newMax = Math.max(newCurrent, streakData.longest_streak);

  await supabase
    .from("user_streaks")
    .update({
      current_streak: newCurrent,
      longest_streak: newMax,
      last_active_date: todayStr,
    })
    .eq("user_id", user.id);
}

export async function getStreak(): Promise<UserStreak | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak, last_active_date")
    .eq("user_id", user.id)
    .single();

  if (data) {
    // Check if streak is broken (diff > 1 day)
    const todayStr = new Date().toISOString().split("T")[0];
    const lastDate = data.last_active_date;

    if (lastDate && lastDate !== todayStr) {
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(todayStr);
      const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // Return 0 current streak for UI if broken, without mutating DB until next activity
        return {
          ...data,
          current_streak: 0,
        };
      }
    }
  }

  return data as UserStreak | null;
}
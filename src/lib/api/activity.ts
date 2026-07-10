"use server";

import { createClient } from "@/lib/supabase/server";

export type ActivityItem = {
  id: string;
  action_type: "completed" | "bookmarked" | "saved_session" | "quiz_completed";
  algorithm_id: string;
  created_at: string;
};

export async function getActivityTimeline(limit: number = 10): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("activity_timeline")
    .select("id, action_type, algorithm_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as ActivityItem[]) || [];
}

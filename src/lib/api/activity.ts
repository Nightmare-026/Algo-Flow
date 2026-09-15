"use server";

import { createClient } from "@/lib/supabase/server";

export type ActivityItem = {
  id: string;
  action_type: "completed" | "bookmarked" | "saved_session" | "quiz_completed";
  algorithm_id: string;
  created_at: string | null;
  metadata?: Record<string, unknown> | null;
};

export type Activity = ActivityItem;

export async function getActivityTimeline(limit: number = 10): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const safeLimit = Number.isInteger(limit) ? Math.min(Math.max(limit, 1), 50) : 10;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("activity_timeline")
    .select("id, action_type, algorithm_id, created_at, metadata")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  if (error) throw new Error("Activity timeline could not be loaded.");

  return (data as ActivityItem[] | null) ?? [];
}

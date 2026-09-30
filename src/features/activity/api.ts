"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

export type ActivityItem = {
  id: string;
  domain?: "dsa" | "mental_math";
  action_type:
    | "completed"
    | "bookmarked"
    | "saved_session"
    | "quiz_completed"
    | "math_session_completed"
    | "daily_completed";
  algorithm_id: string;
  created_at: string | null;
  metadata?: Record<string, unknown> | null;
};

export type Activity = ActivityItem;

export async function getActivityTimeline(
  limit: number = 10,
  domainFilter?: "all" | "dsa" | "mental_math"
): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const safeLimit = Number.isInteger(limit) ? Math.min(Math.max(limit, 1), 50) : 10;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  let query = supabase
    .from("activity_timeline")
    .select("id, domain, action_type, algorithm_id, created_at, metadata")
    .eq("user_id", user.id);

  if (domainFilter && domainFilter !== "all") {
    query = query.eq("domain", domainFilter);
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(safeLimit);

  if (error) {
    // Gracefully handle if domain column not yet migrated
    const fallback = await supabase
      .from("activity_timeline")
      .select("id, action_type, algorithm_id, created_at, metadata")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(safeLimit);

    if (fallback.error) throw new Error("Activity timeline could not be loaded.");
    return (fallback.data as ActivityItem[]) ?? [];
  }

  return (data as ActivityItem[]) ?? [];
}

export async function getActivityTimelineAction(
  limit: number = 10,
  domainFilter?: "all" | "dsa" | "mental_math"
): Promise<ActionResult<ActivityItem[]>> {
  try {
    const activities = await getActivityTimeline(limit, domainFilter);
    return { ok: true, data: activities };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to load activity timeline",
    };
  }
}

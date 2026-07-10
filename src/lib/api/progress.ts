"use server";

import { createClient } from "@/lib/supabase/server";

export async function markCompleted(algorithmId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Insert progress (on conflict do nothing)
  const { error: progressError } = await supabase
    .from("user_progress")
    .upsert(
      { user_id: user.id, algorithm_id: algorithmId, status: "completed" },
      { onConflict: "user_id,algorithm_id" }
    );

  if (!progressError) {
    // Add to activity timeline
    await supabase.from("activity_timeline").insert({
      user_id: user.id,
      action_type: "completed",
      algorithm_id: algorithmId,
    });
    
    // Update streak
    const { updateStreakOnActivity } = await import("./streak");
    await updateStreakOnActivity();
  }

  return true;
}

export async function getCompletedAlgorithms(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("user_progress")
    .select("algorithm_id")
    .eq("user_id", user.id)
    .eq("status", "completed");

  return data?.map(row => row.algorithm_id) || [];
}

"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserActionResult } from "@/features/bookmarks/api";

export async function markCompleted(algorithmId: string): Promise<UserActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Log in to save progress." };
  }

  const { error } = await supabase.rpc("mark_algorithm_completed", {
    p_algorithm_id: algorithmId,
  });

  if (error) {
    return { ok: false, message: "Progress could not be saved." };
  }

  return { ok: true, message: "Progress saved." };
}

export async function getCompletedAlgorithms(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("user_progress")
    .select("algorithm_id")
    .eq("user_id", user.id)
    .eq("status", "completed");

  if (error) throw new Error("Completed algorithms could not be loaded.");

  return data?.map((row) => row.algorithm_id) ?? [];
}

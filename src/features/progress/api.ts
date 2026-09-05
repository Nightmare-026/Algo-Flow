"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserActionResult } from "@/features/bookmarks/api";
import { normalizeAlgorithmId } from "@/lib/validation/algorithm-id";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function markCompleted(algorithmId: string): Promise<UserActionResult> {
  const normalizedAlgorithmId = normalizeAlgorithmId(algorithmId);
  if (!normalizedAlgorithmId) {
    return { ok: false, message: "A valid algorithm is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Log in to save progress." };
  }

  const rateLimit = await checkRateLimit(`progress:${user.id}`, 30);
  if (!rateLimit.success) {
    return { ok: false, message: "Too many requests. Please wait a moment." };
  }

  const { error } = await supabase.rpc("mark_algorithm_completed", {
    p_algorithm_id: normalizedAlgorithmId,
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

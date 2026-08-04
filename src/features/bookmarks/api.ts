"use server";

import { createClient } from "@/lib/supabase/server";
import { normalizeAlgorithmId } from "@/lib/validation/algorithm-id";
import { checkRateLimit } from "@/lib/security/rate-limit";

export type UserActionResult = {
  ok: boolean;
  message: string;
  requiresAuth?: boolean;
};

export async function toggleBookmark(
  algorithmId: string,
  isBookmarked: boolean
): Promise<UserActionResult> {
  const normalizedAlgorithmId = normalizeAlgorithmId(algorithmId);
  if (!normalizedAlgorithmId) {
    return { ok: false, message: "A valid algorithm is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Log in to save bookmarks." };
  }

  const rateLimit = checkRateLimit(`bookmark:${user.id}`, 30);
  if (!rateLimit.success) {
    return { ok: false, message: "Too many requests. Please wait a moment." };
  }

  if (isBookmarked) {
    const { error } = await supabase.from("bookmarks").insert({
      user_id: user.id,
      algorithm_id: normalizedAlgorithmId,
    });

    if (error) {
      return { ok: false, message: "Bookmark could not be saved." };
    }

    const { error: activityError } = await supabase.from("activity_timeline").insert({
      user_id: user.id,
      action_type: "bookmarked",
      algorithm_id: normalizedAlgorithmId,
    });

    return {
      ok: true,
      message: activityError
        ? "Bookmark saved; activity could not be recorded."
        : "Bookmark saved.",
    };
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("algorithm_id", normalizedAlgorithmId);

  if (error) {
    return { ok: false, message: "Bookmark could not be removed." };
  }

  return { ok: true, message: "Bookmark removed." };
}

export async function getBookmarks(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("bookmarks")
    .select("algorithm_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Bookmarks could not be loaded.");

  return data?.flatMap((row) => (row.algorithm_id ? [row.algorithm_id] : [])) ?? [];
}

export type BookmarkAlgorithm = {
  id: string;
  slug: string;
  name: string;
};

"use server";

import { createClient } from "@/lib/supabase/server";

export type UserActionResult = {
  ok: boolean;
  message: string;
  requiresAuth?: boolean;
};

export async function toggleBookmark(
  algorithmId: string,
  isBookmarked: boolean
): Promise<UserActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Log in to save bookmarks." };
  }

  if (isBookmarked) {
    const { error } = await supabase
      .from("bookmarks")
      .insert({ user_id: user.id, algorithm_id: algorithmId });

    if (error) {
      return { ok: false, message: "Bookmark could not be saved." };
    }

    await supabase.from("activity_timeline").insert({
      user_id: user.id,
      action_type: "bookmarked",
      algorithm_id: algorithmId,
    });

    return { ok: true, message: "Bookmark saved." };
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("algorithm_id", algorithmId);

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

  const { data } = await supabase
    .from("bookmarks")
    .select("algorithm_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data?.map((row) => row.algorithm_id) || [];
}
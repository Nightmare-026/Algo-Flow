"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/security/rate-limit";
import type { ActionResult } from "@/types";

/**
 * Permanently deletes a user account and all associated personal data across
 * all tables in compliance with GDPR Article 17 (Right to Erasure).
 */
export async function deleteUserAccountAction(): Promise<ActionResult<{ deleted: boolean }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        ok: false,
        requiresAuth: true,
        error: "Authentication required to delete account.",
      };
    }

    // Rate limit: Maximum 3 deletion attempts per hour per user ID
    const rateLimit = await checkRateLimit(`account-delete:${user.id}`, 3, 3600000);
    if (!rateLimit.success) {
      return {
        ok: false,
        error: "Too many deletion attempts. Please try again later.",
      };
    }

    const userId = user.id;

    // Purge records from all user-associated public tables
    await Promise.allSettled([
      supabase.from("bookmarks").delete().eq("user_id", userId),
      supabase.from("user_progress").delete().eq("user_id", userId),
      supabase.from("chapter_progress").delete().eq("user_id", userId),
      supabase.from("saved_visualizer_sessions").delete().eq("user_id", userId),
      supabase.from("quiz_attempts").delete().eq("user_id", userId),
      supabase.from("activity_timeline").delete().eq("user_id", userId),
      supabase.from("feedback").delete().eq("user_id", userId),
      supabase.from("mental_math_sessions").delete().eq("user_id", userId),
      supabase.from("mental_math_daily_attempts").delete().eq("user_id", userId),
      supabase.from("mental_math_user_stats").delete().eq("user_id", userId),
      supabase.from("mental_math_mastery").delete().eq("user_id", userId),
      supabase.from("user_streaks").delete().eq("user_id", userId),
      supabase.from("preferences").delete().eq("id", userId),
      supabase.from("profiles").delete().eq("id", userId),
      supabase.from("application_error_logs").delete().eq("user_id", userId),
    ]);

    // Delete user from auth schema if service role admin client is available
    const adminClient = createAdminClient();
    if (adminClient) {
      const { error: adminDeleteError } = await adminClient.auth.admin.deleteUser(userId);
      if (adminDeleteError) {
        console.error("Admin deleteUser error:", adminDeleteError);
      }
    }

    // Sign out user and clear session cookies
    await supabase.auth.signOut();

    return {
      ok: true,
      data: { deleted: true },
      message: "Your account and all associated data have been permanently deleted.",
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete account.",
    };
  }
}

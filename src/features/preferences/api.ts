"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import type { ActionResult } from "@/types";

export type UserPreferences = {
  theme: string;
  code_language: string;
  speed: number;
  difficulty: string;
  reduced_motion?: boolean;
};

const ALLOWED_THEMES = new Set(["system", "light", "dark", "light-edu", "dark-neon"]);
const ALLOWED_LANGUAGES = new Set(["javascript", "typescript", "python", "java", "cpp"]);
const ALLOWED_DIFFICULTIES = new Set(["all", "easy", "medium", "hard"]);

const preferenceDefaults: UserPreferences = {
  theme: "system",
  code_language: "javascript",
  speed: 1,
  difficulty: "medium",
  reduced_motion: false,
};

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("preferences")
    .select("theme, code_language, speed, difficulty, reduced_motion")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error("Preferences could not be loaded.");
  if (!data) return preferenceDefaults;

  return {
    theme: data.theme ?? preferenceDefaults.theme,
    code_language: data.code_language ?? preferenceDefaults.code_language,
    speed: data.speed ?? preferenceDefaults.speed,
    difficulty: data.difficulty ?? preferenceDefaults.difficulty,
    reduced_motion: data.reduced_motion ?? preferenceDefaults.reduced_motion,
  };
}

export async function getUserPreferencesAction(): Promise<ActionResult<UserPreferences>> {
  try {
    const prefs = await getUserPreferences();
    if (!prefs) {
      return { ok: false, requiresAuth: true, message: "Authentication required" };
    }
    return { ok: true, data: prefs };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to load preferences",
    };
  }
}

export async function updateUserPreferences(updates: Partial<UserPreferences>): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const rateLimit = await checkRateLimit(`preferences:${user.id}`, 30);
  if (!rateLimit.success) {
    throw new Error("Too many requests. Please wait a moment.");
  }

  const sanitized: Partial<UserPreferences> = {};
  if (typeof updates.theme === "string" && ALLOWED_THEMES.has(updates.theme)) {
    sanitized.theme = updates.theme;
  }
  if (typeof updates.code_language === "string" && ALLOWED_LANGUAGES.has(updates.code_language)) {
    sanitized.code_language = updates.code_language;
  }
  if (
    typeof updates.speed === "number" &&
    Number.isFinite(updates.speed) &&
    updates.speed >= 0.25 &&
    updates.speed <= 4
  ) {
    sanitized.speed = updates.speed;
  }
  if (typeof updates.difficulty === "string" && ALLOWED_DIFFICULTIES.has(updates.difficulty)) {
    sanitized.difficulty = updates.difficulty;
  }
  if (typeof updates.reduced_motion === "boolean") {
    sanitized.reduced_motion = updates.reduced_motion;
  }

  if (Object.keys(sanitized).length === 0) {
    return true;
  }

  const { error } = await supabase.from("preferences").upsert(
    {
      id: user.id,
      ...sanitized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) throw new Error("Preferences could not be updated.");
  return true;
}

export async function updateUserPreferencesAction(
  updates: Partial<UserPreferences>
): Promise<ActionResult<void>> {
  try {
    await updateUserPreferences(updates);
    return { ok: true, message: "Preferences updated successfully." };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update preferences",
    };
  }
}

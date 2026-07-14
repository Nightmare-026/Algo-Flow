import { createClient } from "@/lib/supabase/server";

export type UserPreferences = {
  theme: string;
  preferred_language: string;
  preferred_code_language: string;
  animation_speed: string;
  reduced_motion: boolean;
  difficulty_level: string;
  default_visualizer_mode: string;
};

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_preferences")
    .select(
      "theme, preferred_language, preferred_code_language, animation_speed, reduced_motion, difficulty_level, default_visualizer_mode"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error("Preferences could not be loaded.");

  return data;
}

export async function updateUserPreferences(updates: Partial<UserPreferences>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("user_preferences")
    .upsert(
      { ...updates, user_id: user.id, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

  if (error) throw new Error("Preferences could not be updated.");
  return true;
}

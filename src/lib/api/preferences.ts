import { createClient } from "@/lib/supabase/server";

export type UserPreferences = {
  theme: string;
  code_language: string;
  speed: number;
  difficulty: string;
};

const preferenceDefaults: UserPreferences = {
  theme: "system",
  code_language: "javascript",
  speed: 1,
  difficulty: "medium",
};

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("preferences")
    .select("theme, code_language, speed, difficulty")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error("Preferences could not be loaded.");
  if (!data) return preferenceDefaults;

  return {
    theme: data.theme ?? preferenceDefaults.theme,
    code_language: data.code_language ?? preferenceDefaults.code_language,
    speed: data.speed ?? preferenceDefaults.speed,
    difficulty: data.difficulty ?? preferenceDefaults.difficulty,
  };
}

export async function updateUserPreferences(updates: Partial<UserPreferences>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("preferences").upsert(
    {
      id: user.id,
      ...updates,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) throw new Error("Preferences could not be updated.");
  return true;
}

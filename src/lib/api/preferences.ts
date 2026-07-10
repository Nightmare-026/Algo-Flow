import { createClient } from "@/lib/supabase/server";

export type UserPreferences = {
  theme: string;
  code_language: string;
  speed: number;
  difficulty: string;
};

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("preferences")
    .select("theme, code_language, speed, difficulty")
    .eq("id", user.id)
    .single();

  return data as UserPreferences;
}

export async function updateUserPreferences(updates: Partial<UserPreferences>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("preferences")
    .update(updates)
    .eq("id", user.id);

  if (error) throw error;
  return true;
}

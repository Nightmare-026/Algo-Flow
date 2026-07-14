"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserActionResult } from "@/features/bookmarks/api";

export type SavedSession = {
  id: string;
  algorithm_id: string;
  title: string;
  input_data: unknown;
  current_step: number;
  visual_state: unknown;
  speed: string;
  code_language: string;
  created_at: string;
  updated_at: string;
};

export type SaveSessionResult = UserActionResult & {
  data?: SavedSession;
};

export async function saveSession(
  algorithmId: string,
  title: string,
  inputData: unknown,
  currentStep: number,
  visualState: unknown,
  speed: string = "normal",
  codeLanguage: string = "python"
): Promise<SaveSessionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Log in to save sessions." };
  }

  const { data, error } = await supabase
    .from("saved_visualizer_sessions")
    .insert({
      user_id: user.id,
      algorithm_id: algorithmId,
      title,
      input_data: inputData,
      current_step: currentStep,
      visual_state: visualState,
      speed,
      code_language: codeLanguage,
    })
    .select()
    .single();

  if (error || !data) {
    return { ok: false, message: "Session could not be saved." };
  }

  await supabase.from("activity_timeline").insert({
    user_id: user.id,
    action_type: "saved_session",
    algorithm_id: algorithmId,
  });

  return { ok: true, message: "Session saved.", data: data as SavedSession };
}

export async function getSavedSessions(): Promise<SavedSession[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("saved_visualizer_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (data as SavedSession[]) || [];
}

export async function deleteSession(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  await supabase
    .from("saved_visualizer_sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  return true;
}
"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserActionResult } from "@/features/bookmarks/api";
import type { Json } from "@/types/database";

function toJson(value: unknown): Json {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) {
    throw new Error("Session state is not JSON serializable.");
  }

  return JSON.parse(serialized) as Json;
}

export type SavedSession = {
  id: string;
  algorithm_id: string | null;
  title: string | null;
  input_data: Json;
  current_step: number;
  visual_state: Json | null;
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
      input_data: toJson(inputData),
      current_step: currentStep,
      visual_state: toJson(visualState),
      speed,
      code_language: codeLanguage,
    })
    .select()
    .single();

  if (error || !data) {
    return { ok: false, message: "Session could not be saved." };
  }

  const { error: activityError } = await supabase.from("activity_timeline").insert({
    user_id: user.id,
    action_type: "saved_session",
    algorithm_id: algorithmId,
  });

  return {
    ok: true,
    message: activityError ? "Session saved; activity could not be recorded." : "Session saved.",
    data,
  };
}

export async function getSavedSessions(): Promise<SavedSession[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_visualizer_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error("Saved sessions could not be loaded.");

  return data ?? [];
}

export async function deleteSession(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("saved_visualizer_sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) return false;

  return data !== null;
}

"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserActionResult } from "@/features/bookmarks/api";
import type { Json } from "@/types/database";
import { normalizeAlgorithmId } from "@/lib/validation/algorithm-id";
import { checkRateLimit } from "@/lib/security/rate-limit";

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
  current_step: number | null;
  visual_state: Json | null;
  speed: string | null;
  code_language: string | null;
  created_at: string | null;
  updated_at: string | null;
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
  const normalizedAlgorithmId = normalizeAlgorithmId(algorithmId);
  if (!normalizedAlgorithmId || !Number.isInteger(currentStep) || currentStep < 0) {
    return { ok: false, message: "Session state is invalid." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Log in to save sessions." };
  }

  const rateLimit = checkRateLimit(`session:${user.id}`, 20);
  if (!rateLimit.success) {
    return { ok: false, message: "Too many requests. Please wait a moment." };
  }

  const { data, error } = await supabase
    .from("saved_visualizer_sessions")
    .insert({
      user_id: user.id,
      algorithm_id: normalizedAlgorithmId,
      title: title.trim().slice(0, 200),
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
    algorithm_id: normalizedAlgorithmId,
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

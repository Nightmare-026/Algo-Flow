"use server";

import { createClient } from "@/lib/supabase/server";
import { normalizeAlgorithmId } from "@/lib/validation/algorithm-id";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { publishedAlgorithms } from "@/lib/catalog";
import { getQuestionsForAlgorithm } from "@/data/seed/questions";
import type { ActionResult } from "@/types";

export type QuizAttempt = {
  id: string;
  user_id: string;
  algorithm_id: string;
  score: number;
  total_questions: number;
  created_at: string | null;
};

export type SubmittedQuizAnswer = {
  questionText: string;
  selectedOptionIndex: number;
};

export type EvaluatedQuizResult = {
  score: number;
  totalQuestions: number;
  passed: boolean;
  attempt: QuizAttempt | null;
};

/**
 * Server-authoritative quiz evaluation.
 * Calculates score entirely on the server using verified question banks, preventing
 * client score tampering or automated score spoofing.
 */
export async function submitEvaluatedQuizAttemptAction(
  algorithmId: string,
  answers: SubmittedQuizAnswer[]
): Promise<ActionResult<EvaluatedQuizResult>> {
  try {
    const normalizedAlgorithmId = normalizeAlgorithmId(algorithmId);
    if (!normalizedAlgorithmId) {
      return { ok: false, error: "Invalid algorithm." };
    }

    const algorithm = publishedAlgorithms.find(
      (alg) => alg.id === normalizedAlgorithmId || alg.slug === normalizedAlgorithmId
    );
    if (!algorithm) {
      return { ok: false, error: "Algorithm not found or unpublished." };
    }

    if (!Array.isArray(answers) || answers.length === 0 || answers.length > 50) {
      return { ok: false, error: "Invalid answers payload." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, requiresAuth: true, message: "Log in to save quiz scores." };
    }

    const rateLimit = await checkRateLimit(`quiz:${user.id}`, 30);
    if (!rateLimit.success) {
      return { ok: false, error: "Too many quiz requests. Please wait a moment." };
    }

    // Load canonical server questions for this algorithm
    const canonicalQuestions = getQuestionsForAlgorithm(
      algorithm.id,
      Math.max(answers.length, 5),
      algorithm.name,
      algorithm.slug
    );

    const questionMap = new Map(canonicalQuestions.map((q) => [q.q.trim(), q]));

    let verifiedScore = 0;
    for (const ans of answers) {
      const canonical = questionMap.get(ans.questionText.trim());
      if (canonical) {
        const correctIndex = canonical.correct.charCodeAt(0) - 65;
        if (ans.selectedOptionIndex === correctIndex) {
          verifiedScore += 1;
        }
      }
    }

    const totalQuestions = answers.length;
    const passed = totalQuestions > 0 && verifiedScore / totalQuestions >= 0.6;

    const { data, error } = await supabase.rpc("record_quiz_attempt", {
      p_algorithm_id: normalizedAlgorithmId,
      p_score: verifiedScore,
      p_total_questions: totalQuestions,
    });

    if (error) {
      throw new Error(`Quiz attempt could not be saved: ${error.message}`);
    }

    return {
      ok: true,
      data: {
        score: verifiedScore,
        totalQuestions,
        passed,
        attempt: data?.[0] ?? null,
      },
      message: "Quiz attempt evaluated and recorded.",
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to record quiz attempt.",
    };
  }
}

export async function submitQuizAttempt(
  algorithmId: string,
  score: number,
  totalQuestions: number
): Promise<QuizAttempt | null> {
  const normalizedAlgorithmId = normalizeAlgorithmId(algorithmId);
  if (!normalizedAlgorithmId) throw new Error("Invalid algorithm.");

  const isAvailable = publishedAlgorithms.some(
    (alg) => alg.id === normalizedAlgorithmId || alg.slug === normalizedAlgorithmId
  );
  if (!isAvailable) {
    throw new Error("Algorithm not found or unpublished.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const rateLimit = await checkRateLimit(`quiz:${user.id}`, 30);
  if (!rateLimit.success) {
    throw new Error("Too many requests. Please wait a moment.");
  }

  if (
    !Number.isInteger(score) ||
    !Number.isInteger(totalQuestions) ||
    totalQuestions <= 0 ||
    score < 0 ||
    score > totalQuestions
  ) {
    throw new Error("Invalid quiz score.");
  }

  const { data, error } = await supabase.rpc("record_quiz_attempt", {
    p_algorithm_id: normalizedAlgorithmId,
    p_score: score,
    p_total_questions: totalQuestions,
  });

  if (error) throw new Error("Quiz attempt could not be saved.");

  return data?.[0] ?? null;
}

export async function submitQuizAttemptAction(
  algorithmId: string,
  score: number,
  totalQuestions: number
): Promise<ActionResult<QuizAttempt | null>> {
  try {
    const result = await submitQuizAttempt(algorithmId, score, totalQuestions);
    if (!result) {
      return { ok: false, requiresAuth: true, message: "Log in to save quiz scores." };
    }
    return { ok: true, data: result, message: "Quiz attempt recorded." };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to record quiz attempt",
    };
  }
}

export async function getQuizAttempts(): Promise<QuizAttempt[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Quiz attempts could not be loaded.");

  return data ?? [];
}

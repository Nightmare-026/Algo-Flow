"use server";

import { createClient } from "@/lib/supabase/server";
import { type UserUnifiedXP, calculateXPLevel } from "@/lib/utils/xp-utils";

export type { UserUnifiedXP };

/**
 * Calculates authentic user XP ledger derived from:
 * - DSA Visualizers completed (+100 XP each)
 * - Quiz attempt scores (+10 XP per score point)
 * - Mental Math calculations correct (+1 XP each)
 * - Daily Challenge and sprint bonuses (+30/+40 XP)
 */
export async function getUserUnifiedXP(
  userId?: string,
  localCompletedCount: number = 0,
  localQuizScoreSum: number = 0,
  localMathCorrect: number = 0
): Promise<UserUnifiedXP> {
  const supabase = await createClient();
  let targetId = userId;

  if (!targetId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    targetId = user?.id;
  }

  if (!targetId) {
    const dsaXP = localCompletedCount * 100;
    const quizXP = localQuizScoreSum * 10;
    const mathXP = localMathCorrect * 1;
    const totalXP = dsaXP + quizXP + mathXP;
    const { level, rankTitle } = calculateXPLevel(totalXP);
    return {
      totalXP,
      dsaXP,
      quizXP,
      mathXP,
      bonusXP: 0,
      level,
      rankTitle,
    };
  }

  // 1. Try calling the RPC function from migration 006
  try {
    const { data, error } = await supabase.rpc("get_user_unified_xp", {
      p_user_id: targetId,
    });
    if (!error && data && typeof data === "object" && !Array.isArray(data)) {
      const d = data as Record<string, unknown>;
      const totalXP = typeof d.total_xp === "number" ? d.total_xp : 0;
      const { level, rankTitle } = calculateXPLevel(totalXP);
      return {
        totalXP,
        dsaXP: typeof d.dsa_xp === "number" ? d.dsa_xp : 0,
        quizXP: typeof d.quiz_xp === "number" ? d.quiz_xp : 0,
        mathXP: typeof d.math_xp === "number" ? d.math_xp : 0,
        bonusXP: typeof d.bonus_xp === "number" ? d.bonus_xp : 0,
        level,
        rankTitle,
      };
    }
  } catch {
    // RPC not present in remote schema yet, calculate from queried data
  }

  // 2. Fallback calculation directly from user tables
  try {
    const [progressRes, quizSumRes, mathRes] = await Promise.allSettled([
      supabase
        .from("user_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", targetId)
        .eq("status", "completed"),
      supabase.rpc("get_user_quiz_score_sum", { p_user_id: targetId }),
      supabase
        .from("mental_math_user_stats")
        .select("total_correct")
        .eq("user_id", targetId)
        .maybeSingle(),
    ]);

    const dsaCount =
      progressRes.status === "fulfilled" && progressRes.value.count !== null
        ? progressRes.value.count
        : localCompletedCount;

    let quizScores = localQuizScoreSum;
    if (
      quizSumRes.status === "fulfilled" &&
      !quizSumRes.value.error &&
      typeof quizSumRes.value.data === "number"
    ) {
      quizScores = quizSumRes.value.data;
    } else {
      const fallbackQuiz = await supabase
        .from("quiz_attempts")
        .select("score")
        .eq("user_id", targetId);
      if (fallbackQuiz.data) {
        quizScores = fallbackQuiz.data.reduce((acc, row) => acc + (row.score || 0), 0);
      }
    }

    const mathCorrect =
      mathRes.status === "fulfilled" && mathRes.value.data
        ? mathRes.value.data.total_correct || 0
        : localMathCorrect;

    const dsaXP = dsaCount * 100;
    const quizXP = quizScores * 10;
    const mathXP = mathCorrect * 1;
    const totalXP = dsaXP + quizXP + mathXP;
    const { level, rankTitle } = calculateXPLevel(totalXP);

    return {
      totalXP,
      dsaXP,
      quizXP,
      mathXP,
      bonusXP: 0,
      level,
      rankTitle,
    };
  } catch {
    const dsaXP = localCompletedCount * 100;
    const totalXP = dsaXP;
    const { level, rankTitle } = calculateXPLevel(totalXP);
    return {
      totalXP,
      dsaXP,
      quizXP: 0,
      mathXP: 0,
      bonusXP: 0,
      level,
      rankTitle,
    };
  }
}

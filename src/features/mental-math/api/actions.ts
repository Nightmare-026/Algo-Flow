"use server";

import { createClient } from "@/lib/supabase/server";
import {
  AnswerEvent,
  DifficultyTier,
  GameMode,
  LeaderboardEntry,
  MathOperation,
  SessionSummary,
  UserMentalMathStats,
} from "../core/types";
import { verifySessionIntegrity } from "../engine/anti-cheat";
import { checkRateLimit } from "@/lib/security/rate-limit";

export interface SubmitResult {
  ok: boolean;
  message: string;
  rank?: number;
  isVerified?: boolean;
}

/**
 * Records a practice/test session for an authenticated user in Supabase.
 */
export async function recordMentalMathSession(summary: SessionSummary): Promise<SubmitResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: true, message: "Saved locally for guest user." };
  }

  const rateLimit = checkRateLimit(`mental_math:${user.id}`, 60);
  if (!rateLimit.success) {
    return { ok: false, message: "Rate limit exceeded. Please wait." };
  }

  const integrity = verifySessionIntegrity(summary);
  if (!integrity.isValid) {
    return { ok: false, message: integrity.reason || "Integrity check failed." };
  }

  try {
    // 1. Insert session record
    await supabase.from("mental_math_sessions").insert({
      user_id: user.id,
      mode: summary.mode,
      operation: summary.operation,
      difficulty: summary.difficulty,
      total_questions: summary.totalQuestions,
      correct_count: summary.correctCount,
      accuracy_percentage: summary.accuracyPercentage,
      total_time_ms: summary.totalTimeMs,
      average_solve_time_ms: summary.averageSolveTimeMs,
      final_score: integrity.recalculatedScore,
      max_combo: summary.maxComboStreak || 0,
      hints_used: summary.hintsUsedCount || 0,
      answers: (summary.answers || []) as unknown as import("@/types/database").Json,
      score_version: summary.scoreVersion || "v1.0.0",
      generator_version: summary.generatorVersion || "v1.0.0",
    });

    // 2. If it's a daily challenge, record into daily attempts
    if (summary.isDailyChallenge || summary.mode === "daily") {
      const challengeDate =
        summary.dailyChallengeDate || new Date().toISOString().split("T")[0];
      await supabase.from("mental_math_daily_attempts").upsert(
        {
          user_id: user.id,
          challenge_date: challengeDate,
          score: integrity.recalculatedScore,
          accuracy: summary.accuracyPercentage,
          solve_time_ms: summary.totalTimeMs,
          verified: true,
        },
        { onConflict: "user_id,challenge_date" }
      );
    }

    // 3. Upsert user lifetime stats
    const { data: existingStats } = await supabase
      .from("mental_math_user_stats")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const totalSessions = (existingStats?.total_sessions_completed || 0) + 1;
    const totalSolved = (existingStats?.total_questions_solved || 0) + summary.totalQuestions;
    const totalCorrect = (existingStats?.total_correct || 0) + summary.correctCount;
    const overallAccuracy =
      totalSolved > 0 ? Number(((totalCorrect / totalSolved) * 100).toFixed(2)) : 0;
    const highestScore = Math.max(existingStats?.highest_score || 0, integrity.recalculatedScore);
    const highestCombo = Math.max(existingStats?.highest_combo || 0, summary.maxComboStreak || 0);
    const fastestSpeedQpm = Math.max(
      existingStats?.fastest_speed_qpm || 0,
      summary.questionsPerMinute || 0
    );

    await supabase.from("mental_math_user_stats").upsert({
      user_id: user.id,
      total_sessions_completed: totalSessions,
      total_questions_solved: totalSolved,
      total_correct: totalCorrect,
      overall_accuracy: overallAccuracy,
      highest_score: highestScore,
      highest_combo: highestCombo,
      fastest_speed_qpm: fastestSpeedQpm,
      last_played_date: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString(),
    });

    // 4. Record to user activity timeline
    await supabase.from("activity_timeline").insert({
      user_id: user.id,
      algorithm_id: `mental_math_${summary.operation}`,
      action_type: "quiz_completed",
      metadata: {
        score: integrity.recalculatedScore,
        accuracy: summary.accuracyPercentage,
        mode: summary.mode,
        operation: summary.operation,
      },
    });

    return {
      ok: true,
      message: "Session recorded successfully in cloud.",
      isVerified: true,
    };
  } catch (err) {
    console.error("Error recording mental math session to Supabase:", err);
    return { ok: true, message: "Saved locally." };
  }
}

/**
 * Submits an official daily challenge attempt to Supabase.
 */
export async function submitDailyChallenge(summary: SessionSummary): Promise<SubmitResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const integrity = verifySessionIntegrity(summary);
  if (!integrity.isValid) {
    return {
      ok: false,
      message: integrity.reason || "Score submission failed integrity check.",
    };
  }

  if (!user) {
    return {
      ok: true,
      message: "Daily challenge completed! Sign in to appear on the official global leaderboard.",
      rank: 1,
    };
  }

  const challengeDate =
    summary.dailyChallengeDate || new Date().toISOString().split("T")[0];

  try {
    await supabase.from("mental_math_daily_attempts").upsert(
      {
        user_id: user.id,
        challenge_date: challengeDate,
        score: integrity.recalculatedScore,
        accuracy: summary.accuracyPercentage,
        solve_time_ms: summary.totalTimeMs,
        verified: true,
      },
      { onConflict: "user_id,challenge_date" }
    );

    // Compute rank for this date
    const { count } = await supabase
      .from("mental_math_daily_attempts")
      .select("*", { count: "exact", head: true })
      .eq("challenge_date", challengeDate)
      .gt("score", integrity.recalculatedScore);

    const rank = (count || 0) + 1;

    return {
      ok: true,
      message: "Daily challenge official score submitted!",
      rank,
      isVerified: true,
    };
  } catch (err) {
    console.error("Error submitting daily challenge to Supabase:", err);
    return {
      ok: true,
      message: "Daily challenge saved locally.",
      rank: 1,
    };
  }
}

/**
 * Retrieves real daily or global leaderboards from Supabase.
 */
export async function getMentalMathLeaderboard(
  mode: GameMode = "daily",
  dateStr?: string
): Promise<LeaderboardEntry[]> {
  const targetDate = dateStr || new Date().toISOString().split("T")[0];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("mental_math_daily_attempts")
      .select(`
        id,
        user_id,
        score,
        accuracy,
        solve_time_ms,
        challenge_date,
        profiles (
          username
        )
      `)
      .eq("challenge_date", targetDate)
      .order("score", { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) {
      return [];
    }

interface LeaderboardQueryRow {
  id: string;
  user_id: string;
  score: number;
  accuracy: number;
  solve_time_ms: number;
  challenge_date: string;
  profiles?: {
    username?: string | null;
  } | null;
}

    return (data as unknown as LeaderboardQueryRow[]).map((row, index: number) => ({
      id: row.id,
      userId: row.user_id,
      displayName: row.profiles?.username || `Learner ${row.user_id.slice(0, 6)}`,
      score: row.score,
      accuracy: Number(row.accuracy),
      speedQPM:
        row.solve_time_ms > 0
          ? Number(((10 / (row.solve_time_ms / 60000))).toFixed(1))
          : 0,
      mode,
      operation: "mixed",
      difficulty: "medium",
      date: row.challenge_date,
      rank: index + 1,
    }));
  } catch {
    return [];
  }
}

/**
 * Retrieves aggregate mental math stats from Supabase for authenticated user.
 */
export async function getMentalMathUserStats(): Promise<UserMentalMathStats | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: statsRow } = await supabase
      .from("mental_math_user_stats")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!statsRow) return null;

    // Fetch recent sessions
    const { data: recentSessions } = await supabase
      .from("mental_math_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      totalSessionsCompleted: statsRow.total_sessions_completed || 0,
      totalQuestionsSolved: statsRow.total_questions_solved || 0,
      totalCorrect: statsRow.total_correct || 0,
      overallAccuracy: Number(statsRow.overall_accuracy) || 0,
      currentStreakDays: statsRow.current_streak_days || 0,
      maxStreakDays: statsRow.max_streak_days || 0,
      lastPlayedDate: statsRow.last_played_date || null,
      personalBests: {
        highestScore: statsRow.highest_score || 0,
        highestCombo: statsRow.highest_combo || 0,
        fastestSpeedQPM: Number(statsRow.fastest_speed_qpm) || 0,
        bestAccuracyPercentage: Number(statsRow.overall_accuracy) || 0,
        bestDailyScore: statsRow.best_daily_score || 0,
      },
      operationMastery: {} as UserMentalMathStats["operationMastery"],
      identifiedWeaknesses: [],
      recentSessions: ((recentSessions || []) as Array<{
        id: string;
        user_id: string;
        mode: GameMode;
        operation: MathOperation;
        difficulty: DifficultyTier;
        total_questions: number;
        correct_count: number;
        accuracy_percentage: number;
        total_time_ms: number;
        average_solve_time_ms: number;
        final_score: number;
        max_combo: number;
        hints_used: number;
        score_version: string;
        generator_version: string;
        created_at: string;
        answers: AnswerEvent[] | null;
      }>).map((s) => ({
        sessionId: s.id,
        userId: s.user_id,
        mode: s.mode,
        operation: s.operation,
        difficulty: s.difficulty,
        totalQuestions: s.total_questions,
        correctCount: s.correct_count,
        incorrectCount: s.total_questions - s.correct_count,
        accuracyPercentage: Number(s.accuracy_percentage),
        totalTimeMs: s.total_time_ms,
        averageSolveTimeMs: s.average_solve_time_ms,
        fastestSolveTimeMs: 0,
        slowestSolveTimeMs: 0,
        questionsPerMinute:
          s.total_time_ms > 0
            ? Number(((s.total_questions / (s.total_time_ms / 60000))).toFixed(1))
            : 0,
        finalScore: s.final_score,
        maxComboStreak: s.max_combo,
        hintsUsedCount: s.hints_used,
        scoreVersion: s.score_version,
        generatorVersion: s.generator_version,
        isDailyChallenge: s.mode === "daily",
        completedAt: s.created_at,
        answers: (s.answers || []) as AnswerEvent[],
      })),
    };
  } catch {
    return null;
  }
}

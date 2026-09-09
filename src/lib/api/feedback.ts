"use server";

import { createClient } from "@/lib/supabase/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const FEEDBACK_TYPES = ["bug_report", "feature_request", "rating", "general"] as const;
type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export type FeedbackPayload = {
  type: FeedbackType;
  subject: string;
  message: string;
  rating?: number | null;
  email?: string | null;
  pageUrl?: string | null;
};

export type FeedbackResult = {
  success: boolean;
  error?: string;
};

/* ---------- Rate limiter (5 submissions per hour) ---------- */
let ratelimit: Ratelimit | null = null;

function getRateLimiter(): Ratelimit | null {
  if (ratelimit) return ratelimit;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: false,
    prefix: "feedback",
  });
  return ratelimit;
}

/* ---------- Validation ---------- */
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function validatePayload(payload: FeedbackPayload): string | null {
  if (!FEEDBACK_TYPES.includes(payload.type)) {
    return "Invalid feedback type.";
  }
  if (!payload.subject || payload.subject.trim().length === 0) {
    return "Subject is required.";
  }
  if (payload.subject.trim().length > 200) {
    return "Subject must be 200 characters or fewer.";
  }
  if (!payload.message || payload.message.trim().length === 0) {
    return "Message is required.";
  }
  if (payload.message.trim().length > 5000) {
    return "Message must be 5,000 characters or fewer.";
  }
  if (payload.type === "rating" && (payload.rating == null || payload.rating < 1 || payload.rating > 5)) {
    return "Please select a star rating between 1 and 5.";
  }
  if (payload.rating != null && (payload.rating < 1 || payload.rating > 5 || !Number.isInteger(payload.rating))) {
    return "Rating must be an integer between 1 and 5.";
  }
  if (payload.email && !EMAIL_RE.test(payload.email)) {
    return "Please enter a valid email address.";
  }
  return null;
}

/* ---------- Server action ---------- */
export async function submitFeedback(payload: FeedbackPayload): Promise<FeedbackResult> {
  /* Validate */
  const validationError = validatePayload(payload);
  if (validationError) return { success: false, error: validationError };

  /* Rate limit */
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limiter = getRateLimiter();
  if (limiter) {
    const { success: allowed } = await limiter.limit(`feedback:${ip}`);
    if (!allowed) {
      return {
        success: false,
        error: "You've submitted too many feedback entries. Please try again later.",
      };
    }
  }

  /* Detect user */
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userAgent = headerStore.get("user-agent") ?? null;

  /* Insert */
  const { error } = await supabase.from("feedback").insert({
    user_id: user?.id ?? null,
    type: payload.type,
    subject: payload.subject.trim(),
    message: payload.message.trim(),
    rating: payload.rating ?? null,
    email: payload.email?.trim() || null,
    page_url: payload.pageUrl ?? null,
    user_agent: userAgent,
  });

  if (error) {
    console.error("[Feedback] Insert error:", error.message);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}

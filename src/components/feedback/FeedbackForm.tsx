"use client";

import { useState, useTransition } from "react";
import {
  Bug,
  Lightbulb,
  Star,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Mail,
} from "lucide-react";
import { submitFeedback, type FeedbackPayload } from "@/lib/api/feedback";

/* ---------- Feedback type definitions ---------- */
const FEEDBACK_TYPES = [
  {
    id: "bug_report" as const,
    label: "Bug Report",
    description: "Something isn't working correctly",
    icon: Bug,
    color: "var(--error)",
    mutedColor: "var(--error-muted)",
  },
  {
    id: "feature_request" as const,
    label: "Feature Request",
    description: "Suggest a new feature or improvement",
    icon: Lightbulb,
    color: "var(--warning)",
    mutedColor: "var(--warning-muted)",
  },
  {
    id: "rating" as const,
    label: "Rate Us",
    description: "Share your overall experience",
    icon: Star,
    color: "var(--primary)",
    mutedColor: "var(--primary-muted)",
  },
  {
    id: "general" as const,
    label: "General",
    description: "Any other comments or questions",
    icon: MessageSquare,
    color: "var(--info)",
    mutedColor: "var(--info-muted)",
  },
] as const;

type FeedbackTypeId = (typeof FEEDBACK_TYPES)[number]["id"];

const STAR_LABELS = ["Terrible", "Poor", "Average", "Good", "Excellent"];

/* ---------- Component ---------- */
interface FeedbackFormProps {
  isAuthenticated: boolean;
}

export function FeedbackForm({ isAuthenticated }: FeedbackFormProps) {
  const [selectedType, setSelectedType] = useState<FeedbackTypeId | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  const activeType = FEEDBACK_TYPES.find((t) => t.id === selectedType);

  function resetForm() {
    setSelectedType(null);
    setSubject("");
    setMessage("");
    setRating(0);
    setHoveredStar(0);
    setEmail("");
    setResult(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType) return;

    const payload: FeedbackPayload = {
      type: selectedType,
      subject: subject.trim(),
      message: message.trim(),
      rating: rating > 0 ? rating : null,
      email: email.trim() || null,
      pageUrl: typeof window !== "undefined" ? window.location.href : null,
    };

    startTransition(async () => {
      const res = await submitFeedback(payload);
      setResult(res);
    });
  }

  /* ---- Success State ---- */
  if (result?.success) {
    return (
      <div className="neu-raised rounded-3xl border border-border p-8 sm:p-12 text-center">
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20"
          style={{ background: "var(--primary-muted)" }}
        >
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold font-display text-text-primary tracking-tight">
          Thank You for Your Feedback!
        </h2>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
          Your {activeType?.label.toLowerCase() ?? "feedback"} has been submitted successfully. We
          read every piece of feedback and use it to improve Algo Flow.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary shadow-[var(--shadow-raised-sm)] hover:border-border-hover hover:bg-surface-hover transition-all duration-150"
        >
          <RefreshCw className="h-4 w-4" />
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1 — Feedback Type Selector */}
      <div>
        <label className="block text-xs font-bold font-mono uppercase tracking-wider text-text-primary mb-4">
          What type of feedback?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEEDBACK_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = selectedType === type.id;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setSelectedType(type.id);
                  setResult(null);
                }}
                className={`group relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${
                  isActive
                    ? "border-primary/40 bg-primary-muted shadow-[var(--shadow-glow-primary)] ring-1 ring-primary/20"
                    : "neu-raised-sm hover:border-border-hover hover:bg-surface-hover"
                }`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-colors duration-150"
                  style={{
                    background: isActive ? type.mutedColor : "var(--bg-surface-inset)",
                    borderColor: isActive
                      ? `color-mix(in srgb, ${type.color} 30%, transparent)`
                      : "var(--border)",
                    color: isActive ? type.color : "var(--text-muted)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-bold font-display tracking-tight transition-colors duration-150 ${
                      isActive ? "text-primary" : "text-text-primary"
                    }`}
                  >
                    {type.label}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2 — Form Fields (shown after type is selected) */}
      {selectedType && (
        <div className="neu-float rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6 animate-in">
          {/* Subject */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="feedback-subject"
                className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary"
              >
                Subject
              </label>
              <span
                className={`text-xs font-mono tabular-nums ${subject.length > 180 ? "text-error" : "text-text-muted"}`}
              >
                {subject.length}/200
              </span>
            </div>
            <input
              id="feedback-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              required
              placeholder={
                selectedType === "bug_report"
                  ? "e.g., Binary tree traversal animation freezes on step 5"
                  : selectedType === "feature_request"
                    ? "e.g., Add Dijkstra's algorithm visualization"
                    : selectedType === "rating"
                      ? "e.g., Great learning platform!"
                      : "e.g., Question about array sorting visualizer"
              }
              className="form-textarea !min-h-[2.75rem] w-full rounded-xl"
            />
          </div>

          {/* Star Rating (shown for 'rating' type, optional for others) */}
          {(selectedType === "rating" || rating > 0) && (
            <div>
              <label className="block text-xs font-bold font-mono uppercase tracking-wider text-text-primary mb-2">
                {selectedType === "rating" ? "Your Rating" : "Optional Rating"}
                {selectedType === "rating" && <span className="text-error ml-1">*</span>}
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= (hoveredStar || rating);
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoveredStar(starValue)}
                      onMouseLeave={() => setHoveredStar(0)}
                      aria-label={`${starValue} star${starValue > 1 ? "s" : ""} — ${STAR_LABELS[starValue - 1]}`}
                      className="group p-1 rounded-lg transition-transform duration-150 hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors duration-150 ${
                          isFilled
                            ? "text-primary fill-primary"
                            : "text-border-hover group-hover:text-primary/50"
                        }`}
                      />
                    </button>
                  );
                })}
                {(hoveredStar > 0 || rating > 0) && (
                  <span className="ml-3 text-xs font-bold text-text-secondary">
                    {STAR_LABELS[(hoveredStar || rating) - 1]}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Show star rating toggle for non-rating types */}
          {selectedType !== "rating" && rating === 0 && (
            <button
              type="button"
              onClick={() => setRating(1)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition-colors duration-150"
            >
              <Star className="h-3.5 w-3.5" />
              Add an optional star rating
            </button>
          )}

          {/* Message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="feedback-message"
                className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary"
              >
                {selectedType === "bug_report" ? "Steps to Reproduce" : "Details"}
              </label>
              <span
                className={`text-xs font-mono tabular-nums ${message.length > 4800 ? "text-error" : "text-text-muted"}`}
              >
                {message.length}/5000
              </span>
            </div>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={5000}
              required
              rows={6}
              placeholder={
                selectedType === "bug_report"
                  ? "1. Navigate to the sorting visualizer\n2. Select 'Merge Sort'\n3. Click 'Play'\n4. The animation freezes at step 5…"
                  : selectedType === "feature_request"
                    ? "Describe the feature you'd like and how it would help your learning…"
                    : selectedType === "rating"
                      ? "Tell us what you love about Algo Flow or how we can improve…"
                      : "Share any thoughts, questions, or suggestions…"
              }
              className="form-textarea w-full rounded-xl resize-y"
            />
          </div>

          {/* Email (only for non-authenticated users) */}
          {!isAuthenticated && (
            <div>
              <label
                htmlFor="feedback-email"
                className="flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-text-primary mb-2"
              >
                <Mail className="h-3.5 w-3.5 text-text-muted" />
                Email
                <span className="font-normal normal-case tracking-normal text-text-muted">
                  (optional — if you'd like a response)
                </span>
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="form-textarea !min-h-[2.75rem] w-full rounded-xl"
              />
            </div>
          )}

          {/* Error Message */}
          {result && !result.success && result.error && (
            <div className="flex items-start gap-3 rounded-2xl border border-error/30 bg-error-muted p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-error mt-0.5" />
              <p className="text-sm font-medium text-error">{result.error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !selectedType || !subject.trim() || !message.trim()}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary px-6 py-3 text-sm font-bold text-text-inverse shadow-[var(--shadow-glow-primary)] transition-all duration-200 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
}

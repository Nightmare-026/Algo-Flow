"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
  Check,
  RotateCcw,
  Compass,
} from "lucide-react";
import { submitFeedback, type FeedbackPayload } from "@/lib/api/feedback";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ---------- Feedback type definitions ---------- */
const FEEDBACK_TYPES = [
  {
    id: "general" as const,
    label: "General",
    description: "Questions, comments, or general thoughts",
    icon: MessageSquare,
  },
  {
    id: "bug_report" as const,
    label: "Bug Report",
    description: "Something is broken or behaving incorrectly",
    icon: Bug,
  },
  {
    id: "feature_request" as const,
    label: "Feature Request",
    description: "Suggest a new algorithm or capability",
    icon: Lightbulb,
  },
  {
    id: "rating" as const,
    label: "Rate Us",
    description: "Share your experience with AlgoFlow",
    icon: Star,
  },
] as const;

type FeedbackTypeId = (typeof FEEDBACK_TYPES)[number]["id"];

const STAR_LABELS = ["Terrible", "Poor", "Average", "Good", "Excellent"];

/* ---------- Component ---------- */
interface FeedbackFormProps {
  isAuthenticated: boolean;
}

export function FeedbackForm({ isAuthenticated }: FeedbackFormProps) {
  const [selectedType, setSelectedType] = useState<FeedbackTypeId>("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [lastSubmission, setLastSubmission] = useState<{
    typeLabel: string;
    subject: string;
  } | null>(null);

  const activeType = FEEDBACK_TYPES.find((t) => t.id === selectedType) ?? FEEDBACK_TYPES[0];

  function resetForm() {
    setSelectedType("general");
    setSubject("");
    setMessage("");
    setRating(0);
    setHoveredStar(0);
    setEmail("");
    setResult(null);
    setLastSubmission(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

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
      if (res.success) {
        setLastSubmission({
          typeLabel: activeType.label,
          subject: subject.trim(),
        });
      }
      setResult(res);
    });
  }

  /* ---- Success / Trace Confirmation State ---- */
  if (result?.success) {
    return (
      <div className="rounded-[8px] border border-border bg-surface p-8 sm:p-12 text-center shadow-elevated space-y-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-muted px-3.5 py-1 text-xs font-bold font-mono uppercase tracking-wider text-primary shadow-xs">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Submission Received &bull; Verified</span>
        </div>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[8px] border border-primary/20 bg-primary/10 text-primary shadow-card">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
            Thank You for Your Feedback!
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-text-secondary leading-relaxed max-w-md mx-auto">
            Your {lastSubmission?.typeLabel.toLowerCase() ?? "feedback"} has been recorded securely.
            Our team reviews every submission to continuously refine AlgoFlow.
          </p>
        </div>

        {lastSubmission && (
          <div className="max-w-md mx-auto rounded-[6px] border border-border bg-surface-secondary/70 p-4 text-left">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-1.5">
              <span>Category: {lastSubmission.typeLabel}</span>
              <span>Status: Queued</span>
            </div>
            <p className="text-sm font-semibold text-text-primary truncate">
              {lastSubmission.subject}
            </p>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetForm}
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "w-full sm:w-auto gap-2",
            })}
          >
            <RefreshCw className="h-4 w-4" />
            Submit Another
          </button>
          <Link
            href="/visualizers"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full sm:w-auto gap-2 shadow-(--shadow-raised)",
            })}
          >
            <Compass className="h-4 w-4" />
            Explore Visualizers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Category Selector — Componentized Shared Cards (FR-001 & FR-004) */}
      <div>
        <label className="block text-xs font-bold font-mono uppercase tracking-wider text-text-primary mb-3.5">
          What type of feedback?
        </label>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
          role="radiogroup"
          aria-label="What type of feedback?"
        >
          {FEEDBACK_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = selectedType === type.id;

            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                tabIndex={0}
                onClick={() => {
                  setSelectedType(type.id);
                  setResult(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setSelectedType(type.id);
                    setResult(null);
                  }
                }}
                className={cn(
                  "group relative flex flex-col justify-between rounded-[8px] p-5 text-left transition-all duration-200 cursor-pointer select-none",
                  isActive
                    ? "border-primary bg-surface shadow-card ring-2 ring-primary -translate-y-0.5"
                    : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:bg-surface-secondary/50 hover:-translate-y-0.5 shadow-card"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-[6px] border transition-all duration-200",
                        isActive
                          ? "border-primary/40 bg-primary-muted text-primary scale-105"
                          : "border-border bg-surface-secondary/70 text-text-muted group-hover:text-primary group-hover:scale-105"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-all",
                        isActive
                          ? "border-primary bg-primary text-white shadow-xs"
                          : "border-border bg-surface-secondary/70 text-transparent"
                      )}
                      aria-hidden="true"
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-bold font-display tracking-tight transition-colors duration-150",
                      isActive ? "text-primary" : "text-text-primary group-hover:text-primary"
                    )}
                  >
                    {type.label}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {type.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields Card Shell — Always visible by default (FR-002 & FR-005) */}
      <div className="rounded-[8px] border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-card">
        {/* Subject */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="feedback-subject"
              className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary"
            >
              Subject <span className="text-primary">*</span>
            </label>
            <span
              className={cn(
                "text-xs font-mono tabular-nums",
                subject.length > 180 ? "text-error" : "text-text-muted"
              )}
            >
              {subject.length}/200
            </span>
          </div>
          <Input
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
                    ? "e.g., Great learning platform for interview prep!"
                    : "e.g., Question or comment about AlgoFlow visualizers"
            }
          />
        </div>

        {/* Star Rating (displayed when 'rating' selected or rating > 0) */}
        {(selectedType === "rating" || rating > 0) && (
          <div>
            <label className="block text-xs font-bold font-mono uppercase tracking-wider text-text-primary mb-2">
              {selectedType === "rating" ? "Your Rating" : "Optional Rating"}
              {selectedType === "rating" && <span className="text-primary ml-1">*</span>}
            </label>
            <div className="flex items-center gap-1.5">
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
                    className="group p-1.5 rounded-[4px] border border-border bg-surface-secondary/70 hover:border-primary/40 hover:bg-primary-muted transition-all duration-150 cursor-pointer"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors duration-150",
                        isFilled
                          ? "text-primary fill-primary"
                          : "text-text-muted group-hover:text-primary/70"
                      )}
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

        {/* Optional Star Rating toggle when not on rating tab */}
        {selectedType !== "rating" && rating === 0 && (
          <div>
            <button
              type="button"
              onClick={() => setRating(5)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition-colors cursor-pointer"
            >
              <Star className="h-3.5 w-3.5" />
              Add an optional star rating
            </button>
          </div>
        )}

        {/* Message / Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="feedback-message"
              className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary"
            >
              {selectedType === "bug_report" ? "Steps to Reproduce" : "Details"}{" "}
              <span className="text-primary">*</span>
            </label>
            <span
              className={cn(
                "text-xs font-mono tabular-nums",
                message.length > 4800 ? "text-error" : "text-text-muted"
              )}
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
            rows={5}
            placeholder={
              selectedType === "bug_report"
                ? "1. Navigate to sorting visualizer\n2. Select 'Merge Sort'\n3. Click 'Play'\n4. Animation freezes at step 5…"
                : selectedType === "feature_request"
                  ? "Describe the feature you'd like and how it would improve your DSA learning experience…"
                  : selectedType === "rating"
                    ? "Tell us what you love about AlgoFlow or what we can do better…"
                    : "Share any thoughts, observations, or suggestions…"
            }
            className="min-h-[140px] w-full rounded-[4px] border border-border bg-surface-secondary/70 p-3.5 text-sm text-text-primary transition-all duration-200 placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 resize-y"
          />
        </div>

        {/* Email Field — Visually marked optional (FR-005) */}
        {!isAuthenticated && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="feedback-email"
                className="flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-text-primary"
              >
                <Mail className="h-3.5 w-3.5 text-text-muted" />
                Email address
              </label>
              <span className="text-[10px] font-mono font-normal uppercase px-2 py-0.5 rounded-[4px] border border-border bg-surface-secondary/70 text-text-muted">
                Optional
              </span>
            </div>
            <Input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <p className="mt-1.5 text-xs text-text-muted">
              Provide your email if you&apos;d like a direct follow-up from our team.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {result && !result.success && result.error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-[4px] border border-crimson/30 bg-crimson/10 p-4 text-sm text-crimson"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="font-medium">{result.error}</p>
          </div>
        )}

        {/* Button Hierarchy (FR-006) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isPending || !subject.trim() || !message.trim()}
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full sm:w-auto gap-2 font-bold cursor-pointer",
            })}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting Feedback…</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Feedback</span>
              </>
            )}
          </button>

          {(subject || message || email || rating > 0) && (
            <button
              type="button"
              onClick={() => {
                setSubject("");
                setMessage("");
                setEmail("");
                setRating(0);
              }}
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "w-full sm:w-auto gap-2 text-text-secondary hover:text-text-primary",
              })}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear Form</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

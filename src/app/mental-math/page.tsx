import React from "react";
import Link from "next/link";
import {
  Trophy,
  Play,
  ArrowRight,
  Zap,
  Target,
  BrainCircuit,
  Sparkles,
  Layers,
  BarChart3,
} from "lucide-react";
import { ModeSelector } from "@/features/mental-math/components/ModeSelector";
import { OperationsExplorer } from "@/features/mental-math/components/OperationsExplorer";

export const metadata = {
  title: "Mental Math Calculation Studio",
  description:
    "Train arithmetic reflexes, master decomposition heuristics, and build high-precision mental calculation speed across 9 domains and 6 training formats.",
};

export default function MentalMathHubPage() {
  return (
    <div className="flex w-full flex-col px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-14 pb-24">
      {/* Hero Section: Studio & Curriculum Introduction */}
      <section className="neu-float relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 border border-border bg-surface flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 shadow-[var(--shadow-raised)]">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <div className="inline-flex min-h-7 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-[11px] font-bold font-mono uppercase tracking-wider text-primary shadow-[var(--shadow-raised-sm)] mb-4">
            Mental Math Studio & Curriculum
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Train Arithmetic Reflexes. <span className="text-primary">Master Decomposition.</span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-text-secondary mt-3 max-w-xl">
            Develop lightning mental calculation fluency, intuitive number sense, and high-precision
            arithmetic speed through structured multi-digit drills, 60-second speed sprints, and
            deterministic daily benchmarks.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link
              href="/mental-math/practice"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl bg-primary px-6 text-xs font-bold font-display text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Open Practice Studio</span>
            </Link>

            <Link
              href="/mental-math/speed"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-5 text-xs font-bold font-display text-text-primary hover:text-primary hover:bg-surface-hover shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span>60s Speed Sprint</span>
            </Link>

            <Link
              href="/mental-math/daily"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-5 text-xs font-bold font-display text-text-primary hover:text-primary hover:bg-surface-hover shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-primary" />
              <span>Today&apos;s Challenge</span>
            </Link>
          </div>
        </div>

        {/* Studio Platform Specifications Grid (100% Real Architectural Capabilities) */}
        <div className="grid grid-cols-2 gap-3.5 w-full lg:w-84 shrink-0">
          <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                Operations
              </span>
              <BrainCircuit className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-extrabold font-display text-text-primary">9 Domains</p>
              <p className="text-[11px] font-sans text-text-muted mt-0.5">
                Addition, roots, cubes & %
              </p>
            </div>
          </div>

          <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                Range Control
              </span>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-extrabold font-display text-text-primary">1–4 Digits</p>
              <p className="text-[11px] font-sans text-text-muted mt-0.5">Strict operand bounds</p>
            </div>
          </div>

          <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                Training Modes
              </span>
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-extrabold font-display text-text-primary">6 Formats</p>
              <p className="text-[11px] font-sans text-text-muted mt-0.5">Sandbox, sprint & test</p>
            </div>
          </div>

          <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                Telemetry
              </span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-extrabold font-display text-text-primary">Sub-second</p>
              <p className="text-[11px] font-sans text-text-muted mt-0.5">Real-time QPM tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum & Operations Explorer Catalog */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
              Explore Arithmetic Operations
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Browse all 9 calculation domains. Click any card to launch an instant practice drill.
            </p>
          </div>
          <Link
            href="/mental-math/practice"
            className="text-xs font-bold font-display text-primary hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Custom Setup Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <OperationsExplorer />
      </section>

      {/* Training Formats Matrix (6 Clean Modes) */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
            Training Formats
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Choose your training style: custom sandbox studio, 60s speed sprint, standardized timed
            benchmarks, or official daily competition.
          </p>
        </div>

        <ModeSelector />
      </section>

      {/* Cognitive Heuristics: 4 Pedagogical Mental Math Pillars */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
            Cognitive Calculation Pillars
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Proven algorithmic strategies that replace slow column memorization with intuitive
            mental heuristics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-[var(--shadow-raised-sm)]">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-inset border border-border text-primary shadow-inner mb-4 font-mono font-bold text-sm">
                01
              </span>
              <h3 className="text-base font-bold font-display text-text-primary tracking-tight">
                Left-to-Right Addition
              </h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Add highest place values first (hundreds, then tens, then units). Keeps running
                intermediate sums active without carrying stack overhead.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-primary font-bold">
              48 + 37 → 78 + 7 = 85
            </div>
          </div>

          <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-[var(--shadow-raised-sm)]">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-inset border border-border text-primary shadow-inner mb-4 font-mono font-bold text-sm">
                02
              </span>
              <h3 className="text-base font-bold font-display text-text-primary tracking-tight">
                Complement Subtraction
              </h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Subtract by referencing friendly 100 or 1000 base complements. Completely avoids
                borrow hesitation across multiple zero digits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-primary font-bold">
              100 − 63 → (90−60)+(10−3) = 37
            </div>
          </div>

          <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-[var(--shadow-raised-sm)]">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-inset border border-border text-primary shadow-inner mb-4 font-mono font-bold text-sm">
                03
              </span>
              <h3 className="text-base font-bold font-display text-text-primary tracking-tight">
                Distributive Multipliers
              </h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Decompose non-trivial factors into friendly anchors (e.g. ×25 = ×100÷4, ×9 = ×10−1)
                or leverage doubling and halving symmetries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-primary font-bold">
              16 × 25 → 4 × 100 = 400
            </div>
          </div>

          <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-[var(--shadow-raised-sm)]">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-inset border border-border text-primary shadow-inner mb-4 font-mono font-bold text-sm">
                04
              </span>
              <h3 className="text-base font-bold font-display text-text-primary tracking-tight">
                Anchor Squaring (a±b)²
              </h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Square numbers close to base-50 anchors instantly using (50±d)² = (25±d)×100 + d².
                Solves two-digit squares in under 2 seconds.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-primary font-bold">
              53² → (25+3)×100 + 3² = 2,809
            </div>
          </div>
        </div>
      </section>

      {/* Mastery Telemetry & Student Command Center Gateway Banner */}
      <section className="neu-float relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-border bg-surface shadow-[var(--shadow-raised)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-2xl">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-inset border border-border text-primary shadow-inner">
            <BarChart3 className="w-6 h-6" />
          </span>
          <div>
            <h3 className="text-xl font-bold font-display text-text-primary tracking-tight">
              Personal Analytics & Cognitive Diagnostics
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
              Looking for your personal accuracy trends, carry/borrow bottleneck analysis, and
              operation radar breakdown? Track deep calculation telemetry on the Mastery & Stats
              page or view your unified progress in the Student Command Center.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 self-stretch md:self-auto">
          <Link
            href="/mental-math/progress"
            className="flex-1 md:flex-none inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold font-display text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <span>View Mastery & Stats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 md:flex-none inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-xs font-bold font-display text-text-primary hover:text-primary hover:bg-surface-hover shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
          >
            <span>Student Dashboard</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

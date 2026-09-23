import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { ModeSelector } from "@/features/mental-math/components/ModeSelector";
import { OperationsExplorer } from "@/features/mental-math/components/OperationsExplorer";

export const metadata = {
  title: "Mental Math Calculation Studio",
  description:
    "Train arithmetic reflexes, master decomposition heuristics, and build high-precision mental calculation speed across 9 domains and 6 training formats.",
};

export default function MentalMathHubPage() {
  return (
    <div className="flex w-full flex-col gap-10 pt-1 pb-16">
      {/* Curriculum & Operations Explorer Catalog */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
              Explore Arithmetic Operations
            </h1>
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
          <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-(--shadow-raised-sm)">
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
              48 + 37 â†’ 78 + 7 = 85
            </div>
          </div>

          <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-(--shadow-raised-sm)">
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
              100 âˆ’ 63 â†’ (90âˆ’60)+(10âˆ’3) = 37
            </div>
          </div>

          <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-(--shadow-raised-sm)">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-inset border border-border text-primary shadow-inner mb-4 font-mono font-bold text-sm">
                03
              </span>
              <h3 className="text-base font-bold font-display text-text-primary tracking-tight">
                Distributive Multipliers
              </h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Decompose non-trivial factors into friendly anchors (e.g. Ã—25 = Ã—100Ã·4, Ã—9 =
                Ã—10âˆ’1) or leverage doubling and halving symmetries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-primary font-bold">
              16 Ã— 25 â†’ 4 Ã— 100 = 400
            </div>
          </div>

          <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between shadow-(--shadow-raised-sm)">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-inset border border-border text-primary shadow-inner mb-4 font-mono font-bold text-sm">
                04
              </span>
              <h3 className="text-base font-bold font-display text-text-primary tracking-tight">
                Anchor Squaring (aÂ±b)Â²
              </h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Square numbers close to base-50 anchors instantly using (50Â±d)Â² = (25Â±d)Ã—100 +
                dÂ². Solves two-digit squares in under 2 seconds.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-primary font-bold">
              53Â² â†’ (25+3)Ã—100 + 3Â² = 2,809
            </div>
          </div>
        </div>
      </section>

      {/* Mastery Telemetry & Student Command Center Gateway Banner */}
      <section className="neu-float relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-border bg-surface shadow-(--shadow-raised) flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
            className="flex-1 md:flex-none inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold font-display text-white shadow-(--shadow-raised-sm) hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <span>View Mastery & Stats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 md:flex-none inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-xs font-bold font-display text-text-primary hover:text-primary hover:bg-surface-hover shadow-(--shadow-raised-sm) active:scale-95 transition-all cursor-pointer"
          >
            <span>Student Dashboard</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

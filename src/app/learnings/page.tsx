import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllModules, getCurriculumStats } from "@/lib/learnings/registry";
import { LearningsHubExplorer } from "@/components/learnings/LearningsHubExplorer";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { safeJsonLd } from "@/lib/security/safe-json";

export const metadata: Metadata = {
  title: "DSA Curriculum — 62 In-Depth Chapters & Architectural Blueprints | Algo Flow",
  description:
    "Master data structures and algorithms with our university-level, mathematically rigorous, and visually intuitive curriculum. Complete with ASCII memory layouts, dry-run state tables, and interactive visualizers.",
  keywords: [
    "DSA curriculum",
    "data structures and algorithms tutorial",
    "algorithmic foundations",
    "binary trees",
    "graph algorithms",
    "dynamic programming",
    "time complexity",
    "physical memory layouts",
    "Algo Flow learnings",
  ],
  alternates: {
    canonical: "/learnings",
  },
  openGraph: {
    title: "DSA Curriculum — 62 In-Depth Chapters | Algo Flow",
    description:
      "A university-level, mathematically rigorous, and visually intuitive curriculum covering all major data structures, algorithms, and interview patterns.",
    url: "/learnings",
    type: "website",
    images: [
      {
        url: "/images/dsa-learnings-hero.jpg",
        width: 1200,
        height: 900,
        alt: "Algo Flow DSA Curriculum Architectural Blueprints",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Curriculum — 62 In-Depth Chapters | Algo Flow",
    description:
      "Master data structures and algorithms with our university-level, mathematically rigorous, and visually intuitive curriculum.",
    images: ["/images/dsa-learnings-hero.jpg"],
  },
};

export default function LearningsPage() {
  const modules = getAllModules();
  const stats = getCurriculumStats();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Definitive Data Structures & Algorithms Curriculum",
    description:
      "Comprehensive DSA curriculum covering algorithmic complexity, linear structures, hashing, searching, sorting, trees, graphs, dynamic programming, and interview patterns.",
    provider: {
      "@type": "Organization",
      name: "Algo Flow",
      url: "https://algo-flow.com",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: "PT60H",
    },
    numberOfCredits: stats.totalChapters,
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Modern 2-Column Hero Section */}
        <header className="relative mb-12 md:mb-20">
          {/* Background Ambient Glows */}
          <div
            className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-12 top-4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline, Summary, Actions, and Stats */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-foreground leading-[1.12] mb-4">
                Master Data Structures &amp; Algorithms{" "}
                <span className="text-gradient-primary">Step by Step.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
                From mathematical intuition to physical memory layouts and interview blueprints.
                University lecture rigor meets table-based manual dry runs and interactive
                visualizers.
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link
                  href="/learnings/front-matter/cover-and-purpose"
                  className={buttonVariants({
                    variant: "default",
                    size: "md",
                    className: "shadow-sm",
                  })}
                >
                  <span>Start Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#curriculum-explorer"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "md",
                  })}
                >
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Browse {stats.totalChapters} Chapters</span>
                </a>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-border bg-surface/80 neu-raised max-w-2xl">
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-2xl font-black text-primary">{stats.totalModules}</span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                    Parts
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 text-center border-l border-border/50">
                  <span className="text-2xl font-black text-primary">{stats.totalChapters}</span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                    Chapters
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 text-center border-l border-border/50">
                  <span className="text-2xl font-black text-primary">{stats.totalProblems}+</span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                    Problems
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 text-center border-l border-border/50">
                  <span className="text-2xl font-black text-primary">100%</span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                    Rigorous Proofs
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Isometric Visual Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full max-w-lg lg:max-w-none rounded-3xl border border-border/80 bg-surface/70 p-3 sm:p-4 neu-raised shadow-float overflow-hidden group">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-border/50 bg-surface-inset">
                  <Image
                    src="/images/dsa-learnings-hero.jpg"
                    alt="Data Structures and Algorithms Architectural Blueprints & Interactive Visualizations"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient & Badge Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-background/85 backdrop-blur-md border border-border text-[11px] font-semibold text-foreground shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Interactive Visualizer Blueprints
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-primary/90 text-primary-foreground text-[10px] font-mono font-bold">
                      {stats.totalChapters} Chapters
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Interactive Explorer / Module Grid */}
        <section aria-labelledby="curriculum-heading">
          <h2 id="curriculum-heading" className="sr-only">
            Curriculum Modules &amp; Chapters Explorer
          </h2>
          <LearningsHubExplorer modules={modules} />
        </section>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}

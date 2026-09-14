import type { Metadata } from "next";
import Link from "next/link";
import { getAllModules, getCurriculumStats } from "@/lib/learnings/registry";
import { LearningsHubExplorer } from "@/components/learnings/LearningsHubExplorer";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { safeJsonLd } from "@/lib/security/safe-json";
import { SITE_NAME } from "@/lib/constants/site";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `DSA Curriculum — 62 In-Depth Chapters & Architectural Blueprints | ${SITE_NAME}`,
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
    `${SITE_NAME} learnings`,
  ],
  alternates: {
    canonical: "/learnings",
  },
  openGraph: {
    title: `DSA Curriculum — 62 In-Depth Chapters | ${SITE_NAME}`,
    description:
      "A university-level, mathematically rigorous, and visually intuitive curriculum covering all major data structures, algorithms, and interview patterns.",
    url: "/learnings",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `DSA Curriculum — 62 In-Depth Chapters | ${SITE_NAME}`,
    description:
      "Master data structures and algorithms with our university-level, mathematically rigorous, and visually intuitive curriculum.",
    images: ["/opengraph-image"],
  },
};

export default function LearningsPage() {
  const modules = getAllModules();
  const stats = getCurriculumStats();
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Definitive Data Structures & Algorithms Curriculum",
    description:
      "Comprehensive DSA curriculum covering algorithmic complexity, linear structures, hashing, searching, sorting, trees, graphs, dynamic programming, and interview patterns.",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
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
        {/* Streamlined Curriculum Header */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-border/70">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curriculum Hub &bull; {stats.totalChapters} Chapters</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-foreground">
                DSA Architectural Blueprints &amp; Proofs
              </h1>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                From mathematical intuition to physical memory layouts and interview blueprints.
                University lecture rigor meets table-based manual dry runs and interactive
                visualizers across {stats.totalModules} foundational modules.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-mono text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{stats.totalProblems}+ Problems</span>
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

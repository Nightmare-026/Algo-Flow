import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllModules, getModuleBySlug } from "@/lib/learnings/registry";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, ArrowRight, ChevronLeft, ChevronRight, Compass, Layers } from "lucide-react";

interface ModulePageProps {
  params: Promise<{
    module: string;
  }>;
}

export async function generateStaticParams() {
  const modules = getAllModules();
  return modules.map((m) => ({
    module: m.slug,
  }));
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { module: moduleSlug } = await params;
  const mod = getModuleBySlug(moduleSlug);

  if (!mod) {
    return {
      title: "Module Not Found | Algo Flow",
    };
  }

  return {
    title: `Part ${mod.partNumber.toString().padStart(2, "0")}: ${mod.title} — Syllabus | Algo Flow`,
    description: mod.shortDescription,
    openGraph: {
      title: `Part ${mod.partNumber.toString().padStart(2, "0")}: ${mod.title} | Algo Flow`,
      description: mod.shortDescription,
      type: "article",
    },
  };
}

export default async function ModuleSyllabusPage({ params }: ModulePageProps) {
  const { module: moduleSlug } = await params;
  const mod = getModuleBySlug(moduleSlug);

  if (!mod) {
    notFound();
  }

  const allModules = getAllModules();
  const currentIdx = allModules.findIndex((m) => m.slug === mod.slug);
  const prevModule = currentIdx > 0 ? allModules[currentIdx - 1] : null;
  const nextModule = currentIdx < allModules.length - 1 ? allModules[currentIdx + 1] : null;

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground mb-6"
        >
          <Link href="/learnings" className="hover:text-foreground transition-colors">
            Learnings
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            Part {mod.partNumber.toString().padStart(2, "0")}: {mod.title}
          </span>
        </nav>

        {/* Module Header Card */}
        <div className="rounded-3xl border border-border/80 bg-surface/90 p-6 sm:p-8 md:p-10 neu-raised mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
              Part {mod.partNumber.toString().padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {mod.chapters.length} Detailed Chapters
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            {mod.title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
            {mod.shortDescription}
          </p>

          <div className="pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/learnings/${mod.slug}/${mod.chapters[0].slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-colors neu-raised shadow-xs"
            >
              <span>Start Chapter 1</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/learnings"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Back to all parts
            </Link>
          </div>
        </div>

        {/* Chapters Syllabus List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>Chapters in this Module</span>
            </h2>
            <span className="text-xs text-muted-foreground">
              {mod.chapters.length} of {mod.chapters.length} total
            </span>
          </div>

          <div className="grid gap-4">
            {mod.chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/learnings/${mod.slug}/${chapter.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-surface/80 hover:bg-surface-raised p-5 md:p-6 neu-raised transition-all hover:border-primary/40"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-surface-inset text-foreground/80 font-mono text-xs font-bold shrink-0 border border-border">
                    {chapter.order.toString().padStart(2, "0")}
                  </span>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {chapter.description}
                    </p>

                    {/* Topics badges */}
                    {chapter.topicsCovered && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {chapter.topicsCovered.slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-surface-inset text-[11px] text-foreground/70 font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {chapter.visualizerLinks && chapter.visualizerLinks.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Simulator</span>
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-xl border border-border bg-surface-raised flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Module Navigation (Previous / Next Part) */}
        <div className="grid sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-border/80">
          {prevModule ? (
            <Link
              href={`/learnings/${prevModule.slug}`}
              className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-surface hover:bg-surface-raised transition-all group neu-raised text-left"
            >
              <ChevronLeft className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:-translate-x-1" />
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Previous Part
                </div>
                <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors mt-0.5">
                  Part {prevModule.partNumber.toString().padStart(2, "0")}: {prevModule.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextModule ? (
            <Link
              href={`/learnings/${nextModule.slug}`}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-surface hover:bg-surface-raised transition-all group neu-raised text-right sm:col-start-2"
            >
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Next Part
                </div>
                <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors mt-0.5">
                  Part {nextModule.partNumber.toString().padStart(2, "0")}: {nextModule.title}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}

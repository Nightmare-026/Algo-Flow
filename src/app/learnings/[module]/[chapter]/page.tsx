import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllModules, getChapterBySlugs, getChapterNavigation } from "@/lib/learnings/registry";
import { getParsedChapter } from "@/lib/learnings/content";
import { CurriculumSidebar } from "@/components/learnings/CurriculumSidebar";
import { TableOfContents } from "@/components/learnings/TableOfContents";
import { ChapterReader } from "@/components/learnings/ChapterReader";
import { ReadingProgressBar } from "@/components/learnings/ReadingProgressBar";
import { MobileCurriculumNav } from "@/components/learnings/MobileCurriculumNav";
import { ChevronRight } from "lucide-react";
import { safeJsonLd } from "@/lib/security/safe-json";
import { SITE_NAME } from "@/lib/constants/site";
import { getSiteUrl } from "@/lib/site";

interface ChapterPageProps {
  params: Promise<{
    module: string;
    chapter: string;
  }>;
}

export async function generateStaticParams() {
  const modules = getAllModules();
  return modules.flatMap((m) =>
    m.chapters.map((ch) => ({
      module: m.slug,
      chapter: ch.slug,
    }))
  );
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { module: moduleSlug, chapter: chapterSlug } = await params;
  const resolved = getChapterBySlugs(moduleSlug, chapterSlug);

  if (!resolved) {
    return {
      title: `Chapter Not Found | ${SITE_NAME}`,
    };
  }

  const { module: mod, chapter: ch } = resolved;
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/learnings/${mod.slug}/${ch.slug}`;

  return {
    title: `${ch.title} — Part ${mod.partNumber.toString().padStart(2, "0")}: ${mod.title} | ${SITE_NAME}`,
    description: ch.description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      ch.title,
      ...ch.topicsCovered,
      mod.title,
      "DSA",
      "Data Structures and Algorithms",
      "Computer Science",
      SITE_NAME,
    ],
    openGraph: {
      title: `${ch.title} | ${SITE_NAME} Learnings`,
      description: ch.description,
      url: canonicalUrl,
      type: "article",
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${ch.title} | ${SITE_NAME}`,
      description: ch.description,
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { module: moduleSlug, chapter: chapterSlug } = await params;
  const resolved = getChapterBySlugs(moduleSlug, chapterSlug);

  if (!resolved) {
    notFound();
  }

  const { module: mod, chapter: ch } = resolved;
  const content = await getParsedChapter(moduleSlug, chapterSlug);

  if (!content) {
    notFound();
  }

  const allModules = getAllModules();
  const navigation = getChapterNavigation(moduleSlug, chapterSlug);
  const siteUrl = getSiteUrl();
  const chapterUrl = `${siteUrl}/learnings/${mod.slug}/${ch.slug}`;

  // Rich SEO Structured Data (BreadcrumbList + TechArticle)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learnings",
        item: `${siteUrl}/learnings`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Part ${mod.partNumber.toString().padStart(2, "0")}: ${mod.title}`,
        item: `${siteUrl}/learnings/${mod.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: ch.title,
        item: chapterUrl,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: ch.title,
    description: ch.description,
    articleSection: mod.title,
    wordCount: content.wordCount,
    timeRequired: `PT${content.readingTimeMinutes}M`,
    inLanguage: "en",
    educationalLevel: "University / Technical Interview",
    learningResourceType: "Tutorial / Reference",
    mainEntityOfPage: chapterUrl,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
  };

  return (
    <div className="h-[calc(100vh-4.5rem)] overflow-hidden w-full px-2.5 sm:px-3.5 py-2 sm:py-2.5 flex flex-col bg-background">
      {/* Scroll Reading Progress Bar tied to the middle reader card */}
      <ReadingProgressBar targetId="chapter-reader-container" />

      {/* JSON-LD Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />

      {/* Mobile Navigation Drawer Trigger (Hidden on Desktop) */}
      <MobileCurriculumNav
        modules={allModules}
        currentModuleSlug={mod.slug}
        currentChapterSlug={ch.slug}
        tableOfContents={content.tableOfContents}
        chapterTitle={ch.title}
      />

      {/* 3 Full-Height Cards: Left (Tree Nav), Middle (Reading Reader), Right (TOC) */}
      <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 flex-1 min-h-0 w-full overflow-hidden">
        {/* LEFT CARD — Full height, scrollable curriculum tree navigation */}
        <aside className="hidden lg:flex lg:w-[280px] xl:w-[320px] 2xl:w-[340px] h-full shrink-0 min-w-0 flex-col">
          <CurriculumSidebar
            modules={allModules}
            currentModuleSlug={mod.slug}
            currentChapterSlug={ch.slug}
            currentTableOfContents={content.tableOfContents}
            className="h-full"
          />
        </aside>

        {/* MIDDLE CARD — Full height, scrollable reading article taking available space */}
        <main
          id="chapter-reader-container"
          className="flex-1 h-full min-w-0 overflow-y-auto custom-scrollbar rounded-2xl border border-border/80 bg-surface/90 shadow-[var(--shadow-raised)] p-5 sm:p-7 md:p-9"
        >
          {/* Breadcrumbs inside the reading card */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-1"
          >
            <Link href="/learnings" className="hover:text-foreground transition-colors">
              Learnings
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            <Link
              href={`/learnings/${mod.slug}`}
              className="hover:text-foreground transition-colors"
            >
              Part {mod.partNumber.toString().padStart(2, "0")}: {mod.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            <span className="text-foreground font-semibold truncate">{ch.title}</span>
          </nav>

          <ChapterReader module={mod} chapter={ch} content={content} navigation={navigation} />
        </main>

        {/* RIGHT CARD — Full height, scrollable table of contents */}
        <aside className="hidden lg:flex lg:w-[175px] xl:w-[200px] 2xl:w-[220px] h-full shrink-0 min-w-0 flex-col">
          <TableOfContents items={content.tableOfContents} className="h-full" />
        </aside>
      </div>
    </div>
  );
}

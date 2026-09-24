import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllModules, getChapterBySlugs, getChapterNavigation } from "@/lib/learnings/registry";
import { getParsedChapter } from "@/lib/learnings/content";
import { ChapterLayoutContainer } from "@/components/learnings/ChapterLayoutContainer";
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
  // Re-generate static params for all curriculum chapters (v2)
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
      title: "Chapter Not Found",
    };
  }

  const { module: mod, chapter: ch } = resolved;
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/learnings/${mod.slug}/${ch.slug}`;

  return {
    title: `${ch.title} — Part ${mod.partNumber.toString().padStart(2, "0")}: ${mod.title}`,
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
    <>
      {/* JSON-LD Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />

      <ChapterLayoutContainer
        module={mod}
        chapter={ch}
        allModules={allModules}
        content={content}
        navigation={navigation}
      />
    </>
  );
}

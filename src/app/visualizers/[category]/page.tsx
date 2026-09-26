import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ChevronRight, Home } from "lucide-react";
import { dataStructures } from "@/data/seed/data-structures";
import { algorithms } from "@/data/seed/algorithms";
import { operations } from "@/data/seed/operations";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { CategoryExplorer } from "./CategoryExplorer";
import { getSiteUrl } from "@/lib/site";
import { safeJsonLd } from "@/lib/security/safe-json";
import { SITE_NAME } from "@/lib/constants/site";

export function generateStaticParams() {
  return dataStructures
    .filter((structure) => structure.isPublished)
    .map((structure) => ({ category: structure.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const structure = dataStructures.find((item) => item.slug === category && item.isPublished);
  if (!structure) return {};

  const title = `${structure.name} Algorithms & Visualizers`;
  const description = `Explore interactive step-by-step visualizers and traces for ${structure.name} algorithms and data structures.`;
  return {
    title,
    description,
    alternates: { canonical: `/visualizers/${structure.slug}` },
    openGraph: {
      title,
      description,
      url: `/visualizers/${structure.slug}`,
      siteName: SITE_NAME,
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: `${structure.name} Visualizers` },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const structure = dataStructures.find((item) => item.slug === category && item.isPublished);

  if (!structure) {
    return (
      <div className="page-shell flex min-h-screen flex-col">
        <Navbar />
        <main
          id="main-content"
          className="flex flex-1 items-center justify-center px-4 pb-20 pt-32"
        >
          <div className="max-w-lg rounded-[8px] p-8 sm:p-10 text-center border border-border bg-surface shadow-elevated">
            <AlertCircle className="mx-auto h-12 w-12 text-error" aria-hidden="true" />
            <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold font-display text-text-primary">
              Structure Not Found
            </h1>
            <p className="mt-3 text-sm text-text-secondary">
              The requested data structure category is not in the published library.
            </p>
            <Link href="/visualizers" className={buttonVariants({ className: "mt-6" })}>
              Return to Visualizer Library
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const structureAlgorithms = algorithms
    .filter((algorithm) => algorithm.isPublished && algorithm.dataStructureId === structure.id)
    .sort((left, right) =>
      left.priority === right.priority
        ? left.name.localeCompare(right.name)
        : left.priority.localeCompare(right.priority)
    );

  const operationCounts = new Map<string, number>();
  for (const algorithm of structureAlgorithms) {
    operationCounts.set(
      algorithm.operationId,
      (operationCounts.get(algorithm.operationId) ?? 0) + 1
    );
  }

  const seenOpNames = new Set<string>();
  const structureOperations = operations
    .filter(
      (operation) =>
        operation.dataStructureId === structure.id &&
        operation.isPublished &&
        (operationCounts.get(operation.id) ?? 0) > 0
    )
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .filter((op) => {
      if (seenOpNames.has(op.name)) return false;
      seenOpNames.add(op.name);
      return true;
    });

  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/visualizers/${structure.slug}/#webpage`,
        url: `${siteUrl}/visualizers/${structure.slug}`,
        name: `${structure.name} Visualizers | ${SITE_NAME}`,
        description: structure.description,
      },
      {
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
            name: "Visualizer Library",
            item: `${siteUrl}/visualizers`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${structure.name} Visualizers`,
            item: `${siteUrl}/visualizers/${structure.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />
      <Navbar />
      <main id="main-content" className="flex-1 px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb Bar */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs font-semibold text-text-muted"
          >
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <Link href="/visualizers" className="hover:text-primary transition-colors">
              Library
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <span className="text-text-primary">{structure.name}</span>
          </nav>

          {/* Header */}
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold font-display sm:text-4xl lg:text-5xl text-text-primary">
              {structure.name} <span className="text-gradient-primary">Algorithms</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-text-secondary">
              {structure.description} Choose an algorithm below to launch its interactive simulation
              workstation.
            </p>
          </div>

          <CategoryExplorer
            structure={structure}
            structureAlgorithms={structureAlgorithms}
            structureOperations={structureOperations}
            operationCounts={operationCounts}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

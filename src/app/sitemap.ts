import type { MetadataRoute } from "next";
import { algorithms } from "@/data/seed/algorithms";
import { dataStructures } from "@/data/seed/data-structures";
import { getSiteUrl } from "@/lib/site";

const lastModified = new Date(process.env.BUILD_TIME || "2026-03-01T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const staticRoutes = [
    "",
    "/visualizers",
    "/privacy",
    "/terms",
    "/license",
    "/cookies",
    "/mental-math",
    "/mental-math/practice",
    "/mental-math/speed",
    "/mental-math/test",
    "/mental-math/daily",
    "/mental-math/leaderboard",
    "/mental-math/progress",
  ];
  const structureRoutes = dataStructures
    .filter((structure) => structure.isPublished)
    .map((structure) => `/visualizers/${structure.slug}`);
  const algorithmRoutes = Array.from(
    new Set(
      algorithms
        .filter((algorithm) => algorithm.isPublished)
        .map((algorithm) => `/visualizer/${algorithm.slug}`)
    )
  );

  return [...staticRoutes, ...structureRoutes, ...algorithmRoutes].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path.startsWith("/visualizer/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path === "/visualizers" ? 0.9 : 0.7,
  }));
}

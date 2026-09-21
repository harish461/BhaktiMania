import type { MetadataRoute } from "next";
import { getCategories, getPublishedArticles } from "@/lib/data/supabase";
import { siteConfig } from "@/lib/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url ? siteConfig.url.replace(/\/$/, "") : "";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${base}/bhakti-gyaan`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/privacy-policy`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/terms`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/disclaimer`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/affiliate-disclosure`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let categoryRoutes: MetadataRoute.Sitemap = [];
  let articleRoutes: MetadataRoute.Sitemap = [];

  try {
    const [categories, articles] = await Promise.all([
      getCategories(),
      getPublishedArticles(),
    ]);

    categoryRoutes = categories.map((category) => ({
      url: `${base}/${category.slug}`,
      changeFrequency: "daily",
      priority: 0.85,
    }));

    articleRoutes = articles.map((article) => {
      const dateStr =
        article.updatedAtIso ||
        article.publishedAtIso ||
        article.rawUpdatedAt ||
        article.rawPublishedAt;

      return {
        url: `${base}/bhakti-gyaan/${article.slug}`,
        ...(dateStr ? { lastModified: new Date(dateStr) } : {}),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });
  } catch (err: unknown) {
    console.error("[sitemap] Error generating sitemap routes:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}

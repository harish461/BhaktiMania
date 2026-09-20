import type { MetadataRoute } from "next";
import { getCategories, getPublishedArticles } from "@/lib/data/supabase";
import { siteConfig } from "@/lib/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url ? siteConfig.url.replace(/\/$/, "") : "";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${base}/bhakti-gyaan`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/affiliate-disclosure`,
      lastModified: new Date(),
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
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    }));

    articleRoutes = articles.map((article) => ({
      url: `${base}/bhakti-gyaan/${article.slug}`,
      lastModified: article.rawPublishedAt ? new Date(article.rawPublishedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err: unknown) {
    console.error("[sitemap] Error generating sitemap routes:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/content/CategoryPage";
import {
  getCategoryBySlug,
  getArticlesByCategory,
  getRelatedCategories,
} from "@/lib/data/supabase";
import { getCanonicalUrl } from "@/lib/config/site";

const CATEGORY_SLUG = "shiv";

export async function generateMetadata(): Promise<Metadata> {
  const category = await getCategoryBySlug(CATEGORY_SLUG);
  if (!category) return {};

  const title = category.metaTitle || category.title;
  const description = category.description;
  const canonical = getCanonicalUrl(`/${category.slug}`) || `/${category.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | BhaktiMania`,
      description,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | BhaktiMania`,
      description,
    },
  };
}

export default async function ShivPage() {
  const category = await getCategoryBySlug(CATEGORY_SLUG);
  if (!category) notFound();

  const [articles, relatedCategories] = await Promise.all([
    getArticlesByCategory(category.slug),
    getRelatedCategories(category.slug),
  ]);

  return (
    <CategoryPage
      category={category}
      articles={articles}
      relatedCategories={relatedCategories}
    />
  );
}

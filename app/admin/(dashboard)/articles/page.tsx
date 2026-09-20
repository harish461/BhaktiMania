import React from "react";
import { getCategories, getAdminArticles } from "@/lib/data/supabase";
import ArticleListClient from "@/components/admin/ArticleListClient";

export const metadata = {
  title: "Articles",
};

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([
    getAdminArticles(),
    getCategories(),
  ]);

  return (
    <ArticleListClient
      initialArticles={articles}
      categories={categories}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
    />
  );
}


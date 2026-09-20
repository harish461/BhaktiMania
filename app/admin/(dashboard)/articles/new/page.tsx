import React from "react";
import { getCategories, getAllAuthorsForEditor } from "@/lib/data/supabase";
import ArticleEditor from "@/components/admin/ArticleEditor";

export const metadata = {
  title: "Create Article",
};

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAllAuthorsForEditor(),
  ]);

  return (
    <ArticleEditor
      mode="create"
      categories={categories}
      authors={authors}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
    />
  );
}

import React from "react";
import {
  getCategories,
  getAllAuthorsForEditor,
  getAllActiveAffiliateProducts,
} from "@/lib/data/supabase";
import ArticleEditor from "@/components/admin/ArticleEditor";

export const metadata = {
  title: "Create Article",
};

export default async function NewArticlePage() {
  const [categories, authors, affiliateProducts] = await Promise.all([
    getCategories(),
    getAllAuthorsForEditor(),
    getAllActiveAffiliateProducts(),
  ]);

  return (
    <ArticleEditor
      mode="create"
      categories={categories}
      authors={authors}
      allActiveProducts={affiliateProducts}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
    />
  );
}


import React from "react";
import { notFound } from "next/navigation";
import {
  getAllCategoriesForEditor,
  getAllAuthorsForEditor,
  getAdminArticleById,
  getAllActiveAffiliateProducts,
} from "@/lib/data/supabase";
import ArticleEditor from "@/components/admin/ArticleEditor";

export const metadata = {
  title: "Edit Article",
};

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  const [article, categories, authors, affiliateProducts] = await Promise.all([
    getAdminArticleById(id),
    getAllCategoriesForEditor(),
    getAllAuthorsForEditor(),
    getAllActiveAffiliateProducts(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <ArticleEditor
      mode="edit"
      initialArticle={article}
      categories={categories}
      authors={authors}
      allActiveProducts={affiliateProducts}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
    />
  );
}


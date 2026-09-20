import React from "react";
import { notFound } from "next/navigation";
import {
  getAllCategoriesForEditor,
  getAllAuthorsForEditor,
  getAdminArticleById,
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

  const [article, categories, authors] = await Promise.all([
    getAdminArticleById(id),
    getAllCategoriesForEditor(),
    getAllAuthorsForEditor(),
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
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
    />
  );
}

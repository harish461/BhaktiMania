import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminCategoryById } from "@/lib/data/supabase/admin";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditCategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getAdminCategoryById(id);
  return {
    title: category ? `Edit Category: ${category.title}` : "Edit Category",
  };
}

export default async function AdminEditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getAdminCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <CategoryForm
      initialData={category}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
    />
  );
}

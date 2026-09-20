import React from "react";
import type { Metadata } from "next";
import { getAdminCategories } from "@/lib/data/supabase/admin";
import CategoryListClient from "@/components/admin/categories/CategoryListClient";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <CategoryListClient
      initialCategories={categories}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
    />
  );
}

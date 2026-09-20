import React from "react";
import type { Metadata } from "next";
import { getAdminCategories } from "@/lib/data/supabase/admin";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

export const metadata: Metadata = {
  title: "Create Category",
};

export default async function AdminNewCategoryPage() {
  const existingCategories = await getAdminCategories();
  const nextSortOrder = existingCategories.length + 1;

  return (
    <CategoryForm
      defaultSortOrder={nextSortOrder}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
    />
  );
}

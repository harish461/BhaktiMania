import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminAuthorById } from "@/lib/data/supabase/admin";
import { AuthorForm } from "@/components/admin/authors/AuthorForm";

interface EditAuthorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditAuthorPageProps): Promise<Metadata> {
  const { id } = await params;
  const author = await getAdminAuthorById(id);
  return {
    title: author ? `Edit Author: ${author.name}` : "Edit Author",
  };
}

export default async function AdminEditAuthorPage({
  params,
}: EditAuthorPageProps) {
  const { id } = await params;
  const author = await getAdminAuthorById(id);

  if (!author) {
    notFound();
  }

  return (
    <AuthorForm
      initialData={author}
      isEditMode={true}
    />
  );
}

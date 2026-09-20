import React from "react";
import type { Metadata } from "next";
import { getAdminAuthors } from "@/lib/data/supabase/admin";
import AuthorListClient from "@/components/admin/authors/AuthorListClient";

export const metadata: Metadata = {
  title: "Authors",
};

export default async function AdminAuthorsPage() {
  const authors = await getAdminAuthors();

  return <AuthorListClient initialAuthors={authors} />;
}

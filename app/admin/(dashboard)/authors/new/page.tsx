import React from "react";
import type { Metadata } from "next";
import { AuthorForm } from "@/components/admin/authors/AuthorForm";

export const metadata: Metadata = {
  title: "New Author",
};

export default function AdminNewAuthorPage() {
  return <AuthorForm isEditMode={false} />;
}

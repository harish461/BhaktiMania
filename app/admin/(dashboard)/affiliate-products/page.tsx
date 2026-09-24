import React from "react";
import type { Metadata } from "next";
import { getAdminAffiliateProducts } from "@/lib/data/supabase/admin";
import AffiliateProductListClient from "@/components/admin/affiliate/AffiliateProductListClient";

export const metadata: Metadata = {
  title: "Affiliate Products — Admin Dashboard",
};

export default async function AdminAffiliateProductsPage() {
  const products = await getAdminAffiliateProducts();

  return <AffiliateProductListClient initialProducts={products} />;
}

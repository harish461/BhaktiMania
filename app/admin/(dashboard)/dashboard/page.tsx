import React from "react";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { getAdminDashboardData, getAdminAffiliateProducts } from "@/lib/data/supabase/admin";
import { DashboardKPICards } from "@/components/admin/dashboard/DashboardKPICards";
import { DashboardAnalyticsSection } from "@/components/admin/dashboard/DashboardAnalyticsSection";
import { DashboardRecentArticlesTable } from "@/components/admin/dashboard/DashboardRecentArticlesTable";
import { DashboardErrorBanner } from "@/components/admin/dashboard/DashboardErrorBanner";
import { PlusIcon } from "@/components/admin/icons";

export const metadata = {
  title: "Admin Dashboard | BhaktiMania",
  description: "Modern SaaS administrative control center and content overview for BhaktiMania.",
};

export default async function AdminDashboardPage() {
  const auth = await getCurrentAdmin();

  const [data, affiliateProducts] = await Promise.all([
    getAdminDashboardData(),
    getAdminAffiliateProducts().catch(() => []),
  ]);

  return (
    <div
      className="space-y-6 sm:space-y-7 pb-10"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
    >
      {/* ── 1. PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[27px] font-bold text-[#111827] tracking-tight leading-tight">
            Dashboard Overview
          </h1>
          <p className="text-[13px] sm:text-[13.5px] text-[#6B7280] mt-1">
            Welcome back, <span className="text-[#111827] font-medium">{auth.user?.email?.split("@")[0] || "Admin"}</span>. Here&apos;s what&apos;s happening with your BhaktiMania platform today.
          </p>
        </div>

        {/* Primary Page Action */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-[8px] bg-[#C85A17] hover:bg-[#A8440B] text-white text-[13px] font-semibold transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] focus-visible:ring-offset-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Article</span>
          </Link>
        </div>
      </div>

      {/* Optional Database Warning Banner (if errors exist) */}
      <DashboardErrorBanner errors={data.errors} />

      {/* ── 2. ROW OF 4 KPI SUMMARY CARDS ── */}
      <DashboardKPICards
        stats={data.stats}
        productsCount={affiliateProducts.length}
      />

      {/* ── 3. MAIN ANALYTICS & CATEGORY BREAKDOWN ── */}
      <DashboardAnalyticsSection
        categories={data.categoriesOverview}
        totalArticles={data.stats?.totalArticles ?? 0}
      />

      {/* ── 4. RECENT ARTICLES TABLE ── */}
      <DashboardRecentArticlesTable
        articles={data.recentUpdatedArticles}
      />
    </div>
  );
}

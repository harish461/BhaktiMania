import React from "react";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { getAdminDashboardData } from "@/lib/data/supabase/admin";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { DashboardStatsGrid } from "@/components/admin/dashboard/DashboardStatsGrid";
import { RecentlyUpdatedSection } from "@/components/admin/dashboard/RecentlyUpdatedSection";
import { RecentlyPublishedSection } from "@/components/admin/dashboard/RecentlyPublishedSection";
import { CategoryOverviewSection } from "@/components/admin/dashboard/CategoryOverviewSection";
import { AuthorOverviewSection } from "@/components/admin/dashboard/AuthorOverviewSection";
import { DashboardErrorBanner } from "@/components/admin/dashboard/DashboardErrorBanner";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | BhaktiMania",
  description: "Administrative control center and content overview for BhaktiMania.",
};

export default async function AdminDashboardPage() {
  const auth = await getCurrentAdmin();

  const data = await getAdminDashboardData();

  // Server-generated timestamp (no client component required)
  const now = new Date();
  const serverTimestamp = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner */}
      <DashboardHeader
        userEmail={auth.user?.email}
        userRole={auth.role}
        serverTimestamp={serverTimestamp}
      />

      {/* Optional Error Banner (Graceful Degradation) */}
      <DashboardErrorBanner errors={data.errors} />

      {/* 2. Quick Actions */}
      <QuickActions />

      {/* 3. Content Metrics Grid (8 Authoritative Stats) */}
      <DashboardStatsGrid stats={data.stats} />

      {/* 4. Section 2: Recently Updated Articles */}
      <RecentlyUpdatedSection articles={data.recentUpdatedArticles} />

      {/* 5. Section 3: Recently Published & Side Overviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recently Published Articles (7 cols on lg) */}
        <div className="lg:col-span-7">
          <RecentlyPublishedSection articles={data.recentPublishedArticles} />
        </div>

        {/* Categories & Authors Overviews (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-8">
          <CategoryOverviewSection categories={data.categoriesOverview} />
          <AuthorOverviewSection authors={data.authorsOverview} />
        </div>
      </div>

      {/* Administrative System Status Footer Note */}
      <div className="bg-white border border-[#6B1724]/15 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#6B1724]">
              BhaktiMania Content Management System
            </h3>
            <p className="text-xs text-[#5A6065] mt-1 leading-relaxed">
              Authenticated admin: <span className="font-mono text-[#1F2326] font-medium">{auth.user?.email}</span>. Content management, categorization, and author bylines are synchronized live with Supabase.
            </p>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold text-[#6B1724] hover:text-[#52111C] hover:underline shrink-0 min-h-[44px] inline-flex items-center"
          >
            ← View Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

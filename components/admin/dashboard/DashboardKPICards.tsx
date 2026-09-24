import React from "react";
import Link from "next/link";
import type { DashboardStats } from "@/lib/data/supabase/admin";
import {
  FileTextIcon,
  CheckCircleIcon,
  FolderIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
} from "@/components/admin/icons";

interface DashboardKPICardsProps {
  stats: DashboardStats | null;
  productsCount: number;
}

export function DashboardKPICards({ stats, productsCount }: DashboardKPICardsProps) {
  const cards = [
    {
      id: "total-articles",
      label: "Total Articles",
      value: stats?.totalArticles ?? 0,
      subtext: `${stats?.publishedArticles ?? 0} published • ${stats?.draftArticles ?? 0} drafts`,
      href: "/admin/articles",
      icon: FileTextIcon,
      badge: "In Catalog",
      badgeColor: "bg-[#FFF7ED] text-[#C85A17]",
      iconBg: "bg-[#FFF7ED] text-[#C85A17] border border-[#FED7AA]/50",
    },
    {
      id: "published-articles",
      label: "Published Articles",
      value: stats?.publishedArticles ?? 0,
      subtext: "Live on public website",
      href: "/admin/articles?status=published",
      icon: CheckCircleIcon,
      badge: "Active",
      badgeColor: "bg-[#ECFDF5] text-[#059669]",
      iconBg: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/50",
    },
    {
      id: "categories",
      label: "Content Categories",
      value: stats?.totalCategories ?? 0,
      subtext: `${stats?.activeCategories ?? 0} active sections`,
      href: "/admin/categories",
      icon: FolderIcon,
      badge: "Taxonomy",
      badgeColor: "bg-[#EEF2FF] text-[#4F46E5]",
      iconBg: "bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]/50",
    },
    {
      id: "shop-products",
      label: "Shop Products",
      value: productsCount,
      subtext: "Curated affiliate essentials",
      href: "/admin/affiliate-products",
      icon: ShoppingBagIcon,
      badge: "Commerce",
      badgeColor: "bg-[#FEF3C7] text-[#D97706]",
      iconBg: "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.id}
            href={card.href}
            className="group bg-white rounded-[14px] p-5 sm:p-6 border border-[#EEEEEE] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-[#DCDCDC] transition-all flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17]"
          >
            {/* Top row: Label and Icon Container */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[13px] font-medium text-[#6B7280]">
                  {card.label}
                </span>
                <div className="text-[30px] font-bold text-[#111827] mt-1.5 tracking-tight leading-none group-hover:text-[#C85A17] transition-colors">
                  {card.value}
                </div>
              </div>

              <div
                className={`w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${card.iconBg}`}
                aria-hidden="true"
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Bottom row: Supporting Information & Trend Badge */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11.5px]">
              <span className="text-[#6B7280] font-normal truncate mr-2">
                {card.subtext}
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold shrink-0 ${card.badgeColor}`}
              >
                <TrendingUpIcon className="w-3 h-3" />
                <span>{card.badge}</span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

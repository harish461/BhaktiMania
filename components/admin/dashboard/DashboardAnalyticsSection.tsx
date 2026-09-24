"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AdminCategoryListItem } from "@/lib/data/supabase/admin";

interface DashboardAnalyticsSectionProps {
  categories: AdminCategoryListItem[];
  totalArticles: number;
}

export function DashboardAnalyticsSection({
  categories,
  totalArticles,
}: DashboardAnalyticsSectionProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "12m">("30d");

  // Chart data points for 12 months / 30 days
  const points = [
    { label: "Jan", val: 8, articles: 8 },
    { label: "Feb", val: 12, articles: 12 },
    { label: "Mar", val: 18, articles: 18 },
    { label: "Apr", val: 24, articles: 24 },
    { label: "May", val: 32, articles: 32 },
    { label: "Jun", val: 45, articles: 45 },
    { label: "Jul", val: 60, articles: 60 },
    { label: "Aug", val: 78, articles: 78 },
    { label: "Sep", val: 95, articles: 95 },
    { label: "Oct", val: 110, articles: 110 },
    { label: "Nov", val: 122, articles: 122 },
    { label: "Dec", val: 128, articles: 128 },
  ];

  // SVG Area Chart geometry calculations
  const maxVal = 140;
  const chartWidth = 600;
  const chartHeight = 180;
  const paddingX = 20;
  const paddingY = 20;

  const getCoordinates = () => {
    return points.map((p, i) => {
      const x = paddingX + (i / (points.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - paddingY - (p.val / maxVal) * (chartHeight - paddingY * 2);
      return { x, y, ...p };
    });
  };

  const coords = getCoordinates();

  // Create smooth SVG cubic bezier path
  const linePath = coords.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, "");

  // Create filled area path
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${chartHeight - paddingY} L ${coords[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
      {/* ── Left 7/12: Content Performance & Publishing Cadence ── */}
      <div className="lg:col-span-8 bg-white rounded-[14px] p-6 border border-[#EEEEEE] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
          <div>
            <h3 className="text-[15px] font-bold text-[#111827]">
              Content Publishing Velocity
            </h3>
            <p className="text-[12px] text-[#6B7280] mt-0.5">
              Cumulative editorial growth and publication trend
            </p>
          </div>

          {/* Time Range Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#F7F7F5] rounded-lg border border-[#E5E7EB] self-start sm:self-auto">
            {(
              [
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "12m", label: "12 Months" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1 rounded-[6px] text-[11.5px] font-medium transition-all cursor-pointer ${
                  timeRange === t.id
                    ? "bg-white text-[#C85A17] font-semibold shadow-xs"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Modern SVG Chart */}
        <div className="py-4">
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-[180px] overflow-visible"
              aria-label="Content publication trend chart"
            >
              <defs>
                <linearGradient id="saffronGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C85A17" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#C85A17" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area Gradient */}
              <path d={areaPath} fill="url(#saffronGradient)" />

              {/* Curve Line */}
              <path
                d={linePath}
                fill="none"
                stroke="#C85A17"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Data Points */}
              {coords.map((c, i) => (
                <g key={c.label}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={i === coords.length - 1 ? 4.5 : 2.5}
                    fill={i === coords.length - 1 ? "#C85A17" : "#FFFFFF"}
                    stroke="#C85A17"
                    strokeWidth={i === coords.length - 1 ? 2.5 : 1.8}
                    className="transition-all hover:r-5 cursor-pointer"
                  />
                  {/* X-axis labels */}
                  {(i % 2 === 0 || i === coords.length - 1) && (
                    <text
                      x={c.x}
                      y={chartHeight - 4}
                      textAnchor="middle"
                      className="text-[10px] fill-[#9CA3AF] font-sans"
                    >
                      {c.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Footer Metrics Row */}
        <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="block text-[11px] text-[#6B7280]">Total In Catalog</span>
            <span className="text-[15px] font-bold text-[#111827] mt-0.5 block">
              {totalArticles} Articles
            </span>
          </div>
          <div className="border-x border-gray-100">
            <span className="block text-[11px] text-[#6B7280]">Target Pace</span>
            <span className="text-[15px] font-bold text-[#059669] mt-0.5 block">
              100% On Schedule
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-[#6B7280]">Average Read Time</span>
            <span className="text-[15px] font-bold text-[#C85A17] mt-0.5 block">
              5.2 Minutes
            </span>
          </div>
        </div>
      </div>

      {/* ── Right 5/12: Category Distribution ── */}
      <div className="lg:col-span-4 bg-white rounded-[14px] p-6 border border-[#EEEEEE] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
            <div>
              <h3 className="text-[15px] font-bold text-[#111827]">
                Content Categories
              </h3>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                Distribution across spiritual verticals
              </p>
            </div>
            <Link
              href="/admin/categories"
              className="text-[12px] font-semibold text-[#C85A17] hover:underline"
            >
              Manage →
            </Link>
          </div>

          {/* Categories Progress Bars */}
          <div className="mt-4 space-y-4">
            {categories.slice(0, 5).map((cat, idx) => {
              const count = cat.articleCount ?? 0;
              const percentage = totalArticles > 0 ? Math.round((count / totalArticles) * 100) : 0;
              const colors = [
                "bg-[#C85A17]",
                "bg-[#D97706]",
                "bg-[#059669]",
                "bg-[#4F46E5]",
                "bg-[#7C3AED]",
              ];
              const barColor = colors[idx % colors.length];

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-[#1F2937] truncate max-w-[160px]" title={cat.title}>
                      {cat.title}
                    </span>
                    <span className="text-[#6B7280] font-mono text-[11.5px]">
                      {count} ({percentage}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Link Footer */}
        <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[12px]">
          <span className="text-[#6B7280]">
            {categories.length} total categories registered
          </span>
          <Link
            href="/admin/categories/new"
            className="text-[#C85A17] font-semibold hover:underline"
          >
            + Add New
          </Link>
        </div>
      </div>
    </div>
  );
}

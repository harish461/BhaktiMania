import React from "react";
import Link from "next/link";

interface QuickActionItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  primary?: boolean;
}

const ACTIONS: QuickActionItem[] = [
  {
    title: "New Article",
    description: "Compose and publish new devotional content",
    href: "/admin/articles/new",
    icon: "✍️",
    badge: "Create",
    primary: true,
  },
  {
    title: "Manage Articles",
    description: "Browse, filter, edit, and organize all articles",
    href: "/admin/articles",
    icon: "📄",
  },
  {
    title: "Manage Categories",
    description: "Review devotional topics, order, and metadata",
    href: "/admin/categories",
    icon: "🗂️",
  },
  {
    title: "Manage Authors",
    description: "View contributors, roles, and scholarly bylines",
    href: "/admin/authors",
    icon: "👥",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B1724]">
          Quick Actions
        </h2>
        <span className="text-xs text-[#5A6065]">Primary management portals</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-start gap-3.5 p-4 rounded-xl border transition-all min-h-[44px] ${
              item.primary
                ? "bg-[#6B1724] border-[#52111C] text-white hover:bg-[#52111C] shadow-sm"
                : "bg-white border-[#6B1724]/15 hover:border-[#6B1724]/35 hover:bg-[#FDFBF7]/80 text-[#1F2326] shadow-sm"
            }`}
          >
            <span
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                item.primary ? "bg-white/15" : "bg-[#FDFBF7] border border-[#6B1724]/10"
              }`}
              aria-hidden="true"
            >
              {item.icon}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1.5">
                <span
                  className={`text-sm font-semibold truncate ${
                    item.primary ? "text-white" : "text-[#1F2326] group-hover:text-[#6B1724]"
                  }`}
                >
                  {item.title}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 uppercase">
                    {item.badge}
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${
                  item.primary ? "text-white/80" : "text-[#5A6065]"
                }`}
              >
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

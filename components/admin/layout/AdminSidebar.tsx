"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  FolderIcon,
  UsersIcon,
  ShoppingBagIcon,
  ExternalLinkIcon,
  LogOutIcon,
} from "@/components/admin/icons";

interface AdminSidebarProps {
  userEmail?: string | null;
  userRole?: string | null;
  onCloseMobile?: () => void;
}

interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  external?: boolean;
}

interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export function AdminSidebar({ userEmail, userRole, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const navGroups: SidebarNavGroup[] = [
    {
      title: "MAIN",
      items: [
        {
          label: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboardIcon,
          exact: true,
        },
      ],
    },
    {
      title: "CONTENT",
      items: [
        {
          label: "Articles",
          href: "/admin/articles",
          icon: FileTextIcon,
          exact: false,
        },
        {
          label: "Categories",
          href: "/admin/categories",
          icon: FolderIcon,
          exact: false,
        },
        {
          label: "Authors",
          href: "/admin/authors",
          icon: UsersIcon,
          exact: false,
        },
      ],
    },
    {
      title: "COMMERCE",
      items: [
        {
          label: "Affiliate Products",
          href: "/admin/affiliate-products",
          icon: ShoppingBagIcon,
          exact: false,
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          label: "Public Website",
          href: "/",
          icon: ExternalLinkIcon,
          exact: false,
          external: true,
        },
      ],
    },
  ];

  // Derive display initials from user email
  const displayInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "A";
  const displayRole = userRole === "admin" ? "Administrator" : "Editor";

  return (
    <aside
      className="w-[235px] shrink-0 bg-white border-r border-[#E8E8E8] flex flex-col justify-between h-screen sticky top-0 z-40 select-none"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
      aria-label="Admin Sidebar Navigation"
    >
      {/* ── Top Area: Branding & Navigation ── */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-[68px] px-5 flex items-center gap-3 border-b border-[#E8E8E8] shrink-0">
          <Link
            href="/admin/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-lg"
          >
            {/* Upper circular logo */}
            <div className="relative w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-b from-[#D8B45A] via-[#C89A3C] to-[#A8440B] shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                <Image
                  src="/images/bhaktimania-logo.jpg"
                  alt="BhaktiMania Admin Logo"
                  fill
                  className="object-cover object-center"
                  sizes="32px"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[14.5px] font-bold text-[#1F2937] leading-tight tracking-tight">
                BhaktiMania
              </span>
              <span className="text-[10.5px] font-medium text-[#6B7280] leading-none mt-0.5">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Grouped Navigation */}
        <nav className="p-3.5 space-y-5 flex-1" aria-label="Admin Sections">
          {navGroups.map((group) => (
            <div key={group.title}>
              <span className="block text-[10.5px] font-semibold text-[#9CA3AF] tracking-[0.09em] uppercase px-3 mb-1.5">
                {group.title}
              </span>

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href) && item.href !== "/";

                  if (item.external) {
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17]"
                        >
                          <Icon className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#6B7280] transition-colors shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] ${
                          isActive
                            ? "bg-[#F7F7F5] text-[#C85A17] font-semibold"
                            : "text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] font-medium"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? "text-[#C85A17]"
                              : "text-[#9CA3AF] group-hover:text-[#6B7280]"
                          }`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Bottom Area: Authenticated Admin Profile Footer ── */}
      <div className="p-3.5 border-t border-[#E8E8E8] bg-[#FDFDFD] shrink-0">
        <div className="flex items-center justify-between gap-2.5 p-2 rounded-lg bg-[#F7F7F5] border border-[#EEEEEE]">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C85A17] to-[#D97706] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              {displayInitial}
            </div>

            <div className="flex flex-col min-w-0">
              <span
                className="text-[12px] font-semibold text-[#1F2937] truncate"
                title={userEmail || "Admin User"}
              >
                {userEmail || "Administrator"}
              </span>
              <span className="text-[10.5px] text-[#6B7280] font-normal leading-none mt-0.5">
                {displayRole}
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <form action="/admin/auth/logout" method="POST" className="shrink-0">
            <button
              type="submit"
              title="Logout from admin session"
              className="p-1.5 rounded-[6px] text-[#6B7280] hover:text-[#DC2626] hover:bg-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
              aria-label="Logout"
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

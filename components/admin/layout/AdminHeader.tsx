"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  MenuIcon,
} from "@/components/admin/icons";

interface AdminHeaderProps {
  userEmail?: string | null;
  userRole?: string | null;
  onOpenMobile?: () => void;
}

export function AdminHeader({ userEmail, userRole, onOpenMobile }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const displayInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "A";
  const displayRole = userRole === "admin" ? "Administrator" : "Editor";

  return (
    <header
      className="h-[68px] bg-white border-b border-[#E8E8E8] sticky top-0 z-30 px-6 flex items-center justify-between gap-4"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
    >
      {/* ── Left Area: Mobile Trigger & Search Bar ── */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-[#4B5563] hover:text-[#111827] hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17]"
          aria-label="Open sidebar menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Global Admin Search Bar */}
        <div className="relative w-[280px] sm:w-[340px]">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#9CA3AF]">
            <SearchIcon className="w-4 h-4" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, categories, authors..."
            className="w-full h-10 pl-9 pr-3.5 text-[13px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] text-[#1F2937] placeholder-[#9CA3AF] transition-all focus:outline-none focus:border-[#C85A17] focus:ring-1 focus:ring-[#C85A17]"
          />
        </div>
      </div>

      {/* ── Right Area: Quick Links, Notification & Profile ── */}
      <div className="flex items-center gap-3.5">
        {/* Public Website Preview Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#4B5563] hover:text-[#C85A17] hover:border-[#C85A17]/40 text-[12.5px] font-medium transition-colors"
          title="Open BhaktiMania live public website"
        >
          <span>Live Site</span>
          <ExternalLinkIcon className="w-3.5 h-3.5" />
        </Link>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-full text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17]"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5" />
          {/* Subtle indicator dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C85A17]" />
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-[#E5E7EB]" aria-hidden="true" />

        {/* Admin Profile Display */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C85A17] to-[#D97706] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
            {displayInitial}
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span
              className="text-[12.5px] font-semibold text-[#1F2937] leading-tight max-w-[140px] truncate"
              title={userEmail || "Admin"}
            >
              {userEmail ? userEmail.split("@")[0] : "Admin"}
            </span>
            <span className="text-[10.5px] text-[#6B7280] leading-none mt-0.5">
              {displayRole}
            </span>
          </div>

          <ChevronDownIcon className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

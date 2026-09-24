"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { SocialTabs } from "./SocialTabs";
import { FacebookPosts } from "./FacebookPosts";
import { YouTubeVideos } from "./YouTubeVideos";
import { mockFacebookPosts } from "@/lib/social/facebook";
import { mockYouTubeVideos } from "@/lib/social/youtube";
import type { SocialPlatform } from "@/lib/social/types";

interface SocialDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SocialDrawer({ isOpen, onClose }: SocialDrawerProps) {
  const [activeTab, setActiveTab] = useState<SocialPlatform>("facebook");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // 1. Body Scroll Lock when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // 2. ESC key press to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Navigation handler
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    targetId?: string
  ) => {
    onClose();
    if (pathname === "/" && targetId) {
      e.preventDefault();
      if (targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) {
          window.history.pushState(null, "", "/");
        }
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `/#${targetId}`);
        }
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onClose();
      router.push(`/bhakti-gyaan?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* ── Overlay Backdrop ── */}
      <div
        className={`fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Right-Side Slide-Out Drawer ── */}
      <aside
        id="social-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="BhaktiMania Social and Navigation Panel"
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[420px] max-w-full bg-[#FFFFFF] z-50 shadow-[-8px_0_32px_rgba(0,0,0,0.12)] border-l border-[#EDE2CF] flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
      >
        {/* ── Header: Title & Close Button ── */}
        <div className="px-6 pt-5 pb-4 border-b border-[#EAE4D8] flex items-start justify-between bg-[#FDFBF7]">
          <Link
            href="/"
            onClick={(e) => {
              onClose();
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                if (window.location.hash) {
                  window.history.pushState(null, "", "/");
                }
              }
            }}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded"
          >
            <h3 className="text-[25px] font-bold text-[#252824] group-hover:text-[#C85A17] transition-colors leading-tight tracking-tight [font-family:var(--font-poppins)]">
              BhaktiMania
            </h3>
            <p className="text-[12.5px] text-[#6B706A] mt-0.5 [font-family:var(--font-poppins)]">
              Stay connected with BhaktiMania
            </p>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex items-center justify-center w-8 h-8 rounded-full text-[#6B706A] hover:text-[#C85A17] hover:bg-[#F5EFE2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] cursor-pointer mt-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable Body (One single drawer scrollbar) ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* 1. SOCIAL SECTION (Placed first as requested) */}
          <section aria-labelledby="social-feed-heading">
            <h4 id="social-feed-heading" className="sr-only">
              Latest Social Media Posts
            </h4>

            {/* Platform Tabs: Facebook / YouTube */}
            <div className="mb-4">
              <SocialTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Latest 6 Posts / Videos */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-3 text-[11px] font-semibold text-[#8B908A] uppercase tracking-wider">
                <span>Latest {activeTab === "facebook" ? "Posts" : "Videos"}</span>
                <span className="text-[10px] text-[#C85A17] lowercase font-normal">
                  (6 latest)
                </span>
              </div>

              {activeTab === "facebook" ? (
                <FacebookPosts posts={mockFacebookPosts} />
              ) : (
                <YouTubeVideos videos={mockYouTubeVideos} />
              )}
            </div>
          </section>

          {/* ── Divider ── */}
          <hr className="border-t border-[#EAE4D8]" />

          {/* 2. NAVIGATION SECTION */}
          <nav aria-label="Drawer Navigation">
            <span className="block text-[11px] font-semibold text-[#A8440B] tracking-[0.14em] uppercase mb-3.5 [font-family:var(--font-poppins)]">
              Navigation
            </span>

            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/", targetId: "top" },
                { label: "Articles", href: "/#articles", targetId: "articles" },
                { label: "Shop", href: "/#shop", targetId: "shop" },
                { label: "Bhakti Calendar", href: "/#calendar", targetId: "calendar" },
                { label: "Social Links", href: "/#social", targetId: "social" },
                { label: "About Us", href: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.targetId)}
                    className="text-[14px] font-medium text-[#252824] hover:text-[#C85A17] transition-colors flex items-center justify-between group py-0.5 [font-family:var(--font-poppins)]"
                  >
                    <span>{item.label}</span>
                    <span className="text-gray-300 group-hover:text-[#C85A17] group-hover:translate-x-0.5 transition-all text-sm">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Divider ── */}
          <hr className="border-t border-[#EAE4D8]" />

          {/* 3. SEARCH SECTION */}
          <section aria-labelledby="drawer-search-heading" className="pb-4">
            <span
              id="drawer-search-heading"
              className="block text-[11px] font-semibold text-[#A8440B] tracking-[0.14em] uppercase mb-3 [font-family:var(--font-poppins)]"
            >
              Search
            </span>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, mantras, festivals..."
                aria-label="Search articles, mantras, festivals"
                className="w-full pl-9 pr-4 py-2 text-[13px] bg-[#FDFBF7] border border-[#EAE4D8] rounded-[4px] text-[#252824] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C85A17] focus:ring-1 focus:ring-[#C85A17] transition-all [font-family:var(--font-poppins)]"
              />
              <svg
                className="w-4 h-4 text-[#8B908A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </section>
        </div>
      </aside>
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  labelHindi: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", labelHindi: "होम", href: "/" },
  { label: "Bhakti Gyaan", labelHindi: "भक्ति ज्ञान", href: "/bhakti-gyaan" },
  { label: "Bhakti Vichar", labelHindi: "भक्ति विचार", href: "/bhakti-vichar" },
  { label: "Devotional Stories", labelHindi: "भक्ति कथाएँ", href: "/bhakti-kathayen" },
  { label: "Festivals", labelHindi: "त्योहार", href: "/festivals" },
  { label: "Mantra & Stotra", labelHindi: "मंत्र स्तोत्र", href: "/mantra-stotra" },
  { label: "Yatra", labelHindi: "यात्रा", href: "/vrindavan" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#FBF8F0]/96 backdrop-blur-sm border-b border-[rgba(200,154,60,0.22)] transition-colors">
      <div className="container-desktop flex items-center justify-between h-16 lg:h-[72px]">

        {/* Brand Wordmark */}
        <Link
          href="/"
          className="flex flex-col group py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] flex-shrink-0"
          aria-label="BhaktiMania — होम पर जाएं"
        >
          <span className="font-heading text-[22px] lg:text-[26px] text-[#C85A17] tracking-tight leading-none group-hover:text-[#A8440B] transition-colors duration-200">
            BhaktiMania
          </span>
          <span className="font-ui text-[10px] text-[#6B706A] tracking-[0.12em] uppercase mt-1 leading-none">
            भक्ति • ज्ञान • शांति
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-0.5 xl:gap-1"
          aria-label="मुख्य नेविगेशन"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2.5 xl:px-3 py-2 font-ui text-[13px] xl:text-[13.5px] font-medium transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] group ${
                  isActive
                    ? "text-[#C85A17]"
                    : "text-[#252824] hover:text-[#C85A17]"
                }`}
              >
                {item.labelHindi}
                {/* Active saffron underline indicator */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-2.5 right-2.5 xl:left-3 xl:right-3 h-[2px] bg-[#C85A17] rounded-full"
                    aria-hidden="true"
                  />
                )}
                {/* Hover underline for inactive */}
                {!isActive && (
                  <span
                    className="absolute bottom-0 left-2.5 right-2.5 xl:left-3 xl:right-3 h-[2px] bg-[#C89A3C] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            type="button"
            aria-label="खोजें"
            className="flex items-center justify-center h-10 w-10 rounded text-[#6B706A] hover:text-[#C85A17] hover:bg-[#F5EFE2] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] cursor-pointer"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "मेनू बंद करें" : "मेनू खोलें"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="lg:hidden flex items-center justify-center h-10 w-10 rounded text-[#252824] hover:text-[#C85A17] hover:bg-[#F5EFE2] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] cursor-pointer"
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-[rgba(200,154,60,0.2)] bg-[#FBF8F0] px-4 py-4 shadow-[0_8px_32px_rgba(28,20,12,0.08)]"
        >
          <nav className="flex flex-col gap-0.5" aria-label="मोबाइल नेविगेशन">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 min-h-[44px] px-4 py-2.5 font-ui text-[14px] font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] ${
                    isActive
                      ? "text-[#C85A17] bg-[#C85A17]/6"
                      : "text-[#252824] hover:text-[#C85A17] hover:bg-[#F5EFE2]"
                  }`}
                >
                  {isActive && (
                    <span className="w-1 h-4 bg-[#C85A17] rounded-full flex-shrink-0" aria-hidden="true" />
                  )}
                  {item.labelHindi}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

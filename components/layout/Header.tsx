"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  labelHindi: string;
  href: string;
}

// ─── Verified routes only — no broken links or 404s ──────────────────────────
const navItems: NavItem[] = [
  { label: "Home", labelHindi: "होम", href: "/" },
  { label: "Bhakti Gyaan", labelHindi: "भक्ति ज्ञान", href: "/bhakti-gyaan" },
  { label: "Bhakti Vichar", labelHindi: "भक्ति विचार", href: "/bhakti-vichar" },
  { label: "Bhagavad Gita", labelHindi: "भगवद्गीता", href: "/bhagavad-gita" },
  { label: "Festivals", labelHindi: "त्योहार", href: "/festivals" },
  { label: "Radha Krishna", labelHindi: "राधा कृष्ण", href: "/radha-krishna" },
  { label: "Vrindavan", labelHindi: "वृंदावन", href: "/vrindavan" },
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#FBF8F0]/98 backdrop-blur-md border-b border-[rgba(200,154,60,0.22)] transition-colors">
      <div className="container-desktop flex items-center justify-between h-16 lg:h-[72px]">

        {/* ── Brand Logo: [Icon] + BhaktiMania + A JOURNEY WITHIN ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] flex-shrink-0"
          aria-label="BhaktiMania — A Journey Within — होम पर जाएं"
        >
          <Image
            src="/images/logo-icon.png"
            alt="BhaktiMania Logo"
            width={42}
            height={42}
            className="w-9 h-9 sm:w-10 sm:h-10 lg:w-[42px] lg:h-[42px] object-contain flex-shrink-0 drop-shadow-[0_1px_4px_rgba(40,25,15,0.12)] group-hover:scale-105 transition-transform duration-200"
            priority
          />
          <div className="flex flex-col">
            <span className="font-heading text-[22px] sm:text-[24px] lg:text-[26px] text-[#C85A17] tracking-tight leading-none group-hover:text-[#A8440B] transition-colors duration-200 font-bold">
              BhaktiMania
            </span>
            <span className="font-ui text-[8.5px] sm:text-[9.5px] text-[#8B7267] tracking-[0.18em] uppercase mt-1 leading-none font-semibold">
              A JOURNEY WITHIN
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav
          className="hidden lg:flex items-center gap-0.5 xl:gap-1.5"
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

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-1.5">
          {/* Link to search / articles hub */}
          <Link
            href="/bhakti-gyaan"
            aria-label="लेख और ज्ञान खोजें"
            className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded text-[#6B706A] hover:text-[#C85A17] hover:bg-[#F5EFE2] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] cursor-pointer"
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
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "मेनू बंद करें" : "मेनू खोलें"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="lg:hidden flex items-center justify-center h-11 w-11 rounded text-[#252824] hover:text-[#C85A17] hover:bg-[#F5EFE2] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] cursor-pointer"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {isMenuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-[rgba(200,154,60,0.2)] bg-[#FBF8F0] px-4 py-4 shadow-[0_12px_36px_rgba(28,20,12,0.12)] max-h-[calc(100vh-64px)] overflow-y-auto"
        >
          <nav className="flex flex-col gap-1" aria-label="मोबाइल नेविगेशन">
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
                  className={`flex items-center gap-3 min-h-[48px] px-4 py-3 font-ui text-[15px] font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] ${
                    isActive
                      ? "text-[#C85A17] bg-[#C85A17]/8 font-semibold"
                      : "text-[#252824] hover:text-[#C85A17] hover:bg-[#F5EFE2]"
                  }`}
                >
                  {isActive && (
                    <span
                      className="w-1.5 h-5 bg-[#C85A17] rounded-full flex-shrink-0"
                      aria-hidden="true"
                    />
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


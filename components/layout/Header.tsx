"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "होम", href: "/" },
  { label: "भक्ति ज्ञान", href: "/bhakti-gyaan" },
  { label: "प्रेमानंद जी", href: "/premanand-ji" },
  { label: "राधा कृष्ण", href: "/radha-krishna" },
  { label: "हनुमान", href: "/hanuman" },
  { label: "त्योहार", href: "/festivals" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#6B1724]/10 transition-colors">
      <div className="container-desktop flex items-center justify-between h-16 sm:h-20">
        {/* Brand Wordmark */}
        <Link
          href="/"
          className="flex flex-col group py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
        >
          <span className="font-heading text-2xl sm:text-3xl text-[#6B1724] tracking-tight leading-none group-hover:text-[#52111C] transition-colors">
            BhaktiMania
          </span>
          <span className="text-[11px] sm:text-xs text-[#5A6065] tracking-wider font-body mt-1 leading-none">
            भक्ति • ज्ञान • शांति
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          aria-label="मुख्य नेविगेशन"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-2 text-sm lg:text-base font-medium text-[#1F2326] hover:text-[#6B1724] hover:bg-[#F8F4EC] rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions (Search & Mobile Toggle) */}
        <div className="flex items-center gap-2">
          {/* Search Button (Subtle visual trigger) */}
          <button
            type="button"
            aria-label="खोजें"
            className="flex items-center justify-center h-11 w-11 rounded-xl text-[#1F2326] hover:text-[#6B1724] hover:bg-[#F8F4EC] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "मेनू बंद करें" : "मेनू खोलें"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="md:hidden flex items-center justify-center h-11 w-11 rounded-xl text-[#1F2326] hover:text-[#6B1724] hover:bg-[#F8F4EC] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] cursor-pointer"
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
                  strokeWidth={2}
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
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t border-[#6B1724]/10 bg-[#FDFBF7] px-4 py-4 shadow-lg animate-in fade-in duration-200"
        >
          <nav className="flex flex-col gap-1" aria-label="मोबाइल नेविगेशन">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center min-h-[44px] px-4 py-2.5 text-base font-medium text-[#1F2326] hover:text-[#6B1724] hover:bg-[#F8F4EC] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

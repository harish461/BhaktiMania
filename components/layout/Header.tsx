"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { socialConfig } from "@/lib/social/config";
import { SocialDrawer } from "@/components/social/SocialDrawer";

interface NavItem {
  label: string;
  href: string;
  targetId?: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", targetId: "top" },
  { label: "Articles", href: "/#articles", targetId: "articles" },
  { label: "Shop", href: "/#shop", targetId: "shop" },
  { label: "Bhakti Calendar", href: "/#calendar", targetId: "calendar" },
  { label: "Social Links", href: "/#social", targetId: "social" },
  { label: "About Us", href: "/about" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /* ── Detect scroll to add elevated shadow & header logo on homepage ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Smooth scroll when landing on an anchor from an external page ── */
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      if (hashId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const timer = setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  /* ── In-page smooth scrolling when already on the homepage ── */
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    if (pathname === "/" && item.targetId) {
      e.preventDefault();
      if (item.targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) {
          window.history.pushState(null, "", "/");
        }
      } else {
        const el = document.getElementById(item.targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `/#${item.targetId}`);
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-40 bg-[#FFFFFF] border-b border-[#EAE4D8] transition-all duration-300 ${
          scrolled
            ? "shadow-[0_4px_20px_rgba(37,40,36,0.08)] bg-[#FFFFFF]/98 backdrop-blur-md"
            : "shadow-[0_1px_3px_rgba(37,40,36,0.03)]"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-[62px] md:h-16 flex items-center justify-between">

          {/* ── LEFT: Mobile Logo (Always on mobile) / Desktop Branding (Subpages or scrolled) + Desktop Socials ── */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* 1. Mobile Logo: Always visible on mobile screens (< 768px) */}
            <div className="flex md:hidden items-center">
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    if (window.location.hash) {
                      window.history.pushState(null, "", "/");
                    }
                  }
                }}
                className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-full"
                aria-label="BhaktiMania Home"
              >
                <div className="relative w-[46px] h-[46px] rounded-full p-[2px] bg-gradient-to-b from-[#D8B45A] via-[#C89A3C] to-[#A8440B] shadow-xs flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                    <Image
                      src="/images/bhaktimania-logo.jpg"
                      alt="BhaktiMania Logo"
                      fill
                      priority
                      className="object-cover object-center"
                      sizes="46px"
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* 2. Desktop Branding: Visible ONLY on desktop (>= 768px) when on a subpage or scrolled */}
            {(pathname !== "/" || scrolled) && (
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    if (window.location.hash) {
                      window.history.pushState(null, "", "/");
                    }
                  }
                }}
                className="hidden md:flex items-center gap-2 mr-1 sm:mr-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded"
                aria-label="BhaktiMania Home"
              >
                <div className="relative w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-b from-[#D8B45A] via-[#C89A3C] to-[#A8440B] shadow-xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                    <Image
                      src="/images/bhaktimania-logo.jpg"
                      alt="BhaktiMania Logo"
                      fill
                      className="object-cover object-center"
                      sizes="32px"
                    />
                  </div>
                </div>
                <span className="font-bold text-[16px] text-[#252824] group-hover:text-[#C85A17] transition-colors [font-family:var(--font-poppins)]">
                  BhaktiMania
                </span>
              </Link>
            )}

            {/* 3. Desktop Social Icons (hidden on mobile, rendered on the right on mobile) */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={socialConfig.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BhaktiMania on Facebook"
                className="text-[#111111] hover:text-[#C85A17] transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={socialConfig.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BhaktiMania on YouTube"
                className="text-[#111111] hover:text-[#C85A17] transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── CENTER: Desktop Navigation (Hidden on mobile) ── */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-3"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const isActive =
                (item.href === "/" && pathname === "/") ||
                (item.href !== "/" && pathname === item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative px-3 py-1.5 text-[14.5px] leading-none transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] group [font-family:var(--font-poppins)] ${
                    isActive
                      ? "font-semibold text-[#C85A17]"
                      : "font-medium text-[#252824] hover:text-[#C85A17]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C85A17] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                  {!isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C89A3C] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT: Mobile Socials + Stepped Hamburger Icon Button ── */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile-only social icons placed neatly before hamburger */}
            <div className="flex md:hidden items-center gap-2 mr-0.5">
              <a
                href={socialConfig.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BhaktiMania on Facebook"
                className="flex items-center justify-center w-8 h-8 rounded-full text-[#252824] hover:text-[#C85A17] hover:bg-[#F5EFE2] transition-colors duration-150"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={socialConfig.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BhaktiMania on YouTube"
                className="flex items-center justify-center w-8 h-8 rounded-full text-[#252824] hover:text-[#C85A17] hover:bg-[#F5EFE2] transition-colors duration-150"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Stepped Hamburger Icon Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="social-navigation-drawer"
              className="flex items-center justify-center h-10 w-10 rounded-full text-[#252824] hover:text-[#C85A17] hover:bg-[#F5EFE2] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] cursor-pointer"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeWidth={2.4}
                    d="M8.5 6.5h12M3.5 12h17M12.5 17.5h8"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to preserve normal document flow beneath fixed header */}
      <div className="h-[62px] md:h-16 shrink-0" aria-hidden="true" />

      {/* ── Social + Navigation Slide-Out Drawer ── */}
      <SocialDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

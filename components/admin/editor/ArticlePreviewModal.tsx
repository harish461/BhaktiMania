"use client";

import React, { useEffect } from "react";
import type { ArticleSection } from "@/lib/data/articles";
import type { SupabaseCategory, DatabaseAuthor } from "@/lib/data/supabase";

interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  sections: ArticleSection[];
  categoryId: string;
  authorId: string;
  readTime: string;
  symbol: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  categories: SupabaseCategory[];
  authors: DatabaseAuthor[];
}

function renderFormattedInline(content: string): React.ReactNode {
  if (!content || (!content.includes("[") && !content.includes("*"))) {
    return content;
  }
  const tokenRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      elements.push(content.substring(lastIndex, match.index));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      const linkText = match[1];
      const linkUrl = match[2];
      elements.push(
        <span
          key={`l-${match.index}`}
          className="text-[#6B1724] font-medium underline underline-offset-3 decoration-[#D97706]/60 cursor-pointer"
          title={`Link to: ${linkUrl}`}
        >
          {linkText}
        </span>
      );
    } else if (match[3] !== undefined) {
      elements.push(
        <strong key={`b-${match.index}`} className="font-semibold text-[#1F2326]">
          {match[3]}
        </strong>
      );
    } else if (match[4] !== undefined) {
      elements.push(
        <em key={`i-${match.index}`} className="italic">
          {match[4]}
        </em>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    elements.push(content.substring(lastIndex));
  }

  return elements;
}

export function ArticlePreviewModal({
  isOpen,
  onClose,
  title,
  description,
  sections,
  categoryId,
  authorId,
  readTime,
  symbol,
  featuredImageUrl,
  featuredImageAlt,
  categories,
  authors,
}: ArticlePreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCategory = categories.find((c) => c.id === categoryId);
  const currentAuthor = authors.find((a) => a.id === authorId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-[#FDFBF7] rounded-3xl max-w-4xl w-full my-auto border border-[#6B1724]/20 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Preview Top Action Header */}
        <div className="bg-white px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[#6B1724]/12 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              Live Preview (Draft State)
            </span>
            <span id="preview-modal-title" className="text-xs text-[#5A6065] hidden sm:inline">
              Simulated public devotional rendering
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="min-h-[44px] min-w-[44px] px-3 py-1 rounded-xl text-xs font-semibold text-[#6B1724] hover:bg-[#F8F4EC] border border-[#6B1724]/15 transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
          >
            <span>Close</span>
            <span aria-hidden="true" className="text-sm">✕</span>
          </button>
        </div>

        {/* Preview Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-10 space-y-8 bg-[#FDFBF7]">
          {/* Article Header */}
          <div className="max-w-3xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#6B1724] text-white">
                {currentCategory?.title || "भक्ति ज्ञान"}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#6B1724] tracking-tight leading-snug mb-4">
              {title || "शीर्षक यहाँ दिखाई देगा..."}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#5A6065] leading-relaxed font-body mb-5">
              {description || "संक्षिप्त विवरण यहाँ दिखाई देगा..."}
            </p>

            {/* Metadata Bar */}
            <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm text-[#5A6065] py-3.5 border-y border-[#6B1724]/10 mb-8 font-body">
              <div className="flex items-center gap-1.5">
                <span className="text-[#D97706]" aria-hidden="true">✦</span>
                <span>{readTime || "5 मिनट"} पढ़ने का समय</span>
              </div>
              <span aria-hidden="true" className="text-[#5A6065]/40">•</span>
              <div className="flex items-center gap-1.5">
                <span>प्रकाशित: पूर्वावलोकन (ड्राफ्ट)</span>
              </div>
              {currentAuthor && (
                <>
                  <span aria-hidden="true" className="text-[#5A6065]/40">•</span>
                  <div className="flex items-center gap-1.5">
                    <span>लेखक: {currentAuthor.name}</span>
                  </div>
                </>
              )}
            </div>

            {/* Hero Devotional Artwork / Motif Frame */}
            {featuredImageUrl ? (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-10 border border-[#6B1724]/12 shadow-xs bg-[#F8F4EC]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredImageUrl}
                  alt={featuredImageAlt || title || "Article featured image"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-[#F8F4EC] via-[#F4EFE6] to-[#ECE3D4] border border-[#6B1724]/12 flex flex-col items-center justify-center text-center p-6 mb-10 overflow-hidden shadow-xs"
                aria-hidden="true"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 border border-[#6B1724]/12 flex items-center justify-center text-[#6B1724] shadow-xs mb-3">
                  <span className="font-heading text-2xl select-none">✦</span>
                </div>
                <span className="font-heading text-xl text-[#6B1724]">
                  {symbol || "दीप"}
                </span>
                <span className="text-xs text-[#5A6065] mt-1 font-body">
                  भक्ति एवं आध्यात्मिक चिंतन
                </span>
              </div>
            )}

            {/* Article Content Sections */}
            <div className="article-body font-body text-[#1F2326] space-y-8">
              {sections.map((section, idx) => (
                <section key={idx} className="mb-8">
                  {section.heading && (
                    <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight leading-snug mt-8 mb-4">
                      {section.heading}
                    </h2>
                  )}

                  {section.highlight && (
                    <div className="my-6 p-4 sm:p-5 rounded-r-2xl bg-[#F8F4EC] border-l-4 border-[#D97706] text-[#6B1724] font-heading text-lg sm:text-xl leading-relaxed italic">
                      {renderFormattedInline(section.highlight)}
                    </div>
                  )}

                  {section.paragraphs &&
                    section.paragraphs.map((para, pIdx) =>
                      para.trim() ? (
                        <p
                          key={pIdx}
                          className="text-base sm:text-lg text-[#1F2326] leading-[1.85] mb-4.5"
                        >
                          {renderFormattedInline(para)}
                        </p>
                      ) : null
                    )}

                  {section.bullets && section.bullets.filter((b) => b.trim()).length > 0 && (
                    <ul className="my-5 space-y-2.5 pl-6 list-disc marker:text-[#D97706] text-base sm:text-lg leading-relaxed">
                      {section.bullets.filter((b) => b.trim()).map((bullet, bIdx) => (
                        <li key={bIdx} className="text-[#1F2326]">
                          {renderFormattedInline(bullet)}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

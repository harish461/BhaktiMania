"use client";

import React from "react";
import type { ArticleSection } from "@/lib/data/articles";
import { ParagraphEditor } from "./ParagraphEditor";
import { BulletEditor } from "./BulletEditor";

interface SectionItemCardProps {
  section: ArticleSection;
  index: number;
  totalSections: number;
  onUpdate: (updated: ArticleSection) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export function SectionItemCard({
  section,
  index,
  totalSections,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDelete,
}: SectionItemCardProps) {
  const handleHeadingChange = (heading: string) => {
    onUpdate({ ...section, heading });
  };

  const handleHighlightChange = (highlight: string) => {
    onUpdate({ ...section, highlight });
  };

  const handleParagraphsChange = (paragraphs: string[]) => {
    onUpdate({ ...section, paragraphs });
  };

  const handleBulletsChange = (bullets: string[]) => {
    onUpdate({ ...section, bullets });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#6B1724]/12 shadow-xs overflow-hidden transition-all duration-200">
      {/* Section Header Bar */}
      <div className="bg-[#F8F4EC] px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[#6B1724]/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#6B1724] text-white text-xs font-bold font-heading">
            {index + 1}
          </span>
          <span className="font-heading text-sm sm:text-base font-semibold text-[#6B1724]">
            Section {index + 1}
          </span>
        </div>

        {/* Section Actions: Move Up, Move Down, Delete */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            title={index === 0 ? "First section" : "Move section up"}
            aria-label={`Move section ${index + 1} up`}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#5A6065] hover:text-[#6B1724] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent rounded-lg border border-transparent hover:border-[#6B1724]/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            title={index === totalSections - 1 ? "Last section" : "Move section down"}
            aria-label={`Move section ${index + 1} down`}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#5A6065] hover:text-[#6B1724] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent rounded-lg border border-transparent hover:border-[#6B1724]/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="h-4 w-px bg-[#6B1724]/15 mx-1" aria-hidden="true" />

          <button
            type="button"
            onClick={onDelete}
            disabled={totalSections <= 1}
            title={totalSections <= 1 ? "Minimum one section required" : "Delete section"}
            aria-label={`Delete section ${index + 1}`}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#5A6065] hover:text-red-700 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg border border-transparent hover:border-red-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section Fields */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Section Heading */}
        <div>
          <label
            htmlFor={`section-heading-${index}`}
            className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724] mb-1.5"
          >
            Section Heading (H2)
          </label>
          <input
            id={`section-heading-${index}`}
            type="text"
            value={section.heading || ""}
            onChange={(e) => handleHeadingChange(e.target.value)}
            placeholder="e.g. कर्म योग का वास्तविक अर्थ (Hindi)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-[#FDFBF7] text-[#1F2326] text-sm font-heading font-medium focus:bg-white focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40"
          />
        </div>

        {/* Highlight / Shloka / Key Verse (Optional) */}
        <div className="rounded-xl p-3.5 sm:p-4 bg-[#F8F4EC] border-l-4 border-[#D97706] border-y border-r border-[#6B1724]/10">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`section-highlight-${index}`}
              className="block text-xs font-bold text-[#6B1724] uppercase tracking-wider flex items-center gap-1.5"
            >
              <span className="text-[#D97706]">✦</span>
              <span>Devotional Highlight / Verse / Callout (Optional)</span>
            </label>
            <span className="text-[11px] text-[#5A6065]">Styled quote block</span>
          </div>
          <textarea
            id={`section-highlight-${index}`}
            value={section.highlight || ""}
            onChange={(e) => handleHighlightChange(e.target.value)}
            rows={2}
            placeholder="e.g. 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन' (Key devotional quote or spiritual reflection)"
            className="w-full px-3 py-2 rounded-lg border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm italic focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40"
          />
        </div>

        {/* Paragraphs Editor */}
        <ParagraphEditor
          paragraphs={section.paragraphs || [""]}
          onChange={handleParagraphsChange}
          sectionIndex={index}
        />

        <div className="border-t border-[#6B1724]/8 pt-5">
          {/* Bullets Editor */}
          <BulletEditor
            bullets={section.bullets || []}
            onChange={handleBulletsChange}
            sectionIndex={index}
          />
        </div>
      </div>
    </div>
  );
}

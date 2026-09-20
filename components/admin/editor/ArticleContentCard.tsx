"use client";

import React from "react";
import type { ArticleSection } from "@/lib/data/articles";
import { SectionItemCard } from "./SectionItemCard";

interface ArticleContentCardProps {
  sections: ArticleSection[];
  onChange: (sections: ArticleSection[]) => void;
}

export function ArticleContentCard({
  sections,
  onChange,
}: ArticleContentCardProps) {
  const handleUpdateSection = (index: number, updated: ArticleSection) => {
    const copy = [...sections];
    copy[index] = updated;
    onChange(copy);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;
    onChange(copy);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    onChange(copy);
  };

  const handleDelete = (index: number) => {
    if (sections.length <= 1) return;
    onChange(sections.filter((_, i) => i !== index));
  };

  const handleAddStandardSection = () => {
    onChange([
      ...sections,
      {
        heading: "",
        highlight: "",
        paragraphs: [""],
        bullets: [],
      },
    ]);
  };

  const handleAddVerseSection = () => {
    onChange([
      ...sections,
      {
        heading: "",
        highlight: "श्लोक / विचार...",
        paragraphs: [""],
        bullets: [],
      },
    ]);
  };

  return (
    <div className="bg-[#FDFBF7] rounded-3xl p-5 sm:p-8 border border-[#6B1724]/12 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#6B1724]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B1724]" aria-hidden="true" />
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#6B1724]">
              B. Article Content
            </h2>
          </div>
          <p className="text-xs text-[#5A6065] mt-1">
            Compose and organize article sections with headings, spiritual verses, paragraphs, and bullet points.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-[#6B1724]/15 text-[#6B1724] self-start sm:self-center">
          {sections.length} {sections.length === 1 ? "Section" : "Sections"}
        </span>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <SectionItemCard
            key={idx}
            section={section}
            index={idx}
            totalSections={sections.length}
            onUpdate={(updated) => handleUpdateSection(idx, updated)}
            onMoveUp={() => handleMoveUp(idx)}
            onMoveDown={() => handleMoveDown(idx)}
            onDelete={() => handleDelete(idx)}
          />
        ))}
      </div>

      {/* Add Section Action Controls */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleAddStandardSection}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B1724] text-white text-sm font-semibold hover:bg-[#52111C] active:scale-[0.99] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2"
        >
          <span className="text-base" aria-hidden="true">+</span>
          <span>Add Section</span>
        </button>

        <button
          type="button"
          onClick={handleAddVerseSection}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#6B1724] text-sm font-medium border border-[#6B1724]/20 hover:bg-[#F8F4EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
        >
          <span className="text-[#D97706]" aria-hidden="true">✦</span>
          <span>Add Verse / Quote Section</span>
        </button>
      </div>
    </div>
  );
}

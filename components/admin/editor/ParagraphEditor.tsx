"use client";

import React from "react";

interface ParagraphEditorProps {
  paragraphs: string[];
  onChange: (paragraphs: string[]) => void;
  sectionIndex: number;
}

export function ParagraphEditor({
  paragraphs,
  onChange,
  sectionIndex,
}: ParagraphEditorProps) {
  const handleUpdate = (pIdx: number, val: string) => {
    const updated = [...paragraphs];
    updated[pIdx] = val;
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...paragraphs, ""]);
  };

  const handleRemove = (pIdx: number) => {
    if (paragraphs.length <= 1) {
      // Keep at least one empty paragraph rather than empty array if desired, or allow removing
      onChange([""]);
      return;
    }
    onChange(paragraphs.filter((_, i) => i !== pIdx));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]">
          Paragraphs ({paragraphs.length})
        </label>
        <span className="text-[11px] text-[#5A6065] italic">
          Supports <code className="bg-[#F8F4EC] px-1 py-0.5 rounded text-[#6B1724]">**bold**</code> and <code className="bg-[#F8F4EC] px-1 py-0.5 rounded text-[#6B1724]">[link text](url)</code>
        </span>
      </div>

      <div className="space-y-2.5">
        {paragraphs.map((para, pIdx) => (
          <div key={pIdx} className="flex items-start gap-2 group">
            <div className="flex-1">
              <textarea
                value={para}
                onChange={(e) => handleUpdate(pIdx, e.target.value)}
                rows={3}
                placeholder={`Paragraph ${pIdx + 1} content in Hindi...`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm leading-relaxed focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40"
                aria-label={`Section ${sectionIndex + 1} Paragraph ${pIdx + 1}`}
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemove(pIdx)}
              disabled={paragraphs.length <= 1 && !para}
              aria-label={`Remove paragraph ${pIdx + 1} from section ${sectionIndex + 1}`}
              title="Remove paragraph"
              className="min-h-[44px] min-w-[44px] px-2 py-2 flex items-center justify-center text-[#5A6065] hover:text-red-700 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#5A6065] rounded-xl border border-transparent hover:border-red-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#6B1724] bg-[#F8F4EC] hover:bg-[#F2ECE1] border border-[#6B1724]/15 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
      >
        <span aria-hidden="true">+</span>
        <span>Add Paragraph</span>
      </button>
    </div>
  );
}

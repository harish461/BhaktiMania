"use client";

import React from "react";

interface BulletEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  sectionIndex: number;
}

export function BulletEditor({
  bullets,
  onChange,
  sectionIndex,
}: BulletEditorProps) {
  const handleUpdate = (bIdx: number, val: string) => {
    const updated = [...bullets];
    updated[bIdx] = val;
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...bullets, ""]);
  };

  const handleRemove = (bIdx: number) => {
    onChange(bullets.filter((_, i) => i !== bIdx));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B1724]">
          Key Takeaways / Bullets ({bullets.length})
        </label>
        <span className="text-[11px] text-[#5A6065]">Optional list points</span>
      </div>

      {bullets.length > 0 ? (
        <div className="space-y-2">
          {bullets.map((bullet, bIdx) => (
            <div key={bIdx} className="flex items-center gap-2 group">
              <span className="text-xs text-[#D97706] font-bold pl-1" aria-hidden="true">
                •
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleUpdate(bIdx, e.target.value)}
                  placeholder={`Bullet point ${bIdx + 1}...`}
                  className="w-full px-3 py-2 rounded-xl border border-[#6B1724]/20 bg-white text-[#1F2326] text-sm focus:border-[#6B1724] focus:ring-2 focus:ring-[#6B1724]/20 outline-none transition-all placeholder:text-[#5A6065]/40"
                  aria-label={`Section ${sectionIndex + 1} Bullet ${bIdx + 1}`}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(bIdx)}
                aria-label={`Remove bullet ${bIdx + 1} from section ${sectionIndex + 1}`}
                title="Remove bullet"
                className="min-h-[44px] min-w-[44px] px-2 py-2 flex items-center justify-center text-[#5A6065] hover:text-red-700 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#5A6065] italic bg-[#FDFBF7] p-2.5 rounded-xl border border-dashed border-[#6B1724]/15">
          No bullet points added to this section yet.
        </p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#6B1724] bg-[#F8F4EC] hover:bg-[#F2ECE1] border border-[#6B1724]/15 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
      >
        <span aria-hidden="true">+</span>
        <span>Add Bullet</span>
      </button>
    </div>
  );
}

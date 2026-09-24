"use client";

import React from "react";
import type { SocialPlatform } from "@/lib/social/types";

interface SocialTabsProps {
  activeTab: SocialPlatform;
  onTabChange: (tab: SocialPlatform) => void;
}

export function SocialTabs({ activeTab, onTabChange }: SocialTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-[#EAE4D8] pb-1" role="tablist">
      {/* Facebook Tab */}
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "facebook"}
        onClick={() => onTabChange("facebook")}
        className={`relative pb-2.5 text-[13px] font-semibold tracking-wide transition-colors flex items-center gap-2 cursor-pointer [font-family:var(--font-poppins)] ${
          activeTab === "facebook"
            ? "text-[#1877F2]"
            : "text-[#6B706A] hover:text-[#252824]"
        }`}
      >
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Facebook</span>
        {activeTab === "facebook" && (
          <span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C85A17] rounded-full"
            aria-hidden="true"
          />
        )}
      </button>

      {/* YouTube Tab */}
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "youtube"}
        onClick={() => onTabChange("youtube")}
        className={`relative pb-2.5 text-[13px] font-semibold tracking-wide transition-colors flex items-center gap-2 cursor-pointer [font-family:var(--font-poppins)] ${
          activeTab === "youtube"
            ? "text-[#FF0000]"
            : "text-[#6B706A] hover:text-[#252824]"
        }`}
      >
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        <span>YouTube</span>
        {activeTab === "youtube" && (
          <span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C85A17] rounded-full"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
}

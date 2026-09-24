import React from "react";
import { SocialPostItem } from "./SocialPostItem";
import { socialConfig } from "@/lib/social/config";
import type { SocialPost } from "@/lib/social/types";

interface YouTubeVideosProps {
  videos: SocialPost[];
  isLoading?: boolean;
  error?: string | null;
}

export function YouTubeVideos({ videos, isLoading, error }: YouTubeVideosProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 py-2 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 pb-3 border-b border-[#F0EBE0]">
            <div className="w-[82px] h-[62px] bg-gray-200 rounded-[3px] shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-2 bg-gray-200 rounded w-1/3 mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center">
        <p className="text-[12.5px] text-[#6B706A] mb-3 [font-family:var(--font-poppins)]">
          Unable to load latest posts.
        </p>
        <a
          href={socialConfig.youtube.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-col items-center group [font-family:var(--font-poppins)]"
        >
          <span className="text-[12.5px] font-semibold text-[#C85A17] group-hover:text-[#A8440B] transition-colors">
            {socialConfig.youtube.cta}
          </span>
          <span className="w-6 h-[1.5px] bg-[#C85A17] mt-0.5 group-hover:w-8 transition-all" />
        </a>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-[12.5px] text-[#6B706A] mb-3 [font-family:var(--font-poppins)]">
          YouTube videos are currently unavailable.
        </p>
        <a
          href={socialConfig.youtube.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-col items-center group [font-family:var(--font-poppins)]"
        >
          <span className="text-[12.5px] font-semibold text-[#C85A17] group-hover:text-[#A8440B] transition-colors">
            {socialConfig.youtube.cta}
          </span>
          <span className="w-6 h-[1.5px] bg-[#C85A17] mt-0.5 group-hover:w-8 transition-all" />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* 6 latest items */}
      <div className="space-y-0">
        {videos.slice(0, 6).map((video) => (
          <SocialPostItem key={video.id} post={video} />
        ))}
      </div>

      {/* Editorial Platform CTA */}
      <div className="mt-4 pt-3.5 border-t border-[#EAE4D8] flex items-center justify-between">
        <div>
          <span className="block text-[11px] font-semibold text-[#A8440B] tracking-wider uppercase [font-family:var(--font-poppins)]">
            Channel
          </span>
          <span className="block text-[12.5px] font-medium text-[#252824] [font-family:var(--font-poppins)]">
            {socialConfig.youtube.title}
          </span>
        </div>

        <a
          href={socialConfig.youtube.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex flex-col items-end [font-family:var(--font-poppins)]"
        >
          <span className="text-[12.5px] font-semibold text-[#C85A17] group-hover:text-[#A8440B] transition-colors flex items-center gap-1">
            <span>{socialConfig.youtube.cta}</span>
          </span>
          <span className="w-6 h-[1.5px] bg-[#C85A17] mt-0.5 group-hover:w-8 transition-all" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

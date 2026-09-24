import React from "react";
import Image from "next/image";
import type { SocialPost } from "@/lib/social/types";

interface SocialPostItemProps {
  post: SocialPost;
}

export function SocialPostItem({ post }: SocialPostItemProps) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 pb-3 mb-3 border-b border-[#F0EBE0] last:border-b-0 last:pb-0 last:mb-0 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C85A17] rounded-[2px]"
      aria-label={`${post.title} (Opens on ${post.platform})`}
    >
      {/* Thumbnail: 82px × 62px, rounded 2–4px */}
      <div className="relative w-[82px] h-[62px] shrink-0 overflow-hidden rounded-[3px] bg-gray-100 border border-[#EAE4D8]">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="82px"
        />

        {/* Optional YouTube Duration Badge */}
        {post.duration && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-semibold px-1 py-0.5 rounded leading-none [font-family:var(--font-poppins)]">
            {post.duration}
          </span>
        )}
      </div>

      {/* Content info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-[62px]">
        {/* Title / Excerpt */}
        <h4
          className="text-[12.5px] font-medium leading-[1.35] text-[#252824] group-hover:text-[#C85A17] transition-colors line-clamp-2 [font-family:var(--font-poppins)]"
          title={post.title}
        >
          {post.title}
        </h4>

        {/* Date and Platform indicator row */}
        <div className="flex items-center justify-between text-[11px] text-[#8B908A] [font-family:var(--font-poppins)]">
          <span>{post.publishedAt}</span>

          {post.platform === "facebook" ? (
            <span className="text-[#1877F2]/80 group-hover:text-[#1877F2]" aria-label="Facebook">
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </span>
          ) : (
            <span className="text-[#FF0000]/80 group-hover:text-[#FF0000]" aria-label="YouTube">
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

import React from "react";
import Image from "next/image";
import { realYouTubeShorts } from "@/lib/social/youtube";
import { realFacebookPosts } from "@/lib/social/facebook";
import { socialConfig } from "@/lib/social/config";

export function SocialSection() {
  return (
    <section
      id="social"
      aria-labelledby="social-heading"
      className="pt-4 pb-12 lg:pt-6 lg:pb-16 bg-white [scroll-margin-top:80px]"
      style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* ── Main Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-8 pb-3.5 border-b border-gray-200">
          <div>
            <h2
              id="social-heading"
              className="text-[17px] md:text-[22px] font-bold text-[#1C1C17] leading-tight"
              style={{ fontWeight: 700 }}
            >
              Facebook & YouTube
            </h2>
            <p className="text-[13px] text-[#6B706A] mt-1">
              Watch our latest devotional shorts, reels and spiritual insights on BhaktiMania
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <a
              href={socialConfig.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#FF0000]/25 bg-[#FF0000]/5 hover:bg-[#FF0000]/10 text-[#FF0000] text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000]"
              aria-label="Visit BhaktiMania YouTube Channel"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube</span>
            </a>
            <a
              href={socialConfig.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#1877F2]/25 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 text-[#1877F2] text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]"
              aria-label="Visit BhaktiMania Facebook Page"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            1. YOUTUBE SHORTS SHELF
        ══════════════════════════════════════════════════════════ */}
        <div className="mb-12">
          {/* Subheader */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-[#FF0000]/10 text-[#FF0000]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </span>
              <h3 className="text-[16px] font-bold text-[#1C1C17] leading-tight">
                YouTube Shorts
              </h3>
              <span className="text-[11.5px] text-[#6B706A] font-medium hidden sm:inline">
                {socialConfig.youtube.handle}
              </span>
            </div>

            <a
              href={socialConfig.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors flex items-center gap-1 group"
            >
              <span>Subscribe on YouTube</span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
            </a>
          </div>

          {/* 6-Card YouTube Shorts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {realYouTubeShorts.map((short) => (
              <a
                key={short.id}
                href={short.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-[4px]"
                aria-label={`${short.title} — YouTube Shorts पर देखें`}
              >
                {/* Vertical Video Thumbnail Container */}
                <div className="relative aspect-[9/13] w-full overflow-hidden rounded-[4px] bg-[#2A2521] border border-gray-200 shadow-sm">
                  <Image
                    src={short.thumbnail}
                    alt={short.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 180px"
                  />

                  {/* Top-Right Duration Badge */}
                  {short.duration && (
                    <span className="absolute top-2 right-2 bg-black/75 text-white text-[9.5px] font-semibold px-1.5 py-0.5 rounded leading-none">
                      {short.duration}
                    </span>
                  )}

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-[#FF0000] shadow-md group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>

                  {/* Bottom YouTube Badge */}
                  <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                    <svg className="w-2.5 h-2.5 fill-[#FF0000]" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>Shorts</span>
                  </div>
                </div>

                {/* Card Title & Meta */}
                <div className="pt-2 flex flex-col flex-1">
                  <h4
                    className="text-[12px] font-semibold text-[#1C1C17] line-clamp-2 leading-[1.35] group-hover:text-[#C85A17] transition-colors"
                    title={short.title}
                  >
                    {short.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10.5px] text-[#6B706A] mt-1.5 pt-1 border-t border-gray-100">
                    <span>{short.publishedAt}</span>
                    <span className="text-[#FF0000] font-medium">YouTube</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            2. FACEBOOK REELS SHELF
        ══════════════════════════════════════════════════════════ */}
        <div>
          {/* Subheader */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-[#1877F2]/10 text-[#1877F2]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>
              <h3 className="text-[16px] font-bold text-[#1C1C17] leading-tight">
                Facebook Reels & Posts
              </h3>
              <span className="text-[11.5px] text-[#6B706A] font-medium hidden sm:inline">
                {socialConfig.facebook.handle}
              </span>
            </div>

            <a
              href={socialConfig.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors flex items-center gap-1 group"
            >
              <span>Follow on Facebook</span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
            </a>
          </div>

          {/* 6-Card Facebook Reels Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {realFacebookPosts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-[4px]"
                aria-label={`${post.title} — Facebook Reel देखें`}
              >
                {/* Vertical Reel Thumbnail Container */}
                <div className="relative aspect-[9/13] w-full overflow-hidden rounded-[4px] bg-[#1a2530] border border-gray-200 shadow-sm">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 180px"
                  />

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-[#1877F2] shadow-md group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>

                  {/* Bottom Facebook Badge */}
                  <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                    <svg className="w-2.5 h-2.5 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Reels</span>
                  </div>
                </div>

                {/* Card Title & Meta */}
                <div className="pt-2 flex flex-col flex-1">
                  <h4
                    className="text-[12px] font-semibold text-[#1C1C17] line-clamp-2 leading-[1.35] group-hover:text-[#C85A17] transition-colors"
                    title={post.title}
                  >
                    {post.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10.5px] text-[#6B706A] mt-1.5 pt-1 border-t border-gray-100">
                    <span>{post.publishedAt}</span>
                    <span className="text-[#1877F2] font-medium">Facebook</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

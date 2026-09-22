import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedArticleProps {
  article?: {
    slug: string;
    title: string;
    description: string;
    category: string;
    categorySlug?: string;
    symbol?: string;
    readTime?: string;
    author?: string;
    featuredImageUrl?: string | null;
    featuredImageAlt?: string | null;
  } | null;
}

const defaultFallbackImage =
  "https://images.unsplash.com/photo-1588186939889-1f91a51f4a25?w=800&q=85&auto=format&fit=crop";

export function FeaturedArticle({ article }: FeaturedArticleProps = {}) {
  const title = article?.title || "भक्ति का वास्तविक अर्थ क्या है?";
  const description =
    article?.description ||
    "भक्ति केवल पूजा तक सीमित नहीं है। यह मन, कर्म और जीवन को ईश्वर के प्रति समर्पित करने की एक सुंदर यात्रा है।";
  const category = article?.category || "भक्ति ज्ञान";
  const slug = article?.slug
    ? `/bhakti-gyaan/${article.slug}`
    : "/bhakti-gyaan/sacchi-bhakti-kya-hai";
  const readTime = article?.readTime || "8 min read";
  const author = article?.author || "BhaktiMania Editorial";

  // Priority: article.featuredImageUrl -> fallback (Requirement 8)
  const imageUrl = article?.featuredImageUrl || defaultFallbackImage;
  const imageAlt = article?.featuredImageAlt || `${title} — विशेष भक्ति लेख`;

  return (
    <section
      aria-labelledby="featured-article-heading"
      className="py-20 lg:py-28 bg-white"
    >
      <div className="container-desktop">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-10">
          <span className="accent-dot" aria-hidden="true" />
          <span className="label-ui text-[#C85A17]">विशेष लेख</span>
        </div>

        {/* Two-column editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[8px] border border-[rgba(200,154,60,0.35)] overflow-hidden shadow-[0_4px_24px_-4px_rgba(40,25,15,0.07)]">
          {/* Left — Large devotional image */}
          <div className="relative bg-[#EDE2CF]" style={{ minHeight: "440px" }}>
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle image overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, transparent 70%, rgba(255,255,255,0.08) 100%)",
              }}
              aria-hidden="true"
            />
            {/* Category overlay chip */}
            <div className="absolute top-5 left-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(28,20,12,0.72)] backdrop-blur-sm rounded-[3px]">
                <span className="font-ui text-[10px] font-semibold tracking-[0.1em] uppercase text-[#C89A3C]">
                  {category}
                </span>
              </span>
            </div>
          </div>

          {/* Right — Editorial article details */}
          <div className="bg-white p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
            {/* Chapter marker / ornament */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-6 h-0.5 bg-[#C89A3C]/50" aria-hidden="true" />
              <span className="font-ui text-[10px] font-semibold tracking-[0.12em] uppercase text-[#C89A3C]">
                Feature Story
              </span>
            </div>

            {/* Headline */}
            <h2
              id="featured-article-heading"
              className="font-serif text-[#1C1C17] leading-snug mb-4 sm:mb-5"
              style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.875rem)", fontWeight: 600 }}
            >
              {title}
            </h2>

            {/* Description */}
            <p className="font-serif text-[#6B706A] leading-relaxed mb-6 text-body">
              {description}
            </p>

            {/* Gold hairline */}
            <div className="gold-hairline mb-6" aria-hidden="true" />

            {/* Metadata */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 text-[#8B7267]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-ui text-xs tracking-wide">{readTime}</span>
              </div>
              <span className="text-[rgba(107,112,106,0.3)]" aria-hidden="true">·</span>
              <span className="font-ui text-xs text-[#8B7267] tracking-wide">{author}</span>
            </div>

            {/* CTA */}
            <Link
              href={slug}
              className="inline-flex items-center gap-2 w-fit font-ui text-sm font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded min-h-[44px] py-2"
            >
              <span>Read Full Article</span>
              <span
                className="group-hover:translate-x-0.5 transition-transform duration-200"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

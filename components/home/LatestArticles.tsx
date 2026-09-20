import React from "react";
import Link from "next/link";
import { Badge, BadgeVariant } from "@/components/ui/Badge";

interface ArticleItem {
  id: string;
  category: string;
  badgeVariant: BadgeVariant;
  title: string;
  description: string;
  slug: string;
  motif: string;
}



interface LatestArticlesProps {
  articles?: Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    categorySlug?: string;
    symbol: string;
  }>;
}

const categoryBadgeMap: Record<string, BadgeVariant> = {
  bhakti: "maroon",
  "bhakti-vichar": "maroon",
  "radha-krishna": "saffron",
  hanuman: "gold",
  "bhagavad-gita": "maroon",
  shiv: "neutral",
  festivals: "saffron",
  vrindavan: "gold",
  "premanand-ji": "saffron",
};

export function LatestArticles({ articles: propArticles = [] }: LatestArticlesProps = {}) {
  const displayArticles: ArticleItem[] = propArticles.slice(0, 6).map((art) => ({
    id: art.slug,
    category: art.category,
    badgeVariant: (categoryBadgeMap[art.categorySlug || ""] || "maroon") as BadgeVariant,
    title: art.title,
    description: art.description,
    slug: `/bhakti-gyaan/${art.slug}`,
    motif: art.symbol,
  }));

  return (
    <section
      id="bhakti-gyaan"
      aria-labelledby="latest-articles-heading"
      className="py-14 sm:py-20 bg-[#FDFBF7]"
    >
      <div className="container-desktop">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4 pb-4 border-b border-[#6B1724]/8">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#D97706] uppercase font-body">
                अध्ययन एवं चिंतन
              </span>
            </div>
            <h2
              id="latest-articles-heading"
              className="font-heading text-3xl sm:text-4xl text-[#6B1724] tracking-tight leading-snug"
            >
              भक्ति ज्ञान
            </h2>
            <p className="text-[#5A6065] text-base sm:text-lg max-w-xl mt-2 leading-relaxed font-body">
              भक्ति, आध्यात्मिक जीवन और सनातन परंपराओं से जुड़े उपयोगी लेख पढ़ें।
            </p>
          </div>

          <div className="hidden md:block">
            <Link
              href="/bhakti-gyaan"
              className="inline-flex items-center gap-1.5 text-sm sm:text-base font-medium text-[#6B1724] hover:text-[#52111C] transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-sm py-1"
            >
              <span>सभी लेख देखें</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Articles Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
        {displayArticles.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#F8F4EC] border border-[#6B1724]/10">
            <p className="text-base text-[#5A6065] font-body">
              वर्तमान में कोई लेख उपलब्ध नहीं है। कृपया शीघ्र पुनः पधारें।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-2xl border border-[#6B1724]/10 shadow-[0_2px_12px_rgba(107,23,36,0.03)] hover:shadow-[0_8px_24px_rgba(107,23,36,0.07)] hover:border-[#6B1724]/20 transition-all duration-200 flex flex-col overflow-hidden"
              >
              {/* Image / Artwork Placeholder Frame */}
              <Link
                href={article.slug}
                tabIndex={-1}
                aria-hidden="true"
                className="block relative aspect-[16/10] bg-gradient-to-br from-[#F8F4EC] to-[#F1EADF] overflow-hidden border-b border-[#6B1724]/8"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-white/70 border border-[#6B1724]/10 flex items-center justify-center text-[#6B1724] mb-2 shadow-xs group-hover:scale-105 transition-transform duration-200">
                    <span className="font-heading text-lg select-none">
                      ✦
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#6B1724]/70 font-body">
                    {article.motif}
                  </span>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col grow">
                <div className="mb-3">
                  <Badge variant={article.badgeVariant}>
                    {article.category}
                  </Badge>
                </div>

                <h3 className="font-heading text-lg sm:text-xl text-[#1F2326] group-hover:text-[#6B1724] transition-colors leading-snug line-clamp-2 mb-2">
                  <Link
                    href={article.slug}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-sm"
                  >
                    {article.title}
                  </Link>
                </h3>

                <p className="text-sm text-[#5A6065] leading-relaxed line-clamp-2 mb-4 font-body grow">
                  {article.description}
                </p>

                {/* Read Link */}
                <div className="pt-3 border-t border-[#6B1724]/6 mt-auto">
                  <Link
                    href={article.slug}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B1724] group-hover:text-[#52111C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-sm"
                  >
                    <span>पढ़ें</span>
                    <span
                      className="group-hover:translate-x-0.5 transition-transform duration-150"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/bhakti-gyaan"
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-xl bg-[#F8F4EC] text-[#6B1724] font-medium border border-[#6B1724]/15 hover:bg-white transition-colors"
          >
            <span>सभी लेख देखें →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

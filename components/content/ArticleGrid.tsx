import React from "react";
import Link from "next/link";
import { Article } from "@/lib/data/articles";
import { Badge, BadgeVariant } from "@/components/ui/Badge";

export interface ArticleGridProps {
  articles: Article[];
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

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#6B1724]/10 my-8">
        <p className="font-heading text-xl text-[#6B1724] mb-2">
          इस श्रेणी में अभी कोई लेख उपलब्ध नहीं है।
        </p>
        <p className="text-sm text-[#5A6065] font-body">
          जल्द ही नए आध्यात्मिक लेख जोड़े जाएंगे। कृपया अन्य श्रेणियां देखें।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 my-8">
      {articles.map((article) => {
        const badgeVariant = categoryBadgeMap[article.categorySlug] || "maroon";
        const articleUrl = `/bhakti-gyaan/${article.slug}`;

        return (
          <article
            key={article.slug}
            className="group bg-white rounded-2xl border border-[#6B1724]/10 shadow-[0_2px_12px_rgba(107,23,36,0.03)] hover:shadow-[0_8px_24px_rgba(107,23,36,0.07)] hover:border-[#6B1724]/22 transition-all duration-200 flex flex-col overflow-hidden"
          >
            {/* Visual Motif or Featured Image */}
            <Link
              href={articleUrl}
              tabIndex={-1}
              aria-hidden="true"
              className="block relative aspect-[16/10] bg-gradient-to-br from-[#F8F4EC] to-[#F1EADF] overflow-hidden border-b border-[#6B1724]/8"
            >
              {article.featuredImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={article.featuredImageUrl}
                  alt={article.featuredImageAlt || article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-white/80 border border-[#6B1724]/10 flex items-center justify-center text-[#6B1724] mb-2 shadow-xs group-hover:scale-105 transition-transform duration-200">
                    <span className="font-heading text-lg select-none">
                      ✦
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#6B1724]/75 font-body">
                    {article.symbol}
                  </span>
                </div>
              )}
            </Link>

            {/* Card Content */}
            <div className="p-5 sm:p-6 flex flex-col grow">
              {/* Category & Read Time Meta */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <Link
                  href={`/${article.categorySlug}`}
                  className="hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-full"
                  title={`${article.category} श्रेणी देखें`}
                >
                  <Badge variant={badgeVariant}>{article.category}</Badge>
                </Link>
                <span className="text-xs text-[#5A6065] font-body">
                  {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-heading text-xl text-[#1F2326] group-hover:text-[#6B1724] transition-colors leading-snug line-clamp-2 mb-2">
                <Link
                  href={articleUrl}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-sm"
                >
                  {article.title}
                </Link>
              </h2>

              {/* Description */}
              <p className="text-sm text-[#5A6065] leading-relaxed line-clamp-2 mb-4 font-body grow">
                {article.description}
              </p>

              {/* Footer */}
              <div className="pt-3 border-t border-[#6B1724]/6 mt-auto flex items-center justify-between">
                <span className="text-xs text-[#5A6065]/80 font-body">
                  {article.publishedAt}
                </span>
                <Link
                  href={articleUrl}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B1724] group-hover:text-[#52111C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-sm"
                >
                  <span>पढ़ें</span>
                  <span className="sr-only">: {article.title}</span>
                  <span
                    className="group-hover:translate-x-1 transition-transform duration-150"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

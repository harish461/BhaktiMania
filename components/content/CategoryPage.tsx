import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleGrid } from "@/components/content/ArticleGrid";
import { RelatedCategories } from "@/components/content/RelatedCategories";
import { DevotionalCategory } from "@/lib/data/categories";
import { Article } from "@/lib/data/articles";
import { getCanonicalUrl } from "@/lib/config/site";

export interface CategoryPageProps {
  category: DevotionalCategory;
  articles: Article[];
  relatedCategories?: DevotionalCategory[];
}

export function CategoryPage({
  category,
  articles,
  relatedCategories,
}: CategoryPageProps) {
  const categoryUrl =
    getCanonicalUrl(`/${category.slug}`) || `/${category.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "होम",
        item: getCanonicalUrl("/") || "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.title,
        item: categoryUrl,
      },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: categoryUrl,
    inLanguage: "hi",
    ...(articles.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: article.title,
              url: getCanonicalUrl(`/bhakti-gyaan/${article.slug}`),
            })),
          },
        }
      : {}),
  };

  const showEditorialNotice = articles.length < 3;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      {/* Schema.org BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Schema.org CollectionPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />

      <Header />

      <main className="flex-1 py-8 sm:py-12 md:py-16">
        <div className="container-desktop">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="ब्रेडक्रम्ब"
            className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-[#5A6065] mb-6 font-body"
          >
            <Link
              href="/"
              className="hover:text-[#6B1724] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-xs"
            >
              होम
            </Link>
            <span aria-hidden="true" className="text-[#5A6065]/60">
              →
            </span>
            <span
              className="text-[#6B1724] font-medium"
              aria-current="page"
            >
              {category.title}
            </span>
          </nav>

          {/* Category Header */}
          <header className="max-w-3xl mb-8 sm:mb-12">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                भक्ति • ज्ञान • शांति
              </span>
            </div>

            {/* H1 Title with Devotional Symbol */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div
                className="h-12 px-3.5 min-w-[48px] rounded-xl bg-[#6B1724] text-white flex items-center justify-center font-heading text-sm font-medium shadow-xs shrink-0"
                aria-hidden="true"
              >
                <span>{category.symbol}</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight">
                {category.title}
              </h1>
            </div>

            {/* Category Description */}
            <p className="text-[#5A6065] text-base sm:text-lg leading-relaxed font-body mb-4">
              {category.description}
            </p>

            {/* Optional Introduction */}
            {category.intro && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F4EC] border-l-4 border-[#D97706] text-[#1F2326] text-sm sm:text-base leading-relaxed font-body">
                {category.intro}
              </div>
            )}
          </header>

          {/* Articles Section */}
          <section aria-label={`${category.title} के लेख`}>
            {articles.length > 0 ? (
              <ArticleGrid articles={articles} />
            ) : null}

            {/* Editorial Notice if fewer than 3 articles */}
            {showEditorialNotice && (
              <div className="my-10 sm:my-14 p-6 sm:p-8 rounded-2xl bg-[#F8F4EC] border border-[#6B1724]/10 text-center max-w-2xl mx-auto shadow-xs">
                <div
                  className="w-12 h-12 rounded-full bg-white border border-[#6B1724]/10 flex items-center justify-center text-[#6B1724] mx-auto mb-3 shadow-xs"
                  aria-hidden="true"
                >
                  <span className="font-heading text-lg select-none">✦</span>
                </div>
                <p className="font-heading text-xl sm:text-2xl text-[#6B1724] mb-2">
                  इस विषय पर और लेख जल्द प्रकाशित किए जाएंगे।
                </p>
                <p className="text-xs sm:text-sm text-[#5A6065] font-body leading-relaxed max-w-md mx-auto">
                  सनातन परंपरा, भक्ति एवं आध्यात्मिक ज्ञान से जुड़े नए प्रमाणिक लेख निरंतर संकलित किए जा रहे हैं।
                </p>
              </div>
            )}
          </section>

          {/* Related Categories */}
          <RelatedCategories
            currentSlug={category.slug}
            relatedCategories={relatedCategories}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

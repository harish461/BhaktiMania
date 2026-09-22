import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InArticleAd } from "@/components/ads/InArticleAd";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import type { Article } from "@/lib/data/articles";
import {
  getPublishedArticles,
  getPublishedArticleBySlug,
  getRelatedArticles,
} from "@/lib/data/supabase";
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { siteConfig, getCanonicalUrl } from "@/lib/config/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

const categoryBadgeMap: Record<string, BadgeVariant> = {
  bhakti: "maroon",
  "bhakti-vichar": "maroon",
  "radha-krishna": "saffron",
  hanuman: "gold",
  "bhagavad-gita": "maroon",
  shiv: "stone",
  festivals: "saffron",
  vrindavan: "gold",
  "premanand-ji": "saffron",
};

export async function generateStaticParams() {
  try {
    const articles = await getPublishedArticles();
    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (err: unknown) {
    console.error("[bhakti-gyaan/[slug]] Error generating static params:", err);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "लेख नहीं मिला",
    };
  }

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.description;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/bhakti-gyaan/${article.slug}`),
    },
    openGraph: {
      title: `${title} | BhaktiMania`,
      description,
      type: "article",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      images: [
        {
          url: article.featuredImageUrl || "https://bhaktimania.com/images/og-default.webp",
          alt: article.featuredImageAlt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | BhaktiMania`,
      description,
      images: [article.featuredImageUrl || "https://bhaktimania.com/images/og-default.webp"],
    },
  };
}

function renderFormattedInline(content: string): React.ReactNode {
  if (!content || (!content.includes("[") && !content.includes("*"))) {
    return content;
  }
  const tokenRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      elements.push(content.substring(lastIndex, match.index));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      const linkText = match[1];
      const linkUrl = match[2];
      const isInternal = linkUrl.startsWith("/") || linkUrl.startsWith("#");
      if (isInternal) {
        elements.push(
          <Link
            key={`l-${match.index}`}
            href={linkUrl}
            className="text-[#6B1724] font-medium underline underline-offset-3 hover:text-[#52111C] decoration-[#D97706]/60 hover:decoration-[#6B1724] transition-colors"
          >
            {linkText}
          </Link>
        );
      } else {
        elements.push(
          <a
            key={`l-${match.index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B1724] font-medium underline underline-offset-3 hover:text-[#52111C] decoration-[#D97706]/60 hover:decoration-[#6B1724] transition-colors"
          >
            {linkText}
          </a>
        );
      }
    } else if (match[3] !== undefined) {
      elements.push(
        <strong key={`b-${match.index}`} className="font-semibold text-[#1F2326]">
          {match[3]}
        </strong>
      );
    } else if (match[4] !== undefined) {
      elements.push(
        <em key={`i-${match.index}`} className="italic">
          {match[4]}
        </em>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    elements.push(content.substring(lastIndex));
  }

  return elements;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Related articles resolved via Supabase data access layer
  const relatedArticles: Article[] = await getRelatedArticles(
    article.slug,
    article.categorySlug,
    3
  );

  const badgeVariant = categoryBadgeMap[article.categorySlug] || "maroon";

  const pageUrl =
    getCanonicalUrl(`/bhakti-gyaan/${article.slug}`) ||
    `https://bhaktimania.com/bhakti-gyaan/${article.slug}`;

  const articleImageUrl = article.featuredImageUrl
    ? (article.featuredImageUrl.startsWith("http")
        ? article.featuredImageUrl
        : `https://bhaktimania.com${article.featuredImageUrl.startsWith("/") ? "" : "/"}${article.featuredImageUrl}`)
    : "https://bhaktimania.com/images/og-default.webp";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "होम",
        item: getCanonicalUrl("/") || "https://bhaktimania.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "भक्ति ज्ञान",
        item: getCanonicalUrl("/bhakti-gyaan") || "https://bhaktimania.com/bhakti-gyaan",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: pageUrl,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    inLanguage: "hi",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    image: [articleImageUrl],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: "https://bhaktimania.com/images/og-default.webp",
      },
    },
    author: {
      "@type": "Organization",
      name: article.author || siteConfig.name,
    },
    ...(article.publishedAtIso ? { datePublished: article.publishedAtIso } : {}),
    ...(article.updatedAtIso || article.publishedAtIso
      ? { dateModified: article.updatedAtIso || article.publishedAtIso }
      : {}),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header />

      <main className="flex-1 py-8 sm:py-12 md:py-16">
        <div className="container-article">
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
            <Link
              href="/bhakti-gyaan"
              className="hover:text-[#6B1724] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-xs"
            >
              भक्ति ज्ञान
            </Link>
            <span aria-hidden="true" className="text-[#5A6065]/60">
              →
            </span>
            <span
              className="text-[#6B1724] font-medium truncate max-w-[200px] sm:max-w-[320px]"
              aria-current="page"
            >
              {article.title}
            </span>
          </nav>

          {/* Category Badge - Links to Category Page */}
          <div className="mb-3">
            <Link
              href={`/${article.categorySlug}`}
              className="inline-block hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-full"
              title={`${article.category} श्रेणी के सभी लेख देखें`}
            >
              <Badge variant={badgeVariant}>{article.category}</Badge>
            </Link>
          </div>

          {/* H1 Article Title */}
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#6B1724] tracking-tight leading-snug mb-4">
            {article.title}
          </h1>

          {/* Article Introduction / Subtitle */}
          <p className="text-base sm:text-lg text-[#5A6065] leading-relaxed font-body mb-5">
            {article.description}
          </p>

          {/* Article Metadata Bar */}
          <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm text-[#5A6065] py-3.5 border-y border-[#6B1724]/10 mb-8 font-body">
            <div className="flex items-center gap-1.5">
              <span className="text-[#D97706]" aria-hidden="true">
                ✦
              </span>
              <span>{article.readTime} पढ़ने का समय</span>
            </div>
            <span aria-hidden="true" className="text-[#5A6065]/40">
              •
            </span>
            <div className="flex items-center gap-1.5">
              <span>प्रकाशित: {article.publishedAt}</span>
            </div>
            {article.author && (
              <>
                <span aria-hidden="true" className="text-[#5A6065]/40">
                  •
                </span>
                <div className="flex items-center gap-1.5">
                  <span>लेखक: {article.author}</span>
                </div>
              </>
            )}
          </div>

          {/* Hero Devotional Artwork / Visual Motif */}
          {article.featuredImageUrl ? (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-10 border border-[#6B1724]/12 shadow-xs bg-[#F8F4EC]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.featuredImageUrl}
                alt={article.featuredImageAlt || article.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          ) : (
            <div
              className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-[#F8F4EC] via-[#F4EFE6] to-[#ECE3D4] border border-[#6B1724]/12 flex flex-col items-center justify-center text-center p-6 mb-10 overflow-hidden shadow-xs"
              aria-hidden="true"
            >
              <div className="w-16 h-16 rounded-full bg-white/90 border border-[#6B1724]/12 flex items-center justify-center text-[#6B1724] shadow-xs mb-3">
                <span className="font-heading text-2xl select-none">
                  ✦
                </span>
              </div>
              <span className="font-heading text-xl text-[#6B1724]">
                {article.symbol}
              </span>
              <span className="text-xs text-[#5A6065] mt-1 font-body">
                भक्ति एवं आध्यात्मिक चिंतन
              </span>
            </div>
          )}

          {/* Placement A: Above Body / Below Hero (Dormant until active AdSense & slotId configured) */}
          <InArticleAd className="mb-6" />

          {/* Main Article Content */}
          <div className="article-body font-body text-[#1F2326]">
            {article.sections && article.sections.length > 0 ? (
              article.sections.map((section, idx) => (
                <section key={idx} className="mb-8">
                  {section.heading && (
                    <h2 className="font-heading text-xl sm:text-2xl text-[#6B1724] tracking-tight leading-snug mt-8 mb-4">
                      {section.heading}
                    </h2>
                  )}

                  {section.highlight && (
                    <div className="my-6 p-4 sm:p-5 rounded-r-2xl bg-[#F8F4EC] border-l-4 border-[#D97706] text-[#6B1724] font-heading text-lg sm:text-xl leading-relaxed italic">
                      {renderFormattedInline(section.highlight)}
                    </div>
                  )}

                  {section.paragraphs &&
                    section.paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-base sm:text-lg text-[#1F2326] leading-[1.85] mb-4.5"
                      >
                        {renderFormattedInline(para)}
                      </p>
                    ))}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-3 my-5 pl-2 sm:pl-4">
                      {section.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-base sm:text-lg text-[#1F2326] leading-[1.75]"
                        >
                          <span
                            className="text-[#D97706] text-sm mt-1 shrink-0 select-none"
                            aria-hidden="true"
                          >
                            ✦
                          </span>
                          <span>{renderFormattedInline(bullet)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Placement B: Between Substantial Sections (Dormant until active AdSense & slotId configured) */}
                  {idx === 1 && <InArticleAd />}
                </section>
              ))
            ) : (
              <p className="text-base sm:text-lg text-[#1F2326] leading-[1.85]">
                {article.description}
              </p>
            )}
          </div>

          {/* Placement C: Near End of Article Body (Dormant until active AdSense & slotId configured) */}
          <InArticleAd className="mt-8 mb-4" />

          {/* Reader Transparency Disclosure */}
          <AffiliateDisclosure className="mt-8" />

          {/* Article Footer & Back Link */}
          <Divider variant="ornamental" className="my-10" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <Link
              href="/bhakti-gyaan"
              className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-xl bg-[#F8F4EC] text-[#6B1724] font-medium border border-[#6B1724]/15 hover:bg-white transition-colors"
            >
              <span>← सभी भक्ति लेख देखें</span>
            </Link>

            <span className="text-xs text-[#5A6065] font-body text-center sm:text-right">
              BhaktiMania • भक्ति को जीवन का हिस्सा बनाइए
            </span>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="container-desktop mt-16 sm:mt-20 pt-12 border-t border-[#6B1724]/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D97706] font-body">
                  और अधिक पढ़ें
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl text-[#6B1724] tracking-tight mt-1">
                  संबंधित लेख
                </h3>
              </div>
              <Link
                href="/bhakti-gyaan"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#6B1724] hover:text-[#52111C] underline-offset-4 hover:underline"
              >
                <span>सभी देखें</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedArticles.map((rel) => {
                const relBadge = categoryBadgeMap[rel.categorySlug] || "maroon";
                return (
                  <article
                    key={rel.slug}
                    className="group bg-white rounded-2xl border border-[#6B1724]/10 shadow-[0_2px_10px_rgba(107,23,36,0.03)] hover:shadow-[0_8px_20px_rgba(107,23,36,0.06)] hover:border-[#6B1724]/20 transition-all duration-200 flex flex-col overflow-hidden"
                  >
                    <div className="p-5 flex flex-col grow">
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <Link
                          href={`/${rel.categorySlug}`}
                          className="hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-full"
                          title={`${rel.category} श्रेणी देखें`}
                        >
                          <Badge variant={relBadge}>{rel.category}</Badge>
                        </Link>
                        <span className="text-xs text-[#5A6065]">
                          {rel.readTime}
                        </span>
                      </div>

                      <h4 className="font-heading text-lg text-[#1F2326] group-hover:text-[#6B1724] transition-colors leading-snug line-clamp-2 mb-2">
                        <Link
                          href={`/bhakti-gyaan/${rel.slug}`}
                          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-sm"
                        >
                          {rel.title}
                        </Link>
                      </h4>

                      <p className="text-xs sm:text-sm text-[#5A6065] leading-relaxed line-clamp-2 mb-3 grow">
                        {rel.description}
                      </p>

                      <div className="pt-2.5 border-t border-[#6B1724]/6 mt-auto">
                        <Link
                          href={`/bhakti-gyaan/${rel.slug}`}
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#6B1724] group-hover:text-[#52111C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] rounded-xs"
                        >
                          <span>पढ़ें</span>
                          <span className="sr-only">: {rel.title}</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */

interface ArticleItem {
  id: string;
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  slug: string;
  readTime: string;
  imageUrl: string;
  author?: string;
  publishedAt?: string;
}

interface LatestArticlesProps {
  articles?: Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    categorySlug?: string;
    symbol: string;
    readTime?: string;
    featuredImageUrl?: string | null;
    authorName?: string;
    rawPublishedAt?: string | null;
  }>;
}

/* ─────────────────────────────────────────────────────────────────
   Category → saffron label colour mapping
───────────────────────────────────────────────────────────────── */

const categoryColorMap: Record<string, string> = {
  hanuman: "#C85A17",
  "radha-krishna": "#C89A3C",
  shiv: "#6B706A",
  "bhagavad-gita": "#6B706A",
  vrindavan: "#C89A3C",
  festivals: "#C85A17",
  "bhakti-vichar": "#C85A17",
  "premanand-ji": "#C85A17",
};

/* ─────────────────────────────────────────────────────────────────
   Per-category fallback images
───────────────────────────────────────────────────────────────── */

const categoryImageMap: Record<string, string> = {
  hanuman:
    "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=600&q=80&auto=format&fit=crop",
  "radha-krishna":
    "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=600&q=80&auto=format&fit=crop",
  shiv: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80&auto=format&fit=crop",
  "bhagavad-gita":
    "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=600&q=80&auto=format&fit=crop",
  vrindavan:
    "https://images.unsplash.com/photo-1626015266924-f7ea2c69d14e?w=600&q=80&auto=format&fit=crop",
  festivals:
    "https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=80&auto=format&fit=crop",
};

const defaultImage =
  "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=600&q=80&auto=format&fit=crop";

/* ─────────────────────────────────────────────────────────────────
   Hardcoded fallback articles (shown when Supabase returns empty)
───────────────────────────────────────────────────────────────── */

const fallbackArticles: ArticleItem[] = [
  {
    id: "hanuman-chalisa",
    category: "हनुमान",
    categorySlug: "hanuman",
    title: "हनुमान चालीसा का आध्यात्मिक महत्व",
    description:
      "हनुमान चालीसा की चालीस चौपाइयां मन को शक्ति, विश्वास और भय से मुक्ति प्रदान करती हैं।",
    slug: "/bhakti-gyaan/hanuman-chalisa-paath-kyun-karein",
    readTime: "5 min read",
    imageUrl: categoryImageMap["hanuman"],
    author: "BhaktiMania",
    publishedAt: "June 2, 2024",
  },
  {
    id: "karma-dharma",
    category: "भक्ति ज्ञान",
    categorySlug: "bhakti-gyaan",
    title: "कर्म और धर्म के बीच क्या संबंध है?",
    description:
      "कर्म योग और धर्म का गहरा संबंध — जानिए कैसे श्रेष्ठ कर्म ही सच्चा धर्म है।",
    slug: "/bhakti-gyaan/karma-yoga-kya-hai",
    readTime: "6 min read",
    imageUrl: defaultImage,
    author: "BhaktiMania",
    publishedAt: "July 15, 2024",
  },
  {
    id: "subah-bhakti",
    category: "आध्यात्मिक जीवन",
    categorySlug: "bhakti-vichar",
    title: "सुबह की भक्ति दिनचर्या कैसे बनाएं?",
    description:
      "प्रातःकाल की सरल भक्ति दिनचर्या जो आपके पूरे दिन को शांत और सकारात्मक बना सकती है।",
    slug: "/bhakti-gyaan/subah-ki-10-minute-bhakti-dincharya",
    readTime: "4 min read",
    imageUrl: defaultImage,
    author: "BhaktiMania",
    publishedAt: "August 3, 2024",
  },
  {
    id: "ekadashi",
    category: "त्योहार",
    categorySlug: "festivals",
    title: "एकादशी व्रत का आध्यात्मिक महत्व",
    description:
      "एकादशी व्रत को केवल उपवास नहीं, बल्कि एक आंतरिक शुद्धि और ईश्वर के प्रति समर्पण का अवसर माना जाता है।",
    slug: "/festivals",
    readTime: "5 min read",
    imageUrl: categoryImageMap["festivals"],
    author: "BhaktiMania",
    publishedAt: "September 1, 2024",
  },
  {
    id: "radha-krishna-prem",
    category: "राधा कृष्ण",
    categorySlug: "radha-krishna",
    title: "राधा-कृष्ण के प्रेम से हमें क्या सीख मिलती है?",
    description:
      "राधा-कृष्ण का निस्वार्थ दिव्य प्रेम हमें जीवन में अपेक्षाओं से मुक्त होकर प्रेम करना सिखाता है।",
    slug: "/bhakti-gyaan/radha-krishna-bhakti",
    readTime: "6 min read",
    imageUrl: categoryImageMap["radha-krishna"],
    author: "BhaktiMania",
    publishedAt: "September 10, 2024",
  },
  {
    id: "vrindavan-yatra",
    category: "यात्रा",
    categorySlug: "vrindavan",
    title: "वृंदावन यात्रा: एक आध्यात्मिक अनुभव",
    description:
      "वृंदावन — जहां हर गली में कृष्ण नाम गूंजता है। एक ऐसी यात्रा जो मन और आत्मा दोनों को स्पर्श करती है।",
    slug: "/vrindavan",
    readTime: "7 min read",
    imageUrl: categoryImageMap["vrindavan"],
    author: "BhaktiMania",
    publishedAt: "September 20, 2024",
  },
];

/* ─────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────── */

function formatDate(raw?: string | null): string {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}



/* ─────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────── */

export function LatestArticles({ articles: propArticles = [] }: LatestArticlesProps = {}) {
  const displayArticles: ArticleItem[] =
    propArticles.length > 0
      ? propArticles.slice(0, 6).map((art) => ({
          id: art.slug,
          category: art.category,
          categorySlug: art.categorySlug || "",
          title: art.title,
          description: art.description,
          slug: `/bhakti-gyaan/${art.slug}`,
          readTime: art.readTime ? `${art.readTime} read` : "5 min read",
          imageUrl:
            art.featuredImageUrl ||
            categoryImageMap[art.categorySlug || ""] ||
            defaultImage,
          author: art.authorName || "BhaktiMania",
          publishedAt: formatDate(art.rawPublishedAt),
        }))
      : fallbackArticles;

  return (
    <section
      id="articles"
      aria-labelledby="latest-articles-heading"
      className="pt-10 pb-4 lg:pt-12 lg:pb-6 bg-white [scroll-margin-top:80px]"
      style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex items-start justify-between mb-6 pb-3 border-b border-gray-200">
          <div>
            <h2
              id="latest-articles-heading"
              className="text-[22px] font-bold text-[#1C1C17] leading-tight"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 700 }}
            >
              Articles
            </h2>
            <p
              className="text-[13px] text-[#6B706A] mt-1"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              Spiritual knowledge, bhakti wisdom and devotional guidance
            </p>
          </div>
          <Link
            href="/bhakti-gyaan"
            className="text-[13px] font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors whitespace-nowrap mt-1 flex items-center gap-1"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            More Articles →
          </Link>
        </div>

        {/* ── 3-column Article Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
          {displayArticles.map((article) => {
            const catColor =
              categoryColorMap[article.categorySlug] || "#C85A17";

            return (
              <article key={article.id} className="group flex flex-col">

                {/* Image */}
                <Link
                  href={article.slug}
                  className="relative block overflow-hidden mb-4"
                  style={{ aspectRatio: "16/10" }}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                  />
                </Link>

                {/* Card Body */}
                <div className="flex flex-col flex-1">

                  {/* Category label */}
                  <div className="mb-2">
                    <span
                      className="text-[11px] font-semibold tracking-[0.06em] uppercase"
                      style={{
                        fontFamily: "var(--font-poppins), Poppins, sans-serif",
                        color: catColor,
                      }}
                    >
                      {article.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2">
                    <Link
                      href={article.slug}
                      className="text-[16px] font-bold text-[#1C1C17] leading-snug hover:text-[#C85A17] transition-colors line-clamp-2"
                      style={{
                        fontFamily: "var(--font-poppins), Poppins, sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {article.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p
                    className="text-[13px] text-[#6B706A] leading-relaxed line-clamp-3 mb-3 flex-1"
                    style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
                  >
                    {article.description}
                  </p>

                  {/* Meta row: author · date · read time */}
                  <div
                    className="flex items-center gap-1.5 text-[11.5px] text-[#9CA3AF]"
                    style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
                  >
                    <span className="font-medium text-[#6B706A]">{article.author}</span>
                    {article.publishedAt && (
                      <>
                        <span>·</span>
                        <span>{article.publishedAt}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>

                  {/* Clean bottom row — read more link matching reference design */}
                  <div className="flex items-center justify-between pt-2.5 mt-3 border-t border-gray-100 text-[12px]">
                    <span className="text-[#8B7267] font-medium text-[11.5px]">
                      {article.category}
                    </span>
                    <Link
                      href={article.slug}
                      className="font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors flex items-center gap-1"
                    >
                      पढ़ें →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile view-all */}
        <div className="mt-10 text-center lg:hidden">
          <Link
            href="/bhakti-gyaan"
            className="inline-flex items-center justify-center px-7 py-2.5 border border-[#C85A17] text-[13px] font-semibold text-[#C85A17] hover:bg-[#FFF5EF] transition-colors rounded"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}

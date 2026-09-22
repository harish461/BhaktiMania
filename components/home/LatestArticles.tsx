import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge, BadgeVariant } from "@/components/ui/Badge";

interface ArticleItem {
  id: string;
  category: string;
  badgeVariant: BadgeVariant;
  title: string;
  description: string;
  slug: string;
  readTime: string;
  imageUrl: string;
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
  }>;
}

const categoryBadgeMap: Record<string, BadgeVariant> = {
  bhakti: "saffron",
  "bhakti-vichar": "saffron",
  "radha-krishna": "gold",
  hanuman: "saffron",
  "bhagavad-gita": "stone",
  shiv: "stone",
  festivals: "gold",
  vrindavan: "gold",
  "premanand-ji": "saffron",
};

/** Per-category fallback images from Unsplash */
const categoryImageMap: Record<string, string> = {
  hanuman:
    "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=600&q=80&auto=format&fit=crop",
  "radha-krishna":
    "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=600&q=80&auto=format&fit=crop",
  shiv:
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80&auto=format&fit=crop",
  "bhagavad-gita":
    "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=600&q=80&auto=format&fit=crop",
  vrindavan:
    "https://images.unsplash.com/photo-1626015266924-f7ea2c69d14e?w=600&q=80&auto=format&fit=crop",
  festivals:
    "https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=80&auto=format&fit=crop",
};

const defaultImage =
  "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=600&q=80&auto=format&fit=crop";

/** Hardcoded fallback articles matching the design spec */
const fallbackArticles: ArticleItem[] = [
  {
    id: "hanuman-chalisa",
    category: "हनुमान",
    badgeVariant: "saffron",
    title: "हनुमान चालीसा का आध्यात्मिक महत्व",
    description:
      "हनुमान चालीसा की चालीस चौपाइयां मन को शक्ति, विश्वास और भय से मुक्ति प्रदान करती हैं।",
    slug: "/bhakti-gyaan/hanuman-chalisa-paath-kyun-karein",
    readTime: "5 मिनट",
    imageUrl: categoryImageMap["hanuman"],
  },
  {
    id: "karma-dharma",
    category: "भक्ति ज्ञान",
    badgeVariant: "stone",
    title: "कर्म और धर्म के बीच क्या संबंध है?",
    description:
      "कर्म योग और धर्म का गहरा संबंध — जानिए कैसे श्रेष्ठ कर्म ही सच्चा धर्म है।",
    slug: "/bhakti-gyaan/karma-yoga-kya-hai",
    readTime: "6 मिनट",
    imageUrl: defaultImage,
  },
  {
    id: "subah-bhakti",
    category: "आध्यात्मिक जीवन",
    badgeVariant: "gold",
    title: "सुबह की भक्ति दिनचर्या कैसे बनाएं?",
    description:
      "प्रातःकाल की सरल भक्ति दिनचर्या जो आपके पूरे दिन को शांत और सकारात्मक बना सकती है।",
    slug: "/bhakti-gyaan/subah-ki-10-minute-bhakti-dincharya",
    readTime: "4 मिनट",
    imageUrl: defaultImage,
  },
  {
    id: "ekadashi",
    category: "त्योहार",
    badgeVariant: "saffron",
    title: "एकादशी व्रत का आध्यात्मिक महत्व",
    description:
      "एकादशी व्रत को केवल उपवास नहीं, बल्कि एक आंतरिक शुद्धि और ईश्वर के प्रति समर्पण का अवसर माना जाता है।",
    slug: "/festivals",
    readTime: "5 मिनट",
    imageUrl: categoryImageMap["festivals"],
  },
  {
    id: "radha-krishna-prem",
    category: "राधा कृष्ण",
    badgeVariant: "gold",
    title: "राधा-कृष्ण के प्रेम से हमें क्या सीख मिलती है?",
    description:
      "राधा-कृष्ण का निस्वार्थ दिव्य प्रेम हमें जीवन में अपेक्षाओं से मुक्त होकर प्रेम करना सिखाता है।",
    slug: "/bhakti-gyaan/radha-krishna-bhakti",
    readTime: "6 मिनट",
    imageUrl: categoryImageMap["radha-krishna"],
  },
  {
    id: "vrindavan-yatra",
    category: "यात्रा",
    badgeVariant: "saffron",
    title: "वृंदावन यात्रा: एक आध्यात्मिक अनुभव",
    description:
      "वृंदावन — जहां हर गली में कृष्ण नाम गूंजता है। एक ऐसी यात्रा जो मन और आत्मा दोनों को स्पर्श करती है।",
    slug: "/vrindavan",
    readTime: "7 मिनट",
    imageUrl: categoryImageMap["vrindavan"],
  },
];

export function LatestArticles({ articles: propArticles = [] }: LatestArticlesProps = {}) {
  const displayArticles: ArticleItem[] =
    propArticles.length > 0
      ? propArticles.slice(0, 6).map((art) => ({
          id: art.slug,
          category: art.category,
          badgeVariant: (categoryBadgeMap[art.categorySlug || ""] ||
            "saffron") as BadgeVariant,
          title: art.title,
          description: art.description,
          slug: `/bhakti-gyaan/${art.slug}`,
          readTime: art.readTime || "5 मिनट",
          imageUrl:
            art.featuredImageUrl ||
            categoryImageMap[art.categorySlug || ""] ||
            defaultImage,
        }))
      : fallbackArticles;

  return (
    <section
      id="bhakti-gyaan"
      aria-labelledby="latest-articles-heading"
      className="py-20 lg:py-28 bg-[#FBF8F0]"
    >
      <div className="container-desktop">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4 pb-5 border-b border-[rgba(200,154,60,0.2)]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="accent-dot" aria-hidden="true" />
              <span className="label-ui text-[#C85A17]">अध्ययन एवं चिंतन</span>
            </div>
            <h2
              id="latest-articles-heading"
              className="font-serif text-[#1C1C17] leading-tight"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.125rem)", fontWeight: 500 }}
            >
              नवीनतम लेख&nbsp;•&nbsp;भक्ति ज्ञान
            </h2>
          </div>
          <Link
            href="/bhakti-gyaan"
            className="hidden lg:inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded py-1"
          >
            <span>सभी लेख देखें</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 3-column article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {displayArticles.map((article) => (
            <article
              key={article.id}
              className="group bg-white rounded-[6px] border border-[rgba(200,154,60,0.22)] shadow-[0_2px_12px_-2px_rgba(40,25,15,0.04)] hover:shadow-[0_10px_30px_-4px_rgba(40,25,15,0.08)] hover:border-[rgba(200,154,60,0.4)] transition-all duration-200 flex flex-col overflow-hidden"
            >
              {/* Article image frame */}
              <Link
                href={article.slug}
                tabIndex={-1}
                aria-hidden="true"
                className="block relative overflow-hidden"
                style={{ aspectRatio: "16/10" }}
              >
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
                />
                {/* Subtle warm image overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[rgba(28,20,12,0.15)] to-transparent"
                  aria-hidden="true"
                />
              </Link>

              {/* Card body */}
              <div className="p-5 lg:p-6 flex flex-col grow">
                {/* Category badge */}
                <div className="mb-3">
                  <Badge variant={article.badgeVariant}>{article.category}</Badge>
                </div>

                {/* Title */}
                <h3
                  className="font-serif text-[#1C1C17] group-hover:text-[#C85A17] transition-colors duration-200 leading-snug line-clamp-2 mb-2.5"
                  style={{ fontSize: "1.0625rem", fontWeight: 600 }}
                >
                  <Link
                    href={article.slug}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded"
                  >
                    {article.title}
                  </Link>
                </h3>

                {/* Description */}
                <p className="font-serif text-sm text-[#6B706A] leading-relaxed line-clamp-2 mb-4 grow">
                  {article.description}
                </p>

                {/* Footer */}
                <div className="pt-3.5 border-t border-[rgba(107,112,106,0.12)] mt-auto flex items-center justify-between">
                  <span className="font-ui text-[11px] text-[#8B7267] tracking-wide">
                    {article.readTime} पढ़ने का समय
                  </span>
                  <Link
                    href={article.slug}
                    className="inline-flex items-center gap-1 font-ui text-xs font-semibold text-[#C85A17] group-hover:text-[#A8440B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded"
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

        {/* Mobile view all */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            href="/bhakti-gyaan"
            className="inline-flex items-center justify-center min-h-[44px] px-7 rounded border border-[rgba(200,154,60,0.35)] bg-white font-ui text-sm font-semibold text-[#C85A17] hover:bg-[#F5EFE2] transition-colors"
          >
            सभी लेख देखें →
          </Link>
        </div>
      </div>
    </section>
  );
}

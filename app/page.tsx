import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Hero + Bhakti Vichar
import { Hero } from "@/components/home/Hero";
import { DailyBhaktiThought } from "@/components/home/DailyBhaktiThought";

// Featured editorial
import { FeaturedArticle } from "@/components/home/FeaturedArticle";

// Categories
import { DevotionalCategories } from "@/components/home/DevotionalCategories";

// Latest articles
import { LatestArticles } from "@/components/home/LatestArticles";

// Immersive quote
import { SpiritualQuoteSection } from "@/components/home/SpiritualQuoteSection";

// Devotional stories
import { DevotionalStories } from "@/components/home/DevotionalStories";

// Festivals
import { FestivalSection } from "@/components/home/FestivalSection";

// Newsletter
import { NewsletterSection } from "@/components/home/NewsletterSection";

// Data
import { getPublishedArticles, getCategories } from "@/lib/data/supabase";
import { siteConfig } from "@/lib/config/site";

export default async function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url || "https://bhaktimania.com",
    description: siteConfig.tagline,
    inLanguage: "hi",
  };

  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    const [fetchedArticles, fetchedCategories] = await Promise.all([
      getPublishedArticles(),
      getCategories(),
    ]);
    articles = fetchedArticles;
    categories = fetchedCategories;
  } catch (err: unknown) {
    console.error("[app/page] Error loading homepage Supabase data:", err);
  }

  const featuredArticle = articles.find((a) => a.featured) || articles[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <Header />

      <main className="flex-1">
        {/* 1. Cinematic Hero */}
        <Hero />

        {/* 2. Bhakti Vichar — daily devotional quote */}
        <DailyBhaktiThought />

        {/* 3. Featured Article — two-column editorial */}
        <FeaturedArticle article={featuredArticle} />

        {/* 4. Devotional Categories — 3×2 grid */}
        <DevotionalCategories categories={categories} />

        {/* 5. Latest Articles — 3-column cards */}
        <LatestArticles articles={articles} />

        {/* 6. Immersive Spiritual Quote — full-width dark section */}
        <SpiritualQuoteSection />

        {/* 7. Devotional Stories — Dhruv, Prahlad, Sudama */}
        <DevotionalStories />

        {/* 8. Festival Section — 4-card upcoming festivals */}
        <FestivalSection />

        {/* 9. Newsletter Signup */}
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}

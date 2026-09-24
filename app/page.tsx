import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { LatestArticles } from "@/components/home/LatestArticles";
import { CuratedAffiliateSection } from "@/components/home/CuratedAffiliateSection";
import { FestivalSection } from "@/components/home/FestivalSection";
import { SocialSection } from "@/components/home/SocialSection";
import { getPublishedArticles } from "@/lib/data/supabase/articles";
import { getCuratedAffiliateProducts } from "@/lib/data/supabase/affiliate";
import { siteConfig } from "@/lib/config/site";

export default async function Home() {
  // Fetch live articles & curated shop products from Supabase (server component)
  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  let products: Awaited<ReturnType<typeof getCuratedAffiliateProducts>> = [];
  try {
    const [fetchedArticles, fetchedProducts] = await Promise.all([
      getPublishedArticles(),
      getCuratedAffiliateProducts(3),
    ]);
    articles = fetchedArticles;
    products = fetchedProducts;
  } catch (err) {
    console.error("[homepage] Failed to fetch data from Supabase:", err);
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url || "https://bhaktimania.com",
    description: siteConfig.tagline,
    inLanguage: "hi",
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FFFFFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* 1. Fixed editorial header */}
      <Header />

      {/* 2. Hero — full-width triptych */}
      <main className="flex-1">
        <Hero />

        {/* 3. Articles section — anchor target: #articles */}
        <LatestArticles articles={articles} />

        {/* 4. Shop section — anchor target: #shop */}
        <CuratedAffiliateSection products={products} />

        {/* 5. Calendar / Festivals section — anchor target: #calendar */}
        <FestivalSection />

        {/* 6. Facebook & YouTube Social Section — anchor target: #social */}
        <SocialSection />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}

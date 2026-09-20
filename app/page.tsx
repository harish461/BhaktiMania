import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { DailyBhaktiThought } from "@/components/home/DailyBhaktiThought";
import { LatestArticles } from "@/components/home/LatestArticles";
import { DevotionalCategories } from "@/components/home/DevotionalCategories";
import { getPublishedArticles, getCategories } from "@/lib/data/supabase";
import { siteConfig } from "@/lib/config/site";

export default async function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <DailyBhaktiThought />
        <LatestArticles articles={articles} />
        <DevotionalCategories categories={categories} />
      </main>
      <Footer />
    </div>
  );
}

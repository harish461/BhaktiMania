import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPublishedArticles } from "@/lib/data/supabase";
import { BhaktiGyaanListing } from "@/components/content/BhaktiGyaanListing";
import { getCanonicalUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "भक्ति ज्ञान — लेख, विचार एवं सनातन परंपराएं",
  description:
    "भक्ति, आध्यात्मिक जीवन, सनातन परंपराओं और जीवन को बेहतर समझने से जुड़े उपयोगी लेख पढ़ें।",
  alternates: {
    canonical: getCanonicalUrl("/bhakti-gyaan"),
  },
  openGraph: {
    title: "भक्ति ज्ञान — लेख, विचार एवं सनातन परंपराएं | BhaktiMania",
    description:
      "भक्ति, आध्यात्मिक जीवन, सनातन परंपराओं और जीवन को बेहतर समझने से जुड़े उपयोगी लेख पढ़ें।",
  },
};

export default async function BhaktiGyaanPage() {
  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];

  try {
    articles = await getPublishedArticles();
  } catch (err: unknown) {
    console.error("[bhakti-gyaan] Error loading published articles:", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="flex-1 py-10 sm:py-14 md:py-16">
        <div className="container-desktop">
          {/* Page Header */}
          <header className="max-w-3xl mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                भक्ति • ज्ञान • शांति
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight mb-4">
              भक्ति ज्ञान
            </h1>

            <p className="text-[#5A6065] text-base sm:text-lg leading-relaxed font-body">
              भक्ति, आध्यात्मिक जीवन, सनातन परंपराओं और जीवन को बेहतर समझने से
              जुड़े उपयोगी लेख पढ़ें।
            </p>
          </header>

          {/* Interactive Listing & Filters */}
          <BhaktiGyaanListing initialArticles={articles} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

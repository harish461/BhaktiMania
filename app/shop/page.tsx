import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { ShopCatalogClient } from "@/components/affiliate/ShopCatalogClient";
import { getAllActiveAffiliateProducts } from "@/lib/data/supabase";
import { getCanonicalUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "भक्ति संग्रह | BhaktiMania",
  description:
    "भक्ति, साधना और आध्यात्मिक अध्ययन के लिए चुनी गई उपयोगी धार्मिक पुस्तकें, जप माला और अन्य सामग्री।",
  alternates: {
    canonical: getCanonicalUrl("/shop"),
  },
  openGraph: {
    title: "भक्ति संग्रह | BhaktiMania",
    description:
      "भक्ति, साधना और आध्यात्मिक अध्ययन के लिए चुनी गई उपयोगी धार्मिक पुस्तकें, जप माला और अन्य सामग्री।",
  },
};

export default async function ShopPage() {
  const products = await getAllActiveAffiliateProducts();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="flex-1 py-10 sm:py-14 md:py-16">
        <div className="container-desktop">
          {/* 1. Page Hero / Introduction */}
          <header className="max-w-3xl mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-3.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#C85A17]"
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                भक्ति संग्रह • अनुशंसित सामग्री
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#6B1724] tracking-tight leading-tight mb-3">
              भक्ति संग्रह
            </h1>

            <p className="text-[#5A6065] text-base sm:text-lg leading-relaxed font-body">
              भक्ति, साधना और आध्यात्मिक अध्ययन के लिए चुनी गई उपयोगी वस्तुएँ।
            </p>
          </header>

          {/* 2. Affiliate Disclosure Notice */}
          <AffiliateDisclosure className="mb-6 sm:mb-8 max-w-4xl" />

          {/* 3. Category Filter & Product Grid (with Empty State) */}
          <ShopCatalogClient products={products} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

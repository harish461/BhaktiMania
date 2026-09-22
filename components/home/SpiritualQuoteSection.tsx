import React from "react";
import Image from "next/image";
import Link from "next/link";

export function SpiritualQuoteSection() {
  return (
    <section
      aria-labelledby="spiritual-quote-heading"
      className="relative w-full overflow-hidden bg-[#1C1C17]"
      style={{ minHeight: "520px" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920&q=85&auto=format&fit=crop"
          alt="आध्यात्मिक वातावरण — दीपक की रोशनी में शांति"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Warm dark overlay — deep brown-saffron, not green */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,10,5,0.88) 0%, rgba(35,15,5,0.80) 50%, rgba(20,10,5,0.85) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 container-desktop flex flex-col items-center justify-center text-center py-20 lg:py-28"
        style={{ minHeight: "520px" }}
      >
        {/* Ornamental top */}
        <div className="flex items-center gap-4 mb-8" aria-hidden="true">
          <div className="w-16 h-px bg-[rgba(200,154,60,0.4)]" />
          <span className="font-serif text-xl text-[#C89A3C] select-none">ॐ</span>
          <div className="w-16 h-px bg-[rgba(200,154,60,0.4)]" />
        </div>

        {/* Main quote */}
        <blockquote className="max-w-2xl mx-auto mb-6">
          <p
            id="spiritual-quote-heading"
            className="font-serif text-[#FBF8F0] leading-relaxed"
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            &ldquo;हर दिन थोड़ा ठहरिए,
            <br />
            <span className="text-[#D8B45A]">अपने भीतर के ईश्वर से मिलिए।&rdquo;</span>
          </p>
        </blockquote>

        {/* Ornamental divider */}
        <div
          className="flex items-center justify-center gap-3 my-6 opacity-50"
          aria-hidden="true"
        >
          <span className="text-[#C89A3C] text-xs">◆</span>
          <span className="text-[#C89A3C] text-[8px]">◆</span>
          <span className="text-[#C89A3C] text-xs">◆</span>
        </div>

        {/* Supporting text */}
        <p className="font-serif text-[#EDE2CF]/70 mb-10 max-w-lg mx-auto leading-relaxed" style={{ fontSize: "1rem" }}>
          छोटी-सी भक्ति, शांत-सा मन और जीवन को देखने की एक नई दृष्टि।
        </p>

        {/* CTA */}
        <Link
          href="/bhakti-gyaan"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 font-ui text-[13px] font-semibold tracking-wide bg-[#C85A17] text-[#FBF8F0] border border-[rgba(200,154,60,0.4)] rounded hover:bg-[#A8440B] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
        >
          Begin Your Journey
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden bg-[#1C1C17]"
      style={{ minHeight: "680px" }}
    >
      {/* ── Cinematic Background Image ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-temple.jpg"
          alt="Vrindavan-style sacred temple at golden hour — devotional atmosphere with diya and marigolds"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Warm dark overlay — not green, not flat */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(28,20,12,0.82) 0%, rgba(40,18,10,0.70) 45%, rgba(28,20,12,0.60) 100%)",
          }}
          aria-hidden="true"
        />
        {/* Bottom fade for smooth section transition */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background:
              "linear-gradient(to top, rgba(251,248,240,0.12) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 container-desktop flex flex-col justify-center py-20 lg:py-28" style={{ minHeight: "680px" }}>
        <div className="max-w-2xl">

          {/* Eyebrow / Category Label */}
          <div className="inline-flex items-center gap-2.5 mb-7">
            {/* Thin gold hairline left */}
            <span className="w-8 h-px bg-[#C89A3C]/60" aria-hidden="true" />
            <span className="font-ui text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C89A3C]">
              BhaktiMania&nbsp;•&nbsp;A Journey Within
            </span>
          </div>

          {/* Main H1 — Hindi, Noto Serif Devanagari */}
          <h1
            id="hero-heading"
            className="font-serif text-[#FBF8F0] mb-6 leading-[1.22]"
            style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)", fontWeight: 600 }}
          >
            जहाँ भक्ति केवल भावना नहीं,
            <br />
            <span className="text-[#D8B45A]">जीवन जीने का मार्ग है</span>
          </h1>

          {/* Supporting copy — English, elegant */}
          <p className="font-serif text-[#EDE2CF]/80 mb-10 leading-relaxed" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}>
            Discover timeless wisdom, devotion, stories and spiritual inspiration
            for everyday life.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-3.5">
            <Link
              href="/bhakti-gyaan"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 font-ui text-[13px] font-semibold tracking-wide bg-[#C85A17] text-[#FBF8F0] border border-[rgba(200,154,60,0.4)] rounded hover:bg-[#A8440B] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
            >
              Explore Bhakti Gyaan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#daily-thought"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 font-ui text-[13px] font-semibold tracking-wide bg-transparent text-[#FBF8F0] border border-[rgba(200,154,60,0.5)] rounded hover:bg-[rgba(200,154,60,0.08)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
            >
              Today&apos;s Bhakti Vichar
            </Link>
          </div>
        </div>

        {/* Bottom-right editorial caption */}
        <div className="absolute bottom-8 right-0 container-desktop flex justify-end pointer-events-none" aria-hidden="true">
          <div className="text-right">
            <div className="font-ui text-[10px] tracking-[0.15em] uppercase text-[#C89A3C]/60 mb-0.5">
              Sacred Editorial
            </div>
            <div className="font-serif text-sm text-[#EDE2CF]/40 italic">
              भक्ति • ज्ञान • शांति
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

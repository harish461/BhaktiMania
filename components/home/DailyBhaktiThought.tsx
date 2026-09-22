import React from "react";
import Link from "next/link";

export function DailyBhaktiThought() {
  return (
    <section
      id="daily-thought"
      aria-labelledby="daily-thought-heading"
      className="py-20 lg:py-28 bg-[#FBF8F0] relative overflow-hidden"
    >
      {/* Subtle warm background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(200,154,60,0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container-desktop">
        <div className="max-w-3xl mx-auto text-center">

          {/* Section kicker */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-px bg-[#C89A3C]/50" aria-hidden="true" />
            <span
              id="daily-thought-heading"
              className="label-ui text-[#C85A17]"
            >
              आज का भक्ति विचार
            </span>
            <div className="w-10 h-px bg-[#C89A3C]/50" aria-hidden="true" />
          </div>

          {/* Main devotional quote */}
          <blockquote className="mb-8">
            <p
              className="font-serif text-[#1C1C17] leading-relaxed"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.125rem)",
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              &ldquo;मन शांत हो तो हर परिस्थिति में
              <br className="hidden sm:block" />
              ईश्वर की कृपा दिखाई देने लगती है।&rdquo;
            </p>
          </blockquote>

          {/* Ornamental divider — gold hairline with OM */}
          <div className="flex items-center justify-center gap-4 my-8 max-w-sm mx-auto" aria-hidden="true">
            <div className="flex-1 h-px bg-[rgba(200,154,60,0.35)]" />
            <span className="font-serif text-lg text-[#C89A3C] select-none">ॐ</span>
            <div className="flex-1 h-px bg-[rgba(200,154,60,0.35)]" />
          </div>

          {/* Attribution */}
          <p className="font-ui text-sm text-[#6B706A] tracking-wide mb-8">
            — BhaktiMania
          </p>

          {/* Supporting thought */}
          <p className="font-serif text-[#6B706A] leading-relaxed max-w-lg mx-auto mb-10" style={{ fontSize: "1rem" }}>
            भक्ति केवल पूजा का समय नहीं है। अपने दिन के हर कार्य में
            ईश्वर का स्मरण रखना भी भक्ति का एक सुंदर रूप है।
          </p>

          {/* Action link */}
          <Link
            href="/bhakti-vichar"
            className="inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] focus-visible:ring-offset-2 rounded"
          >
            <span>और भक्ति विचार पढ़ें</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

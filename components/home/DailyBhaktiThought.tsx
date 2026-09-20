import React from "react";
import Link from "next/link";

export function DailyBhaktiThought() {
  return (
    <section
      id="daily-thought"
      aria-labelledby="daily-thought-heading"
      className="py-12 sm:py-16 md:py-20 bg-[#F8F4EC] border-y border-[#6B1724]/8 relative overflow-hidden"
    >
      {/* Subtle Background Accent Motifs */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        aria-hidden="true"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#D97706]/10 blur-3xl" />
      </div>

      <div className="container-desktop">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#6B1724]/10 shadow-[0_4px_24px_rgba(107,23,36,0.04)] text-center">
          {/* Label / Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4EC] border border-[#6B1724]/10 mb-6">
            <span className="text-[#D97706] text-xs select-none" aria-hidden="true">
              ✦
            </span>
            <span
              id="daily-thought-heading"
              className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body"
            >
              आज का भक्ति विचार
            </span>
          </div>

          {/* Main Devotional Thought */}
          <blockquote className="my-2">
            <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#6B1724] leading-relaxed md:leading-snug tracking-tight">
              &ldquo;जब मन अशांत हो, तो कुछ क्षण संसार से नहीं, अपने आराध्य से
              बात कीजिए।&rdquo;
            </p>
          </blockquote>

          {/* Ornamental Divider */}
          <div
            className="flex items-center justify-center my-6 sm:my-8 max-w-xs mx-auto"
            aria-hidden="true"
          >
            <div className="grow border-t border-[#6B1724]/15" />
            <span className="px-4 text-[#C27803] text-base font-heading select-none">
              ॐ
            </span>
            <div className="grow border-t border-[#6B1724]/15" />
          </div>

          {/* Supporting Text */}
          <p className="text-[#5A6065] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8 font-body">
            भक्ति केवल पूजा का समय नहीं है। अपने दिन के हर कार्य में ईश्वर का
            स्मरण रखना भी भक्ति का एक सुंदर रूप है।
          </p>

          {/* Action Link */}
          <div className="pt-2">
            <Link
              href="/bhakti-vichar"
              className="inline-flex items-center gap-1.5 text-sm sm:text-base font-medium text-[#6B1724] hover:text-[#52111C] transition-colors duration-150 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2 rounded-sm"
            >
              <span>और भक्ति विचार पढ़ें</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

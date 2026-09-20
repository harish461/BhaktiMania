import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#FDFBF7] py-12 sm:py-16 md:py-20 lg:py-24"
    >
      {/* Subtle Background Ambience */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#F8F4EC] blur-3xl" />
        <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#F8F4EC] blur-3xl" />
      </div>

      <div className="container-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Editorial Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow / Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B1724]/8 border border-[#6B1724]/12 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#6B1724] uppercase font-body">
                भक्ति • ज्ञान • शांति
              </span>
            </div>

            {/* Main H1 Heading */}
            <h1
              id="hero-heading"
              className="font-heading text-display text-[#6B1724] tracking-tight font-normal mb-5 leading-[1.18]"
            >
              भक्ति को जीवन का{" "}
              <span className="relative inline-block">
                हिस्सा बनाइए
                <span
                  className="absolute bottom-1 left-0 w-full h-[3px] bg-[#D97706]/40 rounded-full"
                  aria-hidden="true"
                />
              </span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-body-large text-[#5A6065] max-w-xl mb-8 leading-[1.8] font-body">
              भक्ति, आध्यात्मिक ज्ञान और जीवन से जुड़े सरल विचारों के माध्यम से
              अपने मन को शांति और सकारात्मकता की ओर ले जाएँ।
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link href="#daily-thought" className="inline-block">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  आज का भक्ति विचार
                </Button>
              </Link>
              <Link href="#bhakti-gyaan" className="inline-block">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  भक्ति ज्ञान पढ़ें
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual / Devotional Thought Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-3xl bg-white p-6 sm:p-8 border border-[#6B1724]/12 shadow-[0_4px_24px_rgba(107,23,36,0.06)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(107,23,36,0.09)]">
              {/* Header of Visual Card */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#6B1724]/8">
                <div className="flex items-center gap-2">
                  <span className="text-[#D97706] text-sm select-none" aria-hidden="true">
                    ✦
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B1724] font-body">
                    दैनिक विचार
                  </span>
                </div>
                <span className="text-xs text-[#5A6065] font-body">
                  प्रेमानंद जी महाराज
                </span>
              </div>

              {/* Devotional Quote */}
              <blockquote className="my-3">
                <p className="font-heading text-xl sm:text-2xl text-[#1F2326] leading-relaxed italic">
                  &ldquo;जीवन में जो कुछ भी मिला है, उसे प्रभु का प्रसाद समझकर
                  स्वीकार करें; चित्त अपने आप शांत हो जाएगा।&rdquo;
                </p>
              </blockquote>

              {/* Ornamental Divider */}
              <div className="flex items-center justify-center my-5" aria-hidden="true">
                <div className="grow border-t border-[#6B1724]/10" />
                <span className="px-3 text-[#C27803] text-xs select-none">
                  ॐ
                </span>
                <div className="grow border-t border-[#6B1724]/10" />
              </div>

              {/* Artwork / Devotional Sanctuary Frame */}
              <div className="relative rounded-2xl bg-[#F8F4EC] border border-[#6B1724]/10 p-5 text-center overflow-hidden">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="h-10 w-10 rounded-full bg-[#6B1724]/10 flex items-center justify-center mb-2.5 text-[#6B1724]">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-heading text-base text-[#6B1724]">
                    राधे राधे
                  </span>
                  <p className="text-xs text-[#5A6065] mt-1 font-body">
                    वृंदावन धाम दर्शन एवं सत्संग
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

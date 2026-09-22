"use client";

import React, { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="py-20 lg:py-28 bg-[#FBF8F0]"
    >
      <div className="container-desktop">
        <div className="max-w-2xl mx-auto">

          {/* Inner card — White/Cream Sand with gold border */}
          <div className="bg-white rounded-[8px] border border-[rgba(200,154,60,0.4)] shadow-[0_4px_32px_-6px_rgba(40,25,15,0.08)] px-8 py-12 lg:px-14 lg:py-14 text-center relative overflow-hidden">

            {/* Background warm glow */}
            <div
              className="pointer-events-none absolute inset-0 -z-0"
              aria-hidden="true"
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full opacity-20"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(200,154,60,0.15) 0%, transparent 70%)",
                }}
              />
            </div>

            <div className="relative z-10">
              {/* Ornament */}
              <div className="flex items-center justify-center gap-3 mb-7" aria-hidden="true">
                <div className="w-10 h-px bg-[rgba(200,154,60,0.5)]" />
                <span className="font-serif text-base text-[#C89A3C] select-none">✦</span>
                <div className="w-10 h-px bg-[rgba(200,154,60,0.5)]" />
              </div>

              {/* Label */}
              <div className="mb-4">
                <span className="label-ui text-[#C85A17]">Newsletter</span>
              </div>

              {!submitted ? (
                <>
                  {/* Heading */}
                  <h2
                    id="newsletter-heading"
                    className="font-serif text-[#1C1C17] mb-4 leading-snug"
                    style={{
                      fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                      fontWeight: 600,
                    }}
                  >
                    भक्ति को अपने हर दिन का हिस्सा बनाइए
                  </h2>

                  {/* Description */}
                  <p className="font-serif text-[#6B706A] mb-8 leading-relaxed max-w-md mx-auto" style={{ fontSize: "0.9375rem" }}>
                    हर सप्ताह आध्यात्मिक विचार, भक्ति कथाएँ, मंत्र और प्रेरणादायक
                    लेख अपने इनबॉक्स में पाएं।
                  </p>

                  {/* Gold hairline */}
                  <div className="gold-hairline mb-8 max-w-xs mx-auto" aria-hidden="true" />

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                    noValidate
                  >
                    <label htmlFor="newsletter-email" className="sr-only">
                      आपका ईमेल पता
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="आपका ईमेल"
                      required
                      className="flex-1 h-11 px-4 rounded border border-[rgba(107,112,106,0.25)] bg-[#FBF8F0] font-ui text-sm text-[#1C1C17] placeholder-[#8B7267] focus:outline-none focus:border-[#C89A3C] focus:ring-1 focus:ring-[rgba(200,154,60,0.3)] transition-colors"
                    />
                    <button
                      type="submit"
                      className="h-11 px-6 rounded bg-[#C85A17] text-[#FBF8F0] font-ui text-sm font-semibold tracking-wide border border-[rgba(200,154,60,0.4)] hover:bg-[#A8440B] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C] cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      Subscribe
                    </button>
                  </form>

                  <p className="font-ui text-[11px] text-[#8B7267] mt-4 tracking-wide">
                    कोई स्पैम नहीं। कभी भी अनसब्सक्राइब करें।
                  </p>
                </>
              ) : (
                /* Success state */
                <div className="py-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#C85A17]/10 border border-[rgba(200,90,23,0.25)] mx-auto mb-5">
                    <svg className="w-6 h-6 text-[#C85A17]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 id="newsletter-heading" className="font-serif text-[#1C1C17] mb-3" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    धन्यवाद! 🙏
                  </h2>
                  <p className="font-serif text-[#6B706A]" style={{ fontSize: "0.9375rem" }}>
                    आपका सब्सक्रिप्शन सफलतापूर्वक हो गया है।
                    <br />
                    भक्ति विचार शीघ्र आपके इनबॉक्स में आएंगे।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

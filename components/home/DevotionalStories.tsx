import React from "react";
import Image from "next/image";
import Link from "next/link";

interface DevotionalStory {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  tag: string;
}

const stories: DevotionalStory[] = [
  {
    title: "ध्रुव की अटूट भक्ति",
    subtitle: "पांच वर्षीय बालक की अखंड साधना",
    description:
      "एक छोटे बालक ध्रुव की अद्भुत भक्ति कथा, जिन्होंने घोर तपस्या से भगवान विष्णु को प्रसन्न किया और ध्रुव तारे के रूप में अमर हो गए।",
    href: "/bhakti-kathayen",
    imageUrl:
      "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=600&q=85&auto=format&fit=crop",
    imageAlt: "तारों भरे आकाश में ध्रुव तारा — भक्ति और समर्पण का प्रतीक",
    tag: "पुराण कथा",
  },
  {
    title: "प्रह्लाद का विश्वास",
    subtitle: "भक्ति की परम परीक्षा",
    description:
      "हिरण्यकश्यप के पुत्र प्रह्लाद की अडिग भक्ति जिसने अग्नि, जल और अन्य सभी परीक्षाओं में भी ईश्वर के प्रति अपना विश्वास नहीं छोड़ा।",
    href: "/bhakti-kathayen",
    imageUrl:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=85&auto=format&fit=crop",
    imageAlt: "दीपक की लौ — प्रह्लाद की अखंड भक्ति का प्रतीक",
    tag: "पुराण कथा",
  },
  {
    title: "सुदामा और श्री कृष्ण",
    subtitle: "निर्मल मित्रता और करुणा",
    description:
      "एक निर्धन ब्राह्मण सुदामा और उनके मित्र श्री कृष्ण की अमर कथा — जो हमें बताती है कि सच्ची भक्ति और निस्वार्थ प्रेम में कभी भी अहंकार नहीं होता।",
    href: "/bhakti-kathayen",
    imageUrl:
      "https://images.unsplash.com/photo-1626015266924-f7ea2c69d14e?w=600&q=85&auto=format&fit=crop",
    imageAlt: "कमल के फूल — सुदामा-कृष्ण की पवित्र मित्रता का प्रतीक",
    tag: "भागवत कथा",
  },
];

export function DevotionalStories() {
  return (
    <section
      aria-labelledby="stories-heading"
      className="py-20 lg:py-28 bg-[#FBF8F0]"
    >
      <div className="container-desktop">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4 pb-5 border-b border-[rgba(200,154,60,0.18)]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="accent-dot" aria-hidden="true" />
              <span className="label-ui text-[#C85A17]">पुराण एवं भागवत</span>
            </div>
            <h2
              id="stories-heading"
              className="font-serif text-[#1C1C17] leading-tight"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.125rem)", fontWeight: 500 }}
            >
              भक्ति कथाएँ
            </h2>
          </div>
          <Link
            href="/bhakti-kathayen"
            className="hidden lg:inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded py-1"
          >
            <span>सभी कथाएँ देखें</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Subtitle */}
        <p className="font-serif text-[#6B706A] mb-10 max-w-xl" style={{ fontSize: "1rem" }}>
          पुराणों और भक्तों की कथाओं से जीवन के लिए प्रेरणा।
        </p>

        {/* Three story cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {stories.map((story) => (
            <Link
              key={story.title}
              href={story.href}
              className="group flex flex-col rounded-[6px] border border-[rgba(200,154,60,0.28)] overflow-hidden shadow-[0_2px_12px_-2px_rgba(40,25,15,0.05)] hover:shadow-[0_10px_30px_-4px_rgba(40,25,15,0.10)] hover:border-[rgba(200,154,60,0.5)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] focus-visible:ring-offset-2"
            >
              {/* Story cover image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                <Image
                  src={story.imageUrl}
                  alt={story.imageAlt}
                  fill
                  className="object-cover transition-transform duration-400 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient overlay for text contrast */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(28,20,12,0.55) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />
                {/* Tag chip */}
                <div className="absolute bottom-4 left-4">
                  <span className="font-ui text-[9px] font-semibold tracking-[0.12em] uppercase text-[#C89A3C] bg-[rgba(28,20,12,0.65)] backdrop-blur-sm px-2.5 py-1 rounded-[3px]">
                    {story.tag}
                  </span>
                </div>
              </div>

              {/* Story body */}
              <div className="bg-white p-5 lg:p-6 flex flex-col grow">
                {/* Thin gold top border detail */}
                <div
                  className="w-8 h-0.5 bg-[#C89A3C]/50 rounded-full mb-4"
                  aria-hidden="true"
                />

                <h3
                  className="font-serif text-[#1C1C17] group-hover:text-[#C85A17] transition-colors duration-200 leading-snug mb-1.5"
                  style={{ fontSize: "1.0625rem", fontWeight: 600 }}
                >
                  {story.title}
                </h3>
                <p className="font-ui text-[11px] font-semibold tracking-wide text-[#C89A3C] mb-3">
                  {story.subtitle}
                </p>
                <p className="font-serif text-sm text-[#6B706A] leading-relaxed line-clamp-3 grow">
                  {story.description}
                </p>

                {/* Read link */}
                <div className="mt-4 pt-4 border-t border-[rgba(107,112,106,0.1)] flex items-center justify-between">
                  <span className="font-ui text-xs font-semibold text-[#C85A17] group-hover:text-[#A8440B] transition-colors">
                    कथा पढ़ें
                  </span>
                  <span
                    className="text-[#C89A3C] group-hover:translate-x-0.5 transition-transform duration-200 text-xs"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

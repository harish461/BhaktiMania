import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Festival {
  day: string;
  month: string;
  name: string;
  description: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  colorDot: string;
}

const festivals: Festival[] = [
  {
    day: "03",
    month: "अक्टूबर",
    name: "नवरात्रि",
    description: "शक्ति की उपासना का नौ दिवसीय महापर्व — माँ दुर्गा की नव शक्तियों की आराधना।",
    href: "/festivals",
    imageUrl:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80&auto=format&fit=crop",
    imageAlt: "नवरात्रि — माँ दुर्गा की पूजा",
    colorDot: "#C85A17",
  },
  {
    day: "07",
    month: "अक्टूबर",
    name: "दुर्गा पूजा",
    description: "बंगाल और देशभर में धूमधाम से मनाया जाने वाला माँ दुर्गा का महापर्व।",
    href: "/festivals",
    imageUrl:
      "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400&q=80&auto=format&fit=crop",
    imageAlt: "दुर्गा पूजा का उत्सव",
    colorDot: "#C89A3C",
  },
  {
    day: "12",
    month: "अक्टूबर",
    name: "विजयादशमी",
    description: "अधर्म पर धर्म की विजय का पर्व — प्रभु श्री राम की रावण पर विजय।",
    href: "/festivals",
    imageUrl:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&q=80&auto=format&fit=crop",
    imageAlt: "दशहरा — रावण दहन",
    colorDot: "#8F2617",
  },
  {
    day: "01",
    month: "नवंबर",
    name: "दीपावली",
    description: "प्रकाश का महापर्व — अज्ञान के अंधकार को दूर करने का उत्सव।",
    href: "/festivals",
    imageUrl:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80&auto=format&fit=crop",
    imageAlt: "दीपावली — दीपकों की रोशनी",
    colorDot: "#C89A3C",
  },
];

export function FestivalSection() {
  return (
    <section
      aria-labelledby="festivals-heading"
      className="py-20 lg:py-28 bg-[#F5EFE2]"
    >
      <div className="container-desktop">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4 pb-5 border-b border-[rgba(200,154,60,0.2)]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="accent-dot" aria-hidden="true" />
              <span className="label-ui text-[#C85A17]">आगामी पर्व</span>
            </div>
            <h2
              id="festivals-heading"
              className="font-serif text-[#1C1C17] leading-tight"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.125rem)", fontWeight: 500 }}
            >
              पर्व और विशेष दिन
            </h2>
          </div>
          <Link
            href="/festivals"
            className="hidden lg:inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded py-1"
          >
            <span>सभी त्योहार</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 4-card row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5">
          {festivals.map((festival) => (
            <Link
              key={festival.name}
              href={festival.href}
              className="group bg-white rounded-[6px] border border-[rgba(107,112,106,0.18)] overflow-hidden shadow-[0_2px_10px_-2px_rgba(40,25,15,0.05)] hover:shadow-[0_8px_24px_-4px_rgba(40,25,15,0.09)] hover:border-[rgba(200,154,60,0.35)] transition-all duration-200 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] focus-visible:ring-offset-2"
            >
              {/* Festival image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={festival.imageUrl}
                  alt={festival.imageAlt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(28,20,12,0.45) 0%, transparent 65%)",
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Festival body */}
              <div className="p-4 lg:p-5 flex flex-col grow">
                {/* Date + indicator */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-1.5 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: festival.colorDot }}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-ui text-[11px] font-semibold tracking-wide text-[#C85A17]">
                      {festival.day}
                    </span>
                    <span className="font-ui text-[11px] text-[#8B7267] ml-1 tracking-wide">
                      {festival.month}
                    </span>
                  </div>
                </div>

                {/* Festival name */}
                <h3
                  className="font-serif text-[#1C1C17] group-hover:text-[#C85A17] transition-colors duration-200 mb-2 leading-snug"
                  style={{ fontSize: "1rem", fontWeight: 600 }}
                >
                  {festival.name}
                </h3>

                {/* Description */}
                <p className="font-serif text-xs text-[#6B706A] leading-relaxed line-clamp-2 grow mb-3">
                  {festival.description}
                </p>

                {/* Read more */}
                <span className="font-ui text-[11px] font-semibold text-[#C85A17] group-hover:text-[#A8440B] transition-colors">
                  और पढ़ें →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

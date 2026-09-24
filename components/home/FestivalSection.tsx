import React from "react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */

interface Festival {
  id: string;
  category: string;
  categoryColor: string;
  name: string;
  description: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  day: string;          // e.g. "03"
  monthShort: string;   // e.g. "OCT"
  monthHindi: string;   // e.g. "अक्टूबर"
  formattedDate: string;// e.g. "3 October 2024"
  tithi: string;        // e.g. "आश्विन शुक्ल प्रतिपदा"
}

/* ─────────────────────────────────────────────────────────────────
   Festival data with dedicated images matching each heading
───────────────────────────────────────────────────────────────── */

const festivals: Festival[] = [
  {
    id: "navratri",
    category: "Major Festival",
    categoryColor: "#C85A17",
    name: "नवरात्रि",
    description:
      "शक्ति की उपासना का नौ दिवसीय महापर्व — माँ दुर्गा की नव शक्तियों की आराधना, अखंड ज्योति, व्रत और कीर्तन का विशेष महत्व।",
    href: "/festivals",
    imageUrl: "/images/festivals/navratri.jpg",
    imageAlt: "नवरात्रि — माँ दुर्गा पूजन एवं अखंड ज्योति",
    day: "03",
    monthShort: "OCT",
    monthHindi: "अक्टूबर",
    formattedDate: "3 October 2024",
    tithi: "आश्विन शुक्ल प्रतिपदा",
  },
  {
    id: "durga-puja",
    category: "Major Festival",
    categoryColor: "#C89A3C",
    name: "दुर्गा पूजा",
    description:
      "माँ दुर्गा का भव्य उत्सव और महिषासुरमर्दिनी स्वरूप की वंदना। भक्ति, भाव और सनातन संस्कृति का अद्भुत संगम।",
    href: "/festivals",
    imageUrl: "/images/festivals/durga-puja.jpg",
    imageAlt: "दुर्गा पूजा — माँ दुर्गा की भव्य प्रतिमा",
    day: "07",
    monthShort: "OCT",
    monthHindi: "अक्टूबर",
    formattedDate: "7 October 2024",
    tithi: "महा षष्ठी पूजन",
  },
  {
    id: "vijayadashami",
    category: "Major Festival",
    categoryColor: "#8F2617",
    name: "विजयादशमी",
    description:
      "अधर्म पर धर्म की विजय का महापर्व — प्रभु श्री राम की रावण पर विजय। असत्य पर सत्य और न्याय की विजय का प्रतीक।",
    href: "/festivals",
    imageUrl: "/images/festivals/vijayadashami.jpg",
    imageAlt: "विजयादशमी — प्रभु श्री राम और धर्म की विजय",
    day: "12",
    monthShort: "OCT",
    monthHindi: "अक्टूबर",
    formattedDate: "12 October 2024",
    tithi: "आश्विन शुक्ल दशमी",
  },
  {
    id: "deepawali",
    category: "Major Festival",
    categoryColor: "#C89A3C",
    name: "दीपावली",
    description:
      "प्रकाश और आनंद का महापर्व — अज्ञान के अंधकार को दूर करने और माँ महालक्ष्मी के आशीर्वाद प्राप्त करने का पावन दिन।",
    href: "/festivals",
    imageUrl: "/images/festivals/deepawali.jpg",
    imageAlt: "दीपावली — दीपकों की जगमगाहट और लक्ष्मी पूजन",
    day: "01",
    monthShort: "NOV",
    monthHindi: "नवंबर",
    formattedDate: "1 November 2024",
    tithi: "कार्तिक कृष्ण अमावस्या",
  },
  {
    id: "kartik-purnima",
    category: "Vrat & Tithi",
    categoryColor: "#C85A17",
    name: "कार्तिक पूर्णिमा (देव दीपावली)",
    description:
      "देवताओं की दीपावली — काशी के घाटों पर लाखों दीपकों का दान और गंगा स्नान का अनंत पुण्य फल प्राप्त करने का दिन।",
    href: "/festivals",
    imageUrl: "/images/festivals/kartik-purnima.jpg",
    imageAlt: "कार्तिक पूर्णिमा — देव दीपावली एवं गंगा स्नान",
    day: "15",
    monthShort: "NOV",
    monthHindi: "नवंबर",
    formattedDate: "15 November 2024",
    tithi: "कार्तिक शुक्ल पूर्णिमा",
  },
  {
    id: "ekadashi",
    category: "Vrat & Tithi",
    categoryColor: "#6B706A",
    name: "एकादशी व्रत",
    description:
      "श्री हरि विष्णु को समर्पित परम कल्याणकारी व्रत — आंतरिक आत्म-शुद्धि, मन के संयम और ईश्वर के प्रति शरणागति का अवसर।",
    href: "/festivals",
    imageUrl: "/images/festivals/ekadashi.jpg",
    imageAlt: "एकादशी व्रत — पवित्र पूजा एवं श्री हरि आराधना",
    day: "12",
    monthShort: "NOV",
    monthHindi: "नवंबर",
    formattedDate: "12 November 2024",
    tithi: "प्रबोधिनी एकादशी",
  },
];

/* ─────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────── */

export function FestivalSection() {
  return (
    <section
      id="calendar"
      aria-labelledby="festivals-heading"
      className="pt-4 pb-12 lg:pt-6 lg:pb-16 bg-white [scroll-margin-top:80px]"
      style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex items-start justify-between mb-6 pb-3 border-b border-gray-200">
          <div>
            <h2
              id="festivals-heading"
              className="text-[22px] font-bold text-[#1C1C17] leading-tight"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 700 }}
            >
              Bhakti Calendar
            </h2>
            <p
              className="text-[13px] text-[#6B706A] mt-1"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              Upcoming festivals, vrats and auspicious tithi dates
            </p>
          </div>
          <Link
            href="/festivals"
            className="text-[13px] font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors whitespace-nowrap mt-1 flex items-center gap-1"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            View All →
          </Link>
        </div>

        {/* ── 3-column Festival Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-8">
          {festivals.map((festival) => (
            <article key={festival.id} className="group flex flex-col">

              {/* Image with Prominent Calendar Date Badge */}
              <Link
                href={festival.href}
                className="relative block overflow-hidden rounded-[4px] mb-3.5"
                style={{ aspectRatio: "16/10" }}
                tabIndex={-1}
                aria-hidden="true"
              >
                <Image
                  src={festival.imageUrl}
                  alt={festival.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                />

                {/* Calendar Date Badge Overlay */}
                <div className="absolute top-3 left-3 z-10 overflow-hidden rounded-[5px] shadow-[0_2px_8px_rgba(0,0,0,0.18)] border border-amber-200/80 bg-white text-center">
                  <div className="bg-[#C85A17] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 leading-tight">
                    {festival.monthShort}
                  </div>
                  <div className="px-2.5 py-1 bg-white">
                    <span className="block text-[19px] font-extrabold text-[#1C1C17] leading-none">
                      {festival.day}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Card body */}
              <div className="flex flex-col flex-1">

                {/* Category label */}
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className="text-[11px] font-semibold tracking-[0.06em] uppercase"
                    style={{
                      fontFamily: "var(--font-poppins), Poppins, sans-serif",
                      color: festival.categoryColor,
                    }}
                  >
                    {festival.category}
                  </span>
                  <span className="text-[11px] text-[#8B7267] font-medium">
                    {festival.monthHindi} {festival.day}
                  </span>
                </div>

                {/* Festival name */}
                <h3 className="mb-1.5">
                  <Link
                    href={festival.href}
                    className="text-[16px] font-bold text-[#1C1C17] leading-snug hover:text-[#C85A17] transition-colors line-clamp-2"
                    style={{
                      fontFamily: "var(--font-poppins), Poppins, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {festival.name}
                  </Link>
                </h3>

                {/* Visible Date & Tithi row — ensures date is unmistakably prominent */}
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#C85A17] mb-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{festival.formattedDate}</span>
                  <span className="text-gray-300 font-normal">·</span>
                  <span className="text-[11.5px] text-[#6B706A] font-normal truncate">
                    {festival.tithi}
                  </span>
                </div>

                {/* Description */}
                <p
                  className="text-[13px] text-[#6B706A] leading-relaxed line-clamp-2 mb-3 flex-1"
                  style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
                >
                  {festival.description}
                </p>

                {/* Clean Bottom row — No social icons, clear action link */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-[12px]">
                  <span className="text-[#8B7267] font-medium text-[11.5px]">
                    शुभ मुहूर्त एवं व्रत कथा
                  </span>
                  <Link
                    href={festival.href}
                    className="font-semibold text-[#C85A17] hover:text-[#A8440B] transition-colors flex items-center gap-1"
                  >
                    विवरण देखें →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile view-all */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            href="/festivals"
            className="inline-flex items-center justify-center px-7 py-2.5 border border-[#C85A17] text-[13px] font-semibold text-[#C85A17] hover:bg-[#FFF5EF] transition-colors rounded"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            View All Festivals →
          </Link>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";

const brandLinks = [
  { label: "हमारे बारे में", href: "/about" },
  { label: "भक्ति ज्ञान", href: "/bhakti-gyaan" },
  { label: "भक्ति विचार", href: "/bhakti-vichar" },
  { label: "भक्ति कथाएँ", href: "/bhakti-kathayen" },
];

const exploreLinks = [
  { label: "श्री कृष्ण", href: "/radha-krishna" },
  { label: "भगवान शिव", href: "/shiv" },
  { label: "हनुमान जी", href: "/hanuman" },
  { label: "राधा-कृष्ण", href: "/radha-krishna" },
  { label: "मंत्र एवं स्तोत्र", href: "/mantra-stotra" },
];

const infoLinks = [
  { label: "संपर्क करें", href: "/contact" },
  { label: "गोपनीयता नीति", href: "/privacy-policy" },
  { label: "नियम और शर्तें", href: "/terms" },
  { label: "अस्वीकरण", href: "/disclaimer" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1C17] text-[#EDE2CF] mt-auto" aria-label="साइट फ़ुटर">

      {/* Gold hairline separator */}
      <div className="gold-hairline" aria-hidden="true" />

      <div className="container-desktop pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Column — 4 cols */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="inline-flex flex-col group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
              aria-label="BhaktiMania होम"
            >
              <span className="font-heading text-[26px] text-[#C89A3C] tracking-tight leading-none group-hover:text-[#D8B45A] transition-colors duration-200">
                BhaktiMania
              </span>
              <span className="font-ui text-[10px] text-[#6B706A] tracking-[0.12em] uppercase mt-1.5 leading-none">
                भक्ति • ज्ञान • शांति
              </span>
            </Link>

            <p className="font-serif text-sm text-[#8B7267] leading-relaxed max-w-xs">
              BhaktiMania — सनातन धर्म, भक्ति परंपराओं और आध्यात्मिक चिंतन
              को समर्पित एक प्रामाणिक डिजिटल मंच।
            </p>

            {/* Sacred Sanskrit */}
            <div className="text-sm text-[#C89A3C] font-serif tracking-wide">
              ॐ शांतिः शांतिः शांतिः
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a
                href="https://instagram.com/bhaktimania"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram पर BhaktiMania को फ़ॉलो करें"
                className="flex items-center justify-center w-9 h-9 rounded border border-[rgba(200,154,60,0.2)] text-[#8B7267] hover:text-[#C89A3C] hover:border-[rgba(200,154,60,0.5)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com/bhaktimania"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook पर BhaktiMania को फ़ॉलो करें"
                className="flex items-center justify-center w-9 h-9 rounded border border-[rgba(200,154,60,0.2)] text-[#8B7267] hover:text-[#C89A3C] hover:border-[rgba(200,154,60,0.5)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com/@bhaktimania"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube पर BhaktiMania को सब्सक्राइब करें"
                className="flex items-center justify-center w-9 h-9 rounded border border-[rgba(200,154,60,0.2)] text-[#8B7267] hover:text-[#C89A3C] hover:border-[rgba(200,154,60,0.5)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* BhaktiMania Column — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-ui text-[11px] font-semibold tracking-[0.1em] uppercase text-[#C89A3C] pb-2 border-b border-[rgba(200,154,60,0.15)]">
              BhaktiMania
            </h3>
            <ul className="space-y-2.5">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-serif text-sm text-[#8B7267] hover:text-[#C89A3C] transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Column — 3 cols */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-ui text-[11px] font-semibold tracking-[0.1em] uppercase text-[#C89A3C] pb-2 border-b border-[rgba(200,154,60,0.15)]">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="font-serif text-sm text-[#8B7267] hover:text-[#C89A3C] transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Column — 3 cols */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-ui text-[11px] font-semibold tracking-[0.1em] uppercase text-[#C89A3C] pb-2 border-b border-[rgba(200,154,60,0.15)]">
              Important
            </h3>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-serif text-sm text-[#8B7267] hover:text-[#C89A3C] transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[rgba(200,154,60,0.12)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-ui text-xs text-[#6B706A]">
            © {currentYear} BhaktiMania. सर्वाधिकार सुरक्षित।
          </p>
          <p className="font-serif text-xs text-[#8B7267] text-center sm:text-right italic">
            सर्वे भवन्तु सुखिनः · सर्वे सन्तु निरामयाः
          </p>
        </div>
      </div>
    </footer>
  );
}

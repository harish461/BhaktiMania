import React from "react";
import Link from "next/link";

const devotionalLinks = [
  { label: "होम", href: "/" },
  { label: "भक्ति ज्ञान", href: "/bhakti-gyaan" },
  { label: "राधा कृष्ण", href: "/radha-krishna" },
  { label: "हनुमान", href: "/hanuman" },
  { label: "शिव", href: "/shiv" },
  { label: "भगवद्गीता", href: "/bhagavad-gita" },
  { label: "वृंदावन", href: "/vrindavan" },
  { label: "प्रेमानंद जी", href: "/premanand-ji" },
  { label: "त्योहार", href: "/festivals" },
];

const legalLinks = [
  { label: "हमारे बारे में", href: "/about" },
  { label: "संपर्क करें", href: "/contact" },
  { label: "गोपनीयता नीति", href: "/privacy-policy" },
  { label: "नियम और शर्तें", href: "/terms" },
  { label: "अस्वीकरण", href: "/disclaimer" },
  { label: "एफिलिएट प्रकटीकरण", href: "/affiliate-disclosure" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F8F4EC] border-t border-[#6B1724]/12 mt-auto text-[#1F2326]">
      <div className="container-desktop py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex flex-col group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
            >
              <span className="font-heading text-2xl sm:text-3xl text-[#6B1724] tracking-tight group-hover:text-[#52111C] transition-colors">
                BhaktiMania
              </span>
              <span className="text-xs text-[#5A6065] tracking-wider font-body mt-1">
                भक्ति • ज्ञान • शांति
              </span>
            </Link>

            <p className="text-sm text-[#5A6065] leading-relaxed max-w-md font-body">
              BhaktiMania सनातन धर्म, भक्ति परंपराओं, आध्यात्मिक चिंतन, भगवद्गीता,
              और प्रभु भक्ति को समर्पित एक विश्वसनीय एवं प्रामाणिक डिजिटल मंच है।
            </p>

            <div className="pt-2 text-xs text-[#6B1724] font-heading font-medium tracking-wide">
              ॐ शांतिः शांतिः शांतिः
            </div>
          </div>

          {/* Devotional Sections */}
          <div className="space-y-4">
            <h3 className="font-heading text-base text-[#6B1724] tracking-tight border-b border-[#6B1724]/10 pb-2">
              भक्ति अनुभाग
            </h3>
            <ul className="space-y-2.5">
              {devotionalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center min-h-[44px] py-1 text-sm text-[#5A6065] hover:text-[#6B1724] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Information */}
          <div className="space-y-4">
            <h3 className="font-heading text-base text-[#6B1724] tracking-tight border-b border-[#6B1724]/10 pb-2">
              सूचना एवं नीतियां
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center min-h-[44px] py-1 text-sm text-[#5A6065] hover:text-[#6B1724] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#6B1724]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A6065] font-body">
          <p>© {currentYear} BhaktiMania. सर्वाधिकार सुरक्षित।</p>
          <p className="text-center sm:text-right text-[#6B1724]/80 font-medium">
            सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
          </p>
        </div>
      </div>
    </footer>
  );
}

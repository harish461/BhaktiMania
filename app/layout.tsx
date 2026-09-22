import type { Metadata } from "next";
import {
  Noto_Sans_Devanagari,
  Playfair_Display,
  Noto_Serif_Devanagari,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { siteConfig, getCanonicalUrl } from "@/lib/config/site";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import "./globals.css";

/* ─────────────────────────────────────────────────────────────────────────────
   Font Strategy — Sacred Folio & Saffron Manuscript
   
   --font-heading  → Playfair Display (display headlines, English editorial)
   --font-serif    → Noto Serif Devanagari (Hindi body, quotes, editorial prose)
   --font-ui       → Plus Jakarta Sans (nav, buttons, labels, metadata)
   --font-body     → Noto Sans Devanagari (backward compat — existing inner pages)
───────────────────────────────────────────────────────────────────────────── */

/** Playfair Display — replaces Rozha One as the editorial headline font. */
const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Noto Serif Devanagari — primary serif for Hindi body text & devotional quotes. */
const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-serif",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Plus Jakarta Sans — UI font: navigation, buttons, labels, timestamps. */
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Noto Sans Devanagari — backward compat for existing inner pages (--font-body). */
const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-body",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...(siteConfig.url ? { metadataBase: new URL(siteConfig.url) } : {}),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: "https://bhaktimania.com/images/og-default.webp",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: ["https://bhaktimania.com/images/og-default.webp"],
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  other: {
    "google-adsense-account":
      process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ||
      "ca-pub-3380573668907472",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      className={`${playfairDisplay.variable} ${notoSerifDevanagari.variable} ${plusJakartaSans.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF8F0] text-[#1C1C17] font-body">
        <AdSenseScript />
        {children}
      </body>
    </html>
  );
}

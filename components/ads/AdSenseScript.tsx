"use client";

import React from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { adsenseConfig, getAdSenseClient } from "@/lib/config/adsense";

/**
 * AdSenseScript — Global Google AdSense script integration component.
 *
 * Requirements & Safety:
 * 1. Loads ONLY when adsenseConfig.enabled is true AND a valid publisher ID exists.
 * 2. Strictly bars loading on any administrative route (/admin and /admin/*).
 * 3. Uses Next.js next/script with strategy="afterInteractive" and crossOrigin="anonymous".
 * 4. Deduplicates script instantiation via id="google-adsense".
 */
export function AdSenseScript() {
  const pathname = usePathname();

  // Guard 1: Must be explicitly enabled with a non-empty publisher ID
  if (!adsenseConfig.enabled || !adsenseConfig.publisherId) {
    return null;
  }

  // Guard 2: Strictly exclude all /admin routes
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const client = getAdSenseClient(adsenseConfig.publisherId);
  if (!client) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

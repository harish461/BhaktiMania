"use client";

import React, { useEffect, useRef } from "react";
import { adsenseConfig, getAdSenseClient } from "@/lib/config/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export interface AdSlotProps {
  placement: "in-article" | "sidebar" | "header" | "footer";
  /**
   * Real Google AdSense ad unit slot ID (e.g. "1234567890").
   * Strictly required for manual ad rendering.
   * If omitted, AdSlot remains dormant (returns null) to avoid fabricating slot IDs.
   */
  slotId?: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  fullWidthResponsive?: boolean;
  /**
   * Optional control for development layout inspection.
   * By default false; in production always returns null when disabled or without slotId.
   */
  showPlaceholder?: boolean;
}

/**
 * AdSlot — Primary manual ad unit component for BhaktiMania.
 *
 * Behavior:
 * 1. Disabled or missing publisher ID: Returns null.
 * 2. Enabled but missing slotId: Returns null (never invents fake slot IDs).
 * 3. Enabled + publisher ID + slotId: Renders responsive <ins class="adsbygoogle"> and pushes to adsbygoogle array.
 * 4. Ref-guarded push prevents duplicate calls on React 19 fast refresh / remounts.
 */
export function AdSlot({
  placement,
  slotId,
  className = "",
  format = "auto",
  fullWidthResponsive = true,
  showPlaceholder = false,
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isPushedRef = useRef(false);

  useEffect(() => {
    // Only trigger adsbygoogle push if AdSense is active, element exists, and has not yet been processed
    if (!adsenseConfig.enabled || !slotId) return;

    if (adRef.current && !isPushedRef.current) {
      const alreadyProcessed = adRef.current.getAttribute("data-adsbygoogle-status");
      if (!alreadyProcessed) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isPushedRef.current = true;
        } catch (err) {
          // Suppress in local environments where ad blockers or network restrictions exist
          if (process.env.NODE_ENV === "development") {
            console.debug("[AdSlot] AdSense push notice:", err);
          }
        }
      }
    }
  }, [slotId]);

  // Case 1: Disabled or missing publisher ID -> Dormant (null)
  if (!adsenseConfig.enabled || !adsenseConfig.publisherId) {
    if (process.env.NODE_ENV === "development" && showPlaceholder) {
      return (
        <div
          data-ad-placement={placement}
          className={`w-full my-4 p-4 rounded-xl border border-dashed border-[#6B1724]/20 bg-[#F8F4EC]/50 text-center select-none ${className}`}
          aria-hidden="true"
        >
          <span className="text-xs font-semibold text-[#6B1724]/60 uppercase tracking-wider block mb-1">
            विज्ञापन स्थान ({placement})
          </span>
          <span className="text-[11px] text-[#5A6065]/70 block">
            [AdSense Disabled — Set NEXT_PUBLIC_ADSENSE_ENABLED=true and provide NEXT_PUBLIC_ADSENSE_PUBLISHER_ID]
          </span>
        </div>
      );
    }
    return null;
  }

  // Case 2: Enabled, but missing slotId -> Dormant (null) to avoid inventing fake IDs
  if (!slotId) {
    if (process.env.NODE_ENV === "development" && showPlaceholder) {
      return (
        <div
          data-ad-placement={placement}
          className={`w-full my-4 p-4 rounded-xl border border-dashed border-[#6B1724]/20 bg-[#F8F4EC]/50 text-center select-none ${className}`}
          aria-hidden="true"
        >
          <span className="text-xs font-semibold text-[#6B1724]/60 uppercase tracking-wider block mb-1">
            विज्ञापन स्थान ({placement})
          </span>
          <span className="text-[11px] text-[#5A6065]/70 block">
            [AdSense Active — Manual ad unit requires real slotId prop]
          </span>
        </div>
      );
    }
    return null;
  }

  // Case 3: Enabled + valid publisher ID + valid slotId -> Render AdSense ad unit
  const client = getAdSenseClient(adsenseConfig.publisherId);

  return (
    <div
      data-ad-placement={placement}
      className={`ad-slot-wrapper my-6 overflow-hidden text-center ${className}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

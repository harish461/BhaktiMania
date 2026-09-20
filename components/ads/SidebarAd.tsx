import React from "react";
import { AdSlot } from "./AdSlot";

export interface SidebarAdProps {
  className?: string;
  slotId?: string;
  showPlaceholder?: boolean;
}

/**
 * SidebarAd — Pre-styled sidebar advertisement slot wrapper.
 * Tailored for desktop sidebars and multi-column article layouts.
 */
export function SidebarAd({
  className = "",
  slotId,
  showPlaceholder,
}: SidebarAdProps) {
  return (
    <aside
      aria-label="विज्ञापन"
      className={`w-full max-w-[300px] my-6 ${className}`}
    >
      <AdSlot
        placement="sidebar"
        slotId={slotId}
        showPlaceholder={showPlaceholder}
      />
    </aside>
  );
}

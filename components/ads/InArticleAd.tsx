import React from "react";
import { AdSlot } from "./AdSlot";

export interface InArticleAdProps {
  className?: string;
  slotId?: string;
  showPlaceholder?: boolean;
}

/**
 * InArticleAd — Pre-styled in-article advertisement slot wrapper.
 * Placed between article sections without interrupting editorial flow.
 */
export function InArticleAd({
  className = "",
  slotId,
  showPlaceholder,
}: InArticleAdProps) {
  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <AdSlot
        placement="in-article"
        slotId={slotId}
        showPlaceholder={showPlaceholder}
        className="max-w-2xl"
      />
    </div>
  );
}

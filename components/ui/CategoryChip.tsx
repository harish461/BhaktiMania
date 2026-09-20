import React from "react";

export interface CategoryChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const CategoryChip = React.forwardRef<HTMLButtonElement, CategoryChipProps>(
  ({ children, selected = false, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        className={`inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] cursor-pointer select-none whitespace-nowrap ${
          selected
            ? "bg-[#6B1724] text-white border-[#6B1724] shadow-sm"
            : "bg-white text-[#1F2326] border-[#6B1724]/15 hover:bg-[#F8F4EC] hover:text-[#6B1724] hover:border-[#6B1724]/30"
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CategoryChip.displayName = "CategoryChip";

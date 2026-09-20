import React from "react";

export type BadgeVariant = "maroon" | "saffron" | "gold" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  maroon: "bg-[#6B1724]/10 text-[#6B1724] border-[#6B1724]/15",
  saffron: "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20",
  gold: "bg-[#C27803]/10 text-[#C27803] border-[#C27803]/20",
  neutral: "bg-[#F8F4EC] text-[#5A6065] border-[#6B1724]/10",
};

export function Badge({
  children,
  variant = "maroon",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none ${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

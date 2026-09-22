import React from "react";

export type BadgeVariant = "saffron" | "gold" | "stone" | "maroon";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  saffron: "bg-[#C85A17]/10 text-[#C85A17] border-[#C85A17]/20",
  gold: "bg-[#C89A3C]/12 text-[#A8821E] border-[#C89A3C]/25",
  stone: "bg-[#F5EFE2] text-[#6B706A] border-[rgba(107,112,106,0.2)]",
  maroon: "bg-[#751F2A]/8 text-[#751F2A] border-[#751F2A]/15",
};

export function Badge({
  children,
  variant = "saffron",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-ui font-semibold border tracking-wide select-none ${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

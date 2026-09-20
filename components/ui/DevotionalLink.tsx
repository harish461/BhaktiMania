import React from "react";
import Link from "next/link";

export type LinkVariant = "default" | "subtle" | "accent";

export interface DevotionalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: LinkVariant;
}

const variantStyles: Record<LinkVariant, string> = {
  default:
    "text-[#6B1724] hover:text-[#52111C] underline-offset-4 hover:underline decoration-[#6B1724]/30",
  subtle:
    "text-[#1F2326] hover:text-[#6B1724] underline-offset-4 hover:underline decoration-[#6B1724]/20",
  accent:
    "text-[#D97706] hover:text-[#C27803] underline-offset-4 hover:underline decoration-[#D97706]/30",
};

export const DevotionalLink = React.forwardRef<
  HTMLAnchorElement,
  DevotionalLinkProps
>(({ href, children, variant = "default", className = "", ...props }, ref) => {
  return (
    <Link
      ref={ref}
      href={href}
      className={`inline-flex items-center font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2 rounded-sm ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
});

DevotionalLink.displayName = "DevotionalLink";

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  // Sacred Saffron — primary action (CTA buttons)
  primary:
    "bg-[#C85A17] text-[#FBF8F0] hover:bg-[#A8440B] active:bg-[#A8440B] border border-[rgba(200,154,60,0.4)]",
  // Transparent / ivory — secondary action
  secondary:
    "bg-transparent text-[#C85A17] hover:bg-[#F5EFE2] active:bg-[#EDE2CF] border border-[#C89A3C]",
  // Antique gold — warm accent
  accent:
    "bg-[#C89A3C] text-[#FBF8F0] hover:bg-[#A8821E] active:bg-[#A8821E] border border-transparent",
  // Outlined saffron
  outline:
    "bg-transparent text-[#C85A17] hover:bg-[#C85A17]/5 active:bg-[#C85A17]/10 border border-[#C85A17]/40",
  // Ghost — minimal
  ghost:
    "bg-transparent text-[#252824] hover:text-[#C85A17] hover:bg-[#F5EFE2] active:bg-[#EDE2CF] border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm min-h-[36px] rounded",
  md: "h-11 px-5 text-sm min-h-[44px] rounded",
  lg: "h-12 px-7 text-sm min-h-[48px] rounded",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center font-ui font-semibold tracking-wide transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A17] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF8F0] disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

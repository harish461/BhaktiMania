import React from "react";

export type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#6B1724] text-white hover:bg-[#52111C] active:bg-[#52111C] shadow-sm border border-transparent",
  secondary:
    "bg-[#F8F4EC] text-[#6B1724] hover:bg-white active:bg-[#F8F4EC] border border-[#6B1724]/15",
  accent:
    "bg-[#D97706] text-white hover:bg-[#C27803] active:bg-[#C27803] shadow-sm border border-transparent",
  outline:
    "bg-transparent text-[#6B1724] hover:bg-[#6B1724]/5 active:bg-[#6B1724]/10 border border-[#6B1724]/30",
  ghost:
    "bg-transparent text-[#1F2326] hover:text-[#6B1724] hover:bg-[#F8F4EC] active:bg-[#F8F4EC]/80 border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm min-h-[36px]",
  md: "h-11 px-5 text-base min-h-[44px]",
  lg: "h-12 px-6 text-lg min-h-[48px]",
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
        className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1724] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${
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

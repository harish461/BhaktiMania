import React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "simple" | "ornamental";
}

export function Divider({
  variant = "simple",
  className = "",
  ...props
}: DividerProps) {
  if (variant === "ornamental") {
    return (
      <div
        role="separator"
        className={`relative flex items-center justify-center my-8 sm:my-10 ${className}`}
        {...props}
      >
        <div className="grow border-t border-[#6B1724]/10" />
        <span className="shrink-0 px-3 text-[#C27803] text-xs select-none">
          ✦
        </span>
        <div className="grow border-t border-[#6B1724]/10" />
      </div>
    );
  }

  return (
    <hr
      className={`border-0 border-t border-[#6B1724]/10 my-6 sm:my-8 ${className}`}
      {...props}
    />
  );
}

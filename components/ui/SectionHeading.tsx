import React from "react";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  kicker?: string;
  description?: string;
  align?: "left" | "center";
  accentLine?: boolean;
}

export function SectionHeading({
  title,
  kicker,
  description,
  align = "left",
  accentLine = true,
  className = "",
  ...props
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-6 sm:mb-8 ${
        isCenter ? "text-center flex flex-col items-center" : "text-left"
      } ${className}`}
      {...props}
    >
      {kicker && (
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#D97706] uppercase mb-1.5 inline-block">
          {kicker}
        </span>
      )}
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#6B1724] tracking-tight leading-snug">
        {title}
      </h2>
      {accentLine && (
        <div
          className={`h-0.5 w-12 bg-[#D97706]/70 rounded-full mt-2.5 mb-2.5 ${
            isCenter ? "mx-auto" : ""
          }`}
        />
      )}
      {description && (
        <p className="text-[#5A6065] text-base sm:text-lg max-w-2xl mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

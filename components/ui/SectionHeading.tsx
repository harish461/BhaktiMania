import React from "react";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  kicker?: string;
  description?: string;
  align?: "left" | "center";
  accentLine?: boolean;
  /** Use "serif" for Hindi headings, "display" for English editorial headings */
  fontStyle?: "serif" | "display";
}

export function SectionHeading({
  title,
  kicker,
  description,
  align = "left",
  accentLine = true,
  fontStyle = "display",
  className = "",
  ...props
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const headingClass =
    fontStyle === "serif"
      ? "text-h2-serif text-[#252824]"
      : "text-h2 text-[#252824]";

  return (
    <div
      className={`mb-8 sm:mb-10 ${
        isCenter ? "text-center flex flex-col items-center" : "text-left"
      } ${className}`}
      {...props}
    >
      {kicker && (
        <div className={`flex items-center gap-2 mb-3 ${isCenter ? "justify-center" : ""}`}>
          <span className="accent-dot" aria-hidden="true" />
          <span className="label-ui text-[#C85A17]">{kicker}</span>
        </div>
      )}
      <h2 className={headingClass}>{title}</h2>
      {accentLine && (
        <div
          className={`h-0.5 w-10 bg-[#C89A3C]/60 rounded-full mt-3 mb-2 ${
            isCenter ? "mx-auto" : ""
          }`}
          aria-hidden="true"
        />
      )}
      {description && (
        <p className="text-[#6B706A] text-body max-w-2xl mt-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

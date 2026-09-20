import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({
  children,
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#6B1724]/10 shadow-[0_2px_8px_rgba(107,23,36,0.04)] ${
        interactive
          ? "transition-all duration-200 hover:shadow-[0_8px_20px_rgba(107,23,36,0.08)] hover:border-[#6B1724]/25 cursor-pointer"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 sm:p-6 pb-2 sm:pb-3 ${className}`} {...props} />;
}

export function CardTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`font-heading text-xl sm:text-2xl text-[#1F2326] leading-snug tracking-tight ${className}`}
      {...props}
    />
  );
}

export function CardDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm sm:text-base text-[#5A6065] mt-1.5 leading-relaxed ${className}`}
      {...props}
    />
  );
}

export function CardContent({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 sm:p-6 pt-2 sm:pt-3 ${className}`} {...props} />;
}

export function CardFooter({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-[#6B1724]/5 mt-2 ${className}`}
      {...props}
    />
  );
}

import React from "react";

// ─── Social channel configuration ────────────────────────────────────────────
// Keep all social destinations in one place so they are easy to update.
const SOCIAL_CHANNELS = {
  youtube: {
    label: "YouTube",
    sublabel: "YouTube Shorts",
    url: "https://www.youtube.com/@BhaktiMania1630/shorts",
    cta: "YouTube पर देखें",
    description:
      "भक्ति पर केंद्रित छोटे-छोटे प्रेरणादायक Shorts — देवी-देवता, मंत्र, भजन और आध्यात्मिक विचार।",
    brandColor: "#FF0000",
    brandColorSubtle: "rgba(255,0,0,0.08)",
  },
  facebook: {
    label: "Facebook",
    sublabel: "Facebook Posts",
    url: "https://www.facebook.com/share/16FqSftNCDM/?mibextid=wwXIfr",
    cta: "Facebook पर देखें",
    description:
      "भक्ति विचार, पर्व की शुभकामनाएँ, मंत्र और समुदाय — हमारे Facebook पेज पर जुड़ें।",
    brandColor: "#1877F2",
    brandColorSubtle: "rgba(24,119,242,0.08)",
  },
} as const;

// ─── YouTube Icon ─────────────────────────────────────────────────────────────
function YouTubeIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ─── Facebook Icon ────────────────────────────────────────────────────────────
function FacebookIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ─── YouTube preview area (future-ready) ──────────────────────────────────────
// When a YouTube Data API v3 key is available server-side, replace this with
// real thumbnail cards shaped as: { id, title, thumbnailUrl, shortUrl }[]
function YouTubePreviewArea() {
  return (
    <div
      className="relative rounded-[5px] overflow-hidden flex-1"
      style={{
        background:
          "linear-gradient(135deg, #1a0a00 0%, #2d1200 60%, #1a0808 100%)",
        minHeight: "172px",
        border: "1px solid rgba(200,154,60,0.2)",
      }}
      aria-label="YouTube Shorts चैनल प्रीव्यू"
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 28px)",
        }}
      />

      {/* Warm saffron glow top-right */}
      <div
        className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(200,90,23,0.6) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full py-10 gap-4">
        {/* Play button badge */}
        <div
          className="flex items-center justify-center w-14 h-14 rounded-full"
          style={{
            background: "rgba(220,0,0,0.9)",
            boxShadow: "0 4px 22px rgba(220,0,0,0.45)",
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 20 20"
            fill="white"
            className="w-6 h-6 ml-0.5"
            aria-hidden="true"
          >
            <path d="M6.3 4.2l10 5.8-10 5.8V4.2z" />
          </svg>
        </div>

        <div className="text-center px-6">
          <p
            className="font-serif text-[#D8B45A] mb-1.5"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            BhaktiMania Shorts
          </p>
          <p
            className="font-ui text-[rgba(251,248,240,0.55)] leading-relaxed"
            style={{ fontSize: "0.73rem" }}
          >
            भक्ति, मंत्र और आध्यात्मिक प्रेरणा
            <br />
            हमारे YouTube Shorts पर देखें
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Facebook preview area (future-ready) ────────────────────────────────────
// When a Facebook Graph API Page token is available (server-side only — never
// expose tokens in client code), replace this with real post cards shaped as:
// { id, message, createdTime, fullPictureUrl }[]
function FacebookPreviewArea() {
  return (
    <div
      className="relative rounded-[5px] overflow-hidden flex-1"
      style={{
        background:
          "linear-gradient(135deg, #020f1f 0%, #06244a 60%, #020f1f 100%)",
        minHeight: "172px",
        border: "1px solid rgba(200,154,60,0.2)",
      }}
      aria-label="Facebook पेज प्रीव्यू"
    >
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Facebook blue glow */}
      <div
        className="absolute -top-6 -left-6 w-32 h-32 rounded-full opacity-20 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(24,119,242,0.7) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full py-10 gap-4">
        {/* Facebook badge */}
        <div
          className="flex items-center justify-center w-14 h-14 rounded-full"
          style={{
            background: "rgba(24,119,242,0.9)",
            boxShadow: "0 4px 22px rgba(24,119,242,0.45)",
          }}
          aria-hidden="true"
        >
          <FacebookIcon className="w-7 h-7 text-white" />
        </div>

        <div className="text-center px-6">
          <p
            className="font-serif text-[#D8B45A] mb-1.5"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            BhaktiMania Facebook
          </p>
          <p
            className="font-ui text-[rgba(251,248,240,0.55)] leading-relaxed"
            style={{ fontSize: "0.73rem" }}
          >
            भक्ति विचार, पर्व और आध्यात्मिक
            <br />
            समुदाय हमारे Facebook पेज पर
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main section export ──────────────────────────────────────────────────────
export function SocialMediaSection() {
  const { youtube, facebook } = SOCIAL_CHANNELS;

  return (
    <section
      aria-labelledby="social-section-heading"
      className="py-20 lg:py-28 bg-[#FBF8F0] border-t border-[rgba(200,154,60,0.18)]"
    >
      <div className="container-desktop">
        {/* ── Section header ── */}
        <div className="mb-12 pb-5 border-b border-[rgba(200,154,60,0.18)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="accent-dot" aria-hidden="true" />
            <span className="label-ui text-[#C85A17]">सोशल मीडिया</span>
          </div>
          <h2
            id="social-section-heading"
            className="font-serif text-[#1C1C17] leading-tight"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.125rem)",
              fontWeight: 500,
            }}
          >
            BhaktiMania से जुड़े रहें
          </h2>
          <div
            className="h-0.5 w-10 bg-[#C89A3C]/60 rounded-full mt-3"
            aria-hidden="true"
          />
          <p
            className="font-serif text-[#6B706A] mt-4 max-w-xl"
            style={{ fontSize: "1rem" }}
          >
            भक्ति, विचार और आध्यात्मिक वीडियो हमारे सोशल चैनलों पर देखें।
          </p>
        </div>

        {/* ── Two-column social panels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* ── YouTube Panel ── */}
          <div className="flex flex-col rounded-[8px] border border-[rgba(200,154,60,0.32)] bg-white overflow-hidden shadow-[0_2px_16px_-3px_rgba(40,25,15,0.07)] hover:shadow-[0_8px_32px_-4px_rgba(40,25,15,0.11)] hover:border-[rgba(200,154,60,0.52)] transition-all duration-200">
            {/* Brand identity strip */}
            <div className="px-6 pt-6 pb-4 flex items-center gap-4">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-[6px] flex-shrink-0"
                style={{
                  background: youtube.brandColorSubtle,
                  border: "1px solid rgba(255,0,0,0.18)",
                }}
                aria-hidden="true"
              >
                <YouTubeIcon
                  className="w-6 h-6"
                  style={{ color: youtube.brandColor }}
                />
              </div>
              <div>
                <p
                  className="font-serif text-[#1C1C17] leading-tight"
                  style={{ fontSize: "1.0625rem", fontWeight: 600 }}
                >
                  {youtube.label}
                </p>
                <p className="font-ui text-[11px] font-semibold tracking-wide text-[#C89A3C] uppercase mt-0.5">
                  {youtube.sublabel}
                </p>
              </div>
            </div>

            {/* Gold separator */}
            <div
              className="mx-6 h-px bg-[rgba(200,154,60,0.2)]"
              aria-hidden="true"
            />

            {/* Description */}
            <p
              className="px-6 pt-4 pb-5 font-serif text-[#6B706A] leading-relaxed"
              style={{ fontSize: "0.9375rem" }}
            >
              {youtube.description}
            </p>

            {/* Preview + CTA */}
            <div className="px-6 pb-6 flex flex-col gap-5 flex-1">
              <YouTubePreviewArea />
              <a
                href={youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 h-11 px-6 rounded border border-[rgba(200,154,60,0.4)] bg-[#C85A17] text-[#FBF8F0] font-ui text-sm font-semibold tracking-wide hover:bg-[#A8440B] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C] focus-visible:ring-offset-2"
                aria-label="BhaktiMania YouTube Shorts देखें — नए टैब में खुलेगा"
              >
                <YouTubeIcon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                />
                <span>{youtube.cta}</span>
                <span
                  className="ml-0.5 group-hover:translate-x-0.5 transition-transform duration-200"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </div>
          </div>

          {/* ── Facebook Panel ── */}
          <div className="flex flex-col rounded-[8px] border border-[rgba(200,154,60,0.32)] bg-white overflow-hidden shadow-[0_2px_16px_-3px_rgba(40,25,15,0.07)] hover:shadow-[0_8px_32px_-4px_rgba(40,25,15,0.11)] hover:border-[rgba(200,154,60,0.52)] transition-all duration-200">
            {/* Brand identity strip */}
            <div className="px-6 pt-6 pb-4 flex items-center gap-4">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-[6px] flex-shrink-0"
                style={{
                  background: facebook.brandColorSubtle,
                  border: "1px solid rgba(24,119,242,0.18)",
                }}
                aria-hidden="true"
              >
                <FacebookIcon
                  className="w-6 h-6"
                  style={{ color: facebook.brandColor }}
                />
              </div>
              <div>
                <p
                  className="font-serif text-[#1C1C17] leading-tight"
                  style={{ fontSize: "1.0625rem", fontWeight: 600 }}
                >
                  {facebook.label}
                </p>
                <p className="font-ui text-[11px] font-semibold tracking-wide text-[#C89A3C] uppercase mt-0.5">
                  {facebook.sublabel}
                </p>
              </div>
            </div>

            {/* Gold separator */}
            <div
              className="mx-6 h-px bg-[rgba(200,154,60,0.2)]"
              aria-hidden="true"
            />

            {/* Description */}
            <p
              className="px-6 pt-4 pb-5 font-serif text-[#6B706A] leading-relaxed"
              style={{ fontSize: "0.9375rem" }}
            >
              {facebook.description}
            </p>

            {/* Preview + CTA */}
            <div className="px-6 pb-6 flex flex-col gap-5 flex-1">
              <FacebookPreviewArea />
              <a
                href={facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 h-11 px-6 rounded border border-[rgba(200,154,60,0.4)] bg-[#C85A17] text-[#FBF8F0] font-ui text-sm font-semibold tracking-wide hover:bg-[#A8440B] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A3C] focus-visible:ring-offset-2"
                aria-label="BhaktiMania Facebook Posts देखें — नए टैब में खुलेगा"
              >
                <FacebookIcon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                />
                <span>{facebook.cta}</span>
                <span
                  className="ml-0.5 group-hover:translate-x-0.5 transition-transform duration-200"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

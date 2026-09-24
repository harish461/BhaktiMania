import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      // Supabase Storage — for admin-uploaded article featured images
      {
        protocol: "https",
        hostname: "pbmkhmrupkakqskktnki.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // YouTube Video & Shorts Thumbnails
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

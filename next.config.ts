import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.aladin.co.kr",
      },
      {
        protocol: "https",
        hostname: "aladin.co.kr",
      },
    ],
  },
};

export default nextConfig;

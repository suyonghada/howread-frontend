import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.aladin.co.kr",
      },
    ],
  },
};

export default nextConfig;

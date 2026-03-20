import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "search1.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "**.kakaocdn.net",
      },
    ],
  },
};

export default nextConfig;

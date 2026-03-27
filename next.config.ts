import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-d3ac298b441547f387442ac76499bdc2.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const extraHosts = (process.env.NEXT_IMAGE_REMOTE_HOSTNAMES ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean)
  .map((hostname) => ({
    protocol: "https" as const,
    hostname,
    pathname: "/**" as const,
  }));

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-d3ac298b441547f387442ac76499bdc2.r2.dev",
        pathname: "/**",
      },
      ...extraHosts,
    ],
  },
};

export default nextConfig;

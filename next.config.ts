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
        hostname: "cdn.mitrajasalegalitas.co.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-8c1ce0172c6d4135bf5db8344f0bbb65.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-d3ac298b441547f387442ac76499bdc2.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dashboard.mitrajasalegalitas.co.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mitrajasalegalitas.co.id",
        pathname: "/**",
      },
      ...extraHosts,
    ],
  },
};

export default nextConfig;

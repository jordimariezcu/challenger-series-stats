import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include data/ directory in serverless function bundles (needed for OG images and API routes)
  outputFileTracingIncludes: {
    "/players/[slug]/opengraph-image": ["./data/**/*"],
    "/api/**": ["./data/**/*"],
  },
};

export default nextConfig;

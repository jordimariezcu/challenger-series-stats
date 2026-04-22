import type { MetadataRoute } from "next";

const BASE = "https://challenger-series-stats.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/organizer", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

const BASE = "https://cs-stats.com";

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

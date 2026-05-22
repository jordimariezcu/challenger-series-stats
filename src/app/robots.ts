import type { MetadataRoute } from "next";

const BASE = "https://cs-stats.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/organizer", "/api/"],
      },
      // AI search crawlers — explicitly welcome (power ChatGPT Search, Perplexity, etc.)
      { userAgent: "ChatGPT-User",   allow: "/" },
      { userAgent: "PerplexityBot",  allow: "/" },
      { userAgent: "ClaudeBot",      allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

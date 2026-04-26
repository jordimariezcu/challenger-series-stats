import type { MetadataRoute } from "next";
import { getAllPlayers } from "@/lib/data";
import { playerSlug } from "@/lib/utils";

const BASE = "https://cs-stats.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const players = getAllPlayers();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: now, changeFrequency: "daily",  priority: 1.0 },
    { url: `${BASE}/players`,       lastModified: now, changeFrequency: "daily",  priority: 0.9 },
    { url: `${BASE}/stats`,         lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/h2h`,           lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/attendance`,    lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const playerRoutes: MetadataRoute.Sitemap = players.map((p) => ({
    url: `${BASE}/players/${playerSlug(p.name)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...playerRoutes];
}

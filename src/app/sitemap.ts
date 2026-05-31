import type { MetadataRoute } from "next";
import { getAllPlayers, getData } from "@/lib/data";
import { playerSlug } from "@/lib/utils";

const BASE = "https://cs-stats.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const players = getAllPlayers();
  const { generated_at } = getData();
  const dataDate = new Date(generated_at);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                 lastModified: dataDate, changeFrequency: "daily",  priority: 1.0 },
    { url: `${BASE}/players`,    lastModified: dataDate, changeFrequency: "daily",  priority: 0.9 },
    { url: `${BASE}/stats`,      lastModified: dataDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/h2h`,        lastModified: dataDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/attendance`,   lastModified: dataDate, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/tournaments`,  lastModified: dataDate, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/faq`,          lastModified: dataDate, changeFrequency: "monthly", priority: 0.6 },
  ];

  const playerRoutes: MetadataRoute.Sitemap = players.map((p) => ({
    url: `${BASE}/players/${playerSlug(p.name)}`,
    lastModified: dataDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...playerRoutes];
}

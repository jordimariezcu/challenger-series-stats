import type { Metadata } from "next";
import { getAllTournamentSummaries, getData, playerSlug } from "@/lib/data";
import TournamentsClient from "@/components/TournamentsClient";

const BASE_URL = "https://cs-stats.com";

export function generateMetadata(): Metadata {
  const { total_tournaments } = getData();
  const desc = `Complete history of all ${total_tournaments} Challenger Series table tennis tournaments in Germany. Champions, finalists, 3rd place finishes and prize money for every event since 2024.`;
  return {
    title: "Tournaments",
    description: desc,
    alternates: { canonical: `${BASE_URL}/tournaments` },
    openGraph: {
      title: "Challenger Series — Tournament History",
      description: desc,
      url: `${BASE_URL}/tournaments`,
      images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Challenger Series Stats" }],
    },
    twitter: { card: "summary_large_image", images: [`${BASE_URL}/opengraph-image`] },
  };
}

export default function TournamentsPage() {
  const tournaments = getAllTournamentSummaries();

  // All-time champion: most wins
  const titleCount: Record<string, number> = {};
  for (const t of tournaments) {
    titleCount[t.winner] = (titleCount[t.winner] ?? 0) + 1;
  }
  const allTimeChamp = Object.entries(titleCount).sort((a, b) => b[1] - a[1])[0];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Challenger Series Tournament History",
    description: "All Challenger Series table tennis tournaments with champion and results",
    numberOfItems: tournaments.length,
    url: `${BASE_URL}/tournaments`,
    itemListElement: tournaments.slice(0, 100).map((t, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: `Tournament #${t.number} — ${t.date_start}`,
      description: `Winner: ${t.winner} · Runner-up: ${t.runnerUp}${t.winnerEarnings > 0 ? ` · Prize: €${t.winnerEarnings}` : ""}`,
      url: `${BASE_URL}/players/${playerSlug(t.winner)}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",        item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Tournaments", item: `${BASE_URL}/tournaments` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TournamentsClient
        tournaments={tournaments}
        allTimeChamp={allTimeChamp[0]}
        allTimeTitles={allTimeChamp[1]}
      />
    </>
  );
}

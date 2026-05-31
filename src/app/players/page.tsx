import type { Metadata } from "next";
import { getAllPlayers, getData, playerSlug } from "@/lib/data";
import PlayersClient from "@/components/PlayersClient";

const BASE_URL = "https://cs-stats.com";

export function generateMetadata(): Metadata {
  const players = getAllPlayers();
  const { total_tournaments } = getData();
  const desc = `All active Challenger Series players ranked by wins, win rate, deuce performance, comeback rate and earnings. ${players.length} players, ${total_tournaments} tournaments.`;
  return {
    title: "Players",
    description: desc,
    alternates: { canonical: `${BASE_URL}/players` },
    openGraph: {
      title: "Challenger Series — All Players",
      description: `Rankings by wins, win rate, deuce performance, comeback rate and earnings. ${players.length} players across ${total_tournaments} tournaments.`,
      url: `${BASE_URL}/players`,
      images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Challenger Series Stats — Table Tennis Statistics" }],
    },
    twitter: { card: "summary_large_image", images: [`${BASE_URL}/opengraph-image`] },
  };
}

export default function PlayersPage() {
  const players = getAllPlayers().sort((a, b) => b.wins - a.wins);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Challenger Series Players",
    description: "All active table tennis players in the Challenger Series league ranked by wins",
    numberOfItems: players.length,
    url: `${BASE_URL}/players`,
    itemListElement: players
      .slice(0, 100)
      .map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: p.name,
        url: `${BASE_URL}/players/${playerSlug(p.name)}`,
        description: `${p.wins}W/${p.losses}L · ${p.win_rate}% win rate`,
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <PlayersClient initialPlayers={players} />
    </>
  );
}

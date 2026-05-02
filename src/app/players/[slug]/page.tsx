import type { Metadata } from "next";
import { getData, getPlayer, playerSlug } from "@/lib/data";
import { notFound } from "next/navigation";
import PlayerHeader from "@/components/PlayerHeader";
import PlayerTabs from "@/components/PlayerTabs";

const BASE_URL = "https://cs-stats.com";

export async function generateStaticParams() {
  const data = getData();
  return Object.keys(data.players).map((name) => ({ slug: playerSlug(name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlayer(slug);
  if (!p) return { title: "Player not found" };

  const url = `${BASE_URL}/players/${slug}`;
  const title = p.name;
  const desc = `${p.name} · ${p.wins}W/${p.losses}L (${p.win_rate}%) · ${p.tournament_wins} tournament win${p.tournament_wins !== 1 ? "s" : ""} · €${p.total_earnings.toLocaleString()} earned · Challenger Series table tennis.`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${p.name} · Challenger Series Stats`,
      description: desc,
      url,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name} · Challenger Series Stats`,
      description: desc,
    },
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = getPlayer(slug);
  if (!player) notFound();

  const url = `${BASE_URL}/players/${slug}`;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    url,
    jobTitle: "Table Tennis Player",
    description: `Table tennis player in the Challenger Series league. ${player.wins}W/${player.losses}L, ${player.tournament_wins} tournament win${player.tournament_wins !== 1 ? "s" : ""}, €${player.total_earnings.toLocaleString()} earned.`,
    memberOf: {
      "@type": "SportsOrganization",
      name: "Challenger Series",
      sport: "Table Tennis",
      url: "https://www.challengerseries.net",
    },
    nationality: { "@type": "Place", name: "Germany" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Players", item: `${BASE_URL}/players` },
      { "@type": "ListItem", position: 3, name: player.name, item: url },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PlayerHeader p={player} />
      <PlayerTabs p={player} />
    </div>
  );
}

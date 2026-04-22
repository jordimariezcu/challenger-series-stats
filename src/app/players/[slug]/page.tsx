import type { Metadata } from "next";
import { getData, getPlayer, playerSlug } from "@/lib/data";
import { notFound } from "next/navigation";
import PlayerHeader from "@/components/PlayerHeader";
import PlayerTabs from "@/components/PlayerTabs";

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

  const title = p.name;
  const desc = `${p.name} · ${p.wins}W/${p.losses}L (${p.win_rate}%) · ${p.tournament_wins} tournament win${p.tournament_wins !== 1 ? "s" : ""} · €${p.total_earnings.toLocaleString()} earned · Challenger Series table tennis.`;

  return {
    title,
    description: desc,
    openGraph: { title: `${p.name} · Challenger Series Stats`, description: desc },
    twitter:    { title: `${p.name} · Challenger Series Stats`, description: desc },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    description: `Table tennis player in the Challenger Series league. ${player.wins}W/${player.losses}L, ${player.tournament_wins} tournament wins.`,
    memberOf: {
      "@type": "SportsOrganization",
      name: "Challenger Series",
      sport: "Table Tennis",
      url: "https://www.challengerseries.net",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlayerHeader p={player} />
      <PlayerTabs p={player} />
    </div>
  );
}

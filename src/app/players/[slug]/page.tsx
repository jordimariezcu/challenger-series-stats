import { getData, getPlayer, playerSlug } from "@/lib/data";
import { notFound } from "next/navigation";
import PlayerHeader from "@/components/PlayerHeader";
import PlayerTabs from "@/components/PlayerTabs";

export async function generateStaticParams() {
  const data = getData();
  return Object.keys(data.players).map((name) => ({ slug: playerSlug(name) }));
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = getPlayer(slug);
  if (!player) notFound();

  return (
    <div>
      <PlayerHeader p={player} />
      <PlayerTabs p={player} />
    </div>
  );
}

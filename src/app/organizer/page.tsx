import type { Metadata } from "next";
import { getData, getAllPlayers } from "@/lib/data";
import OrganizerClient from "@/components/OrganizerClient";

export const metadata: Metadata = {
  title: "Organizer",
  robots: { index: false, follow: false },
};

export default function OrganizerPage() {
  const data    = getData();
  const players = getAllPlayers();

  // ── Total payout: sum of all players' total_earnings
  const totalPayout = Math.round(players.reduce((s, p) => s + p.total_earnings, 0));
  const avgPayoutPerTournament = data.total_tournaments > 0
    ? totalPayout / data.total_tournaments
    : 0;

  // ── Season breakdown: group tournament_results by year
  const seasonMap = new Map<string, { tournaments: Set<string>; payout: number; players: Set<string> }>();

  for (const player of players) {
    for (const tr of player.tournament_results) {
      const year = tr.date ? tr.date.slice(0, 4) : "Unknown";
      if (!seasonMap.has(year)) {
        seasonMap.set(year, { tournaments: new Set(), payout: 0, players: new Set() });
      }
      const s = seasonMap.get(year)!;
      s.tournaments.add(tr.tournament_id);
      s.payout += tr.earnings ?? 0;
      s.players.add(player.name);
    }
  }

  const seasons = [...seasonMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, s]) => ({
      year,
      tournaments:   s.tournaments.size,
      totalPayout:   Math.round(s.payout),
      avgPayout:     s.tournaments.size > 0 ? s.payout / s.tournaments.size : 0,
      uniquePlayers: s.players.size,
    }));

  return (
    <OrganizerClient
      players={players}
      totalTournaments={data.total_tournaments}
      totalPayout={totalPayout}
      avgPayoutPerTournament={avgPayoutPerTournament}
      seasons={seasons}
    />
  );
}

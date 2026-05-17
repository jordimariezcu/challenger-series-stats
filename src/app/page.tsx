import type { Metadata } from "next";
import { getData, getAllPlayers } from "@/lib/data";
import DashboardClient from "@/components/DashboardClient";

const BASE_URL = "https://cs-stats.com";

export const metadata: Metadata = {
  title: { absolute: "Challenger Series Stats — Table Tennis Statistics Germany" },
  description:
    "Live statistics hub for the Challenger Series table tennis league in Germany. Win rates, deuce records, comeback kings, tournament champions and more.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Challenger Series Stats — Table Tennis Statistics Germany",
    description: "Live statistics hub: top winners, deuce kings, comeback leaders, tournament champions.",
    url: BASE_URL,
  },
  twitter: { card: "summary_large_image" },
};

export default function Dashboard() {
  const data = getData();
  const players = getAllPlayers();

  const topWinners = [...players].sort((a, b) => b.wins - a.wins).slice(0, 8);

  const deuceKings = [...players]
    .filter((p) => p.deuce_total >= 10)
    .sort((a, b) => (b.deuce_win_rate ?? 0) - (a.deuce_win_rate ?? 0))
    .slice(0, 8);

  const comebackKings = [...players]
    .filter((p) => p.comeback_chances >= 5)
    .sort((a, b) => (b.comeback_rate ?? 0) - (a.comeback_rate ?? 0))
    .slice(0, 8);

  const bestWinRate = [...players]
    .filter((p) => p.total_matches >= 20)
    .sort((a, b) => b.win_rate - a.win_rate)
    .slice(0, 8);

  const tourChamps = [...players]
    .filter((p) => p.tournament_wins > 0)
    .sort((a, b) => b.tournament_wins - a.tournament_wins)
    .slice(0, 6);

  let firstSetWins = 0, firstSetTotal = 0;
  for (const p of players) {
    firstSetWins += p.first_set_win_match_win;
    firstSetTotal += p.first_set_total;
  }
  const firstSetPct =
    firstSetTotal > 0 ? Math.round((firstSetWins / firstSetTotal) * 100) : 0;

  let totalDeuceSets = 0;
  for (const p of players) totalDeuceSets += p.deuce_total;
  const uniqueDeuceMatches = Math.round(totalDeuceSets / 2);

  return (
    <DashboardClient
      totalTournaments={data.total_tournaments}
      playerCount={players.length}
      firstSetPct={firstSetPct}
      uniqueDeuceMatches={uniqueDeuceMatches}
      topWinners={topWinners}
      bestWinRate={bestWinRate}
      deuceKings={deuceKings}
      comebackKings={comebackKings}
      tourChamps={tourChamps}
    />
  );
}

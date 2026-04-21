import { getAllPlayers } from "@/lib/data";
import StatsClient from "@/components/StatsClient";

export default function StatsPage() {
  const players = getAllPlayers();

  const deuceKings = [...players]
    .filter((p) => p.deuce_total >= 15)
    .sort((a, b) => (b.deuce_win_rate ?? 0) - (a.deuce_win_rate ?? 0))
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.deuce_win_rate,
      sub: `${p.deuce_won}/${p.deuce_total}`,
    }));

  const comebackKings = [...players]
    .filter((p) => p.comeback_chances >= 8)
    .sort((a, b) => (b.comeback_rate ?? 0) - (a.comeback_rate ?? 0))
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.comeback_rate,
      sub: `${p.comeback_wins}/${p.comeback_chances}`,
    }));

  const firstSetChamps = [...players]
    .filter((p) => p.first_set_total >= 20)
    .map((p) => ({
      name: p.name,
      value: Math.round((p.first_set_win_match_win / p.first_set_total) * 100),
      sub: `${p.first_set_win_match_win}/${p.first_set_total}`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  const dominant = [...players]
    .filter((p) => p.sets_won + p.sets_lost >= 30)
    .map((p) => ({
      name: p.name,
      value: Math.round((p.sets_won / (p.sets_won + p.sets_lost)) * 100),
      sub: `${p.sets_won}/${p.sets_won + p.sets_lost}`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  const hotForm = [...players]
    .filter((p) => p.form_trend !== null && p.total_matches >= 10)
    .sort((a, b) => (b.form_trend ?? 0) - (a.form_trend ?? 0))
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.form_trend,
      sub: `${p.form_last10}% / ${p.win_rate}%`,
    }));

  const clutchPlayers = [...players]
    .filter((p) => p.clutch_rate !== null)
    .sort((a, b) => (b.clutch_rate ?? 0) - (a.clutch_rate ?? 0))
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.clutch_rate,
      sub: `${p.ko_wins}/${p.ko_total}`,
    }));

  const dominanceIndex = [...players]
    .filter((p) => p.wins >= 20)
    .map((p) => ({
      name: p.name,
      value: Math.round((p.wins_2_0 / p.wins) * 100),
      sub: `${p.wins_2_0}/${p.wins}`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  const topEarners = [...players]
    .filter((p) => p.tournaments_played >= 3)
    .sort((a, b) => b.total_earnings - a.total_earnings)
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.total_earnings,
      sub: `${p.tournaments_played} tournaments`,
      unit: "€" as const,
    }));

  return (
    <StatsClient
      deuceKings={deuceKings}
      comebackKings={comebackKings}
      firstSetChamps={firstSetChamps}
      dominant={dominant}
      hotForm={hotForm}
      clutchPlayers={clutchPlayers}
      dominanceIndex={dominanceIndex}
      topEarners={topEarners}
    />
  );
}

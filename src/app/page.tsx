import { getData, getAllPlayers, playerSlug } from "@/lib/data";
import { StatCard, SectionHeader } from "@/components/StatCard";
import { LeaderboardRow } from "@/components/PlayerRow";
import Link from "next/link";

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
    <div>
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-end gap-4 mb-2">
          <h1 className="text-4xl font-black uppercase tracking-tight text-[var(--text)]">
            Statistics
          </h1>
          <span className="text-4xl font-black uppercase tracking-tight text-[var(--accent)]">
            Hub
          </span>
        </div>
        <p className="text-[var(--muted)] text-sm">
          Advanced table tennis analytics ·{" "}
          <span className="text-[var(--text)]">{data.total_tournaments}</span> tournaments ·{" "}
          <span className="text-[var(--text)]">{players.length}</span> players
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Tournaments"
          value={data.total_tournaments}
          sub="2024 – 2026"
          icon="🗓"
        />
        <StatCard
          label="Active Players"
          value={players.length}
          sub="≥3 matches played"
          icon="🏓"
        />
        <StatCard
          label="1st Set Impact"
          value={`${firstSetPct}%`}
          accent
          sub="wins after winning 1st set"
          icon="🚀"
        />
        <StatCard
          label="Deuce Sets"
          value={uniqueDeuceMatches.toLocaleString()}
          sub="sets reaching 10–10"
          icon="⚡"
        />
      </div>

      {/* Insight banner */}
      <div className="relative rounded-lg border border-[var(--accent)]/30 bg-[var(--surface)] p-5 mb-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
        <div className="pl-3">
          <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest mb-1.5">
            League Insight
          </div>
          <p className="text-sm text-[var(--text)] font-medium leading-relaxed">
            {firstSetPct >= 70
              ? `Winning the first set converts to a match win ${firstSetPct}% of the time. A dominant start is the strongest predictor of victory in this league.`
              : firstSetPct >= 60
              ? `First-set winners take the match ${firstSetPct}% of the time. Starting strong is a critical tactical advantage.`
              : `Despite the first set going your way only ${firstSetPct}% lead to wins, this league has exceptional comeback culture.`}
          </p>
        </div>
      </div>

      {/* Leaderboards — 2×2 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

        {/* Most wins */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <SectionHeader
            title="Most Wins"
            right={
              <Link href="/players" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                All players →
              </Link>
            }
          />
          <div className="divide-y divide-[var(--border)]">
            {topWinners.map((p, i) => (
              <LeaderboardRow
                key={p.name}
                rank={i + 1}
                name={p.name}
                value={p.win_rate}
                sub={`${p.wins}W/${p.losses}L`}
              />
            ))}
          </div>
        </div>

        {/* Best win rate */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <SectionHeader title="Best Win Rate" subtitle="min. 20 matches" />
          <div className="divide-y divide-[var(--border)]">
            {bestWinRate.map((p, i) => (
              <LeaderboardRow
                key={p.name}
                rank={i + 1}
                name={p.name}
                value={p.win_rate}
                sub={`${p.wins}W/${p.losses}L`}
              />
            ))}
          </div>
        </div>

        {/* Deuce Kings */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <SectionHeader title="👑 Rey del Deuce" subtitle="min. 10 deuce sets" />
          <div className="divide-y divide-[var(--border)]">
            {deuceKings.map((p, i) => (
              <LeaderboardRow
                key={p.name}
                rank={i + 1}
                name={p.name}
                value={p.deuce_win_rate}
                sub={`${p.deuce_won}/${p.deuce_total} sets`}
              />
            ))}
          </div>
        </div>

        {/* Comeback Kings */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <SectionHeader title="⚡ Comeback Kings" subtitle="wins after losing 1st set" />
          <div className="divide-y divide-[var(--border)]">
            {comebackKings.map((p, i) => (
              <LeaderboardRow
                key={p.name}
                rank={i + 1}
                name={p.name}
                value={p.comeback_rate}
                sub={`${p.comeback_wins}/${p.comeback_chances}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tournament Champions */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <SectionHeader title="🏆 Tournament Champions" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-[var(--border)]">
          {tourChamps.map((p, idx) => (
            <Link
              key={p.name}
              href={`/players/${playerSlug(p.name)}`}
              className="p-4 hover:bg-[var(--surface2)] transition-colors group text-center"
            >
              <div
                className={`text-3xl font-black tabular-nums mb-1 ${
                  idx === 0 ? "text-yellow-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-orange-400" : "text-[var(--accent)]"
                }`}
              >
                {p.tournament_wins}
              </div>
              <div className="text-xs font-semibold truncate group-hover:text-[var(--accent)] transition-colors">
                {p.name.split(",")[0]}
              </div>
              <div className="text-[10px] text-[var(--muted)] mt-0.5">
                {p.name.split(",")[1]?.trim()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

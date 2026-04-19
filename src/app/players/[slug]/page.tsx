import { getData, getPlayer, playerSlug, formatDate } from "@/lib/data";
import { StatCard, MiniBar, SectionHeader } from "@/components/StatCard";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const data = getData();
  return Object.keys(data.players).map((name) => ({ slug: playerSlug(name) }));
}

function WinLossBadge({ won }: { won: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-black shrink-0
        ${won ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
    >
      {won ? "W" : "L"}
    </span>
  );
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = getPlayer(slug);
  if (!player) notFound();
  const p = player;

  const h2hSorted = Object.entries(p.h2h)
    .map(([opp, rec]) => ({ opp, ...rec, total: rec.wins + rec.losses }))
    .sort((a, b) => b.total - a.total);

  const firstSetImpactPct =
    p.first_set_total > 0
      ? Math.round((p.first_set_win_match_win / p.first_set_total) * 100)
      : null;

  const setRatio =
    p.sets_won + p.sets_lost > 0
      ? ((p.sets_won / (p.sets_won + p.sets_lost)) * 100).toFixed(1)
      : null;

  return (
    <div>
      {/* Breadcrumb */}
      <Link
        href="/players"
        className="text-xs text-[var(--muted)] hover:text-[var(--accent)] mb-6 inline-flex items-center gap-1 transition-colors uppercase tracking-wide font-medium"
      >
        ← Players
      </Link>

      {/* Player header */}
      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 mb-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-transparent pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Player Profile</div>
            <h1 className="text-3xl font-black text-[var(--text)] mb-1">{p.name}</h1>
            <p className="text-sm text-[var(--muted)]">
              {p.tournaments_played} tournaments · {p.total_matches} matches
            </p>
          </div>
          {p.tournament_wins > 0 && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-5 py-3 text-center">
              <div className="text-2xl font-black text-yellow-400">🏆 {p.tournament_wins}</div>
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-0.5">Champion</div>
            </div>
          )}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Win Rate" value={`${p.win_rate}%`} accent sub={`${p.wins}W / ${p.losses}L`} />
        <StatCard label="Deuce Win Rate" value={p.deuce_win_rate !== null ? `${p.deuce_win_rate}%` : "–"} sub={`${p.deuce_won}/${p.deuce_total} deuce sets`} />
        <StatCard label="Comeback Rate" value={p.comeback_rate !== null ? `${p.comeback_rate}%` : "–"} sub={`${p.comeback_wins}/${p.comeback_chances} chances`} />
        <StatCard label="1st Set Impact" value={firstSetImpactPct !== null ? `${firstSetImpactPct}%` : "–"} sub="wins match after winning 1st set" />
      </div>

      {/* Sets performance */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg mb-6">
        <SectionHeader title="Sets Performance" />
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[var(--muted)] uppercase text-xs tracking-wide font-medium">Sets Won</span>
                <span className="font-bold tabular-nums text-green-400">{p.sets_won}</span>
              </div>
              <MiniBar value={p.sets_won} max={p.sets_won + p.sets_lost} color="#22c55e" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[var(--muted)] uppercase text-xs tracking-wide font-medium">Sets Lost</span>
                <span className="font-bold tabular-nums text-red-400">{p.sets_lost}</span>
              </div>
              <MiniBar value={p.sets_lost} max={p.sets_won + p.sets_lost} color="#ef4444" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-[var(--surface2)] rounded-lg p-4">
            <div className="text-3xl font-black text-[var(--accent)] tabular-nums">{setRatio ?? "–"}%</div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">Set Win Rate</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Recent form */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <SectionHeader title="Recent Form" subtitle="last 5 matches" />
          <div className="divide-y divide-[var(--border)]">
            {p.recent_5.length === 0 ? (
              <p className="px-5 py-6 text-[var(--muted)] text-sm">No data</p>
            ) : (
              p.recent_5.map((m, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <WinLossBadge won={m.won} />
                  <Link
                    href={`/players/${playerSlug(m.opponent)}`}
                    className="flex-1 text-sm hover:text-[var(--accent)] transition-colors truncate font-medium"
                  >
                    {m.opponent}
                  </Link>
                  <span className={`text-sm font-black tabular-nums shrink-0 ${m.won ? "text-green-400" : "text-red-400"}`}>
                    {m.score}
                  </span>
                  <span className="text-xs text-[var(--muted)] shrink-0">{formatDate(m.date)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* H2H */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <SectionHeader title="Head-to-Head" />
          <div className="divide-y divide-[var(--border)] max-h-72 overflow-y-auto">
            {h2hSorted.length === 0 ? (
              <p className="px-5 py-6 text-[var(--muted)] text-sm">No data</p>
            ) : (
              h2hSorted.map(({ opp, wins, losses, sets_won, sets_lost }) => (
                <div key={opp} className="px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--surface2)] transition-colors">
                  <Link
                    href={`/players/${playerSlug(opp)}`}
                    className="flex-1 text-sm hover:text-[var(--accent)] transition-colors truncate"
                  >
                    {opp}
                  </Link>
                  <div className="flex items-center gap-2 shrink-0 text-sm font-mono">
                    <span className="text-green-400 font-bold tabular-nums w-4 text-right">{wins}</span>
                    <span className="text-[var(--muted)]">–</span>
                    <span className="text-red-400 font-bold tabular-nums w-4">{losses}</span>
                    <span className="text-xs text-[var(--muted)] tabular-nums ml-1">
                      ({sets_won}:{sets_lost})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tournament history */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <SectionHeader title="Tournament History" subtitle={`${p.tournament_results.length} appearances`} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] bg-[var(--surface2)]">
                <th className="text-left px-4 py-2.5 font-medium">Date</th>
                <th className="text-center px-4 py-2.5 font-medium">Rank</th>
                <th className="text-center px-4 py-2.5 font-medium">Matches</th>
                <th className="text-center px-4 py-2.5 font-medium">Sets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {p.tournament_results.slice(0, 20).map((tr) => (
                <tr key={tr.tournament_id} className="hover:bg-[var(--surface2)] transition-colors">
                  <td className="px-4 py-2.5 text-[var(--muted)] font-mono text-xs">{formatDate(tr.date)}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`font-black text-sm ${
                      tr.rank === 1 ? "text-yellow-400"
                      : tr.rank === 2 ? "text-slate-300"
                      : tr.rank === 3 ? "text-orange-400"
                      : "text-[var(--muted)]"
                    }`}>
                      #{tr.rank}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center tabular-nums">
                    <span className="text-green-400 font-bold">{tr.matches_won}</span>
                    <span className="text-[var(--border)] mx-1">–</span>
                    <span className="text-red-400 font-bold">{tr.matches_lost}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center text-[var(--muted)] tabular-nums font-mono text-xs">
                    {tr.sets_won}:{tr.sets_lost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

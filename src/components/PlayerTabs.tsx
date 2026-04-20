"use client";

import { useState } from "react";
import Link from "next/link";
import { playerSlug, formatDate } from "@/lib/utils";
import { MiniBar, SectionHeader } from "@/components/StatCard";
import type { PlayerStats } from "@/lib/data";

const TABS = [
  { id: "athlete", label: "🏓 Athlete / Coach" },
  { id: "bettor",  label: "📊 Bettor" },
  { id: "rep",     label: "💼 Representative" },
] as const;
type TabId = typeof TABS[number]["id"];

function WinLossBadge({ won }: { won: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-black shrink-0
      ${won ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-400"}`}>
      {won ? "W" : "L"}
    </span>
  );
}

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-b-0">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <div className="text-right">
        <span className="text-sm font-bold tabular-nums text-[var(--text)]">{value}</span>
        {sub && <div className="text-xs text-[var(--muted)]">{sub}</div>}
      </div>
    </div>
  );
}

export default function PlayerTabs({ p }: { p: PlayerStats }) {
  const [tab, setTab] = useState<TabId>("athlete");

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

  // Rep stats
  const avgRank = p.tournament_results.length > 0
    ? (p.tournament_results.reduce((s, r) => s + r.rank, 0) / p.tournament_results.length).toFixed(1)
    : null;
  const top3Count = p.tournament_results.filter(r => r.rank <= 3).length;
  const top3Pct = p.tournament_results.length > 0
    ? Math.round((top3Count / p.tournament_results.length) * 100)
    : null;
  const opponentsCount = Object.keys(p.h2h).length;

  // Bettor: % matches going to 3 sets
  const totalMatchesWith3Sets = p.wins_2_1 + p.losses_1_2;
  const threeSetsPct = p.total_matches > 0
    ? Math.round((totalMatchesWith3Sets / p.total_matches) * 100)
    : 0;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
              tab === t.id
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ATHLETE / COACH ── */}
      {tab === "athlete" && (
        <div className="space-y-5">
          {/* KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Win Rate",       value: `${p.win_rate}%`,           sub: `${p.wins}W / ${p.losses}L`,                accent: true },
              { label: "Deuce Win Rate", value: p.deuce_win_rate !== null ? `${p.deuce_win_rate}%` : "–", sub: `${p.deuce_won}/${p.deuce_total} deuce sets` },
              { label: "Comeback Rate",  value: p.comeback_rate  !== null ? `${p.comeback_rate}%`  : "–", sub: `${p.comeback_wins}/${p.comeback_chances} chances` },
              { label: "1st Set Impact", value: firstSetImpactPct !== null ? `${firstSetImpactPct}%` : "–", sub: "win match after winning 1st set" },
            ].map(({ label, value, sub, accent }) => (
              <div key={label} className={`rounded-lg p-4 border ${accent ? "bg-[var(--accent)]/10 border-[var(--accent)]/40" : "bg-[var(--surface)] border-[var(--border)]"}`}>
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">{label}</div>
                <div className={`text-2xl font-black tabular-nums ${accent ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>{value}</div>
                {sub && <div className="text-xs text-[var(--muted)] mt-0.5">{sub}</div>}
              </div>
            ))}
          </div>

          {/* Clutch + Score Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
              <SectionHeader title="🎯 Clutch Rating" subtitle="Semifinals & finals vs. group stage" />
              <div className="p-5 grid grid-cols-2 gap-4">
                <div className="bg-[var(--surface2)] rounded-lg p-4 text-center">
                  <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Knockouts</div>
                  <div className={`text-3xl font-black tabular-nums ${p.clutch_rate !== null ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                    {p.clutch_rate !== null ? `${p.clutch_rate}%` : "–"}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">{p.ko_wins}W / {p.ko_losses}L</div>
                  {p.clutch_rate === null && <div className="text-[10px] text-[var(--muted)] mt-1">min. 5 matches</div>}
                </div>
                <div className="bg-[var(--surface2)] rounded-lg p-4 text-center">
                  <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Group Stage</div>
                  <div className="text-3xl font-black tabular-nums text-[var(--text)]">
                    {p.group_win_rate !== null ? `${p.group_win_rate}%` : "–"}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">{p.group_wins}W / {p.group_losses}L</div>
                </div>
                {p.clutch_rate !== null && p.group_win_rate !== null && (
                  <div className="col-span-2 text-center text-sm">
                    <span className={`font-bold ${p.clutch_rate >= p.group_win_rate ? "text-green-500" : "text-red-400"}`}>
                      {p.clutch_rate >= p.group_win_rate ? "▲" : "▼"}{" "}
                      {Math.abs(Math.round(p.clutch_rate - p.group_win_rate))}pp
                    </span>
                    <span className="text-[var(--muted)] text-xs ml-2">
                      {p.clutch_rate >= p.group_win_rate ? "better in knockouts" : "better in group stage"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
              <SectionHeader title="💥 Score Distribution" subtitle="How wins and losses are achieved" />
              <div className="p-5 space-y-3">
                {[
                  { label: "2–0 wins",   value: p.wins_2_0,   total: p.wins,   color: "#22c55e" },
                  { label: "2–1 wins",   value: p.wins_2_1,   total: p.wins,   color: "#86efac" },
                  { label: "1–2 losses", value: p.losses_1_2, total: p.losses, color: "#fca5a5" },
                  { label: "0–2 losses", value: p.losses_0_2, total: p.losses, color: "#ef4444" },
                ].map(({ label, value, total, color }) => {
                  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--muted)] font-medium">{label}</span>
                        <span className="font-bold tabular-nums" style={{ color }}>
                          {value} <span className="text-[var(--muted)] font-normal">({pct}%)</span>
                        </span>
                      </div>
                      <MiniBar value={value} max={total} color={color} />
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-[var(--border)] flex justify-between text-xs text-[var(--muted)]">
                  <span>Dominance score</span>
                  <span className="font-bold text-[var(--text)]">
                    {p.wins > 0 ? `${Math.round((p.wins_2_0 / p.wins) * 100)}%` : "–"}
                    <span className="font-normal text-[var(--muted)] ml-1">of wins are 2–0</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rival / Nemesis */}
          {(p.best_victim || p.nemesis) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {p.best_victim && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
                  <SectionHeader title="😈 Favourite Victim" subtitle="Most dominant H2H (min. 3 matches)" />
                  <div className="p-5">
                    <Link href={`/players/${playerSlug(p.best_victim.name)}`}
                      className="text-base font-black hover:text-[var(--accent)] transition-colors block mb-3">
                      {p.best_victim.name}
                    </Link>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-black text-green-500 tabular-nums">{p.best_victim.win_pct}%</div>
                      <div className="text-sm text-[var(--muted)]">
                        <span className="text-green-500 font-bold">{p.best_victim.wins}W</span> – <span className="text-red-400 font-bold">{p.best_victim.losses}L</span>
                        <div className="text-xs mt-0.5">{p.best_victim.wins + p.best_victim.losses} matches played</div>
                      </div>
                    </div>
                    <MiniBar value={p.best_victim.wins} max={p.best_victim.wins + p.best_victim.losses} color="#22c55e" />
                  </div>
                </div>
              )}
              {p.nemesis && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
                  <SectionHeader title="💀 Nemesis" subtitle="Toughest H2H opponent (min. 3 matches)" />
                  <div className="p-5">
                    <Link href={`/players/${playerSlug(p.nemesis.name)}`}
                      className="text-base font-black hover:text-[var(--accent)] transition-colors block mb-3">
                      {p.nemesis.name}
                    </Link>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-black text-red-500 tabular-nums">{p.nemesis.win_pct}%</div>
                      <div className="text-sm text-[var(--muted)]">
                        <span className="text-green-500 font-bold">{p.nemesis.wins}W</span> – <span className="text-red-400 font-bold">{p.nemesis.losses}L</span>
                        <div className="text-xs mt-0.5">{p.nemesis.wins + p.nemesis.losses} matches played</div>
                      </div>
                    </div>
                    <MiniBar value={p.nemesis.wins} max={p.nemesis.wins + p.nemesis.losses} color="#ef4444" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sets + Recent Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
              <SectionHeader title="Sets Performance" />
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[var(--muted)] uppercase tracking-wide font-medium">Sets Won</span>
                    <span className="font-bold text-green-500">{p.sets_won}</span>
                  </div>
                  <MiniBar value={p.sets_won} max={p.sets_won + p.sets_lost} color="#22c55e" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[var(--muted)] uppercase tracking-wide font-medium">Sets Lost</span>
                    <span className="font-bold text-red-400">{p.sets_lost}</span>
                  </div>
                  <MiniBar value={p.sets_lost} max={p.sets_won + p.sets_lost} color="#ef4444" />
                </div>
                <div className="flex justify-center pt-2">
                  <div className="text-center">
                    <div className="text-3xl font-black text-[var(--accent)]">{setRatio ?? "–"}%</div>
                    <div className="text-xs text-[var(--muted)] uppercase tracking-wider">Set Win Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
              <SectionHeader title="Recent Form" subtitle="last 5 matches" />
              <div className="divide-y divide-[var(--border)]">
                {p.recent_5.length === 0
                  ? <p className="px-5 py-6 text-[var(--muted)] text-sm">No data</p>
                  : p.recent_5.map((m, i) => (
                    <div key={i} className="px-4 py-3 flex items-center gap-3">
                      <WinLossBadge won={m.won} />
                      <Link href={`/players/${playerSlug(m.opponent)}`}
                        className="flex-1 text-sm hover:text-[var(--accent)] transition-colors truncate font-medium">
                        {m.opponent}
                      </Link>
                      <span className={`text-sm font-black tabular-nums shrink-0 ${m.won ? "text-green-500" : "text-red-400"}`}>
                        {m.score}
                      </span>
                      <span className="text-xs text-[var(--muted)] shrink-0">{formatDate(m.date)}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BETTOR ── */}
      {tab === "bettor" && (
        <div className="space-y-5">
          {/* Form trend hero */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5">
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-3">🔥 Form Trend</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-black tabular-nums text-[var(--accent)]">
                  {p.form_last10 !== null ? `${p.form_last10}%` : "–"}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">Last 10 matches</div>
              </div>
              <div className="text-center border-x border-[var(--border)]">
                <div className="text-3xl font-black tabular-nums text-[var(--text)]">{p.win_rate}%</div>
                <div className="text-xs text-[var(--muted)] mt-1">Career average</div>
              </div>
              <div className="text-center">
                {p.form_trend !== null ? (
                  <>
                    <div className={`text-3xl font-black tabular-nums ${p.form_trend >= 0 ? "text-green-500" : "text-red-400"}`}>
                      {p.form_trend >= 0 ? "+" : ""}{p.form_trend}pp
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">
                      {p.form_trend >= 10 ? "🔥 Hot streak" : p.form_trend >= 0 ? "↗ In form" : p.form_trend >= -10 ? "↘ Dropping" : "❄️ Cold streak"}
                    </div>
                  </>
                ) : <div className="text-3xl font-black text-[var(--muted)]">–</div>}
              </div>
            </div>
          </div>

          {/* Key betting stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
              <SectionHeader title="Key Metrics" subtitle="For match analysis" />
              <div className="px-5 py-2">
                <StatRow label="Comeback rate"      value={p.comeback_rate !== null ? `${p.comeback_rate}%` : "–"} sub={`${p.comeback_wins}/${p.comeback_chances} comebacks`} />
                <StatRow label="Deuce set win rate" value={p.deuce_win_rate !== null ? `${p.deuce_win_rate}%` : "–"} sub={`${p.deuce_total} deuce sets played`} />
                <StatRow label="1st set impact"     value={firstSetImpactPct !== null ? `${firstSetImpactPct}%` : "–"} sub="win match after winning 1st set" />
                <StatRow label="Matches to 3 sets"  value={`${threeSetsPct}%`} sub={`${totalMatchesWith3Sets} of ${p.total_matches} matches`} />
                <StatRow label="Clutch (KO stages)" value={p.clutch_rate !== null ? `${p.clutch_rate}%` : "–"} sub={`${p.ko_wins}/${p.ko_total} KO matches`} />
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
              <SectionHeader title="Result Distribution" />
              <div className="p-5 space-y-3">
                {[
                  { label: "2–0 (dominant win)",  value: p.wins_2_0,   total: p.total_matches, color: "#22c55e" },
                  { label: "2–1 (close win)",      value: p.wins_2_1,   total: p.total_matches, color: "#86efac" },
                  { label: "1–2 (close loss)",     value: p.losses_1_2, total: p.total_matches, color: "#fca5a5" },
                  { label: "0–2 (clear loss)",     value: p.losses_0_2, total: p.total_matches, color: "#ef4444" },
                ].map(({ label, value, total, color }) => {
                  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--muted)]">{label}</span>
                        <span className="font-bold tabular-nums" style={{ color }}>{pct}%</span>
                      </div>
                      <MiniBar value={value} max={total} color={color} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* H2H */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <SectionHeader title="Head-to-Head" subtitle={`${h2hSorted.length} different opponents`} />
            <div className="divide-y divide-[var(--border)] max-h-80 overflow-y-auto">
              {h2hSorted.length === 0
                ? <p className="px-5 py-6 text-[var(--muted)] text-sm">No data</p>
                : h2hSorted.map(({ opp, wins, losses, sets_won, sets_lost }) => {
                  const total = wins + losses;
                  const wpct = Math.round((wins / total) * 100);
                  return (
                    <div key={opp} className="px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--surface2)] transition-colors">
                      <Link href={`/players/${playerSlug(opp)}`}
                        className="flex-1 text-sm hover:text-[var(--accent)] transition-colors truncate">
                        {opp}
                      </Link>
                      <div className="flex items-center gap-3 shrink-0 text-sm font-mono">
                        <span className="text-green-500 font-bold w-4 text-right">{wins}</span>
                        <span className="text-[var(--muted)]">–</span>
                        <span className="text-red-400 font-bold w-4">{losses}</span>
                        <span className="text-xs text-[var(--muted)] w-16 text-right">({sets_won}:{sets_lost})</span>
                        <span className={`text-xs font-black w-10 text-right tabular-nums ${wpct >= 60 ? "text-green-500" : wpct <= 40 ? "text-red-400" : "text-[var(--muted)]"}`}>
                          {wpct}%
                        </span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}

      {/* ── REPRESENTATIVE ── */}
      {tab === "rep" && (
        <div className="space-y-5">
          {/* Value indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Win Rate",      value: `${p.win_rate}%`,           sub: `${p.wins}W / ${p.losses}L`,          accent: true },
              { label: "Titles",        value: `${p.tournament_wins}`,      sub: `of ${p.tournaments_played} tournaments` },
              { label: "Top-3 Rate",    value: top3Pct !== null ? `${top3Pct}%` : "–", sub: `${top3Count} top-3 finishes` },
              { label: "Avg. Rank",     value: avgRank ?? "–",              sub: `${opponentsCount} different opponents` },
            ].map(({ label, value, sub, accent }) => (
              <div key={label} className={`rounded-lg p-4 border ${accent ? "bg-[var(--accent)]/10 border-[var(--accent)]/40" : "bg-[var(--surface)] border-[var(--border)]"}`}>
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">{label}</div>
                <div className={`text-2xl font-black tabular-nums ${accent ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>{value}</div>
                {sub && <div className="text-xs text-[var(--muted)] mt-0.5">{sub}</div>}
              </div>
            ))}
          </div>

          {/* Value profile */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <SectionHeader title="📈 Value Profile" subtitle="Key indicators for agents & representatives" />
            <div className="px-5 py-2">
              <StatRow label="Top-3 consistency"  value={top3Pct !== null ? `${top3Pct}%` : "–"} sub={`${top3Count} top-3 in ${p.tournaments_played} tournaments`} />
              <StatRow label="KO performance"     value={p.clutch_rate !== null ? `${p.clutch_rate}%` : "–"} sub="semifinals + finals" />
              <StatRow label="Dominance index"    value={p.wins > 0 ? `${Math.round((p.wins_2_0 / p.wins) * 100)}%` : "–"} sub="of wins are 2–0 sweeps" />
              <StatRow label="Current form"       value={p.form_last10 !== null ? `${p.form_last10}%` : "–"} sub={p.form_trend !== null ? `${p.form_trend >= 0 ? "+" : ""}${p.form_trend}pp vs. career avg.` : undefined} />
              <StatRow label="Opponent range"     value={`${opponentsCount} opponents`} sub="different players faced" />
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
                  {p.tournament_results.map((tr) => (
                    <tr key={tr.tournament_id} className="hover:bg-[var(--surface2)] transition-colors">
                      <td className="px-4 py-2.5 text-[var(--muted)] font-mono text-xs">{formatDate(tr.date)}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`font-black text-sm ${
                          tr.rank === 1 ? "text-yellow-400" : tr.rank === 2 ? "text-slate-500" : tr.rank === 3 ? "text-orange-400" : "text-[var(--muted)]"
                        }`}>#{tr.rank}</span>
                      </td>
                      <td className="px-4 py-2.5 text-center tabular-nums">
                        <span className="text-green-500 font-bold">{tr.matches_won}</span>
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
      )}
    </div>
  );
}

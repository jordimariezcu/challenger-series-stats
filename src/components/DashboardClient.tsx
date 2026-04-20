"use client";

import Link from "next/link";
import { StatCard, SectionHeader } from "@/components/StatCard";
import { LeaderboardRow } from "@/components/PlayerRow";
import { useLanguage } from "@/contexts/LanguageContext";
import { playerSlug } from "@/lib/utils";
import type { PlayerStats } from "@/lib/data";

interface DashboardClientProps {
  totalTournaments: number;
  playerCount: number;
  firstSetPct: number;
  uniqueDeuceMatches: number;
  topWinners: PlayerStats[];
  bestWinRate: PlayerStats[];
  deuceKings: PlayerStats[];
  comebackKings: PlayerStats[];
  tourChamps: PlayerStats[];
}

export default function DashboardClient({
  totalTournaments,
  playerCount,
  firstSetPct,
  uniqueDeuceMatches,
  topWinners,
  bestWinRate,
  deuceKings,
  comebackKings,
  tourChamps,
}: DashboardClientProps) {
  const { t } = useLanguage();

  const insightText =
    firstSetPct >= 70
      ? t.dash_insight_a.replace("{pct}", String(firstSetPct))
      : firstSetPct >= 60
      ? t.dash_insight_b.replace("{pct}", String(firstSetPct))
      : t.dash_insight_c.replace("{pct}", String(firstSetPct));

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-end gap-4 mb-2">
          <h1 className="text-4xl font-black uppercase tracking-tight text-[var(--text)]">
            {t.dash_title}
          </h1>
          <span className="text-4xl font-black uppercase tracking-tight text-[var(--accent)]">
            {t.dash_subtitle}
          </span>
        </div>
        <p className="text-[var(--muted)] text-sm">
          {t.dash_desc} ·{" "}
          <span className="text-[var(--text)]">{totalTournaments}</span> {t.dash_tournaments.toLowerCase()} ·{" "}
          <span className="text-[var(--text)]">{playerCount}</span> {t.dash_players.toLowerCase()}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          label={t.dash_tournaments}
          value={totalTournaments}
          sub="2024 – 2026"
          icon="🗓"
        />
        <StatCard
          label={t.dash_players}
          value={playerCount}
          sub={t.dash_players_sub}
          icon="🏓"
        />
        <StatCard
          label={t.dash_1st_set}
          value={`${firstSetPct}%`}
          accent
          sub={t.dash_1st_set_sub}
          icon="🚀"
        />
        <StatCard
          label={t.dash_deuce}
          value={uniqueDeuceMatches.toLocaleString()}
          sub={t.dash_deuce_sub}
          icon="⚡"
        />
      </div>

      {/* Insight banner */}
      <div className="relative rounded-lg border border-[var(--accent)]/30 bg-[var(--surface)] p-5 mb-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
        <div className="pl-3">
          <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest mb-1.5">
            {t.dash_insight}
          </div>
          <p className="text-sm text-[var(--text)] font-medium leading-relaxed">
            {insightText}
          </p>
        </div>
      </div>

      {/* Leaderboards — 2×2 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

        {/* Most wins */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <SectionHeader
            title={t.dash_most_wins}
            right={
              <Link href="/players" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                {t.dash_all_players}
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
          <SectionHeader title={t.dash_best_rate} subtitle={t.dash_best_rate_sub} />
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
          <SectionHeader title={t.dash_deuce_kings} subtitle={t.dash_deuce_kings_sub} />
          <div className="divide-y divide-[var(--border)]">
            {deuceKings.map((p, i) => (
              <LeaderboardRow
                key={p.name}
                rank={i + 1}
                name={p.name}
                value={p.deuce_win_rate}
                sub={`${p.deuce_won}/${p.deuce_total} ${t.sub_sets_lbl}`}
              />
            ))}
          </div>
        </div>

        {/* Comeback Kings */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <SectionHeader title={t.dash_comeback} subtitle={t.dash_comeback_sub} />
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
        <SectionHeader title={t.dash_champions} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-[var(--border)]">
          {tourChamps.map((p, idx) => (
            <Link
              key={p.name}
              href={`/players/${playerSlug(p.name)}`}
              className="p-4 hover:bg-[var(--surface2)] transition-colors group text-center"
            >
              <div
                className={`text-3xl font-black tabular-nums mb-1 ${
                  idx === 0 ? "text-yellow-400" : idx === 1 ? "text-slate-500" : idx === 2 ? "text-orange-400" : "text-[var(--accent)]"
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

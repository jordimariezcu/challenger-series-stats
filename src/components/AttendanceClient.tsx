"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { playerSlug, formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PlayerStats } from "@/lib/data";

type SortKey = "tournaments_played" | "attendance_rate" | "current_streak" | "longest_streak" | "tournaments_since";

interface Props {
  players: PlayerStats[];
  totalTournaments: number;
}

export default function AttendanceClient({ players, totalTournaments }: Props) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("attendance_rate");

  const SORTS: { key: SortKey; label: string }[] = [
    { key: "attendance_rate",    label: t.att_sort_rate },
    { key: "current_streak",     label: t.att_sort_streak },
    { key: "longest_streak",     label: t.att_sort_best },
    { key: "tournaments_since",  label: t.att_sort_inactive },
  ];

  // Summary stats
  const regulars    = players.filter(p => p.attendance_rate >= 50).length;
  const onStreak    = players.filter(p => p.current_streak >= 3).length;
  const inactive    = players.filter(p => p.tournaments_since >= 5).length;
  const maxStreak   = Math.max(...players.map(p => p.longest_streak));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...players]
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === "tournaments_since") {
          return b.tournaments_since - a.tournaments_since;
        }
        return ((b[sort] as number) ?? 0) - ((a[sort] as number) ?? 0);
      });
  }, [players, search, sort]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-end gap-3 mb-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{t.att_title}</h1>
          <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--accent)]">
            {t.att_subtitle}
          </span>
        </div>
        <p className="text-[var(--muted)] text-sm">
          {t.att_desc} · <span className="text-[var(--text)]">{totalTournaments}</span> {t.att_tourneys}
        </p>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: "🏓", label: t.players_title,    value: players.length,   sub: `≥3 ${t.att_tourneys}` },
          { icon: "📅", label: t.att_sort_rate,    value: `${regulars}`,    sub: `≥50% ${t.att_col_rate.toLowerCase()}`, accent: true },
          { icon: "🔥", label: t.att_sort_streak,  value: `${onStreak}`,    sub: `≥3 ${t.att_col_streak.toLowerCase()}` },
          { icon: "💤", label: t.att_inactive_label, value: `${inactive}`,  sub: `≥5 ${t.att_col_inactive.toLowerCase()}` },
        ].map(({ icon, label, value, sub, accent }) => (
          <div key={label} className={`rounded-lg p-4 border ${accent ? "bg-[var(--accent)]/10 border-[var(--accent)]/40" : "bg-[var(--surface)] border-[var(--border)]"}`}>
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">{icon} {label}</div>
            <div className={`text-2xl font-black tabular-nums ${accent ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>{value}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm">🔍</span>
          <input
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg
                       pl-8 pr-4 py-2.5 text-sm placeholder:text-[var(--muted)]
                       focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
            placeholder={t.att_search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                sort === s.key
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)]/30"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table — columns per breakpoint:
          mobile: Name + Rate%
          sm:     + Played + Streak
          md:     + Best + Last seen + Away               */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_90px]
                        sm:grid-cols-[1fr_90px_90px_70px]
                        md:grid-cols-[1fr_90px_90px_70px_70px_100px_70px]
                        gap-2 px-4 py-2.5 text-[10px] text-[var(--muted)] uppercase tracking-widest
                        border-b border-[var(--border)] bg-[var(--surface2)]">
          <span>{t.players_title}</span>
          <span className="text-right hidden sm:block">{t.att_col_played}</span>
          <span className="text-right">{t.att_col_rate}</span>
          <span className="text-right hidden sm:block">{t.att_col_streak}</span>
          <span className="text-right hidden md:block">{t.att_col_best}</span>
          <span className="text-right hidden md:block">{t.att_col_last}</span>
          <span className="text-right hidden md:block">{t.att_col_inactive}</span>
        </div>

        {filtered.map((p, i) => {
          const isActive    = p.tournaments_since === 0;
          const isStreaking = p.current_streak >= 3;
          const isInactive  = p.tournaments_since >= 5;

          return (
            <Link
              key={p.name}
              href={`/players/${playerSlug(p.name)}`}
              className="grid grid-cols-[1fr_90px]
                         sm:grid-cols-[1fr_90px_90px_70px]
                         md:grid-cols-[1fr_90px_90px_70px_70px_100px_70px]
                         gap-2 items-center px-4 py-3 hover:bg-[var(--surface2)] transition-colors group
                         border-b border-[var(--border)] last:border-b-0"
            >
              {/* Name */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[var(--muted)] text-xs w-5 shrink-0 text-right tabular-nums">{i + 1}</span>
                <span className="truncate font-semibold text-sm group-hover:text-[var(--accent)] transition-colors">
                  {p.name}
                </span>
                {isStreaking && !isInactive && (
                  <span className="text-[10px] text-orange-400 font-bold shrink-0">🔥</span>
                )}
                {isInactive && (
                  <span className="text-[10px] text-[var(--muted)] font-bold shrink-0">💤</span>
                )}
              </div>

              {/* Played */}
              <div className="text-right hidden sm:block">
                <span className="text-sm tabular-nums text-[var(--text)]">{p.tournaments_played}</span>
                <span className="text-xs text-[var(--muted)]"> / {totalTournaments}</span>
              </div>

              {/* Attendance % with mini bar */}
              <div className="text-right">
                <span className={`text-sm font-bold tabular-nums ${
                  sort === "attendance_rate" ? "text-[var(--accent)]" :
                  p.attendance_rate >= 70 ? "text-green-500" :
                  p.attendance_rate >= 40 ? "text-[var(--text)]" : "text-[var(--muted)]"
                }`}>
                  {p.attendance_rate}%
                </span>
                <div className="mt-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] opacity-60"
                    style={{ width: `${p.attendance_rate}%` }}
                  />
                </div>
              </div>

              {/* Current streak */}
              <div className="text-right hidden sm:block">
                <span className={`text-sm font-bold tabular-nums ${
                  p.current_streak >= 5 ? "text-orange-400" :
                  p.current_streak >= 3 ? "text-yellow-500" :
                  p.current_streak >= 1 ? "text-[var(--text)]" : "text-[var(--muted)]"
                }`}>
                  {p.current_streak > 0 ? `${p.current_streak}` : "–"}
                </span>
              </div>

              {/* Best streak */}
              <div className="text-right hidden md:block">
                <span className={`text-sm tabular-nums ${
                  p.longest_streak === maxStreak ? "text-yellow-400 font-black" : "text-[var(--muted)]"
                }`}>
                  {p.longest_streak}
                </span>
              </div>

              {/* Last seen */}
              <div className="text-right hidden md:block">
                <span className={`text-xs tabular-nums ${isActive ? "text-green-500 font-bold" : "text-[var(--muted)]"}`}>
                  {isActive ? t.att_active_now : formatDate(p.last_seen)}
                </span>
              </div>

              {/* Away (tournaments since) */}
              <div className="text-right hidden md:block">
                <span className={`text-sm font-bold tabular-nums ${
                  isActive ? "text-[var(--muted)]" :
                  p.tournaments_since >= 8 ? "text-red-400" :
                  p.tournaments_since >= 5 ? "text-orange-400" : "text-[var(--muted)]"
                }`}>
                  {isActive ? "–" : `${p.tournaments_since}`}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-6 text-xs text-[var(--muted)]">
        <span>🔥 {t.att_streak_label} (≥3)</span>
        <span>💤 {t.att_inactive_label} (≥5 {t.att_col_inactive.toLowerCase()})</span>
        <span className="text-yellow-400 font-bold">★</span><span> {t.att_col_best} = record liga</span>
      </div>
    </div>
  );
}

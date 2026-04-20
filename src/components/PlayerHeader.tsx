"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PlayerStats } from "@/lib/data";

export default function PlayerHeader({ p }: { p: PlayerStats }) {
  const { t } = useLanguage();

  return (
    <>
      {/* Breadcrumb */}
      <Link
        href="/players"
        className="text-xs text-[var(--muted)] hover:text-[var(--accent)] mb-6 inline-flex items-center gap-1 transition-colors uppercase tracking-wide font-medium"
      >
        {t.back_players}
      </Link>

      {/* Player header */}
      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 mb-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-transparent pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">
              {t.profile_label}
            </div>
            <h1 className="text-3xl font-black text-[var(--text)] mb-1">{p.name}</h1>
            <p className="text-sm text-[var(--muted)]">
              {p.tournaments_played} {t.dash_tournaments.toLowerCase()} · {p.total_matches} {t.matches_played}
            </p>
            {p.form_trend !== null && (
              <div className="mt-2 inline-flex items-center gap-1.5">
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                  p.form_trend >= 10  ? "bg-green-500/15 text-green-600" :
                  p.form_trend >= 0   ? "bg-green-500/10 text-green-500" :
                  p.form_trend >= -10 ? "bg-orange-500/10 text-orange-500" :
                  "bg-red-500/10 text-red-500"
                }`}>
                  {p.form_trend >= 0 ? "▲" : "▼"} {Math.abs(p.form_trend)}pp
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {p.form_last10}% {t.profile_last10} · {p.win_rate}% {t.profile_career}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            {p.tournament_wins > 0 && (
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-5 py-3 text-center">
                <div className="text-2xl font-black text-yellow-400">🏆 {p.tournament_wins}</div>
                <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-0.5">
                  {t.profile_titles}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

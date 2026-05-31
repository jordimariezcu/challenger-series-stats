"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { playerSlug } from "@/lib/utils";
import type { PlayerStats } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

type SortKey = "wins" | "win_rate" | "deuce_win_rate" | "comeback_rate" | "tournaments_played" | "total_earnings";

export default function PlayersClient({ initialPlayers }: { initialPlayers: PlayerStats[] }) {
  const [players] = useState<PlayerStats[]>(initialPlayers);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("wins");
  const { t } = useLanguage();

  const COLS: { key: SortKey; label: string; short: string }[] = [
    { key: "wins",            label: t.sort_wins,     short: t.sort_wins },
    { key: "win_rate",        label: t.sort_win_rate, short: t.col_win_pct },
    { key: "deuce_win_rate",  label: t.sort_deuce,    short: t.col_deuce },
    { key: "comeback_rate",   label: t.sort_comeback, short: t.col_comeback },
    { key: "tournaments_played", label: t.sort_tourneys, short: t.col_tourneys },
    { key: "total_earnings",  label: t.sort_earnings, short: "€" },
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...players]
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .sort((a, b) => ((b[sort] as number) ?? -1) - ((a[sort] as number) ?? -1));
  }, [players, search, sort]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-end gap-3 mb-6">
        <h1 className="text-3xl font-black uppercase tracking-tight">{t.players_title}</h1>
        <span className="text-[var(--muted)] text-sm mb-1">
            {filtered.length} {t.players_title.toLowerCase()}
          </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm">🔍</span>
          <input
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg
                       pl-8 pr-4 py-2.5 text-sm placeholder:text-[var(--muted)]
                       focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
            placeholder={t.players_search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {COLS.map((c) => (
            <button
              key={c.key}
              onClick={() => setSort(c.key)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                sort === c.key
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)]/30"
              }`}
            >
              {c.short}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_58px]
                          sm:grid-cols-[1fr_60px_58px_68px]
                          md:grid-cols-[1fr_60px_58px_68px_72px_62px_80px]
                          gap-2 px-4 py-2.5 text-[10px] text-[var(--muted)] uppercase tracking-widest
                          border-b border-[var(--border)] bg-[var(--surface2)]">
            <span>{t.players_title}</span>
            <span className="text-right hidden sm:block">{t.col_record}</span>
            <span className="text-right">{t.col_win_pct}</span>
            <span className="text-right hidden sm:block">{t.col_deuce}</span>
            <span className="text-right hidden md:block">{t.col_comeback}</span>
            <span className="text-right hidden md:block">{t.col_tourneys}</span>
            <span className="text-right hidden md:block">{t.col_earnings}</span>
          </div>

          {filtered.map((p, i) => (
            <Link
              key={p.name}
              href={`/players/${playerSlug(p.name)}`}
              className="grid grid-cols-[1fr_58px]
                         sm:grid-cols-[1fr_60px_58px_68px]
                         md:grid-cols-[1fr_60px_58px_68px_72px_62px_80px]
                         gap-2 items-center px-4 py-3 hover:bg-[var(--surface2)] transition-colors group
                         border-b border-[var(--border)] last:border-b-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[var(--muted)] text-xs w-5 shrink-0 text-right tabular-nums">
                  {i + 1}
                </span>
                <span className="truncate font-semibold group-hover:text-[var(--accent)] transition-colors text-sm">
                  {p.name}
                </span>
                {p.tournament_wins > 0 && (
                  <span className="text-yellow-400 text-xs shrink-0 font-bold hidden sm:inline">
                    🏆{p.tournament_wins}
                  </span>
                )}
              </div>
              <span className="text-right text-xs text-[var(--muted)] tabular-nums hidden sm:block">
                {p.wins}/{p.losses}
              </span>
              <span className="text-right text-sm font-bold tabular-nums text-[var(--accent)]">
                {p.win_rate}%
              </span>
              <span className="text-right text-sm tabular-nums text-[var(--text)] hidden sm:block">
                {p.deuce_win_rate !== null ? `${p.deuce_win_rate}%` : "–"}
              </span>
              <span className="text-right text-sm tabular-nums text-[var(--text)] hidden md:block">
                {p.comeback_rate !== null ? `${p.comeback_rate}%` : "–"}
              </span>
              <span className="text-right text-sm tabular-nums text-[var(--muted)] hidden md:block">
                {p.tournaments_played}
              </span>
              <span className={`text-right text-sm font-bold tabular-nums hidden md:block ${
                sort === "total_earnings" ? "text-[var(--accent)]" : "text-[var(--text)]"
              }`}>
                €{p.total_earnings.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
    </div>
  );
}

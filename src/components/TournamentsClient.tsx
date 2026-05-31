"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { playerSlug } from "@/lib/utils";
import type { TournamentSummary } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function PlayerLink({ name }: { name: string | null }) {
  if (!name) return <span className="text-[var(--muted)]">–</span>;
  return (
    <Link
      href={`/players/${playerSlug(name)}`}
      className="hover:text-[var(--accent)] transition-colors truncate"
    >
      {name}
    </Link>
  );
}

export default function TournamentsClient({
  tournaments,
  allTimeChamp,
  allTimeTitles,
}: {
  tournaments: TournamentSummary[];
  allTimeChamp: string;
  allTimeTitles: number;
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<string>("all");

  const years = useMemo(() => {
    const s = new Set(tournaments.map((t) => t.date_start.slice(0, 4)));
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [tournaments]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tournaments.filter((t) => {
      const matchesYear = year === "all" || t.date_start.startsWith(year);
      const matchesSearch =
        !q ||
        t.winner.toLowerCase().includes(q) ||
        t.runnerUp.toLowerCase().includes(q) ||
        (t.third?.toLowerCase().includes(q) ?? false);
      return matchesYear && matchesSearch;
    });
  }, [tournaments, search, year]);

  const lastChamp = tournaments[0]; // newest first

  return (
    <div>
      {/* Header */}
      <div className="flex items-end gap-3 mb-6">
        <div>
          <div className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-widest mb-0.5">
            {t.tour_subtitle}
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">{t.tour_title}</h1>
        </div>
        <span className="text-[var(--muted)] text-sm mb-1">
          {filtered.length} / {tournaments.length}
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-1">
            {t.tour_alltime}
          </div>
          <Link
            href={`/players/${playerSlug(allTimeChamp)}`}
            className="font-black text-[var(--text)] hover:text-[var(--accent)] transition-colors text-sm sm:text-base leading-tight block"
          >
            {allTimeChamp}
          </Link>
          <div className="text-[var(--accent)] font-bold text-xs mt-1">
            🏆 {allTimeTitles} {t.tour_alltime_sub}
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-1">
            {t.tour_recent}
          </div>
          <Link
            href={`/players/${playerSlug(lastChamp.winner)}`}
            className="font-black text-[var(--text)] hover:text-[var(--accent)] transition-colors text-sm sm:text-base leading-tight block"
          >
            {lastChamp.winner}
          </Link>
          <div className="text-[var(--muted)] text-xs mt-1">
            {fmtDate(lastChamp.date_start)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm">🔍</span>
          <input
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg
                       pl-8 pr-4 py-2.5 text-sm placeholder:text-[var(--muted)]
                       focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
            placeholder={t.tour_search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...years].map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                year === y
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)]/30"
              }`}
            >
              {y === "all" ? t.tour_all : y}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[32px_80px_1fr]
                        sm:grid-cols-[36px_96px_1fr_1fr]
                        md:grid-cols-[36px_96px_1fr_1fr_1fr_72px]
                        gap-2 px-4 py-2.5 text-[10px] text-[var(--muted)] uppercase tracking-widest
                        border-b border-[var(--border)] bg-[var(--surface2)]">
          <span>{t.tour_col_no}</span>
          <span>{t.tour_col_date}</span>
          <span>{t.tour_col_winner}</span>
          <span className="hidden sm:block">{t.tour_col_runner}</span>
          <span className="hidden md:block">{t.tour_col_third}</span>
          <span className="hidden md:block text-right">{t.tour_col_prize}</span>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--muted)] text-sm">
            No tournaments found
          </div>
        )}

        {filtered.map((tour) => (
          <div
            key={tour.id}
            className="grid grid-cols-[32px_80px_1fr]
                       sm:grid-cols-[36px_96px_1fr_1fr]
                       md:grid-cols-[36px_96px_1fr_1fr_1fr_72px]
                       gap-2 items-center px-4 py-3
                       border-b border-[var(--border)] last:border-b-0
                       hover:bg-[var(--surface2)] transition-colors text-sm"
          >
            <span className="text-[var(--muted)] text-xs tabular-nums">{tour.number}</span>
            <span className="text-[var(--muted)] text-xs tabular-nums whitespace-nowrap">
              {fmtDate(tour.date_start)}
            </span>
            <span className="font-semibold text-[var(--text)] min-w-0">
              <PlayerLink name={tour.winner} />
            </span>
            <span className="hidden sm:block text-[var(--text)] min-w-0">
              <PlayerLink name={tour.runnerUp} />
            </span>
            <span className="hidden md:block text-[var(--muted)] min-w-0">
              <PlayerLink name={tour.third} />
            </span>
            <span className="hidden md:block text-right text-xs tabular-nums text-[var(--muted)]">
              {tour.winnerEarnings > 0 ? `€${tour.winnerEarnings.toLocaleString()}` : "–"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

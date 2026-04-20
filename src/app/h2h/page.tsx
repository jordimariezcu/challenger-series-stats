"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { PlayerStats } from "@/lib/data";

function playerSlug(name: string) {
  return encodeURIComponent(name);
}

export default function H2HPage() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/players")
      .then((r) => r.json())
      .then((data: PlayerStats[]) => {
        setPlayers(data.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
      });
  }, []);

  const names = useMemo(() => players.map((p) => p.name), [players]);

  const result = useMemo(() => {
    if (!p1 || !p2 || p1 === p2) return null;
    const player1 = players.find((p) => p.name === p1);
    if (!player1) return null;
    return player1.h2h[p2] ?? { wins: 0, losses: 0, sets_won: 0, sets_lost: 0 };
  }, [p1, p2, players]);

  const total = result ? result.wins + result.losses : 0;
  const p1WinPct = total > 0 ? Math.round((result!.wins / total) * 100) : 0;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-end gap-4 mb-2">
          <h1 className="text-3xl font-black uppercase tracking-tight">Head-to-Head</h1>
        </div>
        <p className="text-[var(--muted)] text-sm">
          Compare the historical record between any two players
        </p>
      </div>

      {/* Player selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_48px_1fr] gap-3 items-center mb-8">
        <PlayerSelect label="Player 1" value={p1} names={names} onChange={setP1} loading={loading} />
        <div className="text-center font-black text-[var(--accent)] text-xl">VS</div>
        <PlayerSelect label="Player 2" value={p2} names={names} onChange={setP2} loading={loading} />
      </div>

      {/* Result */}
      {result && p1 && p2 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          {total === 0 ? (
            <div className="py-14 text-center text-[var(--muted)]">
              No recorded matches between these players.
            </div>
          ) : (
            <>
              {/* Score */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 p-8 items-center">
                <div className="text-center">
                  <Link href={`/players/${playerSlug(p1)}`} className="text-base font-bold hover:text-[var(--accent)] transition-colors block mb-2">
                    {p1}
                  </Link>
                  <div className="text-6xl font-black text-[var(--accent)] tabular-nums">{result.wins}</div>
                  <div className="text-xs text-[var(--muted)] uppercase tracking-widest mt-2">wins</div>
                </div>

                <div className="text-center px-4">
                  <div className="text-xs text-[var(--muted)] uppercase tracking-widest mb-2">Sets</div>
                  <div className="text-2xl font-black font-mono tabular-nums">
                    <span className="text-[var(--accent)]">{result.sets_won}</span>
                    <span className="text-[var(--muted)]">:</span>
                    <span className="text-red-400">{result.sets_lost}</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-2">{total} matches</div>
                </div>

                <div className="text-center">
                  <Link href={`/players/${playerSlug(p2)}`} className="text-base font-bold hover:text-[var(--accent)] transition-colors block mb-2">
                    {p2}
                  </Link>
                  <div className="text-6xl font-black text-red-400 tabular-nums">{result.losses}</div>
                  <div className="text-xs text-[var(--muted)] uppercase tracking-widest mt-2">wins</div>
                </div>
              </div>

              {/* Win bar */}
              <div className="px-8 pb-6">
                <div className="h-2.5 rounded-full overflow-hidden bg-red-900/30 mb-2">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all"
                    style={{ width: `${p1WinPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span className="font-bold text-[var(--accent)]">{p1WinPct}%</span>
                  <span className="font-bold text-red-400">{100 - p1WinPct}%</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 border-t border-[var(--border)] divide-x divide-[var(--border)]">
                {[
                  { label: "Total Matches", value: total },
                  { label: "Sets Played", value: result.sets_won + result.sets_lost },
                  {
                    label: "Avg Sets/Match",
                    value: ((result.sets_won + result.sets_lost) / total).toFixed(1),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="p-5 text-center">
                    <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-2xl font-black tabular-nums">{value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!p1 && !p2 && !loading && (
        <div className="text-center py-20 text-[var(--muted)]">
          <div className="text-4xl mb-3">🏓</div>
          <p className="text-sm">Select two players to see their head-to-head record</p>
        </div>
      )}
    </div>
  );
}

function PlayerSelect({
  label,
  value,
  names,
  onChange,
  loading,
}: {
  label: string;
  value: string;
  names: string[];
  onChange: (v: string) => void;
  loading: boolean;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => names.filter((n) => n.toLowerCase().includes(search.toLowerCase())).slice(0, 20),
    [names, search]
  );

  return (
    <div className="relative">
      <div className="text-[10px] font-bold text-[var(--muted)] mb-1.5 uppercase tracking-widest">{label}</div>
      <div
        className={`bg-[var(--surface)] border rounded-lg px-4 py-3 cursor-pointer
                   flex items-center justify-between transition-colors
                   ${open ? "border-[var(--accent)] " : "border-[var(--border)] hover:border-[var(--accent)]/50"}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={value ? "text-[var(--text)] font-semibold" : "text-[var(--muted)]"}>
          {loading ? "Loading…" : value || "Select player…"}
        </span>
        <span className="text-[var(--accent)] text-xs font-bold">▾</span>
      </div>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[var(--surface2)] border border-[var(--accent)]/40 rounded-lg shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-[var(--border)]">
            <input
              autoFocus
              className="w-full bg-[var(--bg)] rounded px-3 py-2 text-sm focus:outline-none placeholder:text-[var(--muted)]"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((n) => (
              <div
                key={n}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${n === value ? "bg-[var(--accent)]/20 text-[var(--accent)] font-semibold" : "hover:bg-[var(--border)]"}`}
                onClick={() => { onChange(n); setOpen(false); setSearch(""); }}
              >
                {n}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-5 text-sm text-[var(--muted)] text-center">No players found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

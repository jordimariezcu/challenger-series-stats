"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { playerSlug, formatDate } from "@/lib/utils";
import { MiniBar } from "@/components/StatCard";
import type { PlayerStats } from "@/lib/data";

const PASSWORD = "Challenger";
const SESSION_KEY = "cs_organizer_auth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeasonRow {
  year: string;
  tournaments: number;
  totalPayout: number;
  avgPayout: number;
  uniquePlayers: number;
}

interface OrganizerProps {
  players: PlayerStats[];
  totalTournaments: number;
  totalPayout: number;
  avgPayoutPerTournament: number;
  seasons: SeasonRow[];
}

// ─── Password gate ─────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError]   = useState(false);
  const [shake, setShake]   = useState(false);

  function attempt() {
    if (value === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
      setValue("");
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className={`w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 text-center
                       transition-transform ${shake ? "animate-shake" : ""}`}>
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-[var(--accent)] flex items-center justify-center
                        font-black text-white text-xl mx-auto mb-6 shadow-lg shadow-[var(--accent)]/20">
          CS
        </div>
        <h1 className="text-xl font-black uppercase tracking-wide mb-1">Organizer Area</h1>
        <p className="text-xs text-[var(--muted)] mb-8">Challenger Series · Private Access</p>

        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && attempt()}
          placeholder="Password"
          autoFocus
          className={`w-full bg-[var(--bg)] border rounded-lg px-4 py-3 text-sm text-center
                      focus:outline-none transition-colors mb-3 tracking-widest
                      ${error
                        ? "border-red-500 placeholder:text-red-400"
                        : "border-[var(--border)] focus:border-[var(--accent)]/60 placeholder:text-[var(--muted)]"
                      }`}
        />
        {error && (
          <p className="text-xs text-red-400 mb-3">Incorrect password</p>
        )}
        <button
          onClick={attempt}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white font-bold
                     py-3 rounded-lg text-sm uppercase tracking-widest transition-colors"
        >
          Enter
        </button>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        .animate-shake { animation: shake 0.45s ease; }
      `}</style>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

function OrganizerDashboard({ players, totalTournaments, totalPayout, avgPayoutPerTournament, seasons }: OrganizerProps) {
  const active    = players.filter(p => p.tournaments_since === 0).length;
  const regulars  = players.filter(p => p.attendance_rate >= 50).length;
  const atRisk    = players.filter(p => p.tournaments_since >= 5)
                           .sort((a, b) => b.tournaments_since - a.tournaments_since)
                           .slice(0, 20);
  const loyal     = players.filter(p => p.tournaments_since <= 2)
                           .sort((a, b) => b.attendance_rate - a.attendance_rate)
                           .slice(0, 10);
  const streakers = players.filter(p => p.current_streak >= 3)
                           .sort((a, b) => b.current_streak - a.current_streak)
                           .slice(0, 10);

  const maxAttRate = Math.max(...players.map(p => p.attendance_rate));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-end gap-4 mb-2">
          <h1 className="text-3xl font-black uppercase tracking-tight">Organizer</h1>
          <span className="text-3xl font-black uppercase tracking-tight text-[var(--accent)]">Dashboard</span>
          <span className="ml-auto px-3 py-1 rounded-full bg-green-500/15 text-green-500 text-xs font-bold uppercase tracking-wide">
            🔒 Private
          </span>
        </div>
        <p className="text-[var(--muted)] text-sm">League management overview · {totalTournaments} tournaments</p>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: "💰", label: "Total Payout",       value: `€${totalPayout.toLocaleString()}`,               sub: "all time",                    accent: true },
          { icon: "📅", label: "Avg / Tournament",   value: `€${Math.round(avgPayoutPerTournament).toLocaleString()}`, sub: "per event"          },
          { icon: "🏓", label: "Active Players",     value: active,                                            sub: "played last tournament"       },
          { icon: "📊", label: "Regular Players",    value: regulars,                                          sub: "≥50% attendance rate"         },
        ].map(({ icon, label, value, sub, accent }) => (
          <div key={label} className={`rounded-lg p-4 border ${accent ? "bg-[var(--accent)]/10 border-[var(--accent)]/40" : "bg-[var(--surface)] border-[var(--border)]"}`}>
            <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">{icon} {label}</div>
            <div className={`text-2xl font-black tabular-nums ${accent ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>{value}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Season breakdown ── */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface2)]">
          <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">📆 Season Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)]">
                <th className="text-left px-5 py-2.5 font-medium">Season</th>
                <th className="text-center px-4 py-2.5 font-medium">Tournaments</th>
                <th className="text-right px-4 py-2.5 font-medium">Total Payout</th>
                <th className="text-right px-4 py-2.5 font-medium">Avg / Tournament</th>
                <th className="text-right px-5 py-2.5 font-medium">Unique Players</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {seasons.map((s) => (
                <tr key={s.year} className="hover:bg-[var(--surface2)] transition-colors">
                  <td className="px-5 py-3 font-black text-[var(--accent)]">{s.year}</td>
                  <td className="px-4 py-3 text-center tabular-nums">{s.tournaments}</td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums">€{s.totalPayout.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-[var(--muted)]">€{Math.round(s.avgPayout).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-[var(--muted)]">{s.uniquePlayers}</td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-[var(--surface2)] font-black text-sm">
                <td className="px-5 py-3 uppercase tracking-wide">Total</td>
                <td className="px-4 py-3 text-center tabular-nums">{totalTournaments}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[var(--accent)]">€{totalPayout.toLocaleString()}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[var(--muted)]">€{Math.round(avgPayoutPerTournament).toLocaleString()}</td>
                <td className="px-5 py-3 text-right tabular-nums text-[var(--muted)]">{players.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Two columns: At-risk + Loyal ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* At-risk players */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">💤 Inactive Players</h2>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">Missing ≥5 consecutive tournaments</p>
            </div>
            <span className="text-lg font-black text-orange-400">{atRisk.length}</span>
          </div>
          <div className="divide-y divide-[var(--border)] max-h-80 overflow-y-auto">
            {atRisk.map((p) => (
              <Link
                key={p.name}
                href={`/players/${playerSlug(p.name)}`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface2)] transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate group-hover:text-[var(--accent)] transition-colors">
                    {p.name}
                  </div>
                  <div className="text-xs text-[var(--muted)]">Last seen: {formatDate(p.last_seen)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-sm font-black tabular-nums ${
                    p.tournaments_since >= 20 ? "text-red-400" :
                    p.tournaments_since >= 10 ? "text-orange-400" : "text-yellow-500"
                  }`}>
                    {p.tournaments_since} away
                  </div>
                  <div className="text-xs text-[var(--muted)]">{p.attendance_rate}% att.</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Current streakers */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">🔥 Active Streaks</h2>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">Consecutive tournaments attended right now</p>
            </div>
            <span className="text-lg font-black text-orange-400">{streakers.length}</span>
          </div>
          <div className="divide-y divide-[var(--border)] max-h-80 overflow-y-auto">
            {streakers.map((p, i) => (
              <Link
                key={p.name}
                href={`/players/${playerSlug(p.name)}`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface2)] transition-colors group"
              >
                <span className={`text-xs font-bold w-5 text-right shrink-0 tabular-nums ${
                  i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-400" : "text-[var(--muted)]"
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate group-hover:text-[var(--accent)] transition-colors">
                    {p.name}
                  </div>
                  <div className="text-xs text-[var(--muted)]">Best ever: {p.longest_streak}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-black tabular-nums text-orange-400">
                    🔥 {p.current_streak}
                  </div>
                  <div className="text-xs text-[var(--muted)]">{p.attendance_rate}% att.</div>
                </div>
              </Link>
            ))}
            {streakers.length === 0 && (
              <p className="px-5 py-6 text-sm text-[var(--muted)] text-center">No active streaks</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Most loyal active players ── */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface2)]">
          <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">⭐ Most Loyal Active Players</h2>
          <p className="text-[10px] text-[var(--muted)] mt-0.5">Highest attendance rate among players active in the last 3 tournaments</p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {loyal.map((p, i) => (
            <Link
              key={p.name}
              href={`/players/${playerSlug(p.name)}`}
              className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--surface2)] transition-colors group"
            >
              <span className={`text-xs font-bold w-5 text-right shrink-0 ${
                i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-400" : "text-[var(--muted)]"
              }`}>{i + 1}</span>
              <Link
                href={`/players/${playerSlug(p.name)}`}
                className="flex-1 text-sm font-semibold truncate group-hover:text-[var(--accent)] transition-colors"
              >
                {p.name}
              </Link>
              <span className="text-xs text-[var(--muted)] shrink-0 hidden sm:block">
                {p.tournaments_played} / {totalTournaments} tournaments
              </span>
              <div className="w-32 shrink-0">
                <div className="flex justify-between items-center mb-1">
                  <div />
                  <span className="text-sm font-black tabular-nums text-[var(--accent)]">{p.attendance_rate}%</span>
                </div>
                <MiniBar value={p.attendance_rate} max={maxAttRate} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Full attendance table ── */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">📋 All Players — Attendance</h2>
            <p className="text-[10px] text-[var(--muted)] mt-0.5">Sorted by attendance rate</p>
          </div>
          <Link href="/attendance" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            Full page →
          </Link>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="text-[10px] text-[var(--muted)] uppercase tracking-widest bg-[var(--surface2)] border-b border-[var(--border)]">
                <th className="text-left px-4 py-2 font-medium">Player</th>
                <th className="text-center px-3 py-2 font-medium">Played</th>
                <th className="text-right px-3 py-2 font-medium">Att. %</th>
                <th className="text-right px-3 py-2 font-medium">Streak</th>
                <th className="text-right px-3 py-2 font-medium">Best</th>
                <th className="text-right px-4 py-2 font-medium">Away</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {[...players]
                .sort((a, b) => b.attendance_rate - a.attendance_rate)
                .map((p) => (
                  <tr key={p.name} className="hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/players/${playerSlug(p.name)}`}
                        className="font-medium hover:text-[var(--accent)] transition-colors"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-center text-[var(--muted)] tabular-nums text-xs">
                      {p.tournaments_played}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`font-bold tabular-nums text-xs ${
                        p.attendance_rate >= 60 ? "text-green-500" :
                        p.attendance_rate >= 30 ? "text-[var(--text)]" : "text-[var(--muted)]"
                      }`}>{p.attendance_rate}%</span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-xs">
                      {p.current_streak >= 3
                        ? <span className="text-orange-400 font-bold">🔥{p.current_streak}</span>
                        : <span className="text-[var(--muted)]">{p.current_streak || "–"}</span>
                      }
                    </td>
                    <td className="px-3 py-2.5 text-right text-[var(--muted)] tabular-nums text-xs">{p.longest_streak}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-xs">
                      {p.tournaments_since === 0
                        ? <span className="text-green-500 font-bold">✓</span>
                        : <span className={p.tournaments_since >= 10 ? "text-red-400 font-bold" : p.tournaments_since >= 5 ? "text-orange-400" : "text-[var(--muted)]"}>
                            {p.tournaments_since}
                          </span>
                      }
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

// ─── Root export ───────────────────────────────────────────────────────────────

export default function OrganizerClient(props: OrganizerProps) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setUnlocked(true);
  }, []);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <OrganizerDashboard {...props} />;
}

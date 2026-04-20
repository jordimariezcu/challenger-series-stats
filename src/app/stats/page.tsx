import { getAllPlayers, playerSlug } from "@/lib/data";
import Link from "next/link";
import { MiniBar, SectionHeader } from "@/components/StatCard";

export default function StatsPage() {
  const players = getAllPlayers();

  const deuceKings = [...players]
    .filter((p) => p.deuce_total >= 15)
    .sort((a, b) => (b.deuce_win_rate ?? 0) - (a.deuce_win_rate ?? 0))
    .slice(0, 15);

  const comebackKings = [...players]
    .filter((p) => p.comeback_chances >= 8)
    .sort((a, b) => (b.comeback_rate ?? 0) - (a.comeback_rate ?? 0))
    .slice(0, 15);

  const firstSetChamps = [...players]
    .filter((p) => p.first_set_total >= 20)
    .map((p) => ({
      ...p,
      first_set_pct: Math.round((p.first_set_win_match_win / p.first_set_total) * 100),
    }))
    .sort((a, b) => b.first_set_pct - a.first_set_pct)
    .slice(0, 15);

  const dominant = [...players]
    .filter((p) => p.sets_won + p.sets_lost >= 30)
    .map((p) => ({
      ...p,
      set_ratio: Math.round((p.sets_won / (p.sets_won + p.sets_lost)) * 100),
    }))
    .sort((a, b) => b.set_ratio - a.set_ratio)
    .slice(0, 15);

  const sections = [
    {
      title: "👑 Rey del Deuce — Deuce Win Rate",
      subtitle: "% of sets won after reaching 10–10. These players thrive under maximum pressure.",
      data: deuceKings.map((p) => ({
        name: p.name,
        value: p.deuce_win_rate,
        sub: `${p.deuce_won}/${p.deuce_total} deuce sets`,
      })),
    },
    {
      title: "⚡ Comeback Kings — First-Set Recovery",
      subtitle: "% of matches won after losing the first set. Never-give-up mentality in numbers.",
      data: comebackKings.map((p) => ({
        name: p.name,
        value: p.comeback_rate,
        sub: `${p.comeback_wins}/${p.comeback_chances} comebacks`,
      })),
    },
    {
      title: "🚀 First Set Dominance",
      subtitle: "% of matches won when winning the first set. If high: beat them in set 1 or face a wall.",
      data: firstSetChamps.map((p) => ({
        name: p.name,
        value: p.first_set_pct,
        sub: `${p.first_set_win_match_win}/${p.first_set_total} matches`,
      })),
    },
    {
      title: "💪 Set Dominance Index",
      subtitle: "% of individual sets won. Raw on-court control, independent of match results.",
      data: dominant.map((p) => ({
        name: p.name,
        value: p.set_ratio,
        sub: `${p.sets_won}/${p.sets_won + p.sets_lost} sets`,
      })),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-end gap-4 mb-2">
          <h1 className="text-3xl font-black uppercase tracking-tight">Advanced</h1>
          <span className="text-3xl font-black uppercase tracking-tight text-[var(--accent)]">Stats</span>
        </div>
        <p className="text-[var(--muted)] text-sm">
          Deep metrics that reveal what basic win/loss records don't show
        </p>
      </div>

      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <SectionHeader title={s.title} subtitle={s.subtitle} />
            <div className="divide-y divide-[var(--border)]">
              {s.data.map((row, i) => {
                const isTop3 = i < 3;
                return (
                  <div key={row.name} className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--surface2)] transition-colors">
                    <span
                      className={`text-xs font-bold w-5 text-right shrink-0 tabular-nums
                        ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-500" : i === 2 ? "text-orange-400" : "text-[var(--muted)]"}`}
                    >
                      {i + 1}
                    </span>
                    <Link
                      href={`/players/${playerSlug(row.name)}`}
                      className="flex-1 text-sm font-semibold hover:text-[var(--accent)] transition-colors truncate"
                    >
                      {row.name}
                    </Link>
                    <span className="text-xs text-[var(--muted)] shrink-0 hidden sm:block">{row.sub}</span>
                    <div className="w-28 shrink-0">
                      <div className="flex justify-between items-center mb-1">
                        <div />
                        <span className={`text-sm font-black tabular-nums ${isTop3 ? "text-[var(--accent)]" : "text-[var(--accent)]"}`}>
                          {row.value !== null ? `${row.value}%` : "–"}
                        </span>
                      </div>
                      <MiniBar value={row.value ?? 0} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

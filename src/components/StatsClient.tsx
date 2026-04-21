"use client";

import Link from "next/link";
import { MiniBar, SectionHeader } from "@/components/StatCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { playerSlug } from "@/lib/utils";

interface StatRow {
  name: string;
  value: number | null;
  sub: string;
  unit?: "€";
}

interface StatsClientProps {
  deuceKings:      StatRow[];
  comebackKings:   StatRow[];
  firstSetChamps:  StatRow[];
  dominant:        StatRow[];
  hotForm:         StatRow[];
  clutchPlayers:   StatRow[];
  dominanceIndex:  StatRow[];
  topEarners:      StatRow[];
}

export default function StatsClient({
  deuceKings,
  comebackKings,
  firstSetChamps,
  dominant,
  hotForm,
  clutchPlayers,
  dominanceIndex,
  topEarners,
}: StatsClientProps) {
  const { t } = useLanguage();

  const sections: { title: string; subtitle: string; data: StatRow[]; unit?: "pp" | "€" }[] = [
    { title: t.stats_s1_title, subtitle: t.stats_s1_sub, data: deuceKings },
    { title: t.stats_s2_title, subtitle: t.stats_s2_sub, data: comebackKings },
    { title: t.stats_s3_title, subtitle: t.stats_s3_sub, data: firstSetChamps },
    { title: t.stats_s4_title, subtitle: t.stats_s4_sub, data: dominant },
    { title: t.stats_s5_title, subtitle: t.stats_s5_sub, data: hotForm, unit: "pp" },
    { title: t.stats_s6_title, subtitle: t.stats_s6_sub, data: clutchPlayers },
    { title: t.stats_s7_title, subtitle: t.stats_s7_sub, data: dominanceIndex },
    { title: t.stats_s8_title, subtitle: t.stats_s8_sub, data: topEarners, unit: "€" },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-end gap-4 mb-2">
          <h1 className="text-3xl font-black uppercase tracking-tight">{t.stats_title}</h1>
          <span className="text-3xl font-black uppercase tracking-tight text-[var(--accent)]">{t.stats_subtitle}</span>
        </div>
        <p className="text-[var(--muted)] text-sm">{t.stats_desc}</p>
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
                          {row.value !== null
                            ? s.unit === "pp"
                              ? `${row.value >= 0 ? "+" : ""}${row.value}pp`
                              : s.unit === "€"
                              ? `€${row.value.toLocaleString()}`
                              : `${row.value}%`
                            : "–"}
                        </span>
                      </div>
                      <MiniBar
                        value={s.unit === "pp" ? (row.value ?? 0) + 100 : (row.value ?? 0)}
                        max={s.unit === "pp" ? 200 : s.unit === "€" ? (topEarners[0]?.value ?? 1) : 100}
                      />
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

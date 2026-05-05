"use client";

import { useState } from "react";

/* ── Types ─────────────────────────────────────────── */
interface FAQItem {
  q: string;
  a: React.ReactNode;
}

interface Section {
  id: string;
  title: string;
  items: FAQItem[];
}

/* ── Accordion item ─────────────────────────────────── */
function AccordionItem({ item, open, onToggle }: { item: FAQItem; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left
                   bg-[var(--surface)] hover:bg-[var(--surface2)] transition-colors"
      >
        <span className="font-semibold text-[var(--text)] text-sm leading-snug">{item.q}</span>
        <span className={`shrink-0 w-5 h-5 flex items-center justify-center rounded-full
                          border border-[var(--border)] text-[var(--muted)] transition-transform text-xs
                          ${open ? "rotate-45 border-[var(--accent)] text-[var(--accent)]" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="px-5 py-4 bg-[var(--surface)] border-t border-[var(--border)]
                        text-sm text-[var(--muted)] leading-relaxed space-y-2">
          {item.a}
        </div>
      )}
    </div>
  );
}

/* ── Section block ──────────────────────────────────── */
function FAQSection({ section }: { section: Section }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i);
  return (
    <div className="space-y-2">
      {section.items.map((item, i) => (
        <AccordionItem key={i} item={item} open={openIdx === i} onToggle={() => toggle(i)} />
      ))}
    </div>
  );
}

/* ── Stat pill ──────────────────────────────────────── */
function Stat({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="bg-[var(--surface2)] rounded-lg p-3 border border-[var(--border)]">
      <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-wide mb-1">{label}</div>
      <div className="text-xs text-[var(--muted)] leading-snug">{desc}</div>
    </div>
  );
}

/* ── Profile card ───────────────────────────────────── */
function ProfileCard({ icon, title, desc, stats }: { icon: string; title: string; desc: string; stats: { label: string; why: string }[] }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-black text-[var(--text)] uppercase tracking-wide text-sm">{title}</div>
          <div className="text-xs text-[var(--muted)] mt-0.5">{desc}</div>
        </div>
      </div>
      <div className="space-y-2">
        {stats.map((s, i) => (
          <div key={i} className="flex gap-2 text-xs">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5" />
            <div>
              <span className="font-semibold text-[var(--text)]">{s.label}:</span>{" "}
              <span className="text-[var(--muted)]">{s.why}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FAQ data ───────────────────────────────────────── */
const sections: Section[] = [
  {
    id: "about",
    title: "About cs-stats.com",
    items: [
      {
        q: "What is cs-stats.com?",
        a: <p>cs-stats.com is an independent statistics platform for the <strong>Challenger Series</strong>, a competitive table tennis league based in Germany. It automatically parses official tournament result PDFs and computes advanced metrics for every player — win rates, deuce performance, comeback rate, earnings and more.</p>,
      },
      {
        q: "Where does the data come from?",
        a: <p>All data is extracted from the official tournament PDFs published by Challenger Series on <a href="https://www.challengerseries.net" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">challengerseries.net</a>. The site updates automatically after each tournament weekend (Tuesday and Friday).</p>,
      },
      {
        q: "How current is the data?",
        a: <p>The data is updated automatically twice a week (Tuesday and Friday at 16:00 CEST) when new tournament PDFs are published. The timestamp in the footer shows the exact date and time of the last update.</p>,
      },
      {
        q: "Is this an official Challenger Series website?",
        a: <p>No. cs-stats.com is an independent fan project, not affiliated with Challenger Series. It was created to give players, coaches, agents and enthusiasts deeper insight into the league&apos;s data. If you are from the Challenger Series organization and would like to collaborate, feel free to connect on <a href="https://www.linkedin.com/in/jordi-mariezcurrena/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline font-medium">LinkedIn ↗</a>.</p>,
      },
    ],
  },
  {
    id: "stats",
    title: "Statistics explained",
    items: [
      {
        q: "What is Win Rate?",
        a: <>
          <p>The percentage of matches won out of all matches played. A player with 80W / 20L has a win rate of 80%.</p>
          <p className="text-xs text-[var(--muted)] italic">Minimum 20 matches required to appear in the Win Rate leaderboard.</p>
        </>,
      },
      {
        q: "What is Deuce Win Rate?",
        a: <>
          <p>The percentage of sets won after reaching <strong>10-10 (deuce)</strong>. This is one of the purest pressure indicators in table tennis — it measures how a player performs when a single point separates winning and losing a set.</p>
          <p className="text-xs text-[var(--muted)] italic">Minimum 15 deuce sets required to appear in the leaderboard.</p>
        </>,
      },
      {
        q: "What is Comeback Rate?",
        a: <>
          <p>The percentage of matches won after <strong>losing the first set</strong>. A high comeback rate indicates mental resilience and the ability to adapt and reverse a deficit mid-match.</p>
          <p className="text-xs text-[var(--muted)] italic">Minimum 8 comeback chances required to appear in the leaderboard.</p>
        </>,
      },
      {
        q: "What is First Set Impact?",
        a: <>
          <p>The percentage of matches ultimately won by players who <strong>won the first set</strong>. A high value (e.g. 85%) means that player almost always converts a first-set advantage into a match win — they are hard to beat once they start strong.</p>
          <p className="text-xs text-[var(--muted)] italic">Minimum 20 first-set wins required.</p>
        </>,
      },
      {
        q: "What is the Clutch Index?",
        a: <>
          <p>Win rate in <strong>knockout rounds</strong> (semifinals and finals) compared to the group stage. Players who raise their level in elimination matches score higher. It reveals which players perform better the higher the stakes.</p>
        </>,
      },
      {
        q: "What is the Dominance Index?",
        a: <>
          <p>The percentage of wins achieved by <strong>2-0 (without dropping a set)</strong>. A 90% dominance index means a player almost never gives a set away when they win. It reflects the margin of victory, not just the result.</p>
          <p className="text-xs text-[var(--muted)] italic">Minimum 20 wins required.</p>
        </>,
      },
      {
        q: "What is Form Trend?",
        a: <>
          <p>The difference between a player&apos;s <strong>win rate in the last 10 matches</strong> and their overall career win rate. A positive trend (+15) means the player is performing better recently than historically — useful for spotting rising or declining form.</p>
          <p className="text-xs text-[var(--muted)] italic">Minimum 10 matches required.</p>
        </>,
      },
      {
        q: "What is the Attendance Rate?",
        a: <>
          <p>The percentage of all tournaments played since a player&apos;s first appearance. An attendance rate of 90% means the player has participated in 9 out of every 10 possible tournaments — an indicator of commitment and consistency.</p>
        </>,
      },
      {
        q: "What are Total Earnings?",
        a: <>
          <p>The cumulative <strong>prize money (€)</strong> won across all tournaments. Earnings are calculated from tournament placement (1st, 2nd, 3rd/4th) based on official Challenger Series prize structure.</p>
        </>,
      },
      {
        q: "What is Head-to-Head (H2H)?",
        a: <>
          <p>The complete historical record between two specific players — total matches, wins/losses, set scores and win percentage. Access it from the <strong>H2H</strong> section and search for any two players.</p>
        </>,
      },
    ],
  },
  {
    id: "navigation",
    title: "Navigating the site",
    items: [
      {
        q: "What is the Dashboard?",
        a: <p>The home page. It shows key league totals (tournaments played, players, deuce matches) and quick leaderboards for top winners, best win rate, deuce kings, comeback kings and tournament champions.</p>,
      },
      {
        q: "What is the Players section?",
        a: <p>A searchable and sortable table of all 234 players. You can sort by wins, win rate, earnings, tournament wins, deuce performance or any other stat. Click any player to open their full profile.</p>,
      },
      {
        q: "What is a Player Profile?",
        a: <p>Each player has a dedicated page at <code className="bg-[var(--surface2)] px-1 rounded text-xs">/players/[name]</code> with their full career stats, deuce history, set-by-set breakdown, recent form, tournament history and head-to-head records against all opponents they have played.</p>,
      },
      {
        q: "What is the Advanced Stats section?",
        a: <p>Leaderboards for the metrics that go beyond wins and losses: deuce win rate, comeback rate, first set impact, clutch index, dominance index, form trend and total earnings.</p>,
      },
      {
        q: "What is the Attendance section?",
        a: <p>A ranking of players by their attendance rate — how regularly they participate in the league. It shows current and longest streaks, activity status (active / inactive) and total tournaments played.</p>,
      },
    ],
  },
];

const profiles = [
  {
    icon: "📊",
    title: "Sports Bettor",
    desc: "Data-driven edge for match and tournament predictions",
    stats: [
      { label: "Win Rate", why: "baseline strength — who wins consistently over many matches" },
      { label: "Deuce Win Rate", why: "crucial for set betting — who holds nerve at 10-10" },
      { label: "Comeback Rate", why: "for match-winner bets — is this player dangerous even when down a set?" },
      { label: "Form Trend", why: "spot hot or cold streaks before they are priced in by bookmakers" },
      { label: "H2H record", why: "some players have a psychological edge over specific opponents" },
      { label: "Clutch Index", why: "who steps up in knockout rounds vs who underperforms under pressure" },
      { label: "First Set Impact", why: "assesses how predictable the match is once the first set is decided" },
    ],
  },
  {
    icon: "🤝",
    title: "Player Agent / Representative",
    desc: "Objective metrics for talent scouting and player valuation",
    stats: [
      { label: "Total Earnings", why: "objective measure of prize-money value over a career" },
      { label: "Tournament Wins", why: "title count — the clearest indicator of elite performance" },
      { label: "Win Rate (min. 20 matches)", why: "reliable baseline after a statistically significant sample" },
      { label: "Dominance Index", why: "identifies players who win convincingly, not just narrowly — valuable for sponsorship profiles" },
      { label: "Attendance Rate", why: "commitment and availability — essential for contract planning" },
      { label: "Deuce Win Rate", why: "mental toughness under pressure — a quality hard to coach" },
      { label: "Comeback Rate", why: "resilience — reveals character beyond raw talent" },
    ],
  },
  {
    icon: "🏓",
    title: "Player / Coach",
    desc: "Self-analysis and opponent scouting tools",
    stats: [
      { label: "Personal profile", why: "full career breakdown — sets won/lost, deuce history, comeback record, all in one place" },
      { label: "First Set Impact", why: "shows how important your opening set is — if high, work on starting fast" },
      { label: "Deuce Win Rate", why: "identifies if you have a pattern of losing close sets — a key training focus" },
      { label: "Comeback Rate", why: "reveals if you mentally collapse after losing set 1 — or stay competitive" },
      { label: "H2H vs specific players", why: "pre-match scouting — see exact set scores and patterns against your next opponent" },
      { label: "Form Trend", why: "objective view of recent performance vs your own historical baseline" },
      { label: "Attendance Streak", why: "track consistency and commitment over the season" },
    ],
  },
];

/* ── Main component ─────────────────────────────────── */
export default function FAQClient() {
  const [activeSection, setActiveSection] = useState<string>("about");

  return (
    <div className="max-w-3xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text)] uppercase tracking-wide">
          FAQ &amp; Guide
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Everything you need to know about cs-stats.com and the Challenger Series statistics.
        </p>
      </div>

      {/* Stat pills overview */}
      <div>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-3">
          Quick stats reference
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Stat label="Win Rate" desc="% matches won overall" />
          <Stat label="Deuce Win Rate" desc="% sets won at 10-10" />
          <Stat label="Comeback Rate" desc="% matches won after losing set 1" />
          <Stat label="First Set Impact" desc="% wins when taking set 1" />
          <Stat label="Clutch Index" desc="KO rounds vs group stage win rate" />
          <Stat label="Dominance Index" desc="% wins by 2-0" />
          <Stat label="Form Trend" desc="Last 10 matches vs career average" />
          <Stat label="Attendance Rate" desc="% tournaments attended" />
          <Stat label="Total Earnings" desc="Career prize money (€)" />
        </div>
      </div>

      {/* User profiles */}
      <div>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-3">
          What can this site do for you?
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
          {profiles.map((p) => (
            <ProfileCard key={p.title} {...p} />
          ))}
        </div>
      </div>

      {/* Section tabs */}
      <div>
        <div className="flex gap-1 flex-wrap mb-4">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors
                ${activeSection === s.id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
            >
              {s.title}
            </button>
          ))}
        </div>
        {sections.filter((s) => s.id === activeSection).map((s) => (
          <FAQSection key={s.id} section={s} />
        ))}
      </div>

      {/* Contact */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 text-sm text-[var(--muted)]">
        <span className="font-semibold text-[var(--text)]">Missing something?</span>{" "}
        If a statistic is unclear, a player profile looks wrong, or you have a suggestion,
        connect via{" "}
        <a
          href="https://www.linkedin.com/in/jordi-mariezcurrena/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline font-medium"
        >
          LinkedIn ↗
        </a>.
      </div>

    </div>
  );
}

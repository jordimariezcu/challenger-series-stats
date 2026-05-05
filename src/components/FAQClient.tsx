"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/* ── Types ─────────────────────────────────────────── */
interface FAQItem { q: string; a: React.ReactNode }
interface Section  { id: string; title: string; items: FAQItem[] }
interface Profile  { icon: string; title: string; desc: string; stats: { label: string; why: string }[] }

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

function FAQSection({ section }: { section: Section }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {section.items.map((item, i) => (
        <AccordionItem key={i} item={item} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
      ))}
    </div>
  );
}

function Stat({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="bg-[var(--surface2)] rounded-lg p-3 border border-[var(--border)]">
      <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-wide mb-1">{label}</div>
      <div className="text-xs text-[var(--muted)] leading-snug">{desc}</div>
    </div>
  );
}

function ProfileCard({ icon, title, desc, stats }: Profile) {
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

/* ── Content by locale ──────────────────────────────── */
const LI = "https://www.linkedin.com/in/jordi-mariezcurrena/";
const LinkedInLink = () => (
  <a href={LI} target="_blank" rel="noopener noreferrer"
     className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline font-medium">
    LinkedIn ↗
  </a>
);

const content = {
  en: {
    heading: "FAQ & Guide",
    subheading: "Everything you need to know about cs-stats.com and the Challenger Series statistics.",
    statsRef: "Quick stats reference",
    profilesHeading: "What can this site do for you?",
    missing: "Missing something?",
    missingText: (
      <>If a statistic is unclear, a player profile looks wrong, or you have a suggestion, connect via <LinkedInLink />.</>
    ),
    pills: [
      { label: "Win Rate",          desc: "% matches won overall" },
      { label: "Deuce Win Rate",    desc: "% sets won at 10-10" },
      { label: "Comeback Rate",     desc: "% matches won after losing set 1" },
      { label: "First Set Impact",  desc: "% wins when taking set 1" },
      { label: "Clutch Index",      desc: "KO rounds vs group stage win rate" },
      { label: "Dominance Index",   desc: "% wins by 2-0" },
      { label: "Form Trend",        desc: "Last 10 matches vs career average" },
      { label: "Attendance Rate",   desc: "% tournaments attended" },
      { label: "Total Earnings",    desc: "Career prize money (€)" },
    ],
    profiles: [
      {
        icon: "📊", title: "Sports Bettor",
        desc: "Data-driven edge for match and tournament predictions",
        stats: [
          { label: "Win Rate",         why: "baseline strength — who wins consistently over many matches" },
          { label: "Deuce Win Rate",   why: "crucial for set betting — who holds nerve at 10-10" },
          { label: "Comeback Rate",    why: "for match-winner bets — is this player dangerous even when down a set?" },
          { label: "Form Trend",       why: "spot hot or cold streaks before they are priced in by bookmakers" },
          { label: "H2H record",       why: "some players have a psychological edge over specific opponents" },
          { label: "Clutch Index",     why: "who steps up in knockout rounds vs who underperforms under pressure" },
          { label: "First Set Impact", why: "assesses how predictable the match is once the first set is decided" },
        ],
      },
      {
        icon: "🤝", title: "Player Agent / Representative",
        desc: "Objective metrics for talent scouting and player valuation",
        stats: [
          { label: "Total Earnings",    why: "objective measure of prize-money value over a career" },
          { label: "Tournament Wins",   why: "title count — the clearest indicator of elite performance" },
          { label: "Win Rate",          why: "reliable baseline after a statistically significant sample" },
          { label: "Dominance Index",   why: "identifies players who win convincingly — valuable for sponsorship profiles" },
          { label: "Attendance Rate",   why: "commitment and availability — essential for contract planning" },
          { label: "Deuce Win Rate",    why: "mental toughness under pressure — a quality hard to coach" },
          { label: "Comeback Rate",     why: "resilience — reveals character beyond raw talent" },
        ],
      },
      {
        icon: "🏓", title: "Player / Coach",
        desc: "Self-analysis and opponent scouting tools",
        stats: [
          { label: "Personal profile",  why: "full career breakdown — sets, deuce history, comeback record in one place" },
          { label: "First Set Impact",  why: "shows how important your opening set is — if high, work on starting fast" },
          { label: "Deuce Win Rate",    why: "identifies if you lose close sets — a key training focus" },
          { label: "Comeback Rate",     why: "reveals if you mentally collapse after losing set 1 — or stay competitive" },
          { label: "H2H vs opponents",  why: "pre-match scouting — exact set scores and patterns against your next opponent" },
          { label: "Form Trend",        why: "objective view of recent performance vs your own historical baseline" },
          { label: "Attendance Streak", why: "track consistency and commitment over the season" },
        ],
      },
    ] as Profile[],
    sections: [
      {
        id: "about", title: "About cs-stats.com",
        items: [
          {
            q: "What is cs-stats.com?",
            a: <p>cs-stats.com is an independent statistics platform for the <strong>Challenger Series</strong>, a competitive table tennis league based in Germany. It automatically parses official tournament result PDFs and computes advanced metrics for every player — win rates, deuce performance, comeback rate, earnings and more.</p>,
          },
          {
            q: "Where does the data come from?",
            a: <p>All data is extracted from the official tournament PDFs published by Challenger Series on <a href="https://www.challengerseries.net" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">challengerseries.net</a>. The site updates automatically after each tournament weekend.</p>,
          },
          {
            q: "How current is the data?",
            a: <p>The data is updated automatically twice a week (Tuesday and Friday at 16:00 CEST) when new tournament PDFs are published. The timestamp in the footer shows the exact date and time of the last update.</p>,
          },
          {
            q: "Is this an official Challenger Series website?",
            a: <p>No. cs-stats.com is an independent fan project, not affiliated with Challenger Series. It was created to give players, coaches, agents and enthusiasts deeper insight into the league&apos;s data. If you are from the Challenger Series organization and would like to collaborate, feel free to connect on <LinkedInLink />.</p>,
          },
        ],
      },
      {
        id: "stats", title: "Statistics explained",
        items: [
          {
            q: "What is Win Rate?",
            a: <><p>The percentage of matches won out of all matches played. A player with 80W / 20L has a win rate of 80%.</p><p className="text-xs italic">Minimum 20 matches required to appear in the Win Rate leaderboard.</p></>,
          },
          {
            q: "What is Deuce Win Rate?",
            a: <><p>The percentage of sets won after reaching <strong>10-10 (deuce)</strong>. One of the purest pressure indicators — it measures how a player performs when a single point separates winning and losing a set.</p><p className="text-xs italic">Minimum 15 deuce sets required.</p></>,
          },
          {
            q: "What is Comeback Rate?",
            a: <><p>The percentage of matches won after <strong>losing the first set</strong>. A high comeback rate indicates mental resilience and the ability to adapt mid-match.</p><p className="text-xs italic">Minimum 8 comeback chances required.</p></>,
          },
          {
            q: "What is First Set Impact?",
            a: <><p>The percentage of matches ultimately won by players who <strong>won the first set</strong>. A high value (e.g. 85%) means that player almost always converts a first-set advantage into a match win.</p><p className="text-xs italic">Minimum 20 first-set wins required.</p></>,
          },
          {
            q: "What is the Clutch Index?",
            a: <p>Win rate in <strong>knockout rounds</strong> (semifinals and finals) compared to the group stage. Players who raise their level in elimination matches score higher.</p>,
          },
          {
            q: "What is the Dominance Index?",
            a: <><p>The percentage of wins achieved by <strong>2-0 (without dropping a set)</strong>. A 90% dominance index means a player almost never gives a set away when they win.</p><p className="text-xs italic">Minimum 20 wins required.</p></>,
          },
          {
            q: "What is Form Trend?",
            a: <><p>The difference between a player&apos;s <strong>win rate in the last 10 matches</strong> and their overall career win rate. A positive trend (+15) means the player is currently performing better than historically.</p><p className="text-xs italic">Minimum 10 matches required.</p></>,
          },
          {
            q: "What is Attendance Rate?",
            a: <p>The percentage of all tournaments played since a player&apos;s first appearance. 90% means the player has participated in 9 out of every 10 possible tournaments — an indicator of commitment.</p>,
          },
          {
            q: "What are Total Earnings?",
            a: <p>The cumulative <strong>prize money (€)</strong> won across all tournaments, calculated from placement (1st, 2nd, 3rd/4th) based on the official Challenger Series prize structure.</p>,
          },
          {
            q: "What is Head-to-Head (H2H)?",
            a: <p>The complete historical record between two specific players — total matches, wins/losses, set scores and win percentage. Access it from the <strong>H2H</strong> section and search for any two players.</p>,
          },
        ],
      },
      {
        id: "navigation", title: "Navigating the site",
        items: [
          {
            q: "What is the Dashboard?",
            a: <p>The home page. It shows key league totals and quick leaderboards for top winners, best win rate, deuce kings, comeback kings and tournament champions.</p>,
          },
          {
            q: "What is the Players section?",
            a: <p>A searchable and sortable table of all players. Sort by wins, win rate, earnings, tournament wins, deuce performance and more. Click any player to open their full profile.</p>,
          },
          {
            q: "What is a Player Profile?",
            a: <p>Each player has a dedicated page with their full career stats, deuce history, set-by-set breakdown, recent form, tournament history and H2H records against every opponent they have played.</p>,
          },
          {
            q: "What is the Advanced Stats section?",
            a: <p>Leaderboards for metrics beyond wins and losses: deuce win rate, comeback rate, first set impact, clutch index, dominance index, form trend and total earnings.</p>,
          },
          {
            q: "What is the Attendance section?",
            a: <p>A ranking of players by their attendance rate — how regularly they participate. It shows current and longest streaks, activity status and total tournaments played.</p>,
          },
        ],
      },
    ] as Section[],
  },

  de: {
    heading: "FAQ & Leitfaden",
    subheading: "Alles Wissenswerte über cs-stats.com und die Statistiken der Challenger Series.",
    statsRef: "Schnellübersicht der Kennzahlen",
    profilesHeading: "Was kann diese Seite für dich tun?",
    missing: "Etwas fehlt?",
    missingText: (
      <>Wenn eine Kennzahl unklar ist, ein Spielerprofil nicht stimmt oder du einen Vorschlag hast, melde dich via <LinkedInLink />.</>
    ),
    pills: [
      { label: "Siegquote",         desc: "% aller gewonnenen Partien" },
      { label: "Deuce-Siegquote",   desc: "% gewonnene Sätze bei Stand 10:10" },
      { label: "Comeback-Quote",    desc: "% Siege nach Verlust des 1. Satzes" },
      { label: "1. Satz Einfluss",  desc: "% Matchsiege bei Gewinn des 1. Satzes" },
      { label: "Clutch-Index",      desc: "K.O.-Runden vs. Gruppenphase" },
      { label: "Dominanz-Index",    desc: "% Siege mit 2:0" },
      { label: "Formtrend",         desc: "Letzte 10 Partien vs. Karriereschnitt" },
      { label: "Anwesenheitsrate",  desc: "% besuchter Turniere" },
      { label: "Gesamteinnahmen",   desc: "Karriere-Preisgeld (€)" },
    ],
    profiles: [
      {
        icon: "📊", title: "Sportwetter",
        desc: "Datenbasierter Vorteil bei Partien- und Turnierprognosen",
        stats: [
          { label: "Siegquote",          why: "Basisstärke — wer gewinnt konstant über viele Partien" },
          { label: "Deuce-Siegquote",    why: "entscheidend für Satz-Wetten — wer behält die Nerven bei 10:10" },
          { label: "Comeback-Quote",     why: "für Sieger-Wetten — ist dieser Spieler auch nach einem Satzverlust gefährlich?" },
          { label: "Formtrend",          why: "heiße oder kalte Phasen erkennen, bevor Buchmacher sie einpreisen" },
          { label: "H2H-Bilanz",         why: "manche Spieler haben einen psychologischen Vorteil gegen bestimmte Gegner" },
          { label: "Clutch-Index",       why: "wer steigert sich in K.O.-Runden — wer bricht unter Druck ein" },
          { label: "1. Satz Einfluss",   why: "wie vorhersehbar ist die Partie, sobald der erste Satz entschieden ist" },
        ],
      },
      {
        icon: "🤝", title: "Spieleragent / Vertreter",
        desc: "Objektive Kennzahlen für Talent-Scouting und Spielerbewertung",
        stats: [
          { label: "Gesamteinnahmen",    why: "objektiver Messwert für den Preisgeld-Wert einer Karriere" },
          { label: "Turniersiege",       why: "Titelanzahl — der klarste Indikator für Spitzenleistung" },
          { label: "Siegquote",          why: "verlässliche Basis nach ausreichend vielen Partien" },
          { label: "Dominanz-Index",     why: "zeigt Spieler, die überzeugend siegen — wichtig für Sponsoren-Profile" },
          { label: "Anwesenheitsrate",   why: "Verlässlichkeit und Verfügbarkeit — unerlässlich für Vertragsplanung" },
          { label: "Deuce-Siegquote",    why: "mentale Stärke unter Druck — schwer zu trainieren" },
          { label: "Comeback-Quote",     why: "Resilienz — zeigt Charakter jenseits von reinem Talent" },
        ],
      },
      {
        icon: "🏓", title: "Spieler / Trainer",
        desc: "Selbstanalyse und Werkzeuge zur Gegnervorbereitung",
        stats: [
          { label: "Eigenes Profil",     why: "vollständige Karriereübersicht — Sätze, Deuce, Comebacks an einem Ort" },
          { label: "1. Satz Einfluss",   why: "zeigt, wie wichtig dein Auftakt ist — wenn hoch: schnell in die Partie kommen" },
          { label: "Deuce-Siegquote",    why: "zeigt, ob du knappe Sätze regelmäßig verlierst — ein Schlüsselbereich fürs Training" },
          { label: "Comeback-Quote",     why: "zeigt, ob du nach Satzverlust mental einbrichst — oder konkurrenzfähig bleibst" },
          { label: "H2H vs. Gegner",     why: "Vorbereitung auf den nächsten Gegner — genaue Satzergebnisse und Muster" },
          { label: "Formtrend",          why: "objektiver Blick auf die aktuelle Leistung im Vergleich zum eigenen Schnitt" },
          { label: "Anwesenheitsserie",  why: "Regelmäßigkeit und Einsatz über die Saison verfolgen" },
        ],
      },
    ] as Profile[],
    sections: [
      {
        id: "about", title: "Über cs-stats.com",
        items: [
          {
            q: "Was ist cs-stats.com?",
            a: <p>cs-stats.com ist eine unabhängige Statistikplattform für die <strong>Challenger Series</strong>, eine kompetitive Tischtennis-Liga in Deutschland. Die Seite wertet automatisch offizielle Turnier-PDFs aus und berechnet erweiterte Kennzahlen für jeden Spieler — Siegquoten, Deuce-Werte, Comeback-Rate, Einnahmen und mehr.</p>,
          },
          {
            q: "Woher stammen die Daten?",
            a: <p>Alle Daten werden aus den offiziellen Turnier-PDFs der Challenger Series auf <a href="https://www.challengerseries.net" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">challengerseries.net</a> extrahiert. Die Seite aktualisiert sich automatisch nach jedem Turnierwochenende.</p>,
          },
          {
            q: "Wie aktuell sind die Daten?",
            a: <p>Die Daten werden automatisch zweimal pro Woche (dienstags und freitags um 16:00 Uhr MESZ) aktualisiert, wenn neue Turnier-PDFs veröffentlicht werden. Der Zeitstempel in der Fußzeile zeigt das genaue Datum der letzten Aktualisierung.</p>,
          },
          {
            q: "Ist dies eine offizielle Challenger Series-Website?",
            a: <p>Nein. cs-stats.com ist ein unabhängiges Fan-Projekt ohne Verbindung zur Challenger Series. Es wurde entwickelt, um Spielern, Trainern, Agenten und Fans tiefere Einblicke in die Liga-Daten zu ermöglichen. Falls du von der Challenger Series-Organisation bist und zusammenarbeiten möchtest, melde dich gerne über <LinkedInLink />.</p>,
          },
        ],
      },
      {
        id: "stats", title: "Kennzahlen erklärt",
        items: [
          {
            q: "Was ist die Siegquote?",
            a: <><p>Der Prozentsatz der gewonnenen Partien an allen gespielten Partien. Ein Spieler mit 80S / 20N hat eine Siegquote von 80 %.</p><p className="text-xs italic">Mindestens 20 Partien erforderlich für die Siegquoten-Rangliste.</p></>,
          },
          {
            q: "Was ist die Deuce-Siegquote?",
            a: <><p>Der Prozentsatz der Sätze, die nach Erreichen von <strong>10:10 (Deuce)</strong> gewonnen wurden. Eine der reinsten Druckkennzahlen — sie misst die Leistung, wenn ein einziger Punkt über Satzgewinn oder -verlust entscheidet.</p><p className="text-xs italic">Mindestens 15 Deuce-Sätze erforderlich.</p></>,
          },
          {
            q: "Was ist die Comeback-Quote?",
            a: <><p>Der Prozentsatz der Partien, die nach <strong>Verlust des ersten Satzes</strong> gewonnen wurden. Eine hohe Comeback-Quote zeigt mentale Stärke und die Fähigkeit zur Anpassung während der Partie.</p><p className="text-xs italic">Mindestens 8 Comeback-Chancen erforderlich.</p></>,
          },
          {
            q: "Was ist der 1. Satz Einfluss?",
            a: <><p>Der Prozentsatz der Partien, die letztlich von Spielern gewonnen wurden, die <strong>den ersten Satz gewonnen</strong> haben. Ein hoher Wert (z. B. 85 %) bedeutet, dass dieser Spieler einen Erstvorteil fast immer zum Matchsieg ummünzt.</p><p className="text-xs italic">Mindestens 20 gewonnene erste Sätze erforderlich.</p></>,
          },
          {
            q: "Was ist der Clutch-Index?",
            a: <p>Siegquote in <strong>K.O.-Runden</strong> (Halbfinale und Finale) im Vergleich zur Gruppenphase. Spieler, die ihre Leistung bei Entscheidungsspielen steigern, erzielen höhere Werte.</p>,
          },
          {
            q: "Was ist der Dominanz-Index?",
            a: <><p>Der Prozentsatz der Siege, die mit <strong>2:0 (ohne Satzverlust)</strong> erzielt wurden. Ein Wert von 90 % bedeutet, dass ein Spieler bei einem Sieg kaum je einen Satz abgibt.</p><p className="text-xs italic">Mindestens 20 Siege erforderlich.</p></>,
          },
          {
            q: "Was ist der Formtrend?",
            a: <><p>Die Differenz zwischen der <strong>Siegquote der letzten 10 Partien</strong> und der Karriere-Gesamtsiegquote. Ein positiver Trend (+15) bedeutet, dass der Spieler aktuell besser spielt als im historischen Durchschnitt.</p><p className="text-xs italic">Mindestens 10 Partien erforderlich.</p></>,
          },
          {
            q: "Was ist die Anwesenheitsrate?",
            a: <p>Der Prozentsatz aller Turniere, an denen ein Spieler seit seinem ersten Auftritt teilgenommen hat. 90 % bedeutet, dass der Spieler an 9 von 10 möglichen Turnieren teilgenommen hat — ein Indikator für Verlässlichkeit.</p>,
          },
          {
            q: "Was sind die Gesamteinnahmen?",
            a: <p>Das kumulierte <strong>Preisgeld (€)</strong> über alle Turniere, berechnet aus der Platzierung (1., 2., 3./4.) gemäß der offiziellen Preisgeldstruktur der Challenger Series.</p>,
          },
          {
            q: "Was ist der direkte Vergleich (H2H)?",
            a: <p>Die vollständige Bilanz zweier bestimmter Spieler gegeneinander — Partien gesamt, Siege/Niederlagen, Satzergebnisse und Siegprozentsatz. Abrufbar im Bereich <strong>H2H</strong> durch Suche nach zwei Spielern.</p>,
          },
        ],
      },
      {
        id: "navigation", title: "Auf der Seite navigieren",
        items: [
          {
            q: "Was ist das Dashboard?",
            a: <p>Die Startseite. Sie zeigt wichtige Liga-Gesamtwerte und Schnell-Ranglisten für Top-Gewinner, beste Siegquote, Deuce-Könige, Comeback-Könige und Turniersieger.</p>,
          },
          {
            q: "Was ist der Spieler-Bereich?",
            a: <p>Eine durchsuchbare und sortierbare Tabelle aller Spieler. Sortierung nach Siegen, Siegquote, Einnahmen, Turniersiegen, Deuce-Leistung und mehr. Ein Klick auf einen Spieler öffnet sein vollständiges Profil.</p>,
          },
          {
            q: "Was ist ein Spielerprofil?",
            a: <p>Jeder Spieler hat eine eigene Seite mit vollständiger Karrierestatistik, Deuce-Verlauf, Satzaufschlüsselung, aktueller Form, Turnierhistorie und H2H-Bilanzen gegen alle bisherigen Gegner.</p>,
          },
          {
            q: "Was ist der Bereich Erweiterte Statistiken?",
            a: <p>Ranglisten für Kennzahlen jenseits von Siegen und Niederlagen: Deuce-Siegquote, Comeback-Quote, 1. Satz Einfluss, Clutch-Index, Dominanz-Index, Formtrend und Gesamteinnahmen.</p>,
          },
          {
            q: "Was ist der Anwesenheits-Bereich?",
            a: <p>Eine Rangliste der Spieler nach ihrer Anwesenheitsrate — wie regelmäßig sie teilnehmen. Zeigt aktuelle und längste Serien, Aktivitätsstatus und gespielte Turniere gesamt.</p>,
          },
        ],
      },
    ] as Section[],
  },
};

/* ── Main component ─────────────────────────────────── */
export default function FAQClient() {
  const { locale } = useLanguage();
  const c = content[locale];
  const [activeSection, setActiveSection] = useState<string>("about");

  return (
    <div className="max-w-3xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text)] uppercase tracking-wide">{c.heading}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{c.subheading}</p>
      </div>

      {/* Stat pills */}
      <div>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-3">{c.statsRef}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {c.pills.map((p) => <Stat key={p.label} label={p.label} desc={p.desc} />)}
        </div>
      </div>

      {/* Profiles */}
      <div>
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-3">{c.profilesHeading}</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {c.profiles.map((p) => <ProfileCard key={p.title} {...p} />)}
        </div>
      </div>

      {/* Section tabs + accordion */}
      <div>
        <div className="flex gap-1 flex-wrap mb-4">
          {c.sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors
                ${activeSection === s.id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"}`}
            >
              {s.title}
            </button>
          ))}
        </div>
        {c.sections.filter((s) => s.id === activeSection).map((s) => (
          <FAQSection key={s.id + locale} section={s} />
        ))}
      </div>

      {/* Contact */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 text-sm text-[var(--muted)]">
        <span className="font-semibold text-[var(--text)]">{c.missing}</span>{" "}{c.missingText}
      </div>

    </div>
  );
}

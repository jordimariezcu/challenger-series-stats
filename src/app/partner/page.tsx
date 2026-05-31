import type { Metadata } from "next";
import Link from "next/link";
import { getData, getAllPlayers, getAllTournamentSummaries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Partner · Challenger Series Stats",
  robots: { index: false, follow: false }, // not for public search
};

const LINKEDIN = "https://www.linkedin.com/in/jordi-mariezcurrena/";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center bg-[var(--surface2)] rounded-xl px-6 py-5 border border-[var(--border)]">
      <span className="text-3xl font-black text-[var(--accent)] tabular-nums">{value}</span>
      <span className="text-[11px] text-[var(--muted)] uppercase tracking-widest mt-1 text-center">{label}</span>
    </div>
  );
}

function Feature({ icon, title, de, en }: { icon: string; title: string; de: string; en: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="text-2xl shrink-0 mt-0.5">{icon}</div>
      <div>
        <div className="font-bold text-[var(--text)] text-sm">{title}</div>
        <div className="text-[var(--muted)] text-xs mt-0.5">{de}</div>
        <div className="text-[var(--muted)] text-xs opacity-60">{en}</div>
      </div>
    </div>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`mb-12 ${className}`}>
      {children}
    </section>
  );
}

export default function PartnerPage() {
  const { total_tournaments } = getData();
  const players = getAllPlayers();
  const tournaments = getAllTournamentSummaries();

  const totalPayout = players.reduce((s, p) => s + p.total_earnings, 0);
  const totalMatches = Math.round(players.reduce((s, p) => s + p.wins + p.losses, 0) / 2);

  // Most titled player
  const titleCount: Record<string, number> = {};
  for (const t of tournaments) titleCount[t.winner] = (titleCount[t.winner] ?? 0) + 1;
  const topChamp = Object.entries(titleCount).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── Hero ── */}
      <Section>
        <div className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-widest mb-3">
          Partnership Proposal · Partnerschaftsangebot
        </div>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-4">
          Ihre Liga.<br />
          <span className="text-[var(--accent)]">Offiziell</span> mit Daten.
        </h1>
        <p className="text-[var(--muted)] text-base leading-relaxed">
          cs-stats.com ist die erste vollständige Statistikplattform für die Challenger Series —
          bereits aktiv, automatisch aktualisiert und von Google indexiert.
          Dieses Dokument beschreibt eine offizielle Partnerschaft.
        </p>
        <p className="text-[var(--muted)] text-sm mt-2 opacity-70">
          cs-stats.com is the first complete statistics platform for the Challenger Series —
          already live, auto-updated and indexed by Google.
        </p>
      </Section>

      {/* ── Live numbers ── */}
      <Section>
        <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-4">
          Stand heute · Current state
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat value={String(players.length)} label="Spielerprofile · Players" />
          <Stat value={String(total_tournaments)} label="Turniere · Tournaments" />
          <Stat value={totalMatches.toLocaleString()} label="Partien · Matches" />
          <Stat value={`€${Math.round(totalPayout / 1000)}k`} label="Preisgeld · Prize money" />
        </div>
        <p className="text-xs text-[var(--muted)] mt-3 opacity-60">
          Daten werden innerhalb von 24h nach jedem Turnier automatisch aktualisiert ·
          Data is updated automatically within 24h of each tournament.
        </p>
      </Section>

      {/* ── What exists today ── */}
      <Section>
        <h2 className="text-lg font-black uppercase tracking-tight mb-5">
          Was bereits existiert · What already exists
        </h2>
        <div className="grid gap-5">
          <Feature
            icon="👤"
            title="Spielerprofile / Player Profiles"
            de={`${players.length} individuelle Profile: Siegquote, Deuce-Rate, Comeback-Rate, Einnahmen, H2H, Formtrend`}
            en={`${players.length} individual profiles: win rate, deuce rate, comeback rate, earnings, H2H, form trend`}
          />
          <Feature
            icon="🏆"
            title="Turnierhistorie / Tournament History"
            de={`${tournaments.length} Turniere mit Sieger, Finalist, 3. Platz und Preisgeld — vollständig seit 2024`}
            en={`${tournaments.length} tournaments with winner, runner-up, 3rd place and prize money — complete since 2024`}
          />
          <Feature
            icon="⚔️"
            title="Head-to-Head Vergleiche / H2H"
            de="Direktvergleich zwischen beliebigen zwei Spielern mit allen historischen Partien"
            en="Head-to-head comparison between any two players with all historical matches"
          />
          <Feature
            icon="📊"
            title="Erweiterte Statistiken / Advanced Stats"
            de="Deuce-Könige, Comeback-Champions, Clutch-Wertung, Dominanz-Index, Formtrend"
            en="Deuce kings, comeback champions, clutch rating, dominance index, form trend"
          />
          <Feature
            icon="📅"
            title="Anwesenheitstracking / Attendance"
            de="Teilnahmerate, aktive Serien und Inaktivitätshistorie pro Spieler"
            en="Participation rate, active streaks and inactivity history per player"
          />
          <Feature
            icon="🔒"
            title="Veranstalter-Dashboard / Organizer Dashboard"
            de="Privates Dashboard mit Auszahlungsübersicht, Saisonaufstellung, inaktiven Spielern und Treuestatistiken"
            en="Private dashboard with payout overview, season breakdown, inactive players and loyalty stats"
          />
          <Feature
            icon="🌍"
            title="Zweisprachig / Bilingual"
            de="Vollständig auf Deutsch und Englisch — umschaltbar in Echtzeit"
            en="Fully in German and English — switchable in real time"
          />
          <Feature
            icon="🔍"
            title="Google-indexiert / Google-indexed"
            de="192 Seiten von Google indexiert. Spieler finden ihre eigenen Profile über Namenssuche"
            en="192 pages indexed by Google. Players find their own profiles via name search"
          />
        </div>
      </Section>

      {/* ── What an official partnership looks like ── */}
      <Section>
        <h2 className="text-lg font-black uppercase tracking-tight mb-2">
          Was eine offizielle Partnerschaft bedeutet
        </h2>
        <p className="text-[var(--muted)] text-sm mb-5">What an official partnership means</p>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface2)]">
            <div className="font-black text-sm uppercase tracking-wide">Challenger Series erhält · gets</div>
          </div>
          <div className="px-5 py-4 space-y-3 text-sm">
            {[
              ["✅", "Offizieller Stats-Partner-Status · Official stats partner status"],
              ["✅", "Alle aktuellen und zukünftigen Features · All current and future features"],
              ["✅", "Automatische Updates nach jedem Turnier · Auto-updates after every tournament"],
              ["✅", "Veranstalter-Dashboard (privat) · Organizer dashboard (private)"],
              ["✅", "Branding nach Wunsch · Custom branding on request"],
              ["✅", "Keine IT-Aufwände, keine Wartung · No IT overhead, no maintenance"],
            ].map(([icon, text]) => (
              <div key={text} className="flex gap-3 items-start">
                <span className="shrink-0">{icon}</span>
                <span className="text-[var(--text)]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--accent)]/20 rounded-xl overflow-hidden mt-4">
          <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--accent)]/5">
            <div className="font-black text-sm uppercase tracking-wide text-[var(--accent)]">Ich bitte um · I ask for</div>
          </div>
          <div className="px-5 py-4 space-y-3 text-sm">
            {[
              ["🔗", "Link auf challengerseries.net → cs-stats.com"],
              ["📣", "Erwähnung als offizieller Stats-Partner · Mention as official stats partner"],
              ["💶", "Monatliche Pauschale · Monthly fee: €390/Monat"],
            ].map(([icon, text]) => (
              <div key={text} className="flex gap-3 items-start">
                <span className="shrink-0">{icon}</span>
                <span className="text-[var(--text)]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--muted)] mt-3 opacity-70">
          €390/Monat entspricht weniger als 4 Stunden professioneller Webentwicklung in Deutschland —
          für eine Plattform mit hunderten Entwicklungsstunden, die bereits vollständig läuft. ·
          €390/month is less than 4 hours of professional web development in Germany —
          for a platform with hundreds of development hours, already fully operational.
        </p>
      </Section>

      {/* ── Champion callout ── */}
      <Section>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2">
            Beispiel · Example
          </div>
          <p className="text-sm text-[var(--text)] leading-relaxed">
            <strong>{topChamp[0]}</strong> ist mit {topChamp[1]} Titeln der erfolgreichste Spieler der Liga.
            Sein Profil ist bereits auf Google indexiert, zeigt seinen vollständigen Karriereverlauf
            und verlinkt auf alle seine Turnierauftritte.{" "}
            <Link
              href={`/players/${topChamp[0].toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="text-[var(--accent)] hover:underline"
            >
              Profil ansehen →
            </Link>
          </p>
          <p className="text-xs text-[var(--muted)] mt-2 opacity-70">
            {topChamp[0]} is the most successful player with {topChamp[1]} titles.
            His profile is already indexed on Google and shows his complete career history.
          </p>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <h2 className="text-lg font-black uppercase tracking-tight mb-2">Kontakt · Contact</h2>
        <p className="text-[var(--muted)] text-sm mb-5">
          Ich beantworte gerne alle Fragen und passe das Angebot nach Bedarf an. ·
          Happy to answer any questions and adapt the proposal as needed.
        </p>
        <a
          href={LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[var(--accent)] text-white
                     font-bold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          LinkedIn: Jordi Mariezcurrena →
        </a>
        <p className="text-xs text-[var(--muted)] mt-4 opacity-60">
          cs-stats.com ist ein unabhängiges Projekt, nicht mit Challenger Series affiliiert. ·
          cs-stats.com is an independent project, not affiliated with Challenger Series.
        </p>
      </Section>

    </div>
  );
}

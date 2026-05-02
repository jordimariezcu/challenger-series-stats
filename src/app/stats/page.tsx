import type { Metadata } from "next";
import { getAllPlayers, playerSlug } from "@/lib/data";
import StatsClient from "@/components/StatsClient";

const BASE_URL = "https://cs-stats.com";

export const metadata: Metadata = {
  title: "Advanced Stats",
  description:
    "Deep statistical leaderboards: deuce win rate, comeback rate, first-set impact, clutch performance in knockouts, dominance index and top earners.",
  alternates: { canonical: `${BASE_URL}/stats` },
  openGraph: {
    title: "Challenger Series — Advanced Statistics",
    description: "Deep leaderboards: deuce win rate, comeback rate, clutch performance, dominance index and earnings.",
    url: `${BASE_URL}/stats`,
  },
  twitter: { card: "summary_large_image" },
};

export default function StatsPage() {
  const players = getAllPlayers();

  const deuceKings = [...players]
    .filter((p) => p.deuce_total >= 15)
    .sort((a, b) => (b.deuce_win_rate ?? 0) - (a.deuce_win_rate ?? 0))
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.deuce_win_rate,
      sub: `${p.deuce_won}/${p.deuce_total}`,
    }));

  const comebackKings = [...players]
    .filter((p) => p.comeback_chances >= 8)
    .sort((a, b) => (b.comeback_rate ?? 0) - (a.comeback_rate ?? 0))
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.comeback_rate,
      sub: `${p.comeback_wins}/${p.comeback_chances}`,
    }));

  const firstSetChamps = [...players]
    .filter((p) => p.first_set_total >= 20)
    .map((p) => ({
      name: p.name,
      value: Math.round((p.first_set_win_match_win / p.first_set_total) * 100),
      sub: `${p.first_set_win_match_win}/${p.first_set_total}`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  const dominant = [...players]
    .filter((p) => p.sets_won + p.sets_lost >= 30)
    .map((p) => ({
      name: p.name,
      value: Math.round((p.sets_won / (p.sets_won + p.sets_lost)) * 100),
      sub: `${p.sets_won}/${p.sets_won + p.sets_lost}`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  const hotForm = [...players]
    .filter((p) => p.form_trend !== null && p.total_matches >= 10)
    .sort((a, b) => (b.form_trend ?? 0) - (a.form_trend ?? 0))
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.form_trend,
      sub: `${p.form_last10}% / ${p.win_rate}%`,
    }));

  const clutchPlayers = [...players]
    .filter((p) => p.clutch_rate !== null)
    .sort((a, b) => (b.clutch_rate ?? 0) - (a.clutch_rate ?? 0))
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.clutch_rate,
      sub: `${p.ko_wins}/${p.ko_total}`,
    }));

  const dominanceIndex = [...players]
    .filter((p) => p.wins >= 20)
    .map((p) => ({
      name: p.name,
      value: Math.round((p.wins_2_0 / p.wins) * 100),
      sub: `${p.wins_2_0}/${p.wins}`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  const topEarners = [...players]
    .filter((p) => p.tournaments_played >= 3)
    .sort((a, b) => b.total_earnings - a.total_earnings)
    .slice(0, 15)
    .map((p) => ({
      name: p.name,
      value: p.total_earnings,
      sub: `${p.tournaments_played} tournaments`,
      unit: "€" as const,
    }));

  const makeList = (name: string, items: { name: string; value: number | null }[], unit = "") =>
    items.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: p.name,
      url: `${BASE_URL}/players/${playerSlug(p.name)}`,
      description: `${p.value ?? 0}${unit}`,
    }));

  const statsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Challenger Series Advanced Statistics",
    url: `${BASE_URL}/stats`,
    description: "Advanced statistical leaderboards for the Challenger Series table tennis league.",
    mainEntity: [
      { "@type": "ItemList", name: "Deuce Kings — Deuce Win Rate",    itemListElement: makeList("Deuce Kings", deuceKings, "%") },
      { "@type": "ItemList", name: "Comeback Kings — Comeback Rate",  itemListElement: makeList("Comeback Kings", comebackKings, "%") },
      { "@type": "ItemList", name: "First Set Dominance",             itemListElement: makeList("First Set", firstSetChamps, "%") },
      { "@type": "ItemList", name: "Clutch Performers",               itemListElement: makeList("Clutch", clutchPlayers, "%") },
      { "@type": "ItemList", name: "Dominance Index",                 itemListElement: makeList("Dominance", dominanceIndex, "%") },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Deuce Win Rate in table tennis?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Percentage of sets won after reaching 10-10 (deuce). Measures a player's ability to perform under maximum pressure in deciding moments.",
        },
      },
      {
        "@type": "Question",
        name: "What is Comeback Rate in table tennis?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Percentage of matches won after losing the first set. Indicates a player's mental resilience and ability to reverse a losing situation.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Clutch Index in Challenger Series stats?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Win rate in knockout rounds (elimination phase) compared to group stage. Players who raise their game in high-stakes matches score higher.",
        },
      },
      {
        "@type": "Question",
        name: "What is First Set Impact?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Percentage of matches won by players who also won the first set. High values indicate players who start strong and hold the advantage.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(statsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <StatsClient
        deuceKings={deuceKings}
        comebackKings={comebackKings}
        firstSetChamps={firstSetChamps}
        dominant={dominant}
        hotForm={hotForm}
        clutchPlayers={clutchPlayers}
        dominanceIndex={dominanceIndex}
        topEarners={topEarners}
      />
    </>
  );
}

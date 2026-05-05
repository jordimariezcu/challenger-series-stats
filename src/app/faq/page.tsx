import type { Metadata } from "next";
import FAQClient from "@/components/FAQClient";

const BASE_URL = "https://cs-stats.com";

export const metadata: Metadata = {
  title: "FAQ & Guide",
  description:
    "Complete guide to cs-stats.com: all statistics explained (win rate, deuce win rate, comeback rate, clutch index) plus tailored guides for bettors, player agents and athletes.",
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: "Challenger Series Stats — FAQ & Guide",
    description: "All statistics explained plus tailored guides for bettors, player agents and athletes/coaches.",
    url: `${BASE_URL}/faq`,
    images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Challenger Series Stats — Table Tennis Statistics" }],
  },
  twitter: { card: "summary_large_image", images: [`${BASE_URL}/opengraph-image`] },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is cs-stats.com?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "cs-stats.com is an independent statistics platform for the Challenger Series, a competitive table tennis league based in Germany. It automatically parses official tournament result PDFs and computes advanced metrics for every player.",
      },
    },
    {
      "@type": "Question",
      name: "What is Deuce Win Rate in table tennis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The percentage of sets won after reaching 10-10 (deuce). It measures how a player performs when a single point separates winning and losing a set — one of the purest pressure indicators in table tennis.",
      },
    },
    {
      "@type": "Question",
      name: "What is Comeback Rate in table tennis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The percentage of matches won after losing the first set. A high comeback rate indicates mental resilience and the ability to adapt and reverse a deficit mid-match.",
      },
    },
    {
      "@type": "Question",
      name: "What is First Set Impact?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The percentage of matches ultimately won by players who won the first set. A high value means that player almost always converts a first-set advantage into a match win.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Clutch Index?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Win rate in knockout rounds (semifinals and finals) compared to the group stage. Players who raise their level in elimination matches score higher.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Dominance Index?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The percentage of wins achieved by 2-0 (without dropping a set). A high dominance index reflects that a player wins convincingly, not just narrowly.",
      },
    },
    {
      "@type": "Question",
      name: "What is Form Trend?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The difference between a player's win rate in the last 10 matches and their overall career win rate. A positive trend means the player is currently performing better than their historical average.",
      },
    },
    {
      "@type": "Question",
      name: "How is the data on cs-stats.com updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Data is updated automatically twice a week (Tuesday and Friday at 16:00 CEST) when new tournament PDFs are published on the official Challenger Series website.",
      },
    },
    {
      "@type": "Question",
      name: "What statistics are most useful for sports bettors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For bettors, the most relevant metrics are: Win Rate (baseline strength), Deuce Win Rate (pressure performance for set betting), Comeback Rate (match-winner bets), Form Trend (current hot or cold streaks), H2H record (psychological edges), and Clutch Index (knockout round performance).",
      },
    },
    {
      "@type": "Question",
      name: "What statistics are most useful for player agents and scouts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For player agents and scouts, the most relevant metrics are: Total Earnings, Tournament Wins, Win Rate, Dominance Index, Attendance Rate, Deuce Win Rate and Comeback Rate — together they provide a complete objective picture of a player's value and character.",
      },
    },
    {
      "@type": "Question",
      name: "What statistics are most useful for players and coaches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For players and coaches: the full player profile (sets, deuce, comebacks), First Set Impact (start strategy), H2H records vs specific opponents (pre-match scouting), Form Trend (current level), and Attendance Streak (season commitment).",
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQClient />
    </>
  );
}

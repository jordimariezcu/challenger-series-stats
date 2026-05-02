import type { Metadata } from "next";
import H2HClient from "@/components/H2HClient";

const BASE_URL = "https://cs-stats.com";

export const metadata: Metadata = {
  title: "Head to Head",
  description:
    "Compare any two Challenger Series players head-to-head. Full match record, set scores and win percentage.",
  alternates: { canonical: `${BASE_URL}/h2h` },
  openGraph: {
    title: "Challenger Series — Head to Head",
    description: "Compare any two players: full match record, set scores, win percentage and rivalry history.",
    url: `${BASE_URL}/h2h`,
  },
  twitter: { card: "summary_large_image" },
};

const h2hJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Challenger Series H2H Comparison",
  url: `${BASE_URL}/h2h`,
  description: "Head-to-head match statistics between any two Challenger Series table tennis players",
  applicationCategory: "SportsApplication",
  inLanguage: ["en", "de"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/h2h?p1={player1}&p2={player2}`,
    },
    "query-input": "required name=player1 required name=player2",
  },
};

export default function H2HPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(h2hJsonLd) }}
      />
      <H2HClient />
    </>
  );
}

import type { Metadata } from "next";
import { getData, getAllPlayers, playerSlug } from "@/lib/data";
import AttendanceClient from "@/components/AttendanceClient";

const BASE_URL = "https://cs-stats.com";

export const metadata: Metadata = {
  title: "Attendance",
  description:
    "Player attendance records for the Challenger Series. Current streaks, longest streaks, activity status and tournament participation rates.",
  alternates: { canonical: `${BASE_URL}/attendance` },
  openGraph: {
    title: "Challenger Series — Player Attendance",
    description: "Attendance records, current streaks, longest streaks and tournament participation rates for all 233 players.",
    url: `${BASE_URL}/attendance`,
    images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Challenger Series Stats — Table Tennis Statistics" }],
  },
  twitter: { card: "summary_large_image", images: [`${BASE_URL}/opengraph-image`] },
};

export default function AttendancePage() {
  const data = getData();
  const players = getAllPlayers();

  const top50 = [...players]
    .sort((a, b) => (b.attendance_rate ?? 0) - (a.attendance_rate ?? 0))
    .slice(0, 50);

  const attendanceJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Challenger Series Player Attendance",
    url: `${BASE_URL}/attendance`,
    description: "Player participation loyalty and attendance records across all Challenger Series tournaments.",
    mainEntity: {
      "@type": "ItemList",
      name: "Attendance Leaders",
      numberOfItems: players.length,
      itemListElement: top50.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: p.name,
        url: `${BASE_URL}/players/${playerSlug(p.name)}`,
        description: `${p.attendance_rate ?? 0}% attendance rate`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attendanceJsonLd) }}
      />
      <AttendanceClient
        players={players}
        totalTournaments={data.total_tournaments}
      />
    </>
  );
}

import type { Metadata } from "next";
import PlayersClient from "@/components/PlayersClient";

export const metadata: Metadata = {
  title: "Players",
  description:
    "All active Challenger Series players ranked by wins, win rate, deuce performance, comeback rate and earnings. 233 players, 145 tournaments.",
};

export default function PlayersPage() {
  return <PlayersClient />;
}

import type { Metadata } from "next";
import { getData, getAllPlayers } from "@/lib/data";
import AttendanceClient from "@/components/AttendanceClient";

export const metadata: Metadata = {
  title: "Attendance",
  description:
    "Player attendance records for the Challenger Series. Current streaks, longest streaks, activity status and tournament participation rates.",
};

export default function AttendancePage() {
  const data = getData();
  const players = getAllPlayers();

  return (
    <AttendanceClient
      players={players}
      totalTournaments={data.total_tournaments}
    />
  );
}

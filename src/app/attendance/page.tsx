import { getData, getAllPlayers } from "@/lib/data";
import AttendanceClient from "@/components/AttendanceClient";

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

import { NextResponse } from "next/server";
import { getAllPlayers } from "@/lib/data";

export async function GET() {
  const players = getAllPlayers().sort((a, b) => b.wins - a.wins);
  return NextResponse.json(players);
}

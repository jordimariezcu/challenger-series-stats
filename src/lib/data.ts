import fs from "fs";
import path from "path";
import { playerSlug } from "./utils";
export { playerSlug, formatDate } from "./utils";

export interface SetScore {
  0: number;
  1: number;
}

export interface Match {
  player1: string;
  player2: string;
  sets: [number, number][];
  p1_sets: number;
  p2_sets: number;
  phase: "round_robin" | "semifinal" | "third_place" | "final";
}

export interface TournamentPlayer {
  rank: number;
  name: string;
  matches_won: number;
  matches_lost: number;
  sets_won: number;
  sets_lost: number;
  match_diff: number;
  set_diff: number;
}

export interface Tournament {
  id: string;
  filename: string;
  date_start: string | null;
  date_end: string | null;
  players: TournamentPlayer[];
  matches: Match[];
}

export interface H2HRecord {
  wins: number;
  losses: number;
  sets_won: number;
  sets_lost: number;
}

export interface RecentMatch {
  date: string;
  opponent: string;
  won: boolean;
  score: string;
  tournament_id: string;
}

export interface TournamentResult {
  tournament_id: string;
  date: string;
  rank: number;
  matches_won: number;
  matches_lost: number;
  sets_won: number;
  sets_lost: number;
}

export interface PlayerStats {
  name: string;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  sets_won: number;
  sets_lost: number;
  deuce_won: number;
  deuce_total: number;
  deuce_win_rate: number | null;
  first_set_total: number;
  first_set_win_match_win: number;
  comeback_chances: number;
  comeback_wins: number;
  comeback_rate: number | null;
  tournament_wins: number;
  tournaments_played: number;
  h2h: Record<string, H2HRecord>;
  recent_5: RecentMatch[];
  tournament_results: TournamentResult[];
}

export interface DataFile {
  generated_at: string;
  total_tournaments: number;
  total_players: number;
  tournaments: Tournament[];
  players: Record<string, PlayerStats>;
}

let _cache: DataFile | null = null;

export function getData(): DataFile {
  if (_cache) return _cache;
  const filePath = path.join(process.cwd(), "data", "tournaments.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  _cache = JSON.parse(raw) as DataFile;
  return _cache;
}

export function getAllPlayers(): PlayerStats[] {
  const data = getData();
  return Object.values(data.players).filter((p) => p.total_matches >= 3);
}

export function getPlayer(slug: string): PlayerStats | null {
  const data = getData();
  for (const [name, player] of Object.entries(data.players)) {
    if (playerSlug(name) === slug) return player;
  }
  return null;
}

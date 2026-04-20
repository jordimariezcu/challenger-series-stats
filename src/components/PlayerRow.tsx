import Link from "next/link";
import { playerSlug } from "@/lib/utils";

interface LeaderboardRowProps {
  name: string;
  value: number | null;
  sub?: string;
  rank: number;
}

export function LeaderboardRow({ name, value, sub, rank }: LeaderboardRowProps) {
  const isTop3 = rank <= 3;
  const rankColors = ["text-yellow-400", "text-slate-500", "text-orange-400"];

  return (
    <Link
      href={`/players/${playerSlug(name)}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface2)] transition-colors group"
    >
      <span
        className={`text-xs font-bold w-5 text-right shrink-0 tabular-nums
          ${isTop3 ? rankColors[rank - 1] : "text-[var(--muted)]"}`}
      >
        {rank}
      </span>
      <span className="flex-1 text-sm font-medium truncate group-hover:text-[var(--accent)] transition-colors">
        {name}
      </span>
      {sub && (
        <span className="text-xs text-[var(--muted)] shrink-0 hidden sm:block">{sub}</span>
      )}
      <span className="text-sm font-bold font-mono tabular-nums text-[var(--accent)] shrink-0">
        {value !== null ? `${value}%` : "–"}
      </span>
    </Link>
  );
}

import { ImageResponse } from "next/og";
import { getPlayer } from "@/lib/data";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = getPlayer(slug);

  const name = player?.name ?? "Player";
  const wins = player?.wins ?? 0;
  const losses = player?.losses ?? 0;
  const winRate = player?.win_rate ?? 0;
  const tourWins = player?.tournament_wins ?? 0;
  const earnings = player?.total_earnings ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0f1117",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #e53e3e, #e53e3e88)",
          }}
        />

        {/* CS badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#e53e3e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              color: "white",
            }}
          >
            CS
          </div>
          <span style={{ color: "#888", fontSize: 16, letterSpacing: "3px", textTransform: "uppercase" }}>
            Challenger Series Stats
          </span>
        </div>

        {/* Player name */}
        <div
          style={{
            fontSize: name.length > 22 ? 52 : 66,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1.05,
            marginBottom: 12,
          }}
        >
          {name}
        </div>

        {/* Record */}
        <div
          style={{
            fontSize: 28,
            color: "#888",
            marginBottom: 48,
            fontWeight: 400,
          }}
        >
          <span style={{ color: "#4ade80" }}>{wins}W</span>
          {" / "}
          <span style={{ color: "#f87171" }}>{losses}L</span>
          {"  ·  "}
          <span style={{ color: "#e53e3e", fontWeight: 700 }}>{winRate}%</span>
          {" win rate"}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Tournament wins", value: tourWins.toString() },
            { label: "Total earnings", value: `€${earnings.toLocaleString("de-DE")}` },
            { label: "Win rate", value: `${winRate}%` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#1a1d27",
                borderRadius: 12,
                padding: "14px 28px",
                border: "1px solid #2a2d3a",
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>
                {value}
              </span>
              <span style={{ fontSize: 13, color: "#666", marginTop: 4, letterSpacing: "1px", textTransform: "uppercase" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* URL bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 80,
            fontSize: 18,
            color: "#444",
            letterSpacing: "1px",
          }}
        >
          cs-stats.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

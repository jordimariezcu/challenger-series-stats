import { ImageResponse } from "next/og";
import { getData, getAllPlayers } from "@/lib/data";

export const runtime = "nodejs";
export const alt = "Challenger Series Stats — Table Tennis Statistics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const { total_tournaments } = getData();
  const players = getAllPlayers();
  const totalMatches = players.reduce((sum, p) => sum + p.wins + p.losses, 0) / 2;

  const stats = [
    { label: "Players",     value: String(players.length) },
    { label: "Tournaments", value: String(total_tournaments) },
    { label: "Matches",     value: `${Math.round(totalMatches / 100) * 100}+` },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0f1117",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
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

        {/* Logo badge */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            background: "#e53e3e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-1px",
            marginBottom: 28,
          }}
        >
          CS
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          Challenger Series
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#e53e3e",
            letterSpacing: "8px",
            textTransform: "uppercase",
            marginTop: 8,
            marginBottom: 40,
          }}
        >
          Statistics
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 48,
            marginTop: 8,
          }}
        >
          {stats.map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#1a1d27",
                borderRadius: 12,
                padding: "16px 32px",
                border: "1px solid #2a2d3a",
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>
                {value}
              </span>
              <span style={{ fontSize: 14, color: "#888", marginTop: 4, letterSpacing: "2px", textTransform: "uppercase" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 18,
            color: "#555",
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

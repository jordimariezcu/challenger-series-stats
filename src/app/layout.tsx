import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Challenger Series – Stats",
  description: "Advanced table tennis statistics for the Challenger Series",
};

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/players", label: "Players" },
  { href: "/stats", label: "Advanced" },
  { href: "/h2h", label: "H2H" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Top accent line */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-transparent" />

        <header className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded bg-[var(--accent)] flex items-center justify-center font-black text-white text-sm shrink-0">
                CS
              </div>
              <div className="leading-none">
                <div className="font-black text-[var(--text)] tracking-wide uppercase text-sm">
                  Challenger Series
                </div>
                <div className="text-[10px] text-[var(--muted)] tracking-widest uppercase">
                  Statistics
                </div>
              </div>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 rounded text-sm font-medium text-[var(--muted)]
                             hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors uppercase tracking-wide"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-6">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[var(--accent)] flex items-center justify-center font-black text-white text-[9px]">CS</div>
              <span>Challenger Series · Table Tennis · Germany</span>
            </div>
            <a
              href="https://www.challengerseries.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              challengerseries.net ↗
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NavClient, FooterClient } from "@/components/NavClient";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const BASE_URL = "https://challenger-series-stats.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Challenger Series Stats",
    template: "%s · Challenger Series Stats",
  },
  description:
    "Advanced table tennis statistics for the Challenger Series league in Germany. Player profiles, earnings, head-to-head records, attendance data and more.",
  keywords: [
    "table tennis", "Tischtennis", "Challenger Series", "Germany",
    "statistics", "ping pong", "player stats", "Tischtennis Liga",
  ],
  authors: [{ name: "Challenger Series", url: "https://www.challengerseries.net" }],
  openGraph: {
    type: "website",
    siteName: "Challenger Series Stats",
    locale: "en_US",
    url: BASE_URL,
    title: "Challenger Series Stats",
    description:
      "Advanced table tennis statistics for the Challenger Series league in Germany.",
  },
  twitter: {
    card: "summary",
    title: "Challenger Series Stats",
    description: "Advanced table tennis statistics for the Challenger Series.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "Challenger Series",
  sport: "Table Tennis",
  url: "https://www.challengerseries.net",
  description: "Competitive table tennis league in Germany",
  location: { "@type": "Place", addressCountry: "DE" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
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

              {/* Nav + language toggle */}
              <NavClient />
            </div>
          </header>

          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
            {children}
          </main>

          <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-6">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-xs text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[var(--accent)] flex items-center justify-center font-black text-white text-[9px]">CS</div>
                <FooterClient />
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
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NavClient, FooterClient } from "@/components/NavClient";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getData } from "@/lib/data";

const BASE_URL = "https://cs-stats.com";

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
    "Tischtennisliga", "Tischtennis Statistik",
  ],
  authors: [{ name: "cs-stats.com", url: BASE_URL }],
  openGraph: {
    type: "website",
    siteName: "Challenger Series Stats",
    locale: "en_US",
    url: BASE_URL,
    title: "Challenger Series Stats",
    description:
      "Advanced table tennis statistics for the Challenger Series league in Germany. Players, H2H, earnings, attendance and more.",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Challenger Series Stats — Table Tennis Statistics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Challenger Series Stats",
    description: "Advanced table tennis statistics for the Challenger Series league.",
    images: [`${BASE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en": BASE_URL,
      "de": BASE_URL,
      "x-default": BASE_URL,
    },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "Challenger Series",
  sport: "Table Tennis",
  url: "https://www.challengerseries.net",
  description: "Competitive table tennis league based in Germany",
  location: { "@type": "Place", addressCountry: "DE", name: "Germany" },
  sameAs: ["https://www.challengerseries.net"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Challenger Series Stats",
  url: BASE_URL,
  description: "Advanced statistics platform for the Challenger Series table tennis league in Germany.",
  inLanguage: ["en", "de"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/players?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  const dd = d.getDate().toString().padStart(2, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { generated_at } = getData();
  const updatedAt = formatUpdated(generated_at);

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
            <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[var(--accent)] flex items-center justify-center font-black text-white text-[9px]">CS</div>
                <FooterClient />
              </div>
              <span
                title="Last time results were parsed from PDFs"
                className="tabular-nums opacity-60"
              >
                ↻ {updatedAt}
              </span>
              <a
                href="https://www.challengerseries.net"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                challengerseries.net ↗
              </a>
            </div>
            <div className="max-w-6xl mx-auto px-4 mt-3 text-center text-[10px] text-[var(--muted)] opacity-50">
              Independent fan project · not affiliated with Challenger Series ·{" "}
              <a
                href="mailto:jordi.mariezcurrena@gmail.com"
                className="hover:text-[var(--accent)] hover:opacity-100 transition-colors"
              >
                open to official collaboration
              </a>
            </div>
          </footer>
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Umami Analytics (privacy-friendly, no cookies) */}
        <script
          defer
          src="https://umami-production-c3fa.up.railway.app/script.js"
          data-website-id="51114115-bdcb-4e2b-a8bd-543782bc4fed"
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

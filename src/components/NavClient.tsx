"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function NavClient() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/",           label: t.nav_dashboard },
    { href: "/players",    label: t.nav_players },
    { href: "/stats",      label: t.nav_advanced },
    { href: "/h2h",        label: t.nav_h2h },
    { href: "/attendance", label: t.nav_attendance },
  ];

  const LangBtn = () => (
    <button
      onClick={() => setLocale(locale === "en" ? "de" : "en")}
      className="px-2.5 py-1.5 rounded text-xs font-bold border border-[var(--border)]
                 text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)]/50
                 transition-colors uppercase tracking-wide shrink-0"
      title={locale === "en" ? "Auf Deutsch wechseln" : "Switch to English"}
    >
      {locale === "en" ? "🇩🇪 DE" : "🇬🇧 EN"}
    </button>
  );

  return (
    <>
      {/* ── Desktop nav (md+) ── */}
      <nav className="hidden md:flex items-center gap-1">
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
        <div className="ml-2"><LangBtn /></div>
      </nav>

      {/* ── Mobile: lang toggle + hamburger ── */}
      <div className="flex items-center gap-2 md:hidden">
        <LangBtn />
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors"
          aria-label="Menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] shadow-lg md:hidden">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-5 py-3.5 text-sm font-medium text-[var(--muted)]
                           hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors
                           uppercase tracking-wide border-b border-[var(--border)] last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export function FooterClient() {
  const { t } = useLanguage();
  return <span>{t.footer_league}</span>;
}

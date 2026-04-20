"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function NavClient() {
  const { locale, setLocale, t } = useLanguage();

  const navLinks = [
    { href: "/",        label: t.nav_dashboard },
    { href: "/players", label: t.nav_players },
    { href: "/stats",   label: t.nav_advanced },
    { href: "/h2h",     label: t.nav_h2h },
  ];

  return (
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
      <button
        onClick={() => setLocale(locale === "en" ? "de" : "en")}
        className="ml-2 px-2.5 py-1.5 rounded text-xs font-bold border border-[var(--border)]
                   text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)]/50
                   transition-colors uppercase tracking-wide"
        title={locale === "en" ? "Auf Deutsch wechseln" : "Switch to English"}
      >
        {locale === "en" ? "🇩🇪 DE" : "🇬🇧 EN"}
      </button>
    </nav>
  );
}

export function FooterClient() {
  const { t } = useLanguage();
  return <span>{t.footer_league}</span>;
}

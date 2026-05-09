import Link from 'next/link'

const NAV = [
  { href: '/subvenciones', label: 'Buscador' },
  { href: '/estadisticas', label: 'Estadísticas' },
  { href: '/sobre', label: 'Sobre el proyecto' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white font-bold text-lg select-none">
              🏅
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-brand-900">SubvencionsEsport</span>
              <span className="block text-[10px] font-medium text-slate-500 -mt-0.5 leading-none">
                Dades BDNS · Tota Espanya
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/subvenciones"
            className="btn-primary shrink-0 text-sm"
          >
            <span className="hidden sm:inline">Cercar subvencions</span>
            <span className="sm:hidden">Cercar</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

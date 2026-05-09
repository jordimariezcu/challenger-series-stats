import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white text-base">🏅</div>
              <span className="font-bold text-brand-900">SubvencionsEsport</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Buscador de subvencions i ajuts públics de l&apos;àmbit esportiu a Espanya. Dades de la BDNS (IGAE).
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Navegació</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-brand-700 transition-colors">Inici</Link></li>
              <li><Link href="/subvenciones" className="hover:text-brand-700 transition-colors">Buscador</Link></li>
              <li><Link href="/estadisticas" className="hover:text-brand-700 transition-colors">Estadístiques</Link></li>
              <li><Link href="/sobre" className="hover:text-brand-700 transition-colors">Sobre el projecte</Link></li>
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Font de dades</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="https://www.pap.hacienda.gob.es/bdnstrans/GE/es/index" target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 transition-colors">
                  BDNS – Base de Datos Nacional de Subvenciones ↗
                </a>
              </li>
              <li>
                <a href="https://www.pap.hacienda.gob.es/bdnstrans/GE/es/descargas" target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 transition-colors">
                  Documentació API IGAE ↗
                </a>
              </li>
              <li className="text-xs text-slate-400 pt-1">
                Filtre: Política de Gasto 336 (Esport) · Persones Jurídiques
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {year} SubvencionsEsport. Dades públiques BDNS/IGAE.</p>
          <p>Actualitzat: {new Date().toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </footer>
  )
}

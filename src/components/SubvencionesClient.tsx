'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Subvencio, NivellAdmin, EstatSubvencio } from '@/lib/types'
import SubvencioCard from './SubvencioCard'
import Pagination from './Pagination'

const NIVELLS: { value: NivellAdmin | ''; label: string }[] = [
  { value: '', label: 'Tots els nivells' },
  { value: 'estatal', label: 'Estatal (CSD, Ministeris)' },
  { value: 'autonomic', label: 'Autonòmica (CCAA)' },
  { value: 'provincial', label: 'Provincial (Diputació)' },
  { value: 'local', label: 'Local (Ajuntament)' },
]

const ESTATS: { value: EstatSubvencio | ''; label: string }[] = [
  { value: '', label: 'Tots els estats' },
  { value: 'convocatoria', label: 'Convocatòria oberta' },
  { value: 'concessio', label: 'Concessió atorgada' },
]

const ORDRES = [
  { value: 'data_desc', label: 'Més recents' },
  { value: 'import_desc', label: 'Major import' },
  { value: 'import_asc', label: 'Menor import' },
  { value: 'data_asc', label: 'Més antics' },
]

interface Props {
  initialResultats: Subvencio[]
  initialTotal: number
  initialPagina: number
  initialTamany: number
}

export default function SubvencionesClient({
  initialResultats,
  initialTotal,
  initialPagina,
  initialTamany,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [cerca, setCerca] = useState(searchParams.get('cerca') ?? '')
  const [nivell, setNivell] = useState<NivellAdmin | ''>(
    (searchParams.get('nivell') as NivellAdmin) ?? '',
  )
  const [estat, setEstat] = useState<EstatSubvencio | ''>(
    (searchParams.get('estat') as EstatSubvencio) ?? '',
  )
  const [ordre, setOrdre] = useState(searchParams.get('ordre') ?? 'data_desc')
  const [pagina, setPagina] = useState(initialPagina)

  const resultats = initialResultats
  const total = initialTotal

  const buildUrl = useCallback(
    (overrides: Record<string, string | number>) => {
      const params = new URLSearchParams()
      const all = { cerca, nivell, estat, ordre, pagina, ...overrides }
      if (all.cerca) params.set('cerca', String(all.cerca))
      if (all.nivell) params.set('nivell', String(all.nivell))
      if (all.estat) params.set('estat', String(all.estat))
      if (all.ordre && all.ordre !== 'data_desc') params.set('ordre', String(all.ordre))
      if (all.pagina && Number(all.pagina) > 0) params.set('pagina', String(all.pagina))
      return `/subvenciones?${params.toString()}`
    },
    [cerca, nivell, estat, ordre, pagina],
  )

  const applyFilters = (overrides: Record<string, string | number> = {}) => {
    router.push(buildUrl({ ...overrides, pagina: 0 }))
    setPagina(0)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar filters */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="card p-4 space-y-5">
          <h2 className="text-sm font-semibold text-slate-900">Filtres</h2>

          {/* Search */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Cerca per text</label>
            <div className="relative">
              <input
                type="search"
                value={cerca}
                onChange={(e) => setCerca(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyFilters({ cerca })
                }}
                placeholder="Federació, esport, municipi…"
                className="input pr-9"
              />
              <button
                onClick={() => applyFilters({ cerca })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-700"
                aria-label="Cercar"
              >
                🔍
              </button>
            </div>
          </div>

          {/* Nivell */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Nivell administratiu</label>
            <select
              value={nivell}
              onChange={(e) => {
                setNivell(e.target.value as NivellAdmin | '')
                applyFilters({ nivell: e.target.value })
              }}
              className="input"
            >
              {NIVELLS.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>

          {/* Estat */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Estat de la subvenció</label>
            <select
              value={estat}
              onChange={(e) => {
                setEstat(e.target.value as EstatSubvencio | '')
                applyFilters({ estat: e.target.value })
              }}
              className="input"
            >
              {ESTATS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          {/* Reset */}
          {(cerca || nivell || estat) && (
            <button
              onClick={() => {
                setCerca('')
                setNivell('')
                setEstat('')
                router.push('/subvenciones')
              }}
              className="w-full text-sm text-slate-500 hover:text-brand-700 transition-colors text-center py-1"
            >
              ✕ Netejar filtres
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{total.toLocaleString('es-ES')}</span> subvencions trobades
          </p>
          <select
            value={ordre}
            onChange={(e) => {
              setOrdre(e.target.value)
              applyFilters({ ordre: e.target.value })
            }}
            className="input w-auto text-sm"
          >
            {ORDRES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        {resultats.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-slate-900 mb-1">Cap resultat</p>
            <p className="text-sm text-slate-500">Prova amb altres paraules clau o elimina els filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resultats.map((s) => (
              <SubvencioCard key={s.id} subvencio={s} />
            ))}
          </div>
        )}

        <Pagination
          pagina={pagina}
          total={total}
          tamany={initialTamany}
          onChange={(p) => {
            setPagina(p)
            router.push(buildUrl({ pagina: p }))
          }}
        />
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getSubvencions } from '@/lib/bdns'
import type { FiltresSubvencions, NivellAdmin, EstatSubvencio } from '@/lib/types'
import SubvencionesClient from '@/components/SubvencionesClient'

export const revalidate = 3600

interface SearchParams {
  cerca?: string
  nivell?: string
  estat?: string
  ordre?: string
  pagina?: string
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const sp = await searchParams
  const parts = ['Buscador de subvencions esportives']
  if (sp.cerca) parts.push(`"${sp.cerca}"`)
  if (sp.nivell) parts.push(sp.nivell)
  return {
    title: parts.join(' · '),
    description: 'Cerca subvencions i ajuts públics esportius a tota Espanya. Filtra per nivell administratiu, estat i import. Dades BDNS/IGAE.',
    robots: sp.cerca || sp.nivell ? { index: false } : { index: true },
  }
}

export default async function SubvencionesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const filtres: FiltresSubvencions = {
    cerca: sp.cerca,
    nivell: sp.nivell as NivellAdmin | undefined,
    estat: sp.estat as EstatSubvencio | undefined,
    ordre: (sp.ordre as FiltresSubvencions['ordre']) ?? 'data_desc',
    pagina: sp.pagina ? Number(sp.pagina) : 0,
  }

  const { resultats, total, pagina, tamany } = await getSubvencions(filtres)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Buscador de subvencions esportives</h1>
        <p className="text-slate-500 mt-1.5">
          Subvencions i ajuts per a clubs, federacions i entitats esportives — tota Espanya · BDNS cod. 336
        </p>
      </div>

      <Suspense fallback={<div className="text-slate-500 text-sm">Carregant…</div>}>
        <SubvencionesClient
          initialResultats={resultats}
          initialTotal={total}
          initialPagina={pagina}
          initialTamany={tamany}
        />
      </Suspense>
    </div>
  )
}

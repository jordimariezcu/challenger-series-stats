import Link from 'next/link'
import type { Metadata } from 'next'
import { getSubvencions, getEstadistiques } from '@/lib/bdns'
import SubvencioCard from '@/components/SubvencioCard'
import StatsCard from '@/components/StatsCard'
import { formatImport } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Subvencions esportives a Espanya · Buscador BDNS',
  description:
    'Troba totes les subvencions i ajuts públics de l\'àmbit esportiu a Espanya: CSD, CCAA, diputacions i ajuntaments. Dades oficials BDNS/IGAE.',
}

export default async function HomePage() {
  const [dadesInici, estadistiques] = await Promise.all([
    getSubvencions({ ordre: 'data_desc' }),
    getEstadistiques(),
  ])
  const ultimes = dadesInici.resultats.slice(0, 6)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-200 mb-6 backdrop-blur-sm border border-white/10">
              <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Dades actualitzades · BDNS / IGAE España
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Totes les subvencions{' '}
              <span className="text-blue-300">esportives</span>{' '}
              d&apos;Espanya
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xl leading-relaxed">
              Cerca ajuts públics per a clubs, federacions i entitats esportives.
              Dades de la Base de Datos Nacional de Subvenciones (BDNS) filtrades
              pel codi funcional <strong className="text-white">336 — Foment i suport de l&apos;esport</strong>.
            </p>

            {/* Search bar */}
            <form action="/subvenciones" method="GET" className="flex gap-2 max-w-lg">
              <input
                type="search"
                name="cerca"
                placeholder="Cerca per organisme, esport, municipi…"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-blue-300 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                autoComplete="off"
              />
              <button type="submit" className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-blue-50">
                Cercar
              </button>
            </form>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['Estatal', 'Autonòmica', 'Provincial', 'Local'].map((nivell, i) => {
                const vals = ['estatal', 'autonomic', 'provincial', 'local']
                return (
                  <Link
                    key={nivell}
                    href={`/subvenciones?nivell=${vals[i]}`}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-blue-200 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    {nivell}
                  </Link>
                )
              })}
              <Link
                href="/subvenciones?estat=convocatoria"
                className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-400/20"
              >
                ✓ Convocatòries obertes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatsCard
              label="Convocatòries actives"
              value={String(estadistiques.totalConvocatories)}
              icon="📢"
              color="emerald"
            />
            <StatsCard
              label="Concessions atorgades"
              value={String(estadistiques.totalConcesssions)}
              icon="✅"
              color="blue"
            />
            <StatsCard
              label="Import total"
              value={formatImport(estadistiques.importTotal)}
              sublabel="En les dades disponibles"
              icon="💰"
              color="sky"
            />
            <StatsCard
              label="Import mig"
              value={formatImport(estadistiques.importMig)}
              sublabel="Per subvenció"
              icon="📊"
              color="violet"
            />
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Últimes subvencions</h2>
            <p className="text-sm text-slate-500 mt-0.5">Les més recents publicades a la BDNS</p>
          </div>
          <Link href="/subvenciones" className="btn-secondary text-sm hidden sm:inline-flex">
            Veure totes →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ultimes.map((s) => (
            <SubvencioCard key={s.id} subvencio={s} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/subvenciones" className="btn-secondary">Veure totes les subvencions →</Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-center mb-3">Com funciona?</h2>
          <p className="text-blue-200 text-center text-sm mb-10 max-w-lg mx-auto">
            Agrupem les dades de totes les administracions públiques d&apos;Espanya en un únic cercador.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: '🏛️', title: 'Font oficial', body: 'Tots els ajuts provenen de la BDNS (IGAE), la base de dades oficial on totes les administracions publiquen per llei les seves convocatòries.' },
              { icon: '⚙️', title: 'Filtrat automàtic', body: 'Apliquem el codi funcional 336 (Foment i suport de l\'esport) per mostrar únicament subvencions esportives: clubs, federacions i entitats.' },
              { icon: '🔔', title: 'Cobertura total', body: 'Inclou CSD, CCAA, diputacions i ajuntaments. Des del Consell Superior d\'Esports fins a petits municipis de tot Espanya.' },
            ].map((s) => (
              <div key={s.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-blue-200 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top orgs */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Organismes més actius</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {estadistiques.organismesMesActius.map((org) => (
            <Link
              key={org.nom}
              href={`/subvenciones?cerca=${encodeURIComponent(org.nom)}`}
              className="card-hover flex items-center justify-between p-4"
            >
              <span className="text-sm font-medium text-slate-700 line-clamp-1 mr-3">{org.nom}</span>
              <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                {org.total} sub.
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

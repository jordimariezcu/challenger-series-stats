import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSubvencio, getSubvencions } from '@/lib/bdns'
import { formatImport, formatData, labelNivell, colorNivell, labelEstat, colorEstat, bdnsUrl } from '@/lib/utils'
import NivellBadge from '@/components/NivellBadge'
import SubvencioCard from '@/components/SubvencioCard'

export const revalidate = 3600

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const s = await getSubvencio(id)
  if (!s) return { title: 'Subvenció no trobada' }
  return {
    title: s.titol,
    description: s.descripcio ?? `Subvenció esportiva de ${s.organisme}. Import: ${formatImport(s.import)}.`,
    openGraph: {
      title: s.titol,
      description: s.descripcio ?? undefined,
      type: 'article',
    },
  }
}

export default async function SubvencioPage({ params }: Props) {
  const { id } = await params
  const [subvencio, relacionades] = await Promise.all([
    getSubvencio(id),
    getSubvencions({ ordre: 'data_desc' }),
  ])

  if (!subvencio) notFound()

  const altres = relacionades.resultats
    .filter((s) => s.id !== id && s.nivell === subvencio.nivell)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Grant',
    name: subvencio.titol,
    description: subvencio.descripcio,
    funder: { '@type': 'Organization', name: subvencio.organisme },
    amount: subvencio.import ? { '@type': 'MonetaryAmount', currency: 'EUR', value: subvencio.import } : undefined,
    startDate: subvencio.dataPublicacio,
    endDate: subvencio.dataFi ?? undefined,
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-700 transition-colors">Inici</Link>
        <span>/</span>
        <Link href="/subvenciones" className="hover:text-brand-700 transition-colors">Subvencions</Link>
        <span>/</span>
        <span className="text-slate-700 truncate max-w-xs">{subvencio.numBDNS}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <NivellBadge nivell={subvencio.nivell} size="md" />
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${colorEstat(subvencio.estat)}`}>
                {labelEstat(subvencio.estat)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight">
              {subvencio.titol}
            </h1>
            <p className="text-lg text-slate-500">{subvencio.organisme}</p>
          </div>

          {/* Description */}
          {subvencio.descripcio && (
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Descripció</h2>
              <p className="text-slate-600 leading-relaxed">{subvencio.descripcio}</p>
            </div>
          )}

          {/* Beneficiaries */}
          {subvencio.tipusBeneficiari.length > 0 && (
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Tipus de beneficiari</h2>
              <div className="flex flex-wrap gap-2">
                {subvencio.tipusBeneficiari.map((t) => (
                  <span key={t} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 border border-brand-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {subvencio.url && (
              <a
                href={subvencio.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Veure convocatòria oficial ↗
              </a>
            )}
            <a
              href={bdnsUrl(subvencio.numBDNS)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Veure a la BDNS ↗
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Key data */}
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Dades clau</h2>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Import</p>
                <p className="text-xl font-bold text-brand-700">{formatImport(subvencio.import)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Data de publicació</p>
                <p className="text-sm font-medium text-slate-900">{formatData(subvencio.dataPublicacio)}</p>
              </div>
              {subvencio.dataFi && (
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Data límit</p>
                  <p className="text-sm font-medium text-slate-900">{formatData(subvencio.dataFi)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Àmbit territorial</p>
                <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colorNivell(subvencio.nivell)}`}>
                  {labelNivell(subvencio.nivell)}
                </div>
              </div>
              {(subvencio.comunitat || subvencio.provincia) && (
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Localització</p>
                  <p className="text-sm font-medium text-slate-900">
                    {[subvencio.provincia, subvencio.comunitat].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Núm. BDNS</p>
                <p className="font-mono text-sm text-slate-700">{subvencio.numBDNS}</p>
              </div>
            </div>
          </div>

          {/* Policy code */}
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
            <p className="text-xs font-semibold text-brand-800 mb-1">Política de Gasto</p>
            <p className="text-2xl font-bold text-brand-700">336</p>
            <p className="text-xs text-brand-600 mt-0.5">Foment i suport de l&apos;esport</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {altres.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Subvencions similars</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {altres.map((s) => (
              <SubvencioCard key={s.id} subvencio={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

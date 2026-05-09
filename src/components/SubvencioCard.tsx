import Link from 'next/link'
import type { Subvencio } from '@/lib/types'
import { formatImport, formatData, labelEstat, colorEstat, subvencioUrl } from '@/lib/utils'
import NivellBadge from './NivellBadge'

interface Props {
  subvencio: Subvencio
}

export default function SubvencioCard({ subvencio: s }: Props) {
  return (
    <Link href={subvencioUrl(s.id)} className="card-hover block p-5 no-underline">
      <div className="flex flex-wrap items-start gap-2 mb-3">
        <NivellBadge nivell={s.nivell} />
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorEstat(s.estat)}`}>
          {labelEstat(s.estat)}
        </span>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-brand-700">
        {s.titol}
      </h3>

      <p className="text-sm text-slate-500 mb-3">{s.organisme}</p>

      {s.descripcio && (
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{s.descripcio}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {s.import !== null && (
            <span className="flex items-center gap-1 font-semibold text-brand-700">
              <span>💰</span> {formatImport(s.import)}
            </span>
          )}
          {s.comunitat && (
            <span className="flex items-center gap-1">
              <span>📍</span> {s.comunitat}
            </span>
          )}
          {s.dataFi && (
            <span className="flex items-center gap-1">
              <span>📅</span> Fins {formatData(s.dataFi)}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">{formatData(s.dataPublicacio)}</span>
      </div>
    </Link>
  )
}

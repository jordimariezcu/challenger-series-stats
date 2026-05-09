'use client'

interface Props {
  pagina: number
  total: number
  tamany: number
  onChange: (p: number) => void
}

export default function Pagination({ pagina, total, tamany, onChange }: Props) {
  const totalPages = Math.ceil(total / tamany)
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  const delta = 2
  for (let i = 0; i < totalPages; i++) {
    if (i === 0 || i === totalPages - 1 || (i >= pagina - delta && i <= pagina + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav aria-label="Paginació" className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onChange(pagina - 1)}
        disabled={pagina === 0}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Anterior"
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-slate-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === pagina ? 'page' : undefined}
            className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
              p === pagina
                ? 'border-brand-700 bg-brand-700 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {p + 1}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(pagina + 1)}
        disabled={pagina >= totalPages - 1}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Següent"
      >
        →
      </button>
    </nav>
  )
}

import type { NivellAdmin, EstatSubvencio } from './types'

export function formatImport(import_: number | null): string {
  if (import_ === null) return 'Import no especificat'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(import_)
}

export function formatData(data: string | null): string {
  if (!data) return '—'
  try {
    const d = new Date(data)
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return data
  }
}

export function labelNivell(nivell: NivellAdmin): string {
  const map: Record<NivellAdmin, string> = {
    estatal: 'Estatal',
    autonomic: 'Autonómica',
    provincial: 'Provincial',
    local: 'Local',
  }
  return map[nivell]
}

export function colorNivell(nivell: NivellAdmin): string {
  const map: Record<NivellAdmin, string> = {
    estatal: 'bg-blue-700 text-white',
    autonomic: 'bg-blue-500 text-white',
    provincial: 'bg-sky-500 text-white',
    local: 'bg-cyan-500 text-white',
  }
  return map[nivell]
}

export function labelEstat(estat: EstatSubvencio): string {
  return estat === 'convocatoria' ? 'Convocatoria' : 'Concesión'
}

export function colorEstat(estat: EstatSubvencio): string {
  return estat === 'convocatoria'
    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    : 'bg-slate-100 text-slate-600 border border-slate-200'
}

export function subvencioUrl(id: string): string {
  return `/subvenciones/${id}`
}

export function bdnsUrl(numBDNS: string): string {
  return `https://www.pap.hacienda.gob.es/bdnstrans/GE/es/convocatoria;idConvocatoria=${numBDNS}`
}

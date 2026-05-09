/**
 * BDNS API service — Base de Datos Nacional de Subvenciones (IGAE)
 * Documentation: https://www.pap.hacienda.gob.es/bdnstrans/GE/es/descargas
 *
 * Key filter: vpGasto=336 (Fomento y apoyo del deporte)
 * All public administration levels are required by law to publish here.
 */

import type { Subvencio, SubvencionsResponse, FiltresSubvencions, NivellAdmin } from './types'

const BDNS_BASE = 'https://www.pap.hacienda.gob.es/bdnstrans/GE/es'

// --- Mock data for development / API fallback ---
const MOCK_DATA: Subvencio[] = [
  {
    id: '700001', numBDNS: '700001',
    titol: 'Subvenciones para el fomento de actividades deportivas de clubes y federaciones',
    organisme: 'Consejo Superior de Deportes',
    nivell: 'estatal', import: 5000000, dataPublicacio: '2026-03-10', dataFi: '2026-05-10',
    estat: 'convocatoria', provincia: null, comunitat: null,
    url: 'https://www.boe.es', descripcio: 'Ayudas para el desarrollo y fomento del deporte de base y de élite a través de federaciones deportivas y clubes registrados.',
    tipusBeneficiari: ['Federaciones deportivas', 'Clubes deportivos'], boletinUrl: 'https://www.boe.es',
  },
  {
    id: '700002', numBDNS: '700002',
    titol: 'Ajuts per a la promoció de l\'esport i l\'activitat física',
    organisme: 'Consell Català de l\'Esport – Generalitat de Catalunya',
    nivell: 'autonomic', import: 1200000, dataPublicacio: '2026-02-15', dataFi: '2026-04-15',
    estat: 'convocatoria', provincia: null, comunitat: 'Cataluña',
    url: null, descripcio: 'Subvencions per a entitats esportives que promoguin la pràctica de l\'esport entre la població catalana, amb especial atenció a col·lectius vulnerables.',
    tipusBeneficiari: ['Entitats esportives', 'Associacions'], boletinUrl: null,
  },
  {
    id: '700003', numBDNS: '700003',
    titol: 'Subvenciones para instalaciones deportivas municipales',
    organisme: 'Diputación de Barcelona',
    nivell: 'provincial', import: 800000, dataPublicacio: '2026-01-20', dataFi: '2026-03-20',
    estat: 'concessio', provincia: 'Barcelona', comunitat: 'Cataluña',
    url: null, descripcio: 'Subvencions destinades a finançar obres de renovació o millora d\'instal·lacions esportives en municipis de la demarcació de Barcelona.',
    tipusBeneficiari: ['Ayuntamientos', 'Entidades públicas locales'], boletinUrl: null,
  },
  {
    id: '700004', numBDNS: '700004',
    titol: 'Ayudas a escuelas deportivas y deporte escolar',
    organisme: 'Ajuntament de Madrid',
    nivell: 'local', import: 350000, dataPublicacio: '2026-03-01', dataFi: '2026-04-30',
    estat: 'convocatoria', provincia: 'Madrid', comunitat: 'Comunidad de Madrid',
    url: null, descripcio: 'Convocatoria de subvenciones para la organización de actividades de deporte escolar y escuelas deportivas en el municipio de Madrid.',
    tipusBeneficiari: ['Clubes deportivos', 'Asociaciones'], boletinUrl: null,
  },
  {
    id: '700005', numBDNS: '700005',
    titol: 'Subvencions per a esdeveniments esportius de rellevància',
    organisme: 'Generalitat Valenciana – Institut Valencià de l\'Esport',
    nivell: 'autonomic', import: 600000, dataPublicacio: '2026-02-28', dataFi: null,
    estat: 'concessio', provincia: null, comunitat: 'Comunitat Valenciana',
    url: null, descripcio: 'Subvencions per a l\'organització d\'esdeveniments esportius de caràcter internacional, nacional i autonòmic al territori de la Comunitat Valenciana.',
    tipusBeneficiari: ['Federacions esportives', 'Empreses organitzadores'], boletinUrl: null,
  },
  {
    id: '700006', numBDNS: '700006',
    titol: 'Becas para deportistas de alto rendimiento',
    organisme: 'Consejo Superior de Deportes',
    nivell: 'estatal', import: 2500000, dataPublicacio: '2026-01-15', dataFi: '2026-02-28',
    estat: 'concessio', provincia: null, comunitat: null,
    url: null, descripcio: 'Programa de becas del Plan ADO para deportistas de alto rendimiento en disciplinas olímpicas y paralímpicas.',
    tipusBeneficiari: ['Deportistas individuales'], boletinUrl: null,
  },
  {
    id: '700007', numBDNS: '700007',
    titol: 'Subvenciones para la modernización de infraestructura deportiva',
    organisme: 'Junta de Andalucía – Secretaría del Deporte',
    nivell: 'autonomic', import: 3000000, dataPublicacio: '2026-03-05', dataFi: '2026-05-05',
    estat: 'convocatoria', provincia: null, comunitat: 'Andalucía',
    url: null, descripcio: 'Línea de ayudas para la renovación y modernización de instalaciones deportivas en municipios andaluces, con fondos Next Generation EU.',
    tipusBeneficiari: ['Ayuntamientos', 'Diputaciones'], boletinUrl: null,
  },
  {
    id: '700008', numBDNS: '700008',
    titol: 'Ayudas para clubes de fútbol base y deporte amateur',
    organisme: 'Ayuntamiento de Sevilla',
    nivell: 'local', import: 180000, dataPublicacio: '2026-02-10', dataFi: '2026-03-10',
    estat: 'concessio', provincia: 'Sevilla', comunitat: 'Andalucía',
    url: null, descripcio: 'Subvenciones municipales para el mantenimiento de equipos de fútbol, baloncesto y atletismo de categorías inferiores.',
    tipusBeneficiari: ['Clubes deportivos'], boletinUrl: null,
  },
  {
    id: '700009', numBDNS: '700009',
    titol: 'Subvencions per a la integració social a través de l\'esport',
    organisme: 'Govern de les Illes Balears',
    nivell: 'autonomic', import: 400000, dataPublicacio: '2026-03-12', dataFi: '2026-04-12',
    estat: 'convocatoria', provincia: null, comunitat: 'Illes Balears',
    url: null, descripcio: 'Ajuts per a programes d\'inclusió social mitjançant l\'esport, adreçats a col·lectius en risc d\'exclusió.',
    tipusBeneficiari: ['ONGs', 'Entitats sense ànim de lucre'], boletinUrl: null,
  },
  {
    id: '700010', numBDNS: '700010',
    titol: 'Subvenciones para la práctica deportiva en zonas rurales',
    organisme: 'Diputación de Teruel',
    nivell: 'provincial', import: 120000, dataPublicacio: '2026-01-25', dataFi: '2026-03-01',
    estat: 'concessio', provincia: 'Teruel', comunitat: 'Aragón',
    url: null, descripcio: 'Ayudas para pequeños municipios de la provincia de Teruel para fomentar la práctica deportiva y el mantenimiento de instalaciones deportivas básicas.',
    tipusBeneficiari: ['Ayuntamientos', 'Entidades locales menores'], boletinUrl: null,
  },
  {
    id: '700011', numBDNS: '700011',
    titol: 'Plan de ayudas para el deporte paralímpico y adaptado',
    organisme: 'Consejo Superior de Deportes',
    nivell: 'estatal', import: 1800000, dataPublicacio: '2026-02-01', dataFi: '2026-03-31',
    estat: 'convocatoria', provincia: null, comunitat: null,
    url: null, descripcio: 'Convocatoria de ayudas para el fomento del deporte paralímpico y adaptado a través del Comité Paralímpico Español y las federaciones de deporte adaptado.',
    tipusBeneficiari: ['Federaciones de deporte adaptado', 'Clubes'], boletinUrl: null,
  },
  {
    id: '700012', numBDNS: '700012',
    titol: 'Subvenciones para el deporte femenino y la igualdad',
    organisme: 'Gobierno Vasco – Diputación Foral de Bizkaia',
    nivell: 'provincial', import: 250000, dataPublicacio: '2026-03-08', dataFi: '2026-04-30',
    estat: 'convocatoria', provincia: 'Bizkaia', comunitat: 'País Vasco',
    url: null, descripcio: 'Programa de subvenciones para promover la práctica deportiva femenina y la igualdad de género en el deporte, mediante la financiación de equipos y secciones femeninas.',
    tipusBeneficiari: ['Clubes deportivos', 'Federaciones'], boletinUrl: null,
  },
]

interface BDNSRawConvocatoria {
  numBDNS?: string
  id?: string | number
  titulo?: string
  denominacion?: string
  organo?: string
  descripcion?: string
  importeTotal?: number
  importe?: number
  fechaPublicacion?: string
  fechaFin?: string
  fechaCierre?: string
  nivelAdministracion?: string
  nivel?: string
  provincia?: string
  region?: string
  comunidadAutonoma?: string
  tipoBeneficiario?: string[]
  tiposBeneficiarios?: string[]
  urlBoletin?: string
  url?: string
  tipo?: 'convocatoria' | 'concessio'
}

function mapNivell(raw: string | undefined): NivellAdmin {
  if (!raw) return 'estatal'
  const r = raw.toLowerCase()
  if (r.includes('auto') || r.includes('ccaa') || r.includes('regional')) return 'autonomic'
  if (r.includes('prov') || r.includes('diput') || r.includes('insul')) return 'provincial'
  if (r.includes('local') || r.includes('munic') || r.includes('ayunt')) return 'local'
  return 'estatal'
}

function mapRaw(raw: BDNSRawConvocatoria, estat: 'convocatoria' | 'concessio'): Subvencio {
  return {
    id: String(raw.numBDNS ?? raw.id ?? Math.random()),
    numBDNS: String(raw.numBDNS ?? raw.id ?? ''),
    titol: raw.titulo ?? raw.denominacion ?? 'Sin título',
    organisme: raw.organo ?? 'Administración',
    nivell: mapNivell(raw.nivelAdministracion ?? raw.nivel),
    import: raw.importeTotal ?? raw.importe ?? null,
    dataPublicacio: raw.fechaPublicacion ?? new Date().toISOString(),
    dataFi: raw.fechaFin ?? raw.fechaCierre ?? null,
    estat,
    provincia: raw.provincia ?? null,
    comunitat: raw.region ?? raw.comunidadAutonoma ?? null,
    url: raw.url ?? null,
    descripcio: raw.descripcion ?? null,
    tipusBeneficiari: raw.tipoBeneficiario ?? raw.tiposBeneficiarios ?? [],
    boletinUrl: raw.urlBoletin ?? null,
  }
}

async function fetchBDNS(
  endpoint: 'convocatorias' | 'concesiones',
  params: Record<string, string>,
): Promise<{ total: number; items: Subvencio[] }> {
  const url = new URL(`${BDNS_BASE}/${endpoint}`)
  // Sports filter (Política de Gasto 336 = Fomento y apoyo del deporte)
  url.searchParams.set('vpGasto', '336')
  url.searchParams.set('numPagina', params.numPagina ?? '0')
  url.searchParams.set('paginaTamanyo', params.paginaTamanyo ?? '25')
  if (params.fechaDesde) url.searchParams.set('fechaDesde', params.fechaDesde)
  if (params.fechaHasta) url.searchParams.set('fechaHasta', params.fechaHasta)
  if (params.region) url.searchParams.set('region', params.region)
  if (params.provincia) url.searchParams.set('provincia', params.provincia)

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json', 'User-Agent': 'SubvencionsEsport/1.0' },
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`BDNS ${endpoint} HTTP ${res.status}`)

  const data = await res.json()

  const raw: BDNSRawConvocatoria[] = data.content ?? data.convocatorias ?? data.concesiones ?? data.items ?? []
  const total: number = data.totalElements ?? data.totalElementos ?? data.total ?? raw.length
  const estat = endpoint === 'convocatorias' ? 'convocatoria' : 'concessio'

  return { total, items: raw.map((r) => mapRaw(r, estat)) }
}

export async function getSubvencions(filtres: FiltresSubvencions = {}): Promise<SubvencionsResponse> {
  const pagina = filtres.pagina ?? 0
  const tamany = 25

  const params: Record<string, string> = {
    numPagina: String(pagina),
    paginaTamanyo: String(tamany),
  }
  if (filtres.dataDesde) params.fechaDesde = filtres.dataDesde
  if (filtres.dataFins) params.fechaHasta = filtres.dataFins
  if (filtres.comunitat) params.region = filtres.comunitat
  if (filtres.provincia) params.provincia = filtres.provincia

  let resultats: Subvencio[] = []
  let total = 0

  try {
    const endpoint = filtres.estat === 'concessio' ? 'concesiones' : 'convocatorias'
    const { total: t, items } = await fetchBDNS(endpoint, params)
    resultats = items
    total = t

    if (!filtres.estat) {
      const { total: t2, items: items2 } = await fetchBDNS('concesiones', params)
      resultats = [...resultats, ...items2]
      total = total + t2
    }
  } catch {
    // Fall back to mock data — useful during development or if BDNS API is unreachable
    resultats = MOCK_DATA
    total = MOCK_DATA.length
  }

  // Client-side filters on mock/combined data
  if (filtres.cerca) {
    const q = filtres.cerca.toLowerCase()
    resultats = resultats.filter(
      (s) =>
        s.titol.toLowerCase().includes(q) ||
        s.organisme.toLowerCase().includes(q) ||
        s.descripcio?.toLowerCase().includes(q),
    )
    total = resultats.length
  }
  if (filtres.nivell) {
    resultats = resultats.filter((s) => s.nivell === filtres.nivell)
    total = resultats.length
  }
  if (filtres.estat && filtres.estat !== undefined) {
    resultats = resultats.filter((s) => s.estat === filtres.estat)
    total = resultats.length
  }
  if (filtres.importMin != null) {
    resultats = resultats.filter((s) => s.import !== null && s.import >= filtres.importMin!)
  }
  if (filtres.importMax != null) {
    resultats = resultats.filter((s) => s.import !== null && s.import <= filtres.importMax!)
  }

  // Sort
  const ordre = filtres.ordre ?? 'data_desc'
  resultats.sort((a, b) => {
    if (ordre === 'data_desc') return b.dataPublicacio.localeCompare(a.dataPublicacio)
    if (ordre === 'data_asc') return a.dataPublicacio.localeCompare(b.dataPublicacio)
    if (ordre === 'import_desc') return (b.import ?? 0) - (a.import ?? 0)
    if (ordre === 'import_asc') return (a.import ?? 0) - (b.import ?? 0)
    return 0
  })

  const start = pagina * tamany
  const pageItems = resultats.slice(start, start + tamany)

  return { total, pagina, tamany, resultats: pageItems }
}

export async function getSubvencio(id: string): Promise<Subvencio | null> {
  try {
    const url = `${BDNS_BASE}/convocatoria;idConvocatoria=${id}`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('not found')
    const data: BDNSRawConvocatoria = await res.json()
    return mapRaw(data, 'convocatoria')
  } catch {
    return MOCK_DATA.find((s) => s.id === id) ?? null
  }
}

export async function getEstadistiques() {
  const all = MOCK_DATA
  const importTotal = all.reduce((acc, s) => acc + (s.import ?? 0), 0)
  const ambImport = all.filter((s) => s.import !== null)

  const porNivell = (['estatal', 'autonomic', 'provincial', 'local'] as const).map((n) => {
    const items = all.filter((s) => s.nivell === n)
    return {
      nivell: n,
      total: items.length,
      import: items.reduce((acc, s) => acc + (s.import ?? 0), 0),
    }
  })

  const comunitatMap: Record<string, { total: number; import: number }> = {}
  for (const s of all) {
    const c = s.comunitat ?? 'Estatal'
    if (!comunitatMap[c]) comunitatMap[c] = { total: 0, import: 0 }
    comunitatMap[c].total++
    comunitatMap[c].import += s.import ?? 0
  }
  const porComunitat = Object.entries(comunitatMap)
    .map(([comunitat, v]) => ({ comunitat, ...v }))
    .sort((a, b) => b.import - a.import)

  const organismeMap: Record<string, number> = {}
  for (const s of all) {
    organismeMap[s.organisme] = (organismeMap[s.organisme] ?? 0) + 1
  }
  const organismesMesActius = Object.entries(organismeMap)
    .map(([nom, total]) => ({ nom, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)

  return {
    totalConvocatories: all.filter((s) => s.estat === 'convocatoria').length,
    totalConcesssions: all.filter((s) => s.estat === 'concessio').length,
    importTotal,
    importMig: ambImport.length ? importTotal / ambImport.length : 0,
    organismesMesActius,
    porNivell,
    porComunitat,
  }
}

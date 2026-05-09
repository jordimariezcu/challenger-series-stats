export type NivellAdmin = 'estatal' | 'autonomic' | 'provincial' | 'local'
export type EstatSubvencio = 'convocatoria' | 'concessio'

export interface Subvencio {
  id: string
  numBDNS: string
  titol: string
  organisme: string
  nivell: NivellAdmin
  import: number | null
  dataPublicacio: string
  dataFi: string | null
  estat: EstatSubvencio
  provincia: string | null
  comunitat: string | null
  url: string | null
  descripcio: string | null
  tipusBeneficiari: string[]
  boletinUrl: string | null
}

export interface SubvencionsResponse {
  total: number
  pagina: number
  tamany: number
  resultats: Subvencio[]
}

export interface FiltresSubvencions {
  cerca?: string
  nivell?: NivellAdmin
  provincia?: string
  comunitat?: string
  importMin?: number
  importMax?: number
  dataDesde?: string
  dataFins?: string
  estat?: EstatSubvencio
  pagina?: number
  ordre?: 'data_desc' | 'data_asc' | 'import_desc' | 'import_asc'
}

export interface EstadistiquesResum {
  totalConvocatories: number
  totalConcesssions: number
  importTotal: number
  importMig: number
  organismesMesActius: { nom: string; total: number }[]
  porNivell: { nivell: NivellAdmin; total: number; import: number }[]
  porComunitat: { comunitat: string; total: number; import: number }[]
}

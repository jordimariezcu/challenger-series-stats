import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const BASE_URL = 'https://subvencionsesport.vercel.app'
const SITE_NAME = 'SubvencionsEsport'
const DESCRIPTION =
  'Buscador de subvencions i ajuts públics per a entitats esportives a Espanya. Dades de la BDNS (IGAE), filtrades per l\'àmbit deportiu (Política de Gasto 336).'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} — Subvencions esportives a Espanya`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    'subvencions esport', 'ajuts esportius', 'subvenciones deporte España',
    'BDNS', 'IGAE', 'clubes deportivos', 'federaciones deportivas',
    'ayudas públicas deporte', 'convocatorias deporte', 'financiación deporte',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_ES',
    url: BASE_URL,
    title: `${SITE_NAME} — Subvencions esportives a Espanya`,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og.png`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Subvencions esportives a Espanya`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: { canonical: BASE_URL },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  description: DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/subvenciones?cerca={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

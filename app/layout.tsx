import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
})

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

const ibmMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Diseños JK — Puertas Corredizas a Medida | San Justo, La Matanza",
  description: "Fabricamos e instalamos puertas corredizas a medida en CABA y Gran Buenos Aires. Sin obra. Precio exacto en minutos. Fabricantes directos en San Justo, La Matanza.",
  keywords: [
    "puertas corredizas a medida",
    "puertas corredizas CABA",
    "puertas corredizas GBA",
    "instalación puertas corredizas",
    "San Justo La Matanza",
    "fabricantes puertas corredizas",
    "puertas sin obra",
    "diseños JK",
    "puerta plegable a medida",
  ],
  openGraph: {
    title: "Diseños JK — Puertas Corredizas a Medida",
    description: "Fabricamos e instalamos puertas corredizas a medida en CABA y GBA. Sin obra. Precio exacto por WhatsApp.",
    type: "website",
    locale: "es_AR",
    siteName: "Diseños JK",
    images: [
      {
        url: "/puerta-granero.webp",
        width: 1200,
        height: 630,
        alt: "Puertas corredizas a medida — Diseños JK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diseños JK — Puertas Corredizas a Medida",
    description: "Fabricamos e instalamos puertas corredizas a medida en CABA y GBA.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://disenosjk.com.ar" },
}

// JSON-LD LocalBusiness schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Diseños JK",
  "description": "Fabricantes de puertas corredizas a medida. Fabricación e instalación en CABA y Gran Buenos Aires.",
  "image": "/puerta-granero.webp",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Venezuela y Arieta",
    "addressLocality": "San Justo",
    "addressRegion": "Buenos Aires",
    "postalCode": "1754",
    "addressCountry": "AR",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -34.6748,
    "longitude": -58.5585,
  },
  "areaServed": [
    { "@type": "City", "name": "Ciudad Autónoma de Buenos Aires" },
    { "@type": "AdministrativeArea", "name": "Gran Buenos Aires" },
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "15:00",
    },
  ],
  "sameAs": ["https://instagram.com/disenosjk_"],
  "priceRange": "$$",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable} ${ibmMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

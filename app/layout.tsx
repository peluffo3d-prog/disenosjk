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
  title: "Diseños JK — Puertas Corredizas a Medida",
  description: "Fabricamos e instalamos puertas corredizas a medida en CABA y GBA. Sin obra. Precio al instante.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable} ${ibmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}

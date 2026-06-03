import type { Metadata } from "next"
import { DM_Sans, DM_Serif_Display, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
})

const ibmMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Diseños JK — Puertas Corredizas a Medida",
  description: "Fabricamos e instalamos puertas corredizas a medida en CABA y GBA.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${dmSerif.variable} ${ibmMono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}

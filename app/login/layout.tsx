import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Ingresar — Diseños JK",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

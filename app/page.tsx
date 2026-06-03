import Configurador from "@/components/Configurador"
import { MessageCircle } from "lucide-react"

const WA = "5491100000000" // TODO: número real

export default function Home() {
  return (
    <main style={{ fontFamily: "var(--font-sans)" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-black">
        <span
          className="font-display text-xl leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {/* TODO: logo real */}
          Diseños JK
        </span>
        <a
          href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola! Quiero consultar sobre puertas corredizas.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-black transition-colors hover:bg-black hover:text-white"
          style={{ borderRadius: 0 }}
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>
      </nav>

      {/* Hero — tipográfico, asimétrico */}
      <section className="px-6 md:px-12 pt-16 pb-12 border-b border-black">
        <div className="max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-6">
            Fabricantes directos · CABA y GBA
          </p>
          <h1
            className="font-display leading-none mb-8"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Puertas<br />
            <span style={{ color: "#888" }}>a tu medida.</span>
          </h1>
          <div className="flex flex-wrap gap-12 pt-8 border-t border-black">
            {[
              { n: "+500", label: "Puertas instaladas" },
              { n: "41K",  label: "Seguidores en Instagram" },
              { n: "6",    label: "Cuotas sin interés" },
            ].map(({ n, label }) => (
              <div key={label}>
                <p
                  className="font-display leading-none"
                  style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}
                >
                  {n}
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODO: galería / before-after con fotos reales del cliente */}

      {/* Configurador */}
      <div className="border-b border-black">
        <Configurador />
      </div>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-6 flex flex-wrap items-center justify-between gap-4">
        <span
          className="font-display text-base"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Diseños JK
        </span>
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
          CABA y GBA · Fabricantes directos
        </p>
        <div className="flex gap-6 font-mono text-xs uppercase tracking-widest text-neutral-400">
          <a href="https://instagram.com/disenosjk_" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Instagram</a>
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">WhatsApp</a>
        </div>
      </footer>

    </main>
  )
}

import Image from "next/image"
import { MessageCircle } from "lucide-react"
import Configurador from "@/components/Configurador"

const WA_URL = "https://wa.me/5491100000000?text=Hola!%20Vi%20la%20web%20y%20quiero%20consultar"

export default function Home() {
  return (
    <main style={{ fontFamily: "var(--font-sans)", background: "#f5f4f0" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-14"
        style={{ background: "#f5f4f0", borderBottom: "1px solid #d4d0c8" }}
      >
        <span className="text-sm font-semibold tracking-widest uppercase" style={{ letterSpacing: "0.12em" }}>
          {/* TODO: logo SVG real */}
          Diseños JK
        </span>
        <div className="hidden md:flex items-center gap-8">
          {["Modelos", "Cómo funciona", "Testimonios"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-50"
              style={{ color: "#444" }}>
              {l}
            </a>
          ))}
        </div>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 transition-opacity hover:opacity-80"
          style={{ background: "#0a0a0a", color: "#f5f4f0", borderRadius: "4px" }}>
          <MessageCircle size={13} />
          Consultá ahora
        </a>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="grid lg:grid-cols-2 min-h-[90vh]">

        {/* Texto */}
        <div className="flex flex-col justify-center px-6 md:px-12 py-16 lg:py-24">
          <p className="text-xs font-semibold tracking-widest uppercase mb-8"
            style={{ color: "#888" }}>
            Fabricantes directos · CABA y GBA
          </p>

          <h1
            className="font-display mb-4 leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.8rem, 8vw, 7rem)",
              letterSpacing: "-0.02em",
              color: "#0a0a0a",
            }}
          >
            Puertas<br />
            corredizas<br />
            <span style={{ color: "#999" }}>a tu medida.</span>
          </h1>

          <p className="text-base mb-10 max-w-sm leading-relaxed" style={{ color: "#555" }}>
            Fabricamos e instalamos en tu casa, sin obra.<br />
            Precio exacto en minutos por WhatsApp.
          </p>

          <div className="flex flex-wrap gap-3 mb-14">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all hover:opacity-85"
              style={{ background: "#25D366", color: "#fff", borderRadius: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultá ahora
            </a>
            <a href="#configurador"
              className="px-5 py-3 text-sm font-semibold transition-all hover:opacity-60"
              style={{ color: "#0a0a0a", borderBottom: "1px solid #0a0a0a" }}>
              Armar mi puerta →
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-6" style={{ borderTop: "1px solid #d4d0c8" }}>
            {[
              { n: "+500", l: "Puertas instaladas" },
              { n: "41K",  l: "Seguidores en IG" },
              { n: "6 ctas", l: "Cuotas en ML" },
            ].map(({ n, l }) => (
              <div key={l}>
                <p className="font-display text-2xl leading-none" style={{ fontFamily: "var(--font-display)" }}>{n}</p>
                <p className="text-xs mt-1" style={{ color: "#888" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Foto — lado derecho */}
        <div className="relative min-h-[360px] lg:min-h-0" style={{ background: "#e8e4dc" }}>
          <Image
            src="/puerta-granero.webp"
            alt="Puerta corrediza estilo granero instalada en living"
            fill
            className="object-cover object-right"
            priority
          />
          {/* Badge flotante */}
          <div className="absolute bottom-6 left-6 px-4 py-3"
            style={{ background: "#f5f4f0", borderRadius: "6px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <p className="text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#25D366", animation: "pulse 2s infinite" }} />
              Respondemos al instante
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#888" }}>Lun–Sáb · 9 a 19 hs</p>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ NOSOTROS ─────────────────────────────────────────────── */}
      <section style={{ background: "#0a0a0a", color: "#f5f4f0" }} className="px-6 md:px-12 py-20">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#555" }}>
          Por qué elegirnos
        </p>
        <h2 className="font-display mb-12" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}>
          Fabricantes.<br />No revendedores.
        </h2>

        {/* Grid editorial — asimétrico, sin ícono + título + descripción */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ border: "1px solid #1f1f1f", borderRadius: "4px", overflow: "hidden" }}>
          {[
            { title: "Fabricación propia", desc: "Cada puerta desde cero a tus medidas exactas." },
            { title: "A medida",           desc: "No adaptamos estándar. Fabricamos desde el primer milímetro." },
            { title: "Envío incluido",     desc: "Llegamos a CABA y GBA. El precio es el precio final." },
            { title: "Hasta 6 cuotas",     desc: "Pagá en cuotas sin interés a través de Mercado Libre." },
          ].map((item, i) => (
            <div key={item.title} className="p-6"
              style={{ borderRight: i < 3 ? "1px solid #1f1f1f" : "none" }}>
              <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "#555" }}>
                0{i + 1}
              </p>
              <p className="font-semibold text-sm mb-2">{item.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#555" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ANTES / DESPUÉS ──────────────────────────────────────────────── */}
      <section id="modelos" className="px-6 md:px-12 py-20" style={{ background: "#f5f4f0" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#888" }}>
          Transformaciones reales
        </p>
        <h2 className="font-display mb-12" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}>
          Una puerta cambia todo.
        </h2>

        {/* Galería de productos reales — 3 fotos, layout asimétrico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative" style={{ aspectRatio: "16/9" }}>
            <Image src="/puerta-granero.webp" alt="Puerta estilo granero en living" fill
              className="object-cover" style={{ borderRadius: "4px" }} />
            <div className="absolute bottom-3 left-3 px-3 py-1.5"
              style={{ background: "rgba(10,10,10,0.7)", borderRadius: "3px" }}>
              <p className="font-mono text-xs uppercase tracking-widest text-white">Estilo granero · Living</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="relative flex-1" style={{ minHeight: "180px" }}>
              <Image src="/puerta-blanca.webp" alt="Puerta corrediza blanca instalada" fill
                className="object-cover" style={{ borderRadius: "4px" }} />
              <div className="absolute bottom-3 left-3 px-3 py-1.5"
                style={{ background: "rgba(10,10,10,0.7)", borderRadius: "3px" }}>
                <p className="font-mono text-xs uppercase tracking-widest text-white">Lisa blanca · Dormitorio</p>
              </div>
            </div>
            <div className="relative flex-1" style={{ minHeight: "180px" }}>
              <Image src="/puerta-producto.webp" alt="Modelo de puerta corrediza" fill
                className="object-cover" style={{ borderRadius: "4px", objectPosition: "center" }} />
              <div className="absolute bottom-3 left-3 px-3 py-1.5"
                style={{ background: "rgba(10,10,10,0.7)", borderRadius: "3px" }}>
                <p className="font-mono text-xs uppercase tracking-widest text-white">Modelo estándar</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs font-mono text-center mt-4" style={{ color: "#aaa" }}>
          — Todos los modelos se fabrican a medida —
        </p>
      </section>

      {/* ── CONFIGURADOR ─────────────────────────────────────────────────── */}
      <section id="configurador" style={{ background: "#f5f4f0", borderTop: "1px solid #d4d0c8" }}>
        <Configurador />
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────────── */}
      <section id="cómo-funciona" className="px-6 md:px-12 py-20" style={{ background: "#0a0a0a", color: "#f5f4f0" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#555" }}>
          Sin vueltas
        </p>
        <h2 className="font-display mb-14" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}>
          Cómo funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-0" style={{ borderTop: "1px solid #1f1f1f" }}>
          {[
            { n: "1", title: "Armás tu puerta",   desc: "Completás el configurador con ambiente, modelo y medidas. Te llega el precio al instante." },
            { n: "2", title: "Pagás y confirmás",  desc: "Pagás online con Mercado Pago en hasta 6 cuotas. Nosotros confirmamos y programamos la entrega." },
            { n: "3", title: "La instalamos",      desc: "Vamos a tu casa en CABA o GBA y dejamos todo listo. Sin obra, sin drama, sin vueltas." },
          ].map((s, i) => (
            <div key={s.n} className="py-8 pr-8"
              style={{ borderRight: i < 2 ? "1px solid #1f1f1f" : "none", paddingLeft: i === 0 ? 0 : "2rem" }}>
              <p className="font-display text-5xl leading-none mb-4" style={{ fontFamily: "var(--font-display)", color: "#333" }}>
                {s.n}
              </p>
              <p className="font-semibold text-sm mb-2">{s.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#555" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────────────────────────────── */}
      <section id="testimonios" className="px-6 md:px-12 py-20" style={{ background: "#f5f4f0" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#888" }}>
          Lo que dicen nuestros clientes
        </p>
        <h2 className="font-display mb-12" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}>
          +500 hogares<br />transformados.
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { texto: '"Excelente calidad. La puerta quedó perfecta en el baño, exactamente a medida. La instalación fue rápida y limpia."', nombre: "Valeria M.", lugar: "Morón, GBA Oeste" },
            { texto: '"No sabía que era tan fácil. Me mandaron fotos de todo el proceso. Pagué en cuotas y me ahorraron la obra completa."', nombre: "Lucas T.", lugar: "Palermo, CABA" },
            { texto: '"Vine por Instagram y no me arrepiento. Atención inmediata, precio justo y resultado increíble. Los recomiendo 100%."', nombre: "Sofía R.", lugar: "La Matanza, GBA" },
          ].map(t => (
            <div key={t.nombre} className="p-6" style={{ background: "#ebebeb", borderRadius: "4px" }}>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#444" }}>{t.texto}</p>
              <p className="text-xs font-semibold">{t.nombre}</p>
              <p className="text-xs" style={{ color: "#888" }}>{t.lugar}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 text-center relative overflow-hidden"
        style={{ background: "#0a0a0a", color: "#f5f4f0" }}>
        <p className="absolute inset-0 flex items-center justify-center font-display select-none pointer-events-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "20vw", color: "rgba(255,255,255,0.03)", lineHeight: 1 }}>
          JK
        </p>
        <p className="relative text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#555" }}>
          Empezá hoy
        </p>
        <h2 className="relative font-display mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}>
          ¿Querés renovar<br />tu espacio?
        </h2>
        <p className="relative text-sm mb-8" style={{ color: "#555" }}>
          Escribinos y en minutos te damos precio. Sin compromiso.
        </p>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer"
          className="relative inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ background: "#25D366", color: "#fff", borderRadius: "4px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Consultá por WhatsApp
        </a>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-12 py-6 flex flex-wrap items-center justify-between gap-4"
        style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}>
        <span className="font-display text-sm" style={{ fontFamily: "var(--font-display)", color: "#f5f4f0" }}>
          Diseños JK
        </span>
        <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#444" }}>
          CABA y GBA · Fabricantes directos
        </p>
        <div className="flex gap-5">
          {[
            { label: "Instagram", href: "https://instagram.com/disenosjk_" },
            { label: "Mercado Libre", href: "#" },
            { label: "WhatsApp", href: WA_URL },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest transition-colors hover:opacity-60"
              style={{ color: "#555" }}>
              {l.label}
            </a>
          ))}
        </div>
      </footer>

    </main>
  )
}

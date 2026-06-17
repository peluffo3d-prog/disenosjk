"use client"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useRef, useEffect, useState } from "react"
import Configurador from "@/components/Configurador"
import SmoothScroll from "@/components/SmoothScroll"
import Curtain from "@/components/Curtain"
import SplitLines from "@/components/SplitLines"
import ScaleImage from "@/components/ScaleImage"
import SectionReveal from "@/components/SectionReveal"
import { getPrecioDesde, fmtCuota, fmtARS } from "@/lib/precios"

const DoorIntro = dynamic(() => import("@/components/DoorIntro"), { ssr: false })

const WA_URL    = "https://wa.me/5491100000000?text=Hola!%20Vi%20la%20web%20y%20quiero%20consultar"
const IG_URL    = "https://instagram.com/disenosjk_"
const EAZE      = "cubic-bezier(0.76, 0, 0.24, 1)"
const HERO_VID  = "/escuadradora.mp4"

const NAV_LINKS: [string, string][] = [["Catálogo", "#galeria"], ["Cómo funciona", "#como-funciona"], ["Cotizá", "#configurador"]]

// ─── Backgrounds para secciones oscuras ──────────────────────────────────────
function DarkBg({ src, opacity = 0.35 }: { src: string; opacity?: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Image src={src} alt="" fill className="object-cover" style={{ opacity }} priority={false} sizes="100vw" />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)" }} />
    </div>
  )
}

// ─── Divisor para secciones oscuras ──────────────────────────────────────────
function DarkRule({ my = 56 }: { my?: number }) {
  return <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.22)", margin: `${my}px 0` }} />
}

// ─── Card de modelo — igual tamaño, estilo MercadoLibre ──────────────────────
function ProductCard({ img, alt, title, tag, tipo, premium = false }: {
  img: string; alt: string; title: string; tag: string
  tipo: "corredera_simple" | "plegable_doble"
  premium?: boolean
}) {
  const desde = getPrecioDesde(tipo, premium ? "premium" : "estandar")
  return (
    <a href="#configurador" style={{
      display: "flex", flexDirection: "column", height: "100%",
      textDecoration: "none", color: "inherit",
      background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "4px",
      overflow: "hidden",
      transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s cubic-bezier(0.76,0,0.24,1)",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = "rgba(0,0,0,0.18)"
      e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,0.09)"
      e.currentTarget.style.transform = "translateY(-3px)"
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"
      e.currentTarget.style.boxShadow = "none"
      e.currentTarget.style.transform = "translateY(0)"
    }}>
      <ScaleImage style={{ position: "relative", aspectRatio: "4/3" }}>
        <Image src={img} alt={alt} fill className="object-cover" sizes="(max-width: 600px) 85vw, (max-width: 900px) 50vw, 33vw" />
        {premium && (
          <span style={{
            position: "absolute", top: "12px", left: "12px", zIndex: 2,
            fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 600,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#0a0a0a", background: "#c9ccd1",
            padding: "5px 10px", borderRadius: "100px",
          }}>Premium · aluminio</span>
        )}
      </ScaleImage>
      <div style={{ padding: "20px 22px 24px", flexShrink: 0 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>{tag}</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 300, letterSpacing: "-0.01em", color: "#0a0a0a", marginBottom: "14px" }}>{title}</p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: "2px" }}>Desde</p>
        <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em", marginBottom: "4px" }}>{fmtARS(desde)}</p>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#00a650" }}>en 6 cuotas de {fmtCuota(desde)} sin interés</p>
        <span style={{
          display: "inline-block", marginTop: "10px",
          fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 600,
          letterSpacing: "0.06em", textTransform: "uppercase",
          color: "#00a650", background: "rgba(0,166,80,0.1)",
          padding: "4px 11px", borderRadius: "100px",
        }}>Envío a todo el país</span>
      </div>
    </a>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [waVisible, setWaVisible] = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const heroRef   = useRef<HTMLElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const scrollSlider = (dir: 1 | -1) => {
    const el = sliderRef.current
    if (!el) return
    const item = el.querySelector<HTMLElement>(".product-slider-item")
    const w = item ? item.offsetWidth + 20 : el.offsetWidth / 3
    el.scrollBy({ left: dir * w, behavior: "smooth" })
  }

  // Drag-to-scroll estilo MercadoLibre: arrastrar con el mouse mueve el carrusel.
  // Si el puntero se movió más que el umbral, cancelamos el click en la card.
  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    let down = false, startX = 0, startScroll = 0, moved = false
    const DRAG_THRESHOLD = 6

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return // touch usa scroll nativo
      down = true; moved = false
      startX = e.clientX; startScroll = el.scrollLeft
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) moved = true
      if (moved) el.scrollLeft = startScroll - dx
    }
    const onUp = () => { down = false }
    // Bloquea el click si fue un arrastre (no una intención de abrir la card)
    const onClickCapture = (e: MouseEvent) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false }
    }

    el.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerup", onUp)
    el.addEventListener("click", onClickCapture, true)
    return () => {
      el.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      el.removeEventListener("click", onClickCapture, true)
    }
  }, [])

  // Bloquea scroll cuando el menú mobile está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setWaVisible(!e.isIntersecting), { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <DoorIntro />

      {/* ── WA pill — blanco, minimal, luxury ── */}
      <a href={WA_URL} target="_blank" rel="noopener noreferrer"
        aria-label="Cotizá por WhatsApp"
        className="wa-pill"
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 200,
          background: "#fff", color: "#0a0a0a",
          fontSize: "12px", fontWeight: 500, letterSpacing: "0.03em",
          padding: "10px 20px", borderRadius: "100px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.14)",
          textDecoration: "none", whiteSpace: "nowrap",
          opacity: waVisible ? 1 : 0,
          transform: waVisible ? "translateY(0)" : "translateY(8px)",
          pointerEvents: waVisible ? "auto" : "none",
          transition: `opacity 0.4s ${EAZE}, transform 0.4s ${EAZE}`,
        }}>
        Cotizá →
      </a>

      {/* ── Nav — barely-there ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px, 5vw, 56px)", height: "60px",
        background: "rgba(245,244,240,0.9)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "21px", fontWeight: 300, letterSpacing: "0.03em" }}>
          Diseños JK
        </span>
        <div className="nav-links" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h} className="nav-link" style={{
              fontSize: "13px", fontWeight: 300, letterSpacing: "0.04em", color: "#666",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#0a0a0a")}
            onMouseLeave={e => (e.currentTarget.style.color = "#666")}>{l}</a>
          ))}
          <a href="/login" style={{
            fontSize: "12px", fontWeight: 400, letterSpacing: "0.06em",
            color: "#666", textDecoration: "none",
            borderBottom: "1px solid #ddd", paddingBottom: "1px",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#0a0a0a"; e.currentTarget.style.borderColor = "#0a0a0a" }}
          onMouseLeave={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.borderColor = "#ddd" }}>
            Ingresar
          </a>
        </div>

        {/* Botón hamburguesa — solo mobile */}
        <button className="nav-burger" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"
          style={{
            display: "none", background: "transparent", border: "none", cursor: "pointer",
            flexDirection: "column", gap: "5px", padding: "8px", margin: "-8px",
          }}>
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "#0a0a0a" }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "#0a0a0a" }} />
        </button>
      </nav>

      {/* ── Menú mobile — drawer full-screen ── */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: "fixed", inset: 0, zIndex: 150,
          background: "#f5f4f0",
          display: "flex", flexDirection: "column",
          padding: "clamp(20px, 5vw, 56px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
          transition: `opacity 0.35s ${EAZE}, transform 0.35s ${EAZE}`,
        }}>
        {/* Header del drawer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", marginTop: "-20px" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "21px", fontWeight: 300, letterSpacing: "0.03em" }}>
            Diseños JK
          </span>
          <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "26px", lineHeight: 1, color: "#0a0a0a", padding: "8px", margin: "-8px", fontWeight: 200 }}>
            ✕
          </button>
        </div>

        {/* Links grandes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "clamp(32px, 8vh, 64px)", flex: 1 }}>
          {NAV_LINKS.map(([l, h], i) => (
            <a key={l} href={h} onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 11vw, 3.4rem)",
                fontWeight: 300, letterSpacing: "-0.02em", color: "#0a0a0a",
                textDecoration: "none", padding: "12px 0",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                display: "flex", alignItems: "baseline", justifyContent: "space-between",
              }}>
              {l}
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#aaa", letterSpacing: "0.1em" }}>0{i + 1}</span>
            </a>
          ))}
        </div>

        {/* Footer del drawer — Ingresar + WA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "8px" }}>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
            style={{ textAlign: "center", padding: "16px", background: "#0a0a0a", color: "#f5f4f0", fontSize: "14px", fontWeight: 500, letterSpacing: "0.03em", textDecoration: "none", borderRadius: "3px" }}>
            Cotizá por WhatsApp
          </a>
          <a href="/login" onClick={() => setMenuOpen(false)}
            style={{ textAlign: "center", padding: "14px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", textDecoration: "none" }}>
            Ingresar a mi cuenta
          </a>
        </div>
      </div>

      {/* ── Smooth scroll wraps todo ── */}
      <SmoothScroll>
        <main style={{ fontFamily: "var(--font-sans)", background: "#f5f4f0", paddingTop: "60px" }}>

          {/* ── HERO — dark full-bleed con video de fabricación ── */}
          <section ref={heroRef} className="hero-grid" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            minHeight: "calc(100vh - 60px)",
            position: "relative",
            background: "#0a0a0a",
            overflow: "hidden",
          }}>

            {/* Video full-bleed — object-fit:cover cubre cualquier proporción (desktop 16:9, mobile portrait) */}
            <video autoPlay muted loop playsInline preload="auto"
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                mixBlendMode: "screen",
                opacity: 0.28,
                filter: "brightness(0.85) saturate(0.8) contrast(1.2)",
                pointerEvents: "none", zIndex: 0,
              }}>
              <source src={HERO_VID} type="video/mp4" />
            </video>

            {/* Contenido izquierdo — animaciones CSS directas, sin observer */}
            <div className="hero-copy" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(48px, 8vh, 88px) clamp(24px, 5vw, 64px)", position: "relative", zIndex: 1 }}>

              <p className="hero-anim" style={{ animationDelay: "0.1s", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "24px" }}>
                Fabricantes directos · CABA y GBA
              </p>

              <SplitLines
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.8rem, 7.5vw, 7.5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", color: "#f5f4f0", marginBottom: "28px" }}
                baseDelay={0.2}
              >{"Puertas\ncorredizas\na tu medida."}</SplitLines>

              <p className="hero-anim" style={{ animationDelay: "0.55s", fontSize: "15px", lineHeight: 1.75, color: "rgba(255,255,255,0.7)", maxWidth: "340px", marginBottom: "36px" }}>
                Fabricamos e instalamos en tu casa, sin obra.<br />Medidas exactas, precio en minutos.
              </p>

              <div className="hero-anim" style={{ animationDelay: "0.7s", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "clamp(40px, 6vh, 64px)" }}>
                <a href="#configurador"
                  style={{ padding: "14px 28px", background: "#f5f4f0", color: "#0a0a0a", fontSize: "14px", fontWeight: 500, letterSpacing: "0.01em", textDecoration: "none", borderRadius: "3px", transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  Armá tu puerta →
                </a>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "14px 28px", background: "transparent", color: "#f5f4f0", fontSize: "14px", fontWeight: 400, letterSpacing: "0.01em", textDecoration: "none", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.25)", transition: "border-color 0.2s, background 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#f5f4f0"; e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.background = "transparent" }}>
                  Consultar por WhatsApp
                </a>
              </div>

              {/* Stats */}
              <div className="hero-anim" style={{ animationDelay: "0.85s", display: "flex", gap: "clamp(24px, 4vw, 48px)", paddingTop: "clamp(20px, 3vh, 32px)", borderTop: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>
                {[{ n: "+15.000", l: "Puertas vendidas" }, { n: "+6 años", l: "En el rubro" }, { n: "6", l: "Cuotas sin interés" }].map(({ n, l }) => (
                  <div key={l}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, lineHeight: 1, color: "#f5f4f0" }}>{n}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "5px", letterSpacing: "0.02em" }}>{l}</p>
                  </div>
                ))}
              </div>

              {/* Pie de hero */}
              <p className="hero-anim" style={{ animationDelay: "1s", marginTop: "clamp(24px, 4vh, 40px)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>
                San Justo, La Matanza · Buenos Aires · Fábrica propia
              </p>
            </div>

            {/* Lado derecho — ficha técnica flotante */}
            <div className="hero-img" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(32px, 5vw, 64px)" }}>
              <div className="hero-anim hero-spec" style={{
                animationDelay: "0.6s",
                width: "100%", maxWidth: "360px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
                borderRadius: "4px",
                padding: "clamp(24px, 3vw, 36px)",
              }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>
                  Ficha técnica
                </p>
                {[
                  { k: "Corte a medida", v: "Precisión ± 1 mm" },
                  { k: "Material", v: "Melamina" },
                  { k: "Entrega", v: "7 a 15 días hábiles" },
                  { k: "Garantía", v: "12 meses" },
                ].map((row, i, arr) => (
                  <div key={row.k} style={{
                    display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px",
                    padding: "14px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>{row.k}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.6vw, 1.25rem)", fontWeight: 300, color: "#f5f4f0", textAlign: "right", lineHeight: 1.2 }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── GALERÍA / CARRUSEL ── */}
          <section id="galeria" style={{ background: "#f5f4f0", padding: "clamp(80px, 10vh, 120px) clamp(24px, 5vw, 56px)" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
              <div>
                <Curtain>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#666", marginBottom: "16px" }}>
                    Nuestros modelos
                  </p>
                </Curtain>
                <SplitLines
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05 }}
                  baseDelay={0.05}
                >{"Lo que construimos."}</SplitLines>
              </div>
              <Curtain delay={0.3}>
                <div style={{ display: "flex", gap: "8px", paddingBottom: "6px" }}>
                  {([-1, 1] as const).map(dir => (
                    <button key={dir} onClick={() => scrollSlider(dir)}
                      aria-label={dir === -1 ? "Anterior" : "Siguiente"}
                      style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        border: "1px solid rgba(0,0,0,0.12)", background: "transparent",
                        cursor: "pointer", fontSize: "14px", color: "#0a0a0a",
                        transition: "background 0.15s, color 0.15s, border-color 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.color = "#f5f4f0"; e.currentTarget.style.borderColor = "#0a0a0a" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0a0a0a"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)" }}
                    >{dir === -1 ? "←" : "→"}</button>
                  ))}
                </div>
              </Curtain>
            </div>

            <Curtain>
              <div className="product-slider" ref={sliderRef}>
                {[
                  { img: "/puerta-granero.webp",  alt: "Puerta estilo granero",            title: "Estilo granero",           tag: "Corrediza simple · Living",          tipo: "corredera_simple" as const, premium: false },
                  { img: "/puerta-granero.webp",  alt: "Puerta estilo granero premium",    title: "Estilo granero Premium",   tag: "Aluminio anti-humedad · Living",     tipo: "corredera_simple" as const, premium: true  },
                  { img: "/puerta-blanca.webp",   alt: "Puerta corrediza blanca",          title: "Lisa blanca",              tag: "Corrediza simple · Dormitorio",      tipo: "corredera_simple" as const, premium: false },
                  { img: "/puerta-blanca.webp",   alt: "Puerta corrediza blanca premium",  title: "Lisa blanca Premium",      tag: "Aluminio anti-humedad · Baño",       tipo: "corredera_simple" as const, premium: true  },
                  { img: "/puerta-producto.webp", alt: "Modelo de puerta plegable",        title: "Plegable doble",           tag: "Plegable doble · Ambientes amplios", tipo: "plegable_doble"   as const, premium: false },
                  { img: "/puerta-producto.webp", alt: "Modelo de puerta plegable premium",title: "Plegable doble Premium",   tag: "Aluminio anti-humedad · Amplios",    tipo: "plegable_doble"   as const, premium: true  },
                ].map(p => (
                  <div key={p.title} className="product-slider-item">
                    <ProductCard {...p} />
                  </div>
                ))}
              </div>
            </Curtain>
          </section>

          {/* ── TESTIMONIOS — social proof antes de convertir ── */}
          <section style={{ background: "#0a0a0a", padding: "clamp(80px, 10vh, 120px) clamp(24px, 5vw, 56px)" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "clamp(48px, 7vh, 72px)" }}>
              <div>
                <Curtain>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px" }}>Lo que dicen nuestros clientes</p>
                </Curtain>
                <SplitLines
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 200, letterSpacing: "-0.025em", lineHeight: 1, color: "#f5f4f0" }}
                  baseDelay={0.05}
                >{"15.000 hogares\ntransformados."}</SplitLines>
              </div>
              <Curtain delay={0.3}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", paddingBottom: "8px" }}>
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} style={{ color: "#f5c842", fontSize: "22px", lineHeight: 1 }}>{s}</span>
                  ))}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.45)", marginLeft: "10px", letterSpacing: "0.06em" }}>5/5 promedio</span>
                </div>
              </Curtain>
            </div>

            <div className="testimonios-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
              {[
                { texto: "Excelente calidad. La puerta quedó perfecta en el baño, exactamente a medida. La instalación fue rápida y limpia.", nombre: "Valeria M.", lugar: "Morón, GBA Oeste", inicial: "V" },
                { texto: "Pagué en cuotas y me ahorraron la obra completa. No sabía que era tan fácil. Me mandaron fotos de todo el proceso.", nombre: "Lucas T.", lugar: "Palermo, CABA", inicial: "L" },
                { texto: "Vine por Instagram y no me arrepiento. Precio justo y resultado increíble. Los recomiendo 100%.", nombre: "Sofía R.", lugar: "La Matanza, GBA", inicial: "S" },
              ].map((t, i) => (
                <Curtain key={t.nombre} delay={i * 0.12}>
                  <div style={{
                    padding: "clamp(28px, 4vw, 44px)",
                    background: i === 1 ? "#f5f4f0" : "#111",
                    height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "32px",
                    minHeight: "280px",
                  }}>
                    <div>
                      <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
                        {"★★★★★".split("").map((s, j) => (
                          <span key={j} style={{ color: i === 1 ? "#c8a800" : "#f5c842", fontSize: "14px" }}>{s}</span>
                        ))}
                      </div>
                      <p style={{
                        fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                        fontWeight: 300, fontStyle: "italic", lineHeight: 1.65,
                        color: i === 1 ? "#222" : "rgba(255,255,255,0.82)",
                        letterSpacing: "-0.01em",
                      }}>
                        &ldquo;{t.texto}&rdquo;
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{
                        width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                        background: i === 1 ? "#0a0a0a" : "#f5f4f0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 500, color: i === 1 ? "#f5f4f0" : "#0a0a0a" }}>{t.inicial}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: i === 1 ? "#0a0a0a" : "#f5f4f0", letterSpacing: "0.01em" }}>{t.nombre}</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: i === 1 ? "#666" : "rgba(255,255,255,0.4)", marginTop: "3px", letterSpacing: "0.06em" }}>{t.lugar}</p>
                      </div>
                    </div>
                  </div>
                </Curtain>
              ))}
            </div>
          </section>

          {/* ── CONFIGURADOR ── */}
          <section id="configurador" style={{ borderTop: "1px solid rgba(0,0,0,0.08)", background: "#f5f4f0" }}>
            <Configurador />
          </section>

          {/* ── CÓMO FUNCIONA — imagen de fondo ── */}
          <section id="como-funciona" style={{ position: "relative", color: "#f5f4f0", padding: "clamp(120px, 14vh, 160px) clamp(24px, 5vw, 56px)" }}>
            <DarkBg src="/puerta-blanca.webp" opacity={0.25} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Curtain>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "16px" }}>Sin vueltas</p>
              </Curtain>
              <SplitLines
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "0" }}
                baseDelay={0.05}
              >{"Cómo funciona"}</SplitLines>

              <DarkRule my={56} />

              <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid rgba(255,255,255,0.22)" }}>
                {[
                  { n: "1", title: "Armás tu puerta",  desc: "Completás el configurador con ambiente, modelo y medidas. El precio aparece al instante." },
                  { n: "2", title: "Pagás en cuotas",   desc: "Pagás con Mercado Pago en hasta 6 cuotas. Confirmamos y programamos la entrega." },
                  { n: "3", title: "Lo instalamos",     desc: "Vamos a tu domicilio en CABA o GBA. Sin obra, sin drama, sin vueltas." },
                ].map((s, i) => (
                  <Curtain key={s.n} delay={i * 0.1} className="step-item"
                    style={{ padding: "clamp(28px, 4vw, 48px) clamp(16px, 3vw, 36px)", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.22)" : "none" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 7vw, 6rem)", fontWeight: 200, lineHeight: 1, color: "rgba(255,255,255,0.2)", marginBottom: "20px" }}>{s.n}</p>
                    <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "10px" }}>{s.title}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}>{s.desc}</p>
                  </Curtain>
                ))}
              </div>
            </div>
          </section>

          {/* ── DÓNDE ESTAMOS ── */}
          <section style={{ background: "#f5f4f0", padding: "clamp(80px, 10vh, 120px) clamp(24px, 5vw, 56px)" }}>
            <Curtain>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#666", marginBottom: "16px" }}>
                Dónde estamos
              </p>
            </Curtain>
            <SplitLines
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "48px" }}
              baseDelay={0.05}
            >{"Fabricamos en\nSan Justo."}</SplitLines>

            <div className="map-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "48px", alignItems: "start" }}>
              {/* Info */}
              <Curtain>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", marginBottom: "8px" }}>Dirección</p>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                      Venezuela y Arieta<br />San Justo, La Matanza<br />Buenos Aires Oeste
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", marginBottom: "8px" }}>Horario</p>
                    <p style={{ fontSize: "14px", fontWeight: 300, color: "#444", lineHeight: 1.6 }}>
                      Lun–Vie · 9 a 19 hs<br />Sáb · 9 a 15 hs
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", marginBottom: "8px" }}>Zona de entrega</p>
                    <p style={{ fontSize: "14px", fontWeight: 300, color: "#444", lineHeight: 1.6 }}>
                      CABA y Gran Buenos Aires
                    </p>
                  </div>
                </div>
              </Curtain>

              {/* Mapa */}
              <Curtain>
                <div style={{ borderRadius: "3px", overflow: "hidden", height: "320px", border: "1px solid rgba(0,0,0,0.08)" }}>
                  <iframe
                    src="https://maps.google.com/maps?q=Venezuela+y+Arieta+San+Justo+La+Matanza+Buenos+Aires&output=embed&hl=es&z=15"
                    style={{ width: "100%", height: "100%", border: "none" }}
                    loading="lazy"
                    title="Ubicación Diseños JK — San Justo, La Matanza"
                  />
                </div>
              </Curtain>
            </div>
          </section>

          {/* ── PARA EL RUBRO — sección B2B ── */}
          <section style={{ position: "relative", color: "#f5f4f0", padding: "clamp(100px, 12vh, 140px) clamp(24px, 5vw, 56px)" }}>
            <DarkBg src="/puerta-granero.webp" opacity={0.25} />
            <div style={{ position: "relative", zIndex: 1 }}>

              <div className="b2b-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(48px, 6vw, 96px)", alignItems: "start" }}>

                {/* Izquierda — pitch */}
                <div>
                  <Curtain>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "16px" }}>
                      Para carpinteros · instaladores · constructoras
                    </p>
                  </Curtain>
                  <SplitLines
                    style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.8rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.02, marginBottom: "32px" }}
                    baseDelay={0.05}
                  >{"¿Trabajás\nen el rubro?"}</SplitLines>
                  <Curtain delay={0.2}>
                    <p style={{ fontSize: "15px", lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: "420px", marginBottom: "40px" }}>
                      Somos fábrica. Eso significa que podés comprar al precio que ningún local te da,
                      pedir el volumen que necesitás y recibir las puertas en obra, a medida exacta.
                      Sin intermediarios, sin demoras de stock.
                    </p>
                  </Curtain>
                  {/* Tabla de descuentos por volumen */}
                  <Curtain delay={0.25}>
                    <div style={{ marginBottom: "32px" }}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>
                        Descuentos por volumen
                      </p>
                      <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", overflow: "hidden" }}>
                        {[
                          { rango: "1–4 puertas",   desc: "Precio de lista",   badge: null },
                          { rango: "5–9 puertas",   desc: "Precio mayorista",  badge: "−5%" },
                          { rango: "10–19 puertas", desc: "Distribuidor",      badge: "−8%" },
                          { rango: "20+ puertas",   desc: "Precio de fábrica", badge: "−10%" },
                        ].map((row, i) => (
                          <div key={row.rango} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "13px 18px",
                            background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent",
                            borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                          }}>
                            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.4)", minWidth: "90px" }}>{row.rango}</span>
                              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: 300 }}>{row.desc}</span>
                            </div>
                            {row.badge && (
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: "#f5f4f0", background: "rgba(255,255,255,0.12)", padding: "3px 10px", borderRadius: "100px", letterSpacing: "0.05em" }}>
                                {row.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <p style={{ marginTop: "10px", fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
                        Descuentos sobre precio final. Contactanos para coordinar producción.
                      </p>
                    </div>
                  </Curtain>

                  <Curtain delay={0.3}>
                    <a href={`${WA_URL.replace("quiero consultar", "soy del rubro y quiero consultar precio mayorista")}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", background: "#f5f4f0", color: "#0a0a0a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.03em", textDecoration: "none", borderRadius: "3px", transition: "opacity 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                      Consultar precio mayorista →
                    </a>
                  </Curtain>
                </div>

                {/* Derecha — propuestas de valor */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    { n: "01", title: "Precio de fábrica",      desc: "Comprás directo al fabricante. Sin pasar por distribuidor ni local. El margen es tuyo." },
                    { n: "02", title: "Blanco para revendedores", desc: "Sin marca en la puerta. La vendés como tuya, la hacemos nosotros. Ideal para muebleros e instaladores." },
                    { n: "03", title: "Pedidos en volumen",      desc: "Desde una unidad hasta stock para tu local. Coordinamos producción según tu obra o proyecto." },
                    { n: "04", title: "Factura A disponible",    desc: "Trabajamos con personas y empresas. Emitimos factura A para constructoras y profesionales." },
                  ].map((item, i) => (
                    <Curtain key={item.n} delay={i * 0.08}>
                      <div className="b2b-item" style={{ padding: "24px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", transition: "padding-left 0.25s", cursor: "default" }}
                        onMouseEnter={e => (e.currentTarget.style.paddingLeft = "12px")}
                        onMouseLeave={e => (e.currentTarget.style.paddingLeft = "0")}>
                        <div style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>{item.n}</span>
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 500, color: "#f5f4f0", marginBottom: "6px", lineHeight: 1.3 }}>{item.title}</p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    </Curtain>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* ── CTA FINAL — imagen de fondo ── */}
          <section style={{ position: "relative", color: "#f5f4f0", padding: "clamp(120px, 14vh, 160px) clamp(24px, 5vw, 56px)", textAlign: "center", overflow: "hidden" }}>
            <DarkBg src="/puerta-producto.webp" opacity={0.3} />

            {/* JK watermark — más sutil */}
            <p style={{
              position: "absolute", inset: 0, zIndex: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontSize: "28vw",
              color: "rgba(255,255,255,0.06)", lineHeight: 1,
              fontWeight: 200, letterSpacing: "-0.03em",
              pointerEvents: "none", userSelect: "none",
            }}>JK</p>

            <div style={{ position: "relative", zIndex: 1 }}>
              <Curtain>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "20px" }}>
                  Empezá hoy
                </p>
              </Curtain>
              <SplitLines
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem, 6vw, 6rem)", fontWeight: 200, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "0" }}
                baseDelay={0.1}
              >{"¿Querés renovar\ntu espacio?"}</SplitLines>

              <DarkRule my={40} />

              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginBottom: "36px" }}>
                Escribinos y en minutos te damos precio. Sin compromiso.
              </p>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  background: "#fff", color: "#0a0a0a",
                  fontSize: "13px", fontWeight: 500, letterSpacing: "0.03em",
                  textDecoration: "none", borderRadius: "3px",
                  transition: `opacity 0.2s ${EAZE}, transform 0.2s ${EAZE}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.02)" }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)" }}>
                Consultá ahora →
              </a>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}>
            {/* Cuerpo */}
            <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "clamp(32px, 5vw, 64px)", padding: "clamp(48px, 7vh, 80px) clamp(24px, 5vw, 56px)" }}>

              {/* Columna 1 — marca */}
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 300, color: "#f5f4f0", letterSpacing: "0.01em", marginBottom: "14px" }}>Diseños JK</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#444", lineHeight: 1.8, marginBottom: "24px" }}>
                  Fabricantes directos de puertas<br />corredizas y plegables a medida.<br />San Justo, Buenos Aires.
                </p>
                <div style={{ display: "flex", gap: "14px" }}>
                  {[["Instagram", IG_URL], ["WhatsApp", WA_URL]].map(([l, h]) => (
                    <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                      className="nav-link"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#555" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#999")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#555")}>{l}</a>
                  ))}
                </div>
              </div>

              {/* Columna 2 — links */}
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#444", marginBottom: "20px" }}>Navegar</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[...NAV_LINKS, ["Ingresar", "/login"]].map(([l, h]) => (
                    <a key={l} href={h}
                      className="nav-link"
                      style={{ fontSize: "13px", fontWeight: 300, color: "#666", letterSpacing: "0.01em" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#f5f4f0")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>

              {/* Columna 3 — contacto */}
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#444", marginBottom: "20px" }}>Contacto</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#444", marginBottom: "6px" }}>Dirección</p>
                    <p style={{ fontSize: "13px", fontWeight: 300, color: "#666", lineHeight: 1.7 }}>Venezuela y Arieta<br />San Justo, La Matanza</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#444", marginBottom: "6px" }}>Horario</p>
                    <p style={{ fontSize: "13px", fontWeight: 300, color: "#666", lineHeight: 1.7 }}>Lun–Vie · 9 a 19 hs<br />Sáb · 9 a 15 hs</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Barra inferior */}
            <div style={{ borderTop: "1px solid #1a1a1a", padding: "16px clamp(24px, 5vw, 56px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#333" }}>
                © 2026 Diseños JK · CABA y GBA
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2a2a2a" }}>
                Fabricantes directos · Hecho en San Justo
              </p>
            </div>
          </footer>

        </main>
      </SmoothScroll>
    </>
  )
}

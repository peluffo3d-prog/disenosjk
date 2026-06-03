"use client"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useRef, useEffect, useState } from "react"
import Configurador from "@/components/Configurador"
import SmoothScroll from "@/components/SmoothScroll"
import Curtain from "@/components/Curtain"
import SplitLines from "@/components/SplitLines"
import ScaleImage from "@/components/ScaleImage"

const DoorIntro = dynamic(() => import("@/components/DoorIntro"), { ssr: false })

const WA_URL = "https://wa.me/5491100000000?text=Hola!%20Vi%20la%20web%20y%20quiero%20consultar"
const IG_URL = "https://instagram.com/disenosjk_"
const EAZE   = "cubic-bezier(0.76, 0, 0.24, 1)"

function WAIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  const [waVisible, setWaVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // WA button visible cuando hero sale del viewport — IntersectionObserver, sin scroll listener
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setWaVisible(!e.isIntersecting),
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ── Elementos fixed FUERA del smooth scroll ── */}
      <DoorIntro />

      {/* WA flotante — z-index sobre el container de smooth scroll */}
      <a href={WA_URL} target="_blank" rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 200,
          width: "54px", height: "54px", borderRadius: "50%",
          background: "#25D366", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
          opacity: waVisible ? 1 : 0,
          transform: waVisible ? "scale(1)" : "scale(0.7)",
          pointerEvents: waVisible ? "auto" : "none",
          transition: `opacity 0.35s ${EAZE}, transform 0.35s ${EAZE}`,
        }}>
        <WAIcon size={25} />
      </a>

      {/* Nav fija — z-index sobre smooth scroll */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px, 5vw, 56px)",
        height: "60px",
        background: "rgba(245,244,240,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 400, letterSpacing: "0.02em" }}>
          Diseños JK
        </span>
        <div className="nav-links" style={{ display: "flex", gap: "32px" }}>
          {[["Catálogo", "#galeria"], ["Cómo funciona", "#como-funciona"], ["Cotizá", "#configurador"]].map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: "13px", fontWeight: 500, color: "#666", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0a0a0a")}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}>{l}</a>
          ))}
        </div>
      </nav>

      {/* ── Smooth scroll wraps todo el contenido ── */}
      <SmoothScroll>
        <main style={{ fontFamily: "var(--font-sans)", background: "#f5f4f0", paddingTop: "60px" }}>

          {/* ── HERO ─────────────────────────────────────────────────── */}
          <section ref={heroRef} className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 60px)" }}>

            {/* Texto */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(48px, 8vh, 88px) clamp(24px, 5vw, 64px)" }}>
              <Curtain delay={0.1}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: "24px" }}>
                  Fabricantes directos · CABA y GBA
                </p>
              </Curtain>

              <SplitLines
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3.8rem, 7.5vw, 7.5rem)",
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "#0a0a0a",
                  marginBottom: "28px",
                }}
                baseDelay={0.15}
              >
                {"Puertas\ncorredizas\na tu medida."}
              </SplitLines>

              <Curtain delay={0.5}>
                <p style={{ fontSize: "15px", lineHeight: 1.75, color: "#777", maxWidth: "340px", marginBottom: "40px" }}>
                  Fabricamos e instalamos en tu casa, sin obra.<br />Elegís el modelo, cotizás en minutos.
                </p>
              </Curtain>

              <Curtain delay={0.65}>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "clamp(40px, 6vh, 64px)" }}>
                  <a href="#configurador" style={{ padding: "13px 26px", background: "#0a0a0a", color: "#f5f4f0", fontSize: "14px", fontWeight: 500, textDecoration: "none", borderRadius: "3px", transition: "opacity 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.78")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    Armá tu puerta
                  </a>
                  <a href="#galeria" style={{ fontSize: "13px", color: "#888", textDecoration: "none", paddingBottom: "2px", borderBottom: "1px solid #ccc", transition: "color 0.15s, border-color 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#0a0a0a"; e.currentTarget.style.borderColor = "#0a0a0a" }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#ccc" }}>
                    Ver modelos →
                  </a>
                </div>
              </Curtain>

              <Curtain delay={0.75}>
                <div style={{ display: "flex", gap: "clamp(24px, 4vw, 48px)", paddingTop: "clamp(24px, 4vh, 36px)", borderTop: "1px solid rgba(0,0,0,0.1)", flexWrap: "wrap" }}>
                  {[{ n: "+500", l: "Puertas instaladas" }, { n: "41K", l: "Seguidores en IG" }, { n: "6", l: "Cuotas sin interés" }].map(({ n, l }) => (
                    <div key={l}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, lineHeight: 1, color: "#0a0a0a" }}>{n}</p>
                      <p style={{ fontSize: "11px", color: "#aaa", marginTop: "5px" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </Curtain>
            </div>

            {/* Foto con parallax — data-parallax="0.5" → se mueve a 0.5x */}
            <div className="hero-img" style={{ position: "relative", background: "#e0dbd4", overflow: "hidden" }}>
              <div data-parallax="0.5" style={{ position: "absolute", inset: "-8%", height: "116%", width: "100%" }}>
                <Image src="/puerta-granero.webp" alt="Puerta corrediza en living" fill
                  className="object-cover" style={{ objectPosition: "center" }} priority />
              </div>
            </div>
          </section>

          {/* ── POR QUÉ NOSOTROS ─────────────────────────────────────── */}
          <section style={{ background: "#0a0a0a", color: "#f5f4f0", padding: "clamp(64px, 10vh, 104px) clamp(24px, 5vw, 56px)" }}>
            <Curtain>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#444", marginBottom: "16px" }}>
                Por qué elegirnos
              </p>
            </Curtain>
            <SplitLines
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: "56px" }}
              baseDelay={0.05}
            >
              {"Fabricantes.\nNo revendedores."}
            </SplitLines>

            <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid #1a1a1a", borderRadius: "3px", overflow: "hidden" }}>
              {[
                { n: "01", title: "Fabricación propia",  desc: "Cada puerta desde cero a tus medidas. Sin stock genérico." },
                { n: "02", title: "A medida",            desc: "No adaptamos estándar. Fabricamos desde el primer milímetro." },
                { n: "03", title: "Envío incluido",      desc: "Llegamos a CABA y GBA. El precio es el precio final." },
                { n: "04", title: "Hasta 6 cuotas",      desc: "Pagá en cuotas sin interés a través de Mercado Libre." },
              ].map((item, i) => (
                <Curtain key={item.n} delay={i * 0.1} style={{ height: "100%" }}>
                  <div className="why-item" style={{ padding: "32px 24px", height: "100%", borderRight: i < 3 ? "1px solid #1a1a1a" : "none", transition: "background 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#111")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#333", marginBottom: "18px" }}>{item.n}</p>
                    <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "10px", lineHeight: 1.3 }}>{item.title}</p>
                    <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </Curtain>
              ))}
            </div>
          </section>

          {/* ── GALERÍA ──────────────────────────────────────────────── */}
          <section id="galeria" style={{ background: "#f5f4f0", padding: "clamp(64px, 10vh, 104px) clamp(24px, 5vw, 56px)" }}>
            <Curtain>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: "16px" }}>
                Nuestros modelos
              </p>
            </Curtain>
            <SplitLines
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: "40px" }}
              baseDelay={0.05}
            >
              {"Lo que construimos."}
            </SplitLines>

            <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "auto auto", gap: "8px" }}>
              <ScaleImage style={{ gridRow: "1 / 3", position: "relative", aspectRatio: "3/4" }}>
                <Image src="/puerta-granero.webp" alt="Puerta estilo granero" fill className="object-cover" style={{ borderRadius: "3px" }} />
                <GLabel text="Estilo granero · Living" />
              </ScaleImage>
              <ScaleImage style={{ position: "relative", aspectRatio: "4/3" }}>
                <Image src="/puerta-blanca.webp" alt="Puerta corrediza blanca" fill className="object-cover" style={{ borderRadius: "3px" }} />
                <GLabel text="Lisa blanca · Dormitorio" />
              </ScaleImage>
              <ScaleImage style={{ position: "relative", aspectRatio: "4/3" }}>
                <Image src="/puerta-producto.webp" alt="Modelo de puerta" fill className="object-cover object-center" style={{ borderRadius: "3px" }} />
                <GLabel text="Modelo estándar" />
              </ScaleImage>
            </div>
          </section>

          {/* ── CONFIGURADOR ─────────────────────────────────────────── */}
          <section id="configurador" style={{ borderTop: "1px solid rgba(0,0,0,0.08)", background: "#f5f4f0" }}>
            <Configurador />
          </section>

          {/* ── CÓMO FUNCIONA ────────────────────────────────────────── */}
          <section id="como-funciona" style={{ background: "#0a0a0a", color: "#f5f4f0", padding: "clamp(64px, 10vh, 104px) clamp(24px, 5vw, 56px)" }}>
            <Curtain>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#444", marginBottom: "16px" }}>Sin vueltas</p>
            </Curtain>
            <SplitLines
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: "56px" }}
              baseDelay={0.05}
            >{"Cómo funciona"}</SplitLines>

            <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid #1a1a1a" }}>
              {[
                { n: "1", title: "Armás tu puerta",  desc: "Completás el configurador con ambiente, modelo y medidas. El precio aparece al instante." },
                { n: "2", title: "Pagás en cuotas",   desc: "Pagás con Mercado Pago en hasta 6 cuotas. Confirmamos y programamos la entrega." },
                { n: "3", title: "Lo instalamos",     desc: "Vamos a tu domicilio en CABA o GBA. Sin obra, sin drama, sin vueltas." },
              ].map((s, i) => (
                <Curtain key={s.n} delay={i * 0.1} className="step-item"
                  style={{ padding: "clamp(28px, 4vw, 48px) clamp(16px, 3vw, 36px)", borderRight: i < 2 ? "1px solid #1a1a1a" : "none" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 7vw, 6rem)", fontWeight: 300, lineHeight: 1, color: "#222", marginBottom: "20px" }}>{s.n}</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "10px" }}>{s.title}</p>
                  <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.75 }}>{s.desc}</p>
                </Curtain>
              ))}
            </div>
          </section>

          {/* ── TESTIMONIOS ──────────────────────────────────────────── */}
          <section style={{ background: "#f5f4f0", padding: "clamp(64px, 10vh, 104px) clamp(24px, 5vw, 56px)" }}>
            <Curtain>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: "16px" }}>Clientes</p>
            </Curtain>
            <SplitLines
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: "48px" }}
              baseDelay={0.05}
            >{"500 hogares\ntransformados."}</SplitLines>

            <div className="testimonios-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[
                { texto: '"Excelente calidad. La puerta quedó perfecta en el baño, exactamente a medida. La instalación fue rápida y limpia."', nombre: "Valeria M.", lugar: "Morón, GBA Oeste" },
                { texto: '"Pagué en cuotas y me ahorraron la obra completa. No sabía que era tan fácil. Me mandaron fotos de todo el proceso."', nombre: "Lucas T.", lugar: "Palermo, CABA" },
                { texto: '"Vine por Instagram y no me arrepiento. Precio justo y resultado increíble. Los recomiendo 100%."', nombre: "Sofía R.", lugar: "La Matanza, GBA" },
              ].map((t, i) => (
                <Curtain key={t.nombre} delay={i * 0.1}>
                  <div style={{ padding: "24px 22px", background: "#ece9e3", borderRadius: "3px", height: "100%" }}>
                    <p style={{ fontSize: "17px", lineHeight: 1.6, color: "#444", marginBottom: "20px", fontFamily: "var(--font-display)", fontWeight: 300, fontStyle: "italic" }}>{t.texto}</p>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#0a0a0a" }}>{t.nombre}</p>
                    <p style={{ fontSize: "11px", color: "#999", marginTop: "3px" }}>{t.lugar}</p>
                  </div>
                </Curtain>
              ))}
            </div>
          </section>

          {/* ── CTA FINAL ────────────────────────────────────────────── */}
          <section style={{ background: "#0a0a0a", color: "#f5f4f0", padding: "clamp(64px, 12vh, 112px) clamp(24px, 5vw, 56px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <p style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "22vw", color: "rgba(255,255,255,0.025)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>JK</p>

            <Curtain style={{ position: "relative" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#444", marginBottom: "16px" }}>Empezá hoy</p>
              <SplitLines
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem, 6vw, 6rem)", fontWeight: 300, letterSpacing: "-0.015em", lineHeight: 1.05, marginBottom: "16px" }}
                baseDelay={0.1}
              >{"¿Querés renovar\ntu espacio?"}</SplitLines>
              <p style={{ fontSize: "15px", color: "#666", marginBottom: "36px", marginTop: "16px" }}>Escribinos y en minutos te damos precio. Sin compromiso.</p>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 28px", background: "#25D366", color: "#fff", fontSize: "14px", fontWeight: 500, textDecoration: "none", borderRadius: "3px", transition: `opacity 0.2s ${EAZE}, transform 0.2s ${EAZE}` }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)" }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)" }}>
                <WAIcon size={17} />
                Consultá por WhatsApp
              </a>
            </Curtain>
          </section>

          {/* ── FOOTER ───────────────────────────────────────────────── */}
          <footer style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a", padding: "20px clamp(24px, 5vw, 56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 300, color: "#f5f4f0" }}>Diseños JK</span>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#333" }}>CABA y GBA · Fabricantes directos</p>
            <div style={{ display: "flex", gap: "20px" }}>
              {[["Instagram", IG_URL], ["WhatsApp", WA_URL]].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#444", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#888")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#444")}>{l}</a>
              ))}
            </div>
          </footer>

        </main>
      </SmoothScroll>
    </>
  )
}

function GLabel({ text }: { text: string }) {
  return (
    <div style={{ position: "absolute", bottom: "12px", left: "12px", padding: "6px 12px", background: "rgba(10,10,10,0.68)", borderRadius: "2px" }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>{text}</p>
    </div>
  )
}

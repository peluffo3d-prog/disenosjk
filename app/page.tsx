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

// ─── Backgrounds para secciones oscuras ──────────────────────────────────────
function DarkBg({ src, opacity = 0.35 }: { src: string; opacity?: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Image src={src} alt="" fill className="object-cover" style={{ opacity }} priority={false} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)" }} />
    </div>
  )
}

// ─── Divisor para secciones oscuras ──────────────────────────────────────────
function DarkRule({ my = 56 }: { my?: number }) {
  return <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.12)", margin: `${my}px 0` }} />
}

// ─── Label de galería ─────────────────────────────────────────────────────────
function GLabel({ text }: { text: string }) {
  return (
    <div style={{ position: "absolute", bottom: "12px", left: "12px", padding: "6px 12px", background: "rgba(10,10,10,0.65)", borderRadius: "2px" }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>{text}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [waVisible, setWaVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

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
        <div className="nav-links" style={{ display: "flex", gap: "32px" }}>
          {[["Catálogo", "#galeria"], ["Cómo funciona", "#como-funciona"], ["Cotizá", "#configurador"]].map(([l, h]) => (
            <a key={l} href={h} style={{
              fontSize: "13px", fontWeight: 300, letterSpacing: "0.04em",
              color: "#666", textDecoration: "none", transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#0a0a0a")}
            onMouseLeave={e => (e.currentTarget.style.color = "#666")}>{l}</a>
          ))}
        </div>
      </nav>

      {/* ── Smooth scroll wraps todo ── */}
      <SmoothScroll>
        <main style={{ fontFamily: "var(--font-sans)", background: "#f5f4f0", paddingTop: "60px" }}>

          {/* ── HERO ── */}
          <section ref={heroRef} className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 60px)" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(48px, 8vh, 88px) clamp(24px, 5vw, 64px)" }}>
              <Curtain delay={0.1}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: "24px" }}>
                  Fabricantes directos · CABA y GBA
                </p>
              </Curtain>

              <SplitLines
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.8rem, 7.5vw, 7.5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: "28px" }}
                baseDelay={0.15}
              >{"Puertas\ncorredizas\na tu medida."}</SplitLines>

              <Curtain delay={0.5}>
                <p style={{ fontSize: "15px", lineHeight: 1.75, color: "#777", maxWidth: "340px", marginBottom: "40px" }}>
                  Fabricamos e instalamos en tu casa, sin obra.<br />Elegís el modelo, cotizás en minutos.
                </p>
              </Curtain>

              <Curtain delay={0.65}>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "clamp(40px, 6vh, 64px)" }}>
                  <a href="#configurador" style={{ padding: "13px 26px", background: "#0a0a0a", color: "#f5f4f0", fontSize: "14px", fontWeight: 400, letterSpacing: "0.01em", textDecoration: "none", borderRadius: "3px", transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
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
                      <p style={{ fontSize: "11px", color: "#aaa", marginTop: "5px", letterSpacing: "0.02em" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </Curtain>
            </div>

            {/* Foto con parallax */}
            <div className="hero-img" style={{ position: "relative", background: "#e0dbd4", overflow: "hidden" }}>
              <div data-parallax="0.5" style={{ position: "absolute", inset: "-8%", height: "116%", width: "100%" }}>
                <Image src="/puerta-granero.webp" alt="Puerta corrediza en living" fill className="object-cover" style={{ objectPosition: "center" }} priority />
              </div>
            </div>
          </section>

          {/* ── POR QUÉ NOSOTROS — imagen de fondo ── */}
          <section style={{ position: "relative", color: "#f5f4f0", padding: "clamp(120px, 14vh, 160px) clamp(24px, 5vw, 56px)" }}>
            <DarkBg src="/puerta-granero.webp" opacity={0.3} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Curtain>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px" }}>
                  Por qué elegirnos
                </p>
              </Curtain>
              <SplitLines
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "0" }}
                baseDelay={0.05}
              >{"Fabricantes.\nNo revendedores."}</SplitLines>

              <DarkRule my={56} />

              <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                {[
                  { n: "01", title: "Fabricación propia",  desc: "Cada puerta desde cero a tus medidas. Sin stock genérico." },
                  { n: "02", title: "A medida",            desc: "No adaptamos estándar. Fabricamos desde el primer milímetro." },
                  { n: "03", title: "Envío incluido",      desc: "Llegamos a CABA y GBA. El precio es el precio final." },
                  { n: "04", title: "Hasta 6 cuotas",      desc: "Pagá en cuotas sin interés a través de Mercado Libre." },
                ].map((item, i) => (
                  <Curtain key={item.n} delay={i * 0.1} style={{ height: "100%" }}>
                    <div className="why-item" style={{ padding: "32px 24px", height: "100%", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none", transition: "background 0.3s", cursor: "default" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "18px" }}>{item.n}</p>
                      <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "10px", lineHeight: 1.3 }}>{item.title}</p>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.desc}</p>
                    </div>
                  </Curtain>
                ))}
              </div>
            </div>
          </section>

          {/* ── GALERÍA ── */}
          <section id="galeria" style={{ background: "#f5f4f0", padding: "clamp(80px, 10vh, 120px) clamp(24px, 5vw, 56px)" }}>
            <Curtain>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: "16px" }}>
                Nuestros modelos
              </p>
            </Curtain>
            <SplitLines
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "40px" }}
              baseDelay={0.05}
            >{"Lo que construimos."}</SplitLines>

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

          {/* ── CONFIGURADOR ── */}
          <section id="configurador" style={{ borderTop: "1px solid rgba(0,0,0,0.08)", background: "#f5f4f0" }}>
            <Configurador />
          </section>

          {/* ── CÓMO FUNCIONA — imagen de fondo ── */}
          <section id="como-funciona" style={{ position: "relative", color: "#f5f4f0", padding: "clamp(120px, 14vh, 160px) clamp(24px, 5vw, 56px)" }}>
            <DarkBg src="/puerta-blanca.webp" opacity={0.25} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Curtain>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>Sin vueltas</p>
              </Curtain>
              <SplitLines
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "0" }}
                baseDelay={0.05}
              >{"Cómo funciona"}</SplitLines>

              <DarkRule my={56} />

              <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                {[
                  { n: "1", title: "Armás tu puerta",  desc: "Completás el configurador con ambiente, modelo y medidas. El precio aparece al instante." },
                  { n: "2", title: "Pagás en cuotas",   desc: "Pagás con Mercado Pago en hasta 6 cuotas. Confirmamos y programamos la entrega." },
                  { n: "3", title: "Lo instalamos",     desc: "Vamos a tu domicilio en CABA o GBA. Sin obra, sin drama, sin vueltas." },
                ].map((s, i) => (
                  <Curtain key={s.n} delay={i * 0.1} className="step-item"
                    style={{ padding: "clamp(28px, 4vw, 48px) clamp(16px, 3vw, 36px)", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 7vw, 6rem)", fontWeight: 200, lineHeight: 1, color: "rgba(255,255,255,0.2)", marginBottom: "20px" }}>{s.n}</p>
                    <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "10px" }}>{s.title}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>{s.desc}</p>
                  </Curtain>
                ))}
              </div>
            </div>
          </section>

          {/* ── TESTIMONIOS ── */}
          <section style={{ background: "#f5f4f0", padding: "clamp(80px, 10vh, 120px) clamp(24px, 5vw, 56px)" }}>
            <Curtain>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa", marginBottom: "16px" }}>Clientes</p>
            </Curtain>
            {/* Heading grande — impacto máximo */}
            <SplitLines
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(56px, 7vw, 96px)", fontWeight: 200, letterSpacing: "-0.025em", lineHeight: 1, marginBottom: "56px" }}
              baseDelay={0.05}
            >{"500 hogares\ntransformados."}</SplitLines>

            <div className="testimonios-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[
                { texto: '"Excelente calidad. La puerta quedó perfecta en el baño, exactamente a medida. La instalación fue rápida y limpia."', nombre: "Valeria M.", lugar: "Morón, GBA Oeste" },
                { texto: '"Pagué en cuotas y me ahorraron la obra completa. No sabía que era tan fácil. Me mandaron fotos de todo el proceso."', nombre: "Lucas T.", lugar: "Palermo, CABA" },
                { texto: '"Vine por Instagram y no me arrepiento. Precio justo y resultado increíble. Los recomiendo 100%."', nombre: "Sofía R.", lugar: "La Matanza, GBA" },
              ].map((t, i) => (
                <Curtain key={t.nombre} delay={i * 0.1}>
                  <div style={{ padding: "28px 24px", background: "#ece9e3", borderRadius: "3px", height: "100%" }}>
                    <p style={{ fontSize: "18px", lineHeight: 1.6, color: "#555", marginBottom: "24px", fontFamily: "var(--font-display)", fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.01em" }}>{t.texto}</p>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "#0a0a0a", letterSpacing: "0.02em" }}>{t.nombre}</p>
                    <p style={{ fontSize: "11px", color: "#aaa", marginTop: "3px" }}>{t.lugar}</p>
                  </div>
                </Curtain>
              ))}
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
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
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
          <footer style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a", padding: "20px clamp(24px, 5vw, 56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 300, color: "#f5f4f0", letterSpacing: "0.02em" }}>Diseños JK</span>
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

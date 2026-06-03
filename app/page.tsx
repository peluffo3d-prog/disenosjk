"use client"
import Image from "next/image"
import dynamic from "next/dynamic"
import Configurador from "@/components/Configurador"

const DoorIntro = dynamic(() => import("@/components/DoorIntro"), { ssr: false })

const WA_URL = "https://wa.me/5491100000000?text=Hola!%20Vi%20la%20web%20y%20quiero%20consultar"
const IG_URL = "https://instagram.com/disenosjk_"

// Ícono WhatsApp reutilizable
function WAIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function Home() {
  return (
    <>
      <DoorIntro />

      {/* Botón WhatsApp flotante — solo ícono, bottom-right */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 100,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#25D366",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1)",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <WAIcon size={24} />
      </a>

      <main style={{ fontFamily: "var(--font-sans)", background: "#f5f4f0" }}>

        {/* ── NAV ── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(20px, 5vw, 48px)",
          height: "56px",
          background: "#f5f4f0",
          borderBottom: "1px solid #d4d0c8",
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            letterSpacing: "-0.01em",
            color: "#0a0a0a",
          }}>
            {/* TODO: logo SVG real */}
            Diseños JK
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {[
              { label: "Catálogo",       href: "#galeria" },
              { label: "Cómo funciona",  href: "#como-funciona" },
              { label: "Consultanos",    href: "#configurador" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{
                fontSize: "13px", fontWeight: 500,
                color: "#555", textDecoration: "none",
                transition: "color 0.15s",
                /* ocultar en mobile via style inline no es ideal, ver globals */
              }}
              className="nav-link">
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "88vh",
        }} className="hero-grid">

          {/* Texto */}
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "clamp(40px, 8vh, 80px) clamp(20px, 5vw, 48px)",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px", letterSpacing: "0.16em",
              textTransform: "uppercase", color: "#999",
              marginBottom: "28px",
            }}>
              Fabricantes directos · CABA y GBA
            </p>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.2rem, 7vw, 6.5rem)",
              lineHeight: 0.95, letterSpacing: "-0.025em",
              color: "#0a0a0a",
              marginBottom: "24px",
            }}>
              Puertas<br />
              corredizas<br />
              <span style={{ color: "#aaa" }}>a tu medida.</span>
            </h1>

            <p style={{
              fontSize: "15px", lineHeight: 1.65,
              color: "#666", maxWidth: "360px",
              marginBottom: "40px",
            }}>
              Fabricamos e instalamos en tu casa, sin obra. Elegís el modelo, cotizás en minutos.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <a href="#configurador" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "13px 22px",
                background: "#0a0a0a", color: "#f5f4f0",
                fontSize: "14px", fontWeight: 600,
                textDecoration: "none", borderRadius: "4px",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Armá tu puerta
              </a>
              <a href="#galeria" style={{
                fontSize: "13px", color: "#555",
                textDecoration: "none",
                borderBottom: "1px solid #bbb",
                paddingBottom: "2px",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0a0a0a")}
              onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
                Ver modelos →
              </a>
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: "clamp(20px, 4vw, 36px)",
              marginTop: "48px", paddingTop: "28px",
              borderTop: "1px solid #d4d0c8",
              flexWrap: "wrap",
            }}>
              {[
                { n: "+500",   l: "Puertas instaladas" },
                { n: "41K",   l: "Seguidores en IG" },
                { n: "6 ctas",l: "Cuotas en ML" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    lineHeight: 1, color: "#0a0a0a",
                  }}>{n}</p>
                  <p style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Foto */}
          <div style={{ position: "relative", background: "#e8e4dc", minHeight: "300px" }}>
            <Image
              src="/puerta-granero.webp"
              alt="Puerta corrediza estilo granero instalada en living"
              fill
              className="object-cover object-right"
              priority
            />
          </div>
        </section>

        {/* ── POR QUÉ NOSOTROS ── */}
        <section style={{ background: "#0a0a0a", color: "#f5f4f0", padding: "clamp(56px, 10vh, 96px) clamp(20px, 5vw, 48px)" }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#444", marginBottom: "12px",
          }}>Por qué elegirnos</p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            letterSpacing: "-0.02em", lineHeight: 1.05,
            marginBottom: "56px",
          }}>
            Fabricantes.<br />No revendedores.
          </h2>

          <div className="why-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
            border: "1px solid #1f1f1f",
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            {[
              { n: "01", title: "Fabricación propia", desc: "Cada puerta desde cero a tus medidas exactas. Sin stock genérico." },
              { n: "02", title: "A medida",           desc: "No adaptamos estándar. Fabricamos desde el primer milímetro." },
              { n: "03", title: "Envío incluido",     desc: "Llegamos a CABA y GBA. El precio que te damos es el precio final." },
              { n: "04", title: "Hasta 6 cuotas",     desc: "Pagá en cuotas sin interés a través de Mercado Libre." },
            ].map((item, i) => (
              <div key={item.n}
                className="why-item"
                style={{
                  padding: "28px 24px",
                  borderRight: i < 3 ? "1px solid #1f1f1f" : "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#111")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#444", marginBottom: "16px",
                }}>{item.n}</p>
                <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "10px" }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── GALERÍA ── */}
        <section id="galeria" style={{ padding: "clamp(56px, 10vh, 96px) clamp(20px, 5vw, 48px)", background: "#f5f4f0" }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#999", marginBottom: "12px",
          }}>Nuestros modelos</p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            letterSpacing: "-0.02em", lineHeight: 1.05,
            marginBottom: "40px",
          }}>Lo que construimos.</h2>

          {/* Galería asimétrica */}
          <div className="gallery-grid" style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gridTemplateRows: "auto auto",
            gap: "8px",
          }}>
            <div style={{ position: "relative", aspectRatio: "16/10", gridRow: "1 / 3" }}>
              <Image src="/puerta-granero.webp" alt="Puerta estilo granero" fill
                className="object-cover" style={{ borderRadius: "4px" }} />
              <div style={{
                position: "absolute", bottom: "12px", left: "12px",
                padding: "6px 12px",
                background: "rgba(10,10,10,0.72)", borderRadius: "3px",
              }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>
                  Estilo granero · Living
                </p>
              </div>
            </div>
            <div style={{ position: "relative", aspectRatio: "4/3" }}>
              <Image src="/puerta-blanca.webp" alt="Puerta corrediza blanca" fill
                className="object-cover" style={{ borderRadius: "4px" }} />
              <div style={{
                position: "absolute", bottom: "12px", left: "12px",
                padding: "6px 12px",
                background: "rgba(10,10,10,0.72)", borderRadius: "3px",
              }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>
                  Lisa blanca · Dormitorio
                </p>
              </div>
            </div>
            <div style={{ position: "relative", aspectRatio: "4/3" }}>
              <Image src="/puerta-producto.webp" alt="Modelo de puerta" fill
                className="object-cover object-center" style={{ borderRadius: "4px" }} />
              <div style={{
                position: "absolute", bottom: "12px", left: "12px",
                padding: "6px 12px",
                background: "rgba(10,10,10,0.72)", borderRadius: "3px",
              }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>
                  Modelo estándar
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONFIGURADOR ── */}
        <section id="configurador" style={{ borderTop: "1px solid #d4d0c8", background: "#f5f4f0" }}>
          <Configurador />
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section id="como-funciona" style={{
          background: "#0a0a0a", color: "#f5f4f0",
          padding: "clamp(56px, 10vh, 96px) clamp(20px, 5vw, 48px)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#444", marginBottom: "12px",
          }}>Sin vueltas</p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            letterSpacing: "-0.02em", lineHeight: 1.05,
            marginBottom: "56px",
          }}>Cómo funciona</h2>

          <div className="steps-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
            borderTop: "1px solid #1f1f1f",
          }}>
            {[
              { n: "1", title: "Armás tu puerta",   desc: "Completás el configurador con ambiente, modelo y medidas. El precio aparece al instante." },
              { n: "2", title: "Pagás en cuotas",    desc: "Pagás con Mercado Pago en hasta 6 cuotas sin interés. Confirmamos y coordinamos." },
              { n: "3", title: "Lo instalamos",      desc: "Vamos a tu domicilio en CABA o GBA. Sin obra, sin drama." },
            ].map((s, i) => (
              <div key={s.n}
                className="step-item"
                style={{
                  padding: "clamp(28px, 4vw, 48px) clamp(16px, 3vw, 36px)",
                  borderRight: i < 2 ? "1px solid #1f1f1f" : "none",
                }}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  lineHeight: 1, color: "#2a2a2a",
                  marginBottom: "20px",
                }}>{s.n}</p>
                <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "10px" }}>{s.title}</p>
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIOS ── */}
        <section style={{
          background: "#f5f4f0",
          padding: "clamp(56px, 10vh, 96px) clamp(20px, 5vw, 48px)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#999", marginBottom: "12px",
          }}>Clientes</p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            letterSpacing: "-0.02em", lineHeight: 1.05,
            marginBottom: "48px",
          }}>+500 hogares<br />transformados.</h2>

          <div className="testimonios-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}>
            {[
              { texto: '"Excelente calidad. La puerta quedó perfecta en el baño, exactamente a medida. La instalación fue rápida y limpia."', nombre: "Valeria M.", lugar: "Morón, GBA Oeste" },
              { texto: '"No sabía que era tan fácil. Me mandaron fotos de todo el proceso. Pagué en cuotas y me ahorraron la obra completa."', nombre: "Lucas T.", lugar: "Palermo, CABA" },
              { texto: '"Vine por Instagram y no me arrepiento. Atención inmediata, precio justo y resultado increíble. 100% recomendado."', nombre: "Sofía R.", lugar: "La Matanza, GBA" },
            ].map(t => (
              <div key={t.nombre} style={{
                padding: "24px",
                background: "#ebebeb",
                borderRadius: "4px",
              }}>
                <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#444", marginBottom: "20px" }}>{t.texto}</p>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#0a0a0a" }}>{t.nombre}</p>
                <p style={{ fontSize: "11px", color: "#999" }}>{t.lugar}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{
          background: "#0a0a0a", color: "#f5f4f0",
          padding: "clamp(56px, 10vh, 96px) clamp(20px, 5vw, 48px)",
          textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          <p style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: "20vw", color: "rgba(255,255,255,0.03)",
            lineHeight: 1, pointerEvents: "none", userSelect: "none",
          }}>JK</p>

          <p style={{ position: "relative", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#444", marginBottom: "16px" }}>
            Empezá hoy
          </p>
          <h2 style={{
            position: "relative",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            letterSpacing: "-0.02em", lineHeight: 1.05,
            marginBottom: "16px",
          }}>
            ¿Querés renovar<br />tu espacio?
          </h2>
          <p style={{ position: "relative", fontSize: "14px", color: "#555", marginBottom: "36px" }}>
            Escribinos y en minutos te damos precio. Sin compromiso.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            style={{
              position: "relative",
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "14px 28px",
              background: "#25D366", color: "#fff",
              fontSize: "14px", fontWeight: 600,
              textDecoration: "none", borderRadius: "4px",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            <WAIcon size={17} />
            Consultá por WhatsApp
          </a>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          background: "#0a0a0a",
          borderTop: "1px solid #1a1a1a",
          padding: "20px clamp(20px, 5vw, 48px)",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between",
          gap: "12px",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "#f5f4f0" }}>Diseños JK</span>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#444" }}>
            CABA y GBA · Fabricantes directos
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {[
              { label: "Instagram",    href: IG_URL },
              { label: "WhatsApp",     href: WA_URL },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#888")}
                onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
                {l.label}
              </a>
            ))}
          </div>
        </footer>

      </main>
    </>
  )
}

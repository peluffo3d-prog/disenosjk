"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import type { ConfiguradorState, Ambiente, TipoPuerta, Material } from "@/types"
import { calcularPrecio, fmtARS } from "@/lib/precios"

const WA = "5491100000000"
const EAZE = [0.76, 0, 0.24, 1] as [number, number, number, number]

// ─── Divisor ─────────────────────────────────────────────────────────────────
function Rule() {
  return <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.08)", margin: "40px 0" }} />
}

// ─── Cabecera de paso ─────────────────────────────────────────────────────────
function StepHead({ n, label, done }: { n: string; label: string; done?: boolean }) {
  return (
    <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
        background: done ? "#0a0a0a" : "#f0ede7",
        border: done ? "none" : "1px solid #d4d0c8",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.3s",
      }}>
        {done
          ? <span style={{ color: "#f5f4f0", fontSize: "13px" }}>✓</span>
          : <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#888" }}>{n}</span>
        }
      </div>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: "10px",
        letterSpacing: "0.18em", textTransform: "uppercase", color: "#555",
      }}>{label}</p>
    </div>
  )
}

// ─── Input base ───────────────────────────────────────────────────────────────
function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, style, ...rest } = props
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666" }}>
        {label}
      </label>
      <input
        {...rest}
        style={{
          background: "#fff",
          border: "1px solid #d4d0c8",
          borderRadius: "3px",
          padding: "11px 14px",
          fontSize: "15px",
          fontFamily: "var(--font-sans)",
          fontWeight: 300,
          color: "#0a0a0a",
          outline: "none",
          width: "100%",
          transition: "border-color 0.2s",
          ...style,
        }}
        onFocus={e => (e.currentTarget.style.borderColor = "#0a0a0a")}
        onBlur={e => (e.currentTarget.style.borderColor = "#d4d0c8")}
      />
    </div>
  )
}

// ─── Datos ────────────────────────────────────────────────────────────────────
const AMBIENTES: { value: Ambiente; label: string; img: string }[] = [
  { value: "baño",       label: "Baño",            img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&h=160&fit=crop&q=60" },
  { value: "dormitorio", label: "Dormitorio",       img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=200&h=160&fit=crop&q=60" },
  { value: "living",     label: "Living / Comedor", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=160&fit=crop&q=60" },
  { value: "otro",       label: "Otro ambiente",    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=160&fit=crop&q=60" },
]

const TIPOS: { value: TipoPuerta; label: string; desc: string }[] = [
  { value: "corredera_simple", label: "Corrediza simple",  desc: "Una hoja que desliza sobre riel" },
  { value: "plegable_doble",   label: "Plegable doble",    desc: "Dos hojas que se pliegan hacia el costado" },
  { value: "otro",             label: "Modelo especial",   desc: "Cotización personalizada por WhatsApp" },
]

const MATERIALES: { value: Material; label: string; swatch: string }[] = [
  { value: "blanco", label: "Blanco",      swatch: "#f5f4f0" },
  { value: "madera", label: "Madera",      swatch: "#b8864e" },
  { value: "negro",  label: "Negro",       swatch: "#1a1a1a" },
  { value: "otro",   label: "A consultar", swatch: "linear-gradient(135deg,#e0dbd4 50%,#c8c2b8 50%)" },
]

const INITIAL: ConfiguradorState = {
  ambiente: null, tipo: null, material: null,
  ancho: null, alto: null, instalacion: false, localidad: "",
}

export default function Configurador() {
  const [cfg, setCfg]         = useState<ConfiguradorState>(INITIAL)
  const [nombre, setNombre]   = useState("")
  const [email, setEmail]     = useState("")
  const [tel, setTel]         = useState("")
  const [loading, setLoading] = useState(false)

  const precio   = calcularPrecio(cfg)
  const completo = cfg.ambiente && cfg.tipo && cfg.material && cfg.ancho && cfg.alto

  function waMsg() {
    return `https://wa.me/${WA}?text=${encodeURIComponent(
      ["Hola! Quiero cotizar una puerta.",
       cfg.ambiente  && `Ambiente: ${cfg.ambiente}`,
       cfg.tipo      && `Tipo: ${cfg.tipo.replace("_", " ")}`,
       cfg.material  && `Material: ${cfg.material}`,
       cfg.ancho && cfg.alto && `Medidas: ${cfg.ancho} × ${cfg.alto} cm`,
       cfg.instalacion && cfg.localidad && `Instalación en ${cfg.localidad}`,
      ].filter(Boolean).join("\n")
    )}`
  }

  async function handlePagar() {
    if (!completo || !nombre || !email || !precio.estandar || !precio.puerta) return
    setLoading(true)
    try {
      const res  = await fetch("/api/mp/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, telefono: tel, ...cfg, precio_puerta: precio.puerta, precio_instalacion: precio.instalacion }),
      })
      const data = await res.json()
      if (data.init_point) window.location.href = data.init_point
    } finally { setLoading(false) }
  }

  return (
    <section style={{ padding: "clamp(80px, 10vh, 120px) clamp(24px, 5vw, 56px)", background: "#f5f4f0" }}>

      {/* Heading */}
      <div style={{ maxWidth: "860px", marginBottom: "clamp(40px, 6vh, 64px)" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#666", marginBottom: "16px" }}>
          Configurador
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Armá tu puerta.
        </h2>
      </div>

      {/* Card contenedor */}
      <div style={{
        maxWidth: "860px",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.09)",
        borderRadius: "6px",
        padding: "clamp(28px, 4vw, 52px)",
      }}>

        {/* ── 01 Ambiente ── */}
        <StepHead n="01" label="¿Para qué ambiente?" done={!!cfg.ambiente} />
        <div className="ambiente-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {AMBIENTES.map(a => {
            const active = cfg.ambiente === a.value
            return (
              <button key={a.value} onClick={() => setCfg(p => ({ ...p, ambiente: a.value }))}
                style={{
                  padding: 0, cursor: "pointer", borderRadius: "4px",
                  overflow: "hidden", textAlign: "left",
                  border: active ? "2px solid #0a0a0a" : "2px solid transparent",
                  outline: active ? "none" : "1px solid #d4d0c8",
                  outlineOffset: "-1px",
                  transform: active ? "scale(1.03)" : "scale(1)",
                  boxShadow: active ? "0 4px 16px rgba(0,0,0,0.14)" : "none",
                  transition: `transform 0.25s ${String(EAZE)}, border-color 0.2s, box-shadow 0.2s`,
                  background: "transparent",
                }}>
                <div style={{ height: "90px", overflow: "hidden", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.img} alt={a.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.07)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "10px 12px", background: active ? "#0a0a0a" : "#f7f5f2", borderTop: active ? "none" : "1px solid #e8e4de" }}>
                  <p style={{ fontSize: "12px", fontWeight: 500, color: active ? "#f5f4f0" : "#333", fontFamily: "var(--font-sans)" }}>{a.label}</p>
                </div>
              </button>
            )
          })}
        </div>

        <Rule />

        {/* ── 02 Tipo ── */}
        <StepHead n="02" label="¿Qué tipo de puerta?" done={!!cfg.tipo} />
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {TIPOS.map((t, i) => {
            const active = cfg.tipo === t.value
            return (
              <button key={t.value} onClick={() => setCfg(p => ({ ...p, tipo: t.value }))}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 20px", width: "100%",
                  background: active ? "#0a0a0a" : "#f7f5f2",
                  cursor: "pointer", textAlign: "left", borderRadius: "4px",
                  border: active ? "1px solid #0a0a0a" : "1px solid #e0dcd5",
                  transition: "background 0.2s, border-color 0.2s",
                }}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
                    fontWeight: 300, letterSpacing: "-0.01em",
                    color: active ? "#f5f4f0" : "#1a1a1a",
                    lineHeight: 1,
                  }}>{t.label}</p>
                  <p style={{ fontSize: "11px", color: active ? "rgba(255,255,255,0.55)" : "#888", marginTop: "4px", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>{t.desc}</p>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "11px",
                  color: active ? "rgba(255,255,255,0.7)" : "#bbb",
                  letterSpacing: "0.1em", flexShrink: 0, marginLeft: "16px",
                }}>
                  {active ? "✓" : `0${i + 1}`}
                </span>
              </button>
            )
          })}
        </div>

        <Rule />

        {/* ── 03 Material ── */}
        <StepHead n="03" label="Material / color" done={!!cfg.material} />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {MATERIALES.map(m => {
            const active = cfg.material === m.value
            return (
              <button key={m.value} onClick={() => setCfg(p => ({ ...p, material: m.value }))}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 18px", borderRadius: "4px",
                  border: active ? "2px solid #0a0a0a" : "1px solid #d4d0c8",
                  background: active ? "#0a0a0a" : "#f7f5f2",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: active ? "0 2px 10px rgba(0,0,0,0.12)" : "none",
                }}>
                <span style={{
                  width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                  background: m.swatch,
                  border: m.value === "blanco" ? "1px solid #d4d0c8" : "none",
                }} />
                <span style={{ fontSize: "13px", fontWeight: 400, color: active ? "#f5f4f0" : "#444", letterSpacing: "0.01em" }}>
                  {m.label}
                </span>
              </button>
            )
          })}
        </div>

        <Rule />

        {/* ── 04 Medidas ── */}
        <StepHead n="04" label="Medidas del hueco (cm)" done={!!(cfg.ancho && cfg.alto)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "end", maxWidth: "380px" }}>
          <Input label="Ancho" type="number" placeholder="ej: 80"
            value={cfg.ancho ?? ""}
            onChange={e => setCfg(p => ({ ...p, ancho: Number(e.target.value) || null }))} />
          <span style={{ paddingBottom: "12px", color: "#999", fontSize: "20px", textAlign: "center" }}>×</span>
          <Input label="Alto" type="number" placeholder="ej: 200"
            value={cfg.alto ?? ""}
            onChange={e => setCfg(p => ({ ...p, alto: Number(e.target.value) || null }))} />
        </div>
        <p style={{ marginTop: "12px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#999", letterSpacing: "0.08em" }}>
          Medí el ancho y alto del hueco en la pared, no de la puerta actual.
        </p>

        <Rule />

        {/* ── 05 Instalación ── */}
        <StepHead n="05" label="¿Necesitás instalación?" />
        <label style={{ display: "flex", alignItems: "flex-start", gap: "14px", cursor: "pointer", maxWidth: "500px", padding: "16px", background: "#f7f5f2", borderRadius: "4px", border: "1px solid #e0dcd5" }}>
          <input type="checkbox" checked={cfg.instalacion}
            onChange={e => setCfg(p => ({ ...p, instalacion: e.target.checked }))}
            style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#0a0a0a", cursor: "pointer", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#0a0a0a" }}>Sí, quiero que lo instalen</p>
            <p style={{ fontSize: "12px", color: "#777", marginTop: "4px", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
              Disponible en CABA y GBA · Se cobra aparte
            </p>
          </div>
        </label>

        <AnimatePresence>
          {cfg.instalacion && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
              style={{ overflow: "hidden", marginTop: "16px", maxWidth: "380px" }}>
              <Input label="¿En qué localidad?"
                type="text" placeholder="ej: Palermo, Morón..."
                value={cfg.localidad}
                onChange={e => setCfg(p => ({ ...p, localidad: e.target.value }))} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Resultado ── */}
        <AnimatePresence>
          {completo && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EAZE }}>
              <Rule />

              {precio.estandar ? (
                <>
                  <div style={{ background: "#f7f5f2", borderRadius: "4px", border: "1px solid #e0dcd5", padding: "24px", marginBottom: "28px" }}>
                    {[
                      { label: "Puerta", value: precio.puerta ? fmtARS(precio.puerta) : null },
                      cfg.instalacion ? { label: `Instalación${cfg.localidad ? ` en ${cfg.localidad}` : ""}`, value: precio.instalacion ? fmtARS(precio.instalacion) : "Coordinar" } : null,
                    ].filter(Boolean).map(row => (
                      <div key={row!.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: "14px", borderBottom: "1px solid rgba(0,0,0,0.07)", marginBottom: "14px" }}>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#777" }}>{row!.label}</p>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 300 }}>{row!.value}</p>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#0a0a0a", fontWeight: 500 }}>Total</p>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", fontWeight: 200, letterSpacing: "-0.025em" }}>{fmtARS(precio.total!)}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                    <Input label="Tu nombre" type="text" placeholder="Nombre y apellido" value={nombre} onChange={e => setNombre(e.target.value)} />
                    <div className="contact-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <Input label="Email" type="email" placeholder="correo@mail.com" value={email} onChange={e => setEmail(e.target.value)} />
                      <Input label="WhatsApp" type="tel" placeholder="11 2345 6789" value={tel} onChange={e => setTel(e.target.value)} />
                    </div>
                  </div>

                  <button onClick={handlePagar} disabled={loading || !nombre || !email}
                    style={{
                      width: "100%", padding: "16px 24px",
                      background: "#0a0a0a", color: "#f5f4f0",
                      border: "none", fontSize: "13px", fontWeight: 500,
                      letterSpacing: "0.04em", cursor: loading || !nombre || !email ? "not-allowed" : "pointer",
                      borderRadius: "4px", transition: "opacity 0.2s",
                      opacity: (!nombre || !email) ? 0.35 : 1,
                    }}
                    onMouseEnter={e => { if (nombre && email) e.currentTarget.style.opacity = "0.82" }}
                    onMouseLeave={e => { if (nombre && email) e.currentTarget.style.opacity = "1" }}>
                    {loading ? "Procesando..." : "Pagar · Hasta 6 cuotas sin interés · Mercado Pago"}
                  </button>

                  <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "#888", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                    ¿Querés guardar esta cotización?{" "}
                    <a href="/login" style={{ color: "#0a0a0a", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                      Creá tu cuenta →
                    </a>
                  </p>
                </>
              ) : (
                <div style={{ background: "#f7f5f2", borderRadius: "4px", border: "1px solid #e0dcd5", padding: "28px" }}>
                  <p style={{ fontSize: "15px", color: "#333", marginBottom: "24px", lineHeight: 1.65 }}>
                    {precio.mensaje ?? "Esta configuración necesita una cotización personalizada."}
                  </p>
                  <a href={waMsg()} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "10px",
                      padding: "14px 28px", background: "#0a0a0a", color: "#fff",
                      fontSize: "14px", fontWeight: 500, textDecoration: "none", borderRadius: "4px",
                    }}>
                    Pedir cotización por WhatsApp →
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}

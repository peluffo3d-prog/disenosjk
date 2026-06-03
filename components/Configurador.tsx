"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import type { ConfiguradorState, Ambiente, TipoPuerta, Material } from "@/types"
import { calcularPrecio, fmtARS } from "@/lib/precios"

const WA = "5491100000000"
const EAZE = [0.76, 0, 0.24, 1] as [number, number, number, number]

// ─── Divisor ─────────────────────────────────────────────────────────────────
function Rule() {
  return <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.08)", margin: "48px 0" }} />
}

// ─── Cabecera de paso ─────────────────────────────────────────────────────────
function StepHead({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ marginBottom: "32px", position: "relative" }}>
      <p style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(5rem, 10vw, 9rem)",
        fontWeight: 200,
        lineHeight: 1,
        color: "rgba(0,0,0,0.06)",
        letterSpacing: "-0.02em",
        userSelect: "none",
        marginBottom: "-8px",
      }}>{n}</p>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px", letterSpacing: "0.18em",
        textTransform: "uppercase", color: "#666",
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
          background: "transparent",
          border: "none",
          borderBottom: "1px solid #d4d0c8",
          padding: "10px 0",
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
  { value: "otro",       label: "Otro",             img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=160&fit=crop&q=60" },
]

const TIPOS: { value: TipoPuerta; label: string; desc: string }[] = [
  { value: "corredera_simple", label: "Corrediza simple",  desc: "Una hoja que desliza sobre riel" },
  { value: "plegable_doble",   label: "Plegable doble",    desc: "Dos hojas que se pliegan hacia el costado" },
  { value: "otro",             label: "Modelo especial",   desc: "Cotización personalizada por WhatsApp" },
]

const MATERIALES: { value: Material; label: string }[] = [
  { value: "blanco",   label: "Blanco" },
  { value: "madera",   label: "Madera" },
  { value: "vidriado", label: "Vidriado" },
  { value: "negro",    label: "Negro" },
  { value: "otro",     label: "A consultar" },
]

const INITIAL: ConfiguradorState = {
  ambiente: null, tipo: null, material: null,
  ancho: null, alto: null, instalacion: false, localidad: "",
}

export default function Configurador() {
  const [cfg, setCfg]       = useState<ConfiguradorState>(INITIAL)
  const [nombre, setNombre] = useState("")
  const [email, setEmail]   = useState("")
  const [tel, setTel]       = useState("")
  const [loading, setLoading] = useState(false)

  const precio   = calcularPrecio(cfg)
  const completo = cfg.ambiente && cfg.tipo && cfg.material && cfg.ancho && cfg.alto

  function waMsg() {
    return `https://wa.me/${WA}?text=${encodeURIComponent(
      ["Hola! Quiero cotizar una puerta.",
       cfg.ambiente  && `📍 Ambiente: ${cfg.ambiente}`,
       cfg.tipo      && `🚪 Tipo: ${cfg.tipo.replace("_", " ")}`,
       cfg.material  && `🎨 Material: ${cfg.material}`,
       cfg.ancho && cfg.alto && `📐 Medidas: ${cfg.ancho} × ${cfg.alto} cm`,
       cfg.instalacion && cfg.localidad && `🔧 Instalación en ${cfg.localidad}`,
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

      {/* Heading de sección */}
      <div style={{ maxWidth: "800px", marginBottom: "clamp(48px, 6vh, 72px)" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#666", marginBottom: "16px" }}>
          Configurador
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Armá tu puerta.
        </h2>
      </div>

      <div style={{ maxWidth: "800px" }}>

        {/* ── 01 Ambiente ── */}
        <StepHead n="01" label="¿Para qué ambiente?" />
        <div className="ambiente-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
          {AMBIENTES.map(a => {
            const active = cfg.ambiente === a.value
            return (
              <button key={a.value} onClick={() => setCfg(p => ({ ...p, ambiente: a.value }))}
                style={{
                  padding: 0, border: `1px solid ${active ? "#0a0a0a" : "#d4d0c8"}`,
                  background: "transparent", cursor: "pointer", borderRadius: "3px",
                  overflow: "hidden", textAlign: "left",
                  transform: active ? "scale(1.02)" : "scale(1)",
                  transition: `transform 0.25s ${String(EAZE)}, border-color 0.2s`,
                }}>
                <div style={{ height: "80px", overflow: "hidden", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.img} alt={a.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "9px 10px", background: active ? "#0a0a0a" : "#faf9f7" }}>
                  <p style={{ fontSize: "12px", fontWeight: 500, color: active ? "#f5f4f0" : "#0a0a0a", fontFamily: "var(--font-sans)" }}>{a.label}</p>
                </div>
              </button>
            )
          })}
        </div>

        <Rule />

        {/* ── 02 Tipo ── */}
        <StepHead n="02" label="¿Qué tipo de puerta?" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {TIPOS.map((t, i) => {
            const active = cfg.tipo === t.value
            return (
              <button key={t.value} onClick={() => setCfg(p => ({ ...p, tipo: t.value }))}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "20px 0", width: "100%",
                  background: "transparent", cursor: "pointer", textAlign: "left",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <div>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                    fontWeight: 300, letterSpacing: "-0.01em",
                    color: active ? "#0a0a0a" : "#444",
                    lineHeight: 1,
                  }}>{t.label}</p>
                  <p style={{ fontSize: "11px", color: "#666", marginTop: "5px", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>{t.desc}</p>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "11px",
                  color: active ? "#0a0a0a" : "#d4d0c8",
                  letterSpacing: "0.1em", flexShrink: 0,
                  transition: "color 0.2s",
                }}>
                  {active ? "✓" : `0${i + 1}`}
                </span>
              </button>
            )
          })}
        </div>

        <Rule />

        {/* ── 03 Material ── */}
        <StepHead n="03" label="Material / color" />
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {MATERIALES.map(m => {
            const active = cfg.material === m.value
            return (
              <button key={m.value} onClick={() => setCfg(p => ({ ...p, material: m.value }))}
                style={{
                  padding: "10px 22px", borderRadius: "100px",
                  border: `1px solid ${active ? "#0a0a0a" : "#d4d0c8"}`,
                  background: active ? "#0a0a0a" : "transparent",
                  color: active ? "#f5f4f0" : "#555",
                  fontSize: "13px", fontWeight: 400,
                  cursor: "pointer", letterSpacing: "0.01em",
                  transition: "all 0.2s",
                }}>
                {m.label}
              </button>
            )
          })}
        </div>

        <Rule />

        {/* ── 04 Medidas ── */}
        <StepHead n="04" label="Medidas del hueco (cm)" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "end", maxWidth: "420px" }}>
          <Input label="Ancho" type="number" placeholder="ej: 80"
            value={cfg.ancho ?? ""}
            onChange={e => setCfg(p => ({ ...p, ancho: Number(e.target.value) || null }))} />
          <span style={{ paddingBottom: "12px", color: "#666", fontSize: "18px" }}>×</span>
          <Input label="Alto" type="number" placeholder="ej: 200"
            value={cfg.alto ?? ""}
            onChange={e => setCfg(p => ({ ...p, alto: Number(e.target.value) || null }))} />
        </div>

        <Rule />

        {/* ── 05 Instalación ── */}
        <StepHead n="05" label="¿Necesitás instalación?" />
        <label style={{ display: "flex", alignItems: "flex-start", gap: "14px", cursor: "pointer", maxWidth: "500px" }}>
          <input type="checkbox" checked={cfg.instalacion}
            onChange={e => setCfg(p => ({ ...p, instalacion: e.target.checked }))}
            style={{ marginTop: "3px", width: "16px", height: "16px", accentColor: "#0a0a0a", cursor: "pointer" }} />
          <div>
            <p style={{ fontSize: "15px", fontWeight: 400, color: "#0a0a0a" }}>Sí, quiero que lo instalen</p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "4px", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
              Disponible en CABA y GBA · Se cobra aparte
            </p>
          </div>
        </label>

        <AnimatePresence>
          {cfg.instalacion && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
              style={{ overflow: "hidden", marginTop: "20px", maxWidth: "360px" }}>
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
                  {/* Desglose de precio con tipografía de impacto */}
                  <div style={{ marginBottom: "40px" }}>
                    {[
                      { label: "Puerta", value: precio.puerta ? fmtARS(precio.puerta) : null },
                      cfg.instalacion ? { label: `Instalación${cfg.localidad ? ` en ${cfg.localidad}` : ""}`, value: precio.instalacion ? fmtARS(precio.instalacion) : "Coordinar" } : null,
                    ].filter(Boolean).map(row => (
                      <div key={row!.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "16px" }}>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666" }}>{row!.label}</p>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300, letterSpacing: "-0.01em" }}>{row!.value}</p>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "8px" }}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#0a0a0a", fontWeight: 500 }}>Total</p>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 200, letterSpacing: "-0.025em", color: "#0a0a0a" }}>{fmtARS(precio.total!)}</p>
                    </div>
                  </div>

                  {/* Datos del comprador */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
                    <Input label="Tu nombre" type="text" placeholder="Nombre y apellido" value={nombre} onChange={e => setNombre(e.target.value)} />
                    <div className="contact-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <Input label="Email" type="email" placeholder="correo@mail.com" value={email} onChange={e => setEmail(e.target.value)} />
                      <Input label="WhatsApp" type="tel" placeholder="11 2345 6789" value={tel} onChange={e => setTel(e.target.value)} />
                    </div>
                  </div>

                  {/* CTA pago */}
                  <button onClick={handlePagar} disabled={loading || !nombre || !email}
                    style={{
                      width: "100%", padding: "16px 24px",
                      background: "#0a0a0a", color: "#f5f4f0",
                      border: "none", fontSize: "13px", fontWeight: 500,
                      letterSpacing: "0.04em", cursor: "pointer",
                      borderRadius: "3px", transition: "opacity 0.2s",
                      opacity: (!nombre || !email) ? 0.35 : 1,
                    }}
                    onMouseEnter={e => { if (nombre && email) e.currentTarget.style.opacity = "0.78" }}
                    onMouseLeave={e => { if (nombre && email) e.currentTarget.style.opacity = "1" }}>
                    {loading ? "Procesando..." : "Pagar · Hasta 6 cuotas sin interés · Mercado Pago"}
                  </button>

                  {/* CTA login — momento clave para registrarse */}
                  <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#666", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                    ¿Querés guardar esta cotización?{" "}
                    <a href="/login" style={{ color: "#0a0a0a", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                      Creá tu cuenta →
                    </a>
                  </p>
                </>
              ) : (
                <div>
                  <p style={{ fontSize: "15px", color: "#333", marginBottom: "28px", lineHeight: 1.65 }}>
                    {precio.mensaje ?? "Esta configuración necesita una cotización personalizada."}
                  </p>
                  <a href={waMsg()} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "10px",
                      padding: "14px 28px", background: "#25D366", color: "#fff",
                      fontSize: "14px", fontWeight: 500, textDecoration: "none", borderRadius: "3px",
                    }}>
                    Pedir cotización por WhatsApp
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

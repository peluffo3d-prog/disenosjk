"use client"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import type { ConfiguradorState, Ambiente, TipoPuerta, Material } from "@/types"
import { calcularPrecio, fmtARS } from "@/lib/precios"

const WA = "5491100000000"
const EAZE = [0.76, 0, 0.24, 1] as [number, number, number, number]

// ─── Cabecera de paso ─────────────────────────────────────────────────────────
function StepHead({ n, label, done }: { n: string; label: string; done?: boolean }) {
  return (
    <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{
        width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
        background: done ? "#0a0a0a" : "#fff",
        border: done ? "none" : "1px solid #d4d0c8",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.3s",
      }}>
        {done
          ? <span style={{ color: "#f5f4f0", fontSize: "13px" }}>✓</span>
          : <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#999" }}>{n}</span>}
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#555" }}>{label}</p>
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, style, ...rest } = props
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#666" }}>{label}</label>
      <input {...rest}
        style={{
          background: "#fff", border: "1px solid #d4d0c8", borderRadius: "3px",
          padding: "11px 14px", fontSize: "15px", fontFamily: "var(--font-sans)",
          fontWeight: 300, color: "#0a0a0a", outline: "none", width: "100%",
          transition: "border-color 0.2s", ...style,
        }}
        onFocus={e => (e.currentTarget.style.borderColor = "#0a0a0a")}
        onBlur={e => (e.currentTarget.style.borderColor = "#d4d0c8")} />
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
  { value: "plegable_doble",   label: "Plegable doble",    desc: "Dos hojas que se pliegan al costado" },
  { value: "otro",             label: "Modelo especial",   desc: "Cotización personalizada" },
]
const MATERIALES: { value: Material; label: string; swatch: string }[] = [
  { value: "blanco", label: "Blanco",      swatch: "#eceae4" },
  { value: "madera", label: "Madera",      swatch: "#a9763f" },
  { value: "negro",  label: "Negro",       swatch: "#1c1c1c" },
  { value: "otro",   label: "A consultar", swatch: "linear-gradient(135deg,#cfc9c0 50%,#a9763f 50%)" },
]

const INITIAL: ConfiguradorState = {
  ambiente: null, tipo: null, material: null,
  ancho: null, alto: null, instalacion: false, localidad: "",
}

// ─── Preview en vivo de la puerta ──────────────────────────────────────────────
function DoorPreview({ cfg }: { cfg: ConfiguradorState }) {
  const w = cfg.ancho || 80
  const h = cfg.alto || 200
  const ratio = Math.min(Math.max(w / h, 0.25), 1.4) // ancho/alto, clamp para que no se deforme
  const mat = MATERIALES.find(m => m.value === cfg.material)
  const swatch = mat?.swatch ?? "#3a3a3a"
  const filled = !!cfg.material

  return (
    <div style={{ height: "200px", display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: "24px" }}>
      {/* Riel */}
      <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", top: "6px", left: "-10%", right: "-10%", height: "2px", background: "rgba(255,255,255,0.25)" }} />
        {/* Hoja */}
        <div style={{
          height: "92%", aspectRatio: String(ratio),
          background: filled ? swatch : "rgba(255,255,255,0.06)",
          border: filled ? (cfg.material === "negro" ? "1px solid rgba(255,255,255,0.18)" : "none") : "1px dashed rgba(255,255,255,0.2)",
          borderRadius: "2px", position: "relative",
          transition: "aspect-ratio 0.4s cubic-bezier(0.76,0,0.24,1), background 0.3s",
          boxShadow: filled ? "0 8px 30px rgba(0,0,0,0.35)" : "none",
        }}>
          {/* Manija */}
          {filled && <div style={{ position: "absolute", top: "44%", right: cfg.tipo === "plegable_doble" ? "48%" : "10%", width: "3px", height: "26px", background: "rgba(0,0,0,0.35)", borderRadius: "2px" }} />}
          {/* Línea de plegado si es doble */}
          {filled && cfg.tipo === "plegable_doble" && <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", background: "rgba(0,0,0,0.2)" }} />}
        </div>
      </div>
    </div>
  )
}

export default function Configurador() {
  const [cfg, setCfg]         = useState<ConfiguradorState>(INITIAL)
  const [nombre, setNombre]   = useState("")
  const [email, setEmail]     = useState("")
  const [tel, setTel]         = useState("")
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener("resize", check, { passive: true })
    return () => window.removeEventListener("resize", check)
  }, [])

  const precio   = calcularPrecio(cfg)
  const completo = !!(cfg.ambiente && cfg.tipo && cfg.material && cfg.ancho && cfg.alto)
  const listoPagar = completo && precio.estandar && !!nombre && !!email

  const matLabel = MATERIALES.find(m => m.value === cfg.material)?.label

  function waMsg() {
    return `https://wa.me/${WA}?text=${encodeURIComponent(
      ["Hola! Quiero cotizar una puerta.",
       cfg.ambiente && `Ambiente: ${cfg.ambiente}`,
       cfg.tipo     && `Tipo: ${cfg.tipo.replace("_", " ")}`,
       cfg.material && `Material: ${cfg.material}`,
       cfg.ancho && cfg.alto && `Medidas: ${cfg.ancho} × ${cfg.alto} cm`,
       cfg.instalacion && cfg.localidad && `Instalación en ${cfg.localidad}`,
      ].filter(Boolean).join("\n")
    )}`
  }

  async function handlePagar() {
    if (!listoPagar || !precio.puerta) return
    setLoading(true)
    try {
      const res  = await fetch("/api/mp/create-preference", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, telefono: tel, ...cfg, precio_puerta: precio.puerta, precio_instalacion: precio.instalacion }),
      })
      const data = await res.json()
      if (data.init_point) window.location.href = data.init_point
    } finally { setLoading(false) }
  }

  // Filas de resumen en vivo
  const resumen: [string, string | null][] = [
    ["Ambiente", cfg.ambiente ? cfg.ambiente[0].toUpperCase() + cfg.ambiente.slice(1) : null],
    ["Tipo",     cfg.tipo ? TIPOS.find(t => t.value === cfg.tipo)?.label ?? null : null],
    ["Material", matLabel ?? null],
    ["Medidas",  cfg.ancho && cfg.alto ? `${cfg.ancho} × ${cfg.alto} cm` : null],
  ]

  return (
    <section style={{ padding: "clamp(80px, 10vh, 120px) clamp(24px, 5vw, 56px)", background: "#f5f4f0", paddingBottom: isMobile && completo ? "140px" : undefined }}>

      {/* Barra de precio fija en mobile */}
      <AnimatePresence>
        {isMobile && completo && precio.estandar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90,
              background: "#0a0a0a", padding: "16px 24px 24px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
            }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Total</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 200, letterSpacing: "-0.02em", color: "#f5f4f0", lineHeight: 1.1 }}>
                {fmtARS(precio.total!)}
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>6 cuotas sin interés</p>
            </div>
            <a href="#configurador-pago"
              style={{ padding: "14px 20px", background: "#f5f4f0", color: "#0a0a0a", fontSize: "13px", fontWeight: 500, letterSpacing: "0.03em", textDecoration: "none", borderRadius: "3px", whiteSpace: "nowrap" }}>
              Continuar →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heading */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", marginBottom: "clamp(40px, 6vh, 64px)" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#666", marginBottom: "16px" }}>Configurador</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05 }}>Armá tu puerta.</h2>
        <p style={{ fontSize: "15px", color: "#666", marginTop: "16px", maxWidth: "440px", lineHeight: 1.7 }}>
          Elegí cada detalle y el precio se calcula al instante. Sin esperas, sin ir y venir por WhatsApp.
        </p>
      </div>

      {/* Grid: pasos + resumen sticky */}
      <div className="config-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: "clamp(24px, 3vw, 48px)", alignItems: "start" }}>

        {/* ── Columna de pasos ── */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.09)", borderRadius: "6px", padding: "clamp(24px, 3.5vw, 44px)" }}>

          {/* 01 Ambiente */}
          <StepHead n="01" label="¿Para qué ambiente?" done={!!cfg.ambiente} />
          <div className="ambiente-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {AMBIENTES.map(a => {
              const active = cfg.ambiente === a.value
              return (
                <button key={a.value} onClick={() => setCfg(p => ({ ...p, ambiente: a.value }))}
                  style={{
                    padding: 0, cursor: "pointer", borderRadius: "4px", overflow: "hidden", textAlign: "left",
                    border: active ? "2px solid #0a0a0a" : "1px solid #d4d0c8",
                    transform: active ? "translateY(-2px)" : "none",
                    boxShadow: active ? "0 6px 18px rgba(0,0,0,0.15)" : "none",
                    transition: `transform 0.25s ${String(EAZE)}, box-shadow 0.2s, border-color 0.2s`, background: "transparent",
                  }}>
                  <div style={{ height: "78px", overflow: "hidden", position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.img} alt={a.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    {active && <div style={{ position: "absolute", inset: 0, border: "2px solid #fff", borderRadius: "2px", pointerEvents: "none" }} />}
                  </div>
                  <div style={{ padding: "9px 10px", background: active ? "#0a0a0a" : "#f7f5f2" }}>
                    <p style={{ fontSize: "11.5px", fontWeight: 500, color: active ? "#f5f4f0" : "#333" }}>{a.label}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.08)", margin: "36px 0" }} />

          {/* 02 Tipo */}
          <StepHead n="02" label="¿Qué tipo de puerta?" done={!!cfg.tipo} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {TIPOS.map((t, i) => {
              const active = cfg.tipo === t.value
              return (
                <button key={t.value} onClick={() => setCfg(p => ({ ...p, tipo: t.value }))}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 18px", width: "100%", borderRadius: "4px", cursor: "pointer", textAlign: "left",
                    background: active ? "#0a0a0a" : "#f7f5f2",
                    border: active ? "1px solid #0a0a0a" : "1px solid #e0dcd5",
                    transition: "background 0.2s, border-color 0.2s",
                  }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 300, color: active ? "#f5f4f0" : "#1a1a1a", lineHeight: 1 }}>{t.label}</p>
                    <p style={{ fontSize: "11px", color: active ? "rgba(255,255,255,0.6)" : "#888", marginTop: "5px", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>{t.desc}</p>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: active ? "rgba(255,255,255,0.7)" : "#bbb", marginLeft: "14px", flexShrink: 0 }}>{active ? "✓" : `0${i + 1}`}</span>
                </button>
              )
            })}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.08)", margin: "36px 0" }} />

          {/* 03 Material */}
          <StepHead n="03" label="Acabado / color" done={!!cfg.material} />
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {MATERIALES.map(m => {
              const active = cfg.material === m.value
              return (
                <button key={m.value} onClick={() => setCfg(p => ({ ...p, material: m.value }))}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", borderRadius: "4px", cursor: "pointer",
                    border: active ? "2px solid #0a0a0a" : "1px solid #d4d0c8",
                    background: active ? "#0a0a0a" : "#f7f5f2",
                    transition: "all 0.2s",
                  }}>
                  <span style={{ width: "15px", height: "15px", borderRadius: "50%", flexShrink: 0, background: m.swatch, border: m.value === "blanco" ? "1px solid #d4d0c8" : "none" }} />
                  <span style={{ fontSize: "13px", fontWeight: 400, color: active ? "#f5f4f0" : "#444" }}>{m.label}</span>
                </button>
              )
            })}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.08)", margin: "36px 0" }} />

          {/* 04 Medidas */}
          <StepHead n="04" label="Medidas del hueco (cm)" done={!!(cfg.ancho && cfg.alto)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "14px", alignItems: "end", maxWidth: "360px" }}>
            <Input label="Ancho" type="number" placeholder="ej: 80" value={cfg.ancho ?? ""} onChange={e => setCfg(p => ({ ...p, ancho: Number(e.target.value) || null }))} />
            <span style={{ paddingBottom: "12px", color: "#999", fontSize: "20px" }}>×</span>
            <Input label="Alto" type="number" placeholder="ej: 200" value={cfg.alto ?? ""} onChange={e => setCfg(p => ({ ...p, alto: Number(e.target.value) || null }))} />
          </div>
          <p style={{ marginTop: "12px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#999", letterSpacing: "0.06em" }}>
            Medí el hueco en la pared, no la puerta actual.
          </p>

          <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.08)", margin: "36px 0" }} />

          {/* 05 Instalación */}
          <StepHead n="05" label="¿Necesitás instalación?" />
          <label style={{ display: "flex", alignItems: "flex-start", gap: "14px", cursor: "pointer", padding: "16px", background: "#f7f5f2", borderRadius: "4px", border: "1px solid #e0dcd5" }}>
            <input type="checkbox" checked={cfg.instalacion} onChange={e => setCfg(p => ({ ...p, instalacion: e.target.checked }))}
              style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#0a0a0a", cursor: "pointer", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#0a0a0a" }}>Sí, quiero que la instalen</p>
              <p style={{ fontSize: "12px", color: "#777", marginTop: "4px", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>Disponible en CABA y GBA · Se cobra aparte</p>
            </div>
          </label>
          <AnimatePresence>
            {cfg.instalacion && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                style={{ overflow: "hidden", marginTop: "16px", maxWidth: "360px" }}>
                <Input label="¿En qué localidad?" type="text" placeholder="ej: Palermo, Morón..." value={cfg.localidad} onChange={e => setCfg(p => ({ ...p, localidad: e.target.value }))} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 06 Datos + pago — aparece al completar */}
          <AnimatePresence>
            {completo && precio.estandar && (
              <motion.div id="configurador-pago" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} style={{ overflow: "hidden" }}>
                <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.08)", margin: "36px 0" }} />
                <StepHead n="06" label="Tus datos" done={!!nombre && !!email} />
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <Input label="Nombre y apellido" type="text" placeholder="Juan Pérez" value={nombre} onChange={e => setNombre(e.target.value)} />
                  <div className="contact-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Input label="Email" type="email" placeholder="correo@mail.com" value={email} onChange={e => setEmail(e.target.value)} />
                    <Input label="WhatsApp" type="tel" placeholder="11 2345 6789" value={tel} onChange={e => setTel(e.target.value)} />
                  </div>
                </div>
                {/* Precio + botón pago inline en mobile */}
                {isMobile && (
                  <div style={{ background: "#0a0a0a", borderRadius: "6px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Total</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 200, letterSpacing: "-0.02em", color: "#f5f4f0" }}>{fmtARS(precio.total!)}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>Hasta 6 cuotas sin interés</p>
                    <button onClick={handlePagar} disabled={!listoPagar || loading}
                      style={{ width: "100%", padding: "16px", background: "#f5f4f0", color: "#0a0a0a", border: "none", fontSize: "14px", fontWeight: 600, borderRadius: "4px", cursor: listoPagar ? "pointer" : "not-allowed", opacity: listoPagar ? 1 : 0.4 }}>
                      {loading ? "Procesando…" : listoPagar ? "Pagar con Mercado Pago" : "Completá tus datos ↑"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Panel resumen sticky (oscuro) — solo desktop, no se monta en mobile ── */}
        {!isMobile && <aside className="config-summary" style={{ position: "sticky", top: "80px", background: "#0a0a0a", borderRadius: "6px", padding: "clamp(24px, 3vw, 36px)", color: "#f5f4f0" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "20px" }}>Tu puerta</p>

          <DoorPreview cfg={cfg} />

          {/* Resumen de selecciones */}
          <div style={{ marginBottom: "20px" }}>
            {resumen.map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "11px 0", borderBottom: i < resumen.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>{k}</span>
                <span style={{ fontSize: "14px", fontWeight: v ? 400 : 300, color: v ? "#f5f4f0" : "rgba(255,255,255,0.3)", textAlign: "right" }}>{v ?? "—"}</span>
              </div>
            ))}
            {cfg.instalacion && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "11px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Instalación</span>
                <span style={{ fontSize: "14px", color: "#f5f4f0", textAlign: "right" }}>{cfg.localidad || "Sí"}</span>
              </div>
            )}
          </div>

          {/* Precio en vivo */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "20px" }}>
            {completo && precio.estandar ? (
              <>
                {cfg.instalacion && precio.instalacion != null && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(255,255,255,0.55)", marginBottom: "6px" }}>
                    <span>Puerta {fmtARS(precio.puerta!)}</span>
                    <span>+ Instalación {fmtARS(precio.instalacion)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3rem)", fontWeight: 200, letterSpacing: "-0.02em", color: "#f5f4f0" }}>{fmtARS(precio.total!)}</span>
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", marginBottom: "20px" }}>Hasta 6 cuotas sin interés</p>

                <button onClick={handlePagar} disabled={!listoPagar || loading}
                  style={{
                    width: "100%", padding: "15px", background: "#f5f4f0", color: "#0a0a0a", border: "none",
                    fontSize: "13px", fontWeight: 600, letterSpacing: "0.03em", borderRadius: "4px",
                    cursor: listoPagar && !loading ? "pointer" : "not-allowed",
                    opacity: listoPagar ? 1 : 0.4, transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => { if (listoPagar && !loading) e.currentTarget.style.opacity = "0.85" }}
                  onMouseLeave={e => { if (listoPagar && !loading) e.currentTarget.style.opacity = "1" }}>
                  {loading ? "Procesando…" : listoPagar ? "Pagar con Mercado Pago" : "Completá tus datos ↓"}
                </button>
                <p style={{ textAlign: "center", marginTop: "14px", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
                  ¿Guardar cotización? <a href="/login" style={{ color: "#f5f4f0", textDecoration: "underline", textUnderlineOffset: "3px" }}>Creá tu cuenta</a>
                </p>
              </>
            ) : completo && !precio.estandar ? (
              <>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: "18px" }}>
                  {precio.mensaje ?? "Esta configuración necesita cotización personalizada."}
                </p>
                <a href={waMsg()} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", width: "100%", padding: "15px", background: "#f5f4f0", color: "#0a0a0a", fontSize: "13px", fontWeight: 600, letterSpacing: "0.03em", textDecoration: "none", borderRadius: "4px" }}>
                  Cotizar por WhatsApp →
                </a>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 300, color: "rgba(255,255,255,0.55)", marginBottom: "6px" }}>Precio al instante</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Completá los pasos y el total aparece acá.</p>
              </div>
            )}
          </div>
        </aside>}
      </div>
    </section>
  )
}

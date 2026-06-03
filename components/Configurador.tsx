"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, MessageCircle, ShoppingBag } from "lucide-react"
import type { ConfiguradorState, Ambiente, TipoPuerta, Material } from "@/types"
import { calcularPrecio, fmtARS } from "@/lib/precios"

const WA = "5491100000000" // TODO: número real
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

// ─── Chip de selección ────────────────────────────────────────────────────────
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="relative px-5 py-2.5 text-sm font-semibold transition-all"
      style={{
        background: active ? "#0a0a0a" : "transparent",
        border: `1px solid ${active ? "#0a0a0a" : "#c8c4bc"}`,
        color: active ? "#f5f4f0" : "#444",
        borderRadius: "4px",
      }}>
      {active && (
        <motion.span
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center"
          style={{ background: "#0a0a0a", borderRadius: "50%" }}>
          <Check size={9} color="#f5f4f0" strokeWidth={3} />
        </motion.span>
      )}
      {label}
    </button>
  )
}

// ─── Card de tipo de puerta ───────────────────────────────────────────────────
function TipoCard({
  n, title, desc, active, onClick,
}: { n: string; title: string; desc: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-4 px-5 py-4 text-left w-full transition-all"
      style={{
        border: `1px solid ${active ? "#0a0a0a" : "#c8c4bc"}`,
        background: active ? "#0a0a0a" : "#faf9f7",
        borderRadius: "4px",
        color: active ? "#f5f4f0" : "#0a0a0a",
      }}>
      <span className="font-mono text-xs shrink-0" style={{ color: active ? "#666" : "#aaa" }}>{n}</span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs mt-0.5" style={{ color: active ? "#888" : "#aaa" }}>{desc}</p>
      </div>
      {active && <Check size={15} className="ml-auto shrink-0" />}
    </button>
  )
}

// TODO: reemplazar con fotos reales del cliente cuando las tengamos
const AMBIENTES: { value: Ambiente; label: string; img: string }[] = [
  { value: "baño",       label: "Baño",            img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&h=160&fit=crop&q=60" },
  { value: "dormitorio", label: "Dormitorio",       img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=200&h=160&fit=crop&q=60" },
  { value: "living",     label: "Living / Comedor", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=160&fit=crop&q=60" },
  { value: "otro",       label: "Otro",             img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=160&fit=crop&q=60" },
]
const TIPOS: { value: TipoPuerta; label: string; desc: string; n: string }[] = [
  { value: "corredera_simple", label: "Corrediza simple",  desc: "Una hoja que desliza", n: "01" },
  { value: "plegable_doble",   label: "Plegable doble",    desc: "Dos hojas que se pliegan", n: "02" },
  { value: "otro",             label: "Otro modelo",       desc: "Te cotizamos personalizado", n: "03" },
]
const MATERIALES: { value: Material; label: string }[] = [
  { value: "blanco",   label: "Blanco" },
  { value: "madera",   label: "Madera" },
  { value: "vidriado", label: "Vidriado" },
  { value: "negro",    label: "Negro" },
  { value: "otro",     label: "Otro" },
]
const INITIAL: ConfiguradorState = {
  ambiente: null, tipo: null, material: null,
  ancho: null, alto: null, instalacion: false, localidad: "",
}

export default function Configurador() {
  const [cfg, setCfg] = useState<ConfiguradorState>(INITIAL)
  const [nombre, setNombre]     = useState("")
  const [email, setEmail]       = useState("")
  const [telefono, setTelefono] = useState("")
  const [loading, setLoading]   = useState(false)

  const precio   = calcularPrecio(cfg)
  const completo = cfg.ambiente && cfg.tipo && cfg.material && cfg.ancho && cfg.alto

  function waMsg() {
    return `https://wa.me/${WA}?text=${encodeURIComponent(
      ["Hola! Quiero cotizar una puerta.",
       cfg.ambiente  && `📍 Ambiente: ${cfg.ambiente}`,
       cfg.tipo      && `🚪 Tipo: ${cfg.tipo.replace("_", " ")}`,
       cfg.material  && `🎨 Material: ${cfg.material}`,
       cfg.ancho && cfg.alto && `📐 Medidas: ${cfg.ancho} × ${cfg.alto} cm`,
       cfg.instalacion && cfg.localidad && `🔧 Con instalación en ${cfg.localidad}`,
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
        body: JSON.stringify({ nombre, email, telefono, ...cfg, precio_puerta: precio.puerta, precio_instalacion: precio.instalacion }),
      })
      const data = await res.json()
      if (data.init_point) window.location.href = data.init_point
    } finally { setLoading(false) }
  }

  // Input base style
  const inputStyle = {
    background: "#faf9f7",
    border: "none",
    borderBottom: "1px solid #c8c4bc",
    borderRadius: 0,
    padding: "10px 0",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    fontFamily: "var(--font-sans)",
    color: "#0a0a0a",
    transition: "border-color 0.15s",
  }

  return (
    <section className="px-6 md:px-12 py-20 max-w-3xl mx-auto">
      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#888" }}>
        Configurador
      </p>
      <h2 className="font-display mb-14" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}>
        Armá tu puerta
      </h2>

      <div className="flex flex-col gap-12">

        {/* 1. Ambiente — image cards */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "#aaa" }}>
            01 — ¿Para qué ambiente?
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }} className="ambiente-grid">
            {AMBIENTES.map(a => {
              const active = cfg.ambiente === a.value
              return (
                <button
                  key={a.value}
                  onClick={() => setCfg(p => ({ ...p, ambiente: a.value }))}
                  style={{
                    border: `1px solid ${active ? "#0a0a0a" : "#d4d0c8"}`,
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    borderRadius: "3px",
                    overflow: "hidden",
                    transform: active ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.2s cubic-bezier(0.76,0,0.24,1), border-color 0.2s",
                    textAlign: "left",
                  }}
                >
                  <div style={{ width: "100%", height: "80px", overflow: "hidden", position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.img}
                      alt={a.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s cubic-bezier(0.76,0,0.24,1)" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ padding: "8px 10px", background: active ? "#0a0a0a" : "#faf9f7" }}>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: active ? "#f5f4f0" : "#0a0a0a", fontFamily: "var(--font-sans)" }}>
                      {a.label}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Tipo */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "#aaa" }}>
            02 — ¿Qué tipo de puerta?
          </p>
          <div className="flex flex-col gap-2">
            {TIPOS.map(t => (
              <TipoCard key={t.value} n={t.n} title={t.label} desc={t.desc}
                active={cfg.tipo === t.value}
                onClick={() => setCfg(p => ({ ...p, tipo: t.value }))} />
            ))}
          </div>
        </div>

        {/* 3. Material */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "#aaa" }}>
            03 — Material / color
          </p>
          <div className="flex flex-wrap gap-2">
            {MATERIALES.map(m => (
              <Chip key={m.value} label={m.label} active={cfg.material === m.value}
                onClick={() => setCfg(p => ({ ...p, material: m.value }))} />
            ))}
          </div>
        </div>

        {/* 4. Medidas */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "#aaa" }}>
            04 — Medidas del hueco (cm)
          </p>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-xs" style={{ color: "#aaa" }}>Ancho</label>
              <input type="number" placeholder="ej: 80" value={cfg.ancho ?? ""}
                onChange={e => setCfg(p => ({ ...p, ancho: Number(e.target.value) || null }))}
                style={inputStyle} />
            </div>
            <span className="text-lg pb-2" style={{ color: "#aaa" }}>×</span>
            <div className="flex-1">
              <label className="text-xs" style={{ color: "#aaa" }}>Alto</label>
              <input type="number" placeholder="ej: 200" value={cfg.alto ?? ""}
                onChange={e => setCfg(p => ({ ...p, alto: Number(e.target.value) || null }))}
                style={inputStyle} />
            </div>
          </div>
        </div>

        {/* 5. Instalación */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "#aaa" }}>
            05 — ¿Necesitás instalación?
          </p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={cfg.instalacion}
              onChange={e => setCfg(p => ({ ...p, instalacion: e.target.checked }))}
              className="mt-0.5 w-4 h-4 accent-black" />
            <div>
              <p className="text-sm font-medium">Sí, quiero que lo instalen</p>
              <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>Disponible en CABA y GBA · Se cobra por separado</p>
            </div>
          </label>
          <AnimatePresence>
            {cfg.instalacion && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease }}
                className="overflow-hidden mt-4">
                <label className="text-xs" style={{ color: "#aaa" }}>¿En qué localidad?</label>
                <input type="text" placeholder="ej: Palermo, Morón..."
                  value={cfg.localidad} onChange={e => setCfg(p => ({ ...p, localidad: e.target.value }))}
                  style={inputStyle} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Resultado */}
        <AnimatePresence>
          {completo && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4, ease }}
              className="pt-8" style={{ borderTop: "1px solid #d4d0c8" }}>

              {precio.estandar ? (
                <>
                  {/* Desglose de precio */}
                  <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#888" }}>Puerta</span>
                      <span className="font-display text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                        {fmtARS(precio.puerta!)}
                      </span>
                    </div>
                    {cfg.instalacion && (
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#888" }}>
                          Instalación{cfg.localidad ? ` · ${cfg.localidad}` : ""}
                        </span>
                        <span className="font-display text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                          {precio.instalacion ? fmtARS(precio.instalacion) : "Coordinar por WA"}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-3" style={{ borderTop: "1px solid #d4d0c8" }}>
                      <span className="text-sm font-semibold">Total</span>
                      <span className="font-display text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                        {fmtARS(precio.total!)}
                      </span>
                    </div>
                  </div>

                  {/* Datos del comprador */}
                  <div className="flex flex-col gap-4 mb-6">
                    <input type="text" placeholder="Tu nombre" value={nombre}
                      onChange={e => setNombre(e.target.value)} style={inputStyle} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="email" placeholder="Email" value={email}
                        onChange={e => setEmail(e.target.value)} style={inputStyle} />
                      <input type="tel" placeholder="WhatsApp" value={telefono}
                        onChange={e => setTelefono(e.target.value)} style={inputStyle} />
                    </div>
                  </div>

                  <button onClick={handlePagar} disabled={loading || !nombre || !email}
                    className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-opacity disabled:opacity-40"
                    style={{ background: "#0a0a0a", color: "#f5f4f0", borderRadius: "4px" }}>
                    <ShoppingBag size={15} />
                    {loading ? "Procesando..." : "Pagar · Hasta 6 cuotas sin interés"}
                  </button>
                  <p className="text-xs text-center mt-2" style={{ color: "#aaa" }}>
                    Procesado por Mercado Pago · Tarjeta, débito, efectivo
                  </p>
                </>
              ) : (
                <div>
                  <p className="text-sm mb-4" style={{ color: "#555" }}>
                    {precio.mensaje ?? "Esta configuración necesita cotización personalizada."}
                  </p>
                  <a href={waMsg()} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-opacity hover:opacity-85"
                    style={{ background: "#25D366", color: "#fff", borderRadius: "4px" }}>
                    <MessageCircle size={15} />
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
